import { NextResponse } from "next/server";

export const maxDuration = 30;

const API = "https://api.lemonsqueezy.com/v1/licenses";

type Reason =
  | "invalid"
  | "expired"
  | "disabled"
  | "limit"
  | "wrong_product"
  | "test"
  | "config"
  | "server";

type LsLicense = {
  status?: string;
  expires_at?: string | null;
  test_mode?: boolean;
};

type LsResponse = {
  activated?: boolean;
  valid?: boolean;
  error?: string | null;
  license_key?: LsLicense;
  instance?: { id?: string } | null;
  meta?: { store_id?: number; product_id?: number };
};

// Light protection: 20 requests per minute per IP
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 20) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

async function ls(
  path: "activate" | "validate",
  params: Record<string, string>
): Promise<LsResponse> {
  const res = await fetch(`${API}/${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params),
    cache: "no-store",
  });
  return (await res.json()) as LsResponse;
}

function reasonFrom(r: LsResponse): Reason {
  const msg = (r.error ?? "").toLowerCase();
  const status = r.license_key?.status;
  if (status === "expired" || msg.includes("expired")) return "expired";
  if (status === "disabled" || msg.includes("disabled")) return "disabled";
  if (msg.includes("activation limit")) return "limit";
  return "invalid";
}

// The code must belong to YOUR store and product, and test codes
// are refused on the live site
function ownershipProblem(r: LsResponse): Reason | null {
  const store = Number(process.env.LEMONSQUEEZY_STORE_ID);
  const product = Number(process.env.LEMONSQUEEZY_PRODUCT_ID);

  if (!store || !product) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "Lemon Squeezy IDs for .env.local (copy them):",
        `LEMONSQUEEZY_STORE_ID=${r.meta?.store_id}`,
        `LEMONSQUEEZY_PRODUCT_ID=${r.meta?.product_id}`
      );
    }
    return "config";
  }

  if (r.meta?.store_id !== store || r.meta?.product_id !== product) {
    return "wrong_product";
  }

  if (
    r.license_key?.test_mode &&
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_TEST_LICENSES !== "true"
  ) {
    return "test";
  }

  return null;
}

const fail = (reason: Reason, status = 200) =>
  NextResponse.json({ ok: false, reason }, { status });

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (limited(ip)) return fail("server", 429);

    const body = (await req.json()) as {
      action?: string;
      key?: string;
      instanceId?: string;
    };
    const key = typeof body.key === "string" ? body.key.trim() : "";
    if (key.length < 8 || key.length > 100) return fail("invalid", 400);

    // First use of a code: check it, then activate it on this browser
    if (body.action === "activate") {
      const first = await ls("validate", { license_key: key });
      if (!first.license_key || !first.meta) return fail(reasonFrom(first));

      const problem = ownershipProblem(first);
      if (problem) return fail(problem);

      const status = first.license_key.status;
      if (status === "expired" || status === "disabled") return fail(status);

      const act = await ls("activate", {
        license_key: key,
        instance_name: "browser",
      });
      if (!act.activated || !act.instance?.id) return fail(reasonFrom(act));

      return NextResponse.json({
        ok: true,
        instanceId: act.instance.id,
        expiresAt: act.license_key?.expires_at ?? null,
      });
    }

    // Later downloads: check the saved code is still valid
    if (body.action === "validate") {
      const instanceId =
        typeof body.instanceId === "string" ? body.instanceId.trim() : "";
      if (!instanceId) return fail("invalid", 400);

      const r = await ls("validate", {
        license_key: key,
        instance_id: instanceId,
      });
      if (!r.valid) return fail(reasonFrom(r));

      const problem = ownershipProblem(r);
      if (problem) return fail(problem);

      return NextResponse.json({
        ok: true,
        expiresAt: r.license_key?.expires_at ?? null,
      });
    }

    return fail("invalid", 400);
  } catch (err) {
    console.error("License check failed:", err);
    return fail("server", 500);
  }
}