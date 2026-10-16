const STORAGE_KEY = "rc_license";

export type StoredLicense = {
  key: string;
  instanceId: string;
  expiresAt: string | null;
};

export type Reason =
  | "invalid"
  | "expired"
  | "disabled"
  | "limit"
  | "wrong_product"
  | "test"
  | "config"
  | "server"
  | "network";

export function loadLicense(): StoredLicense | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (v && typeof v.key === "string" && typeof v.instanceId === "string") {
      return v as StoredLicense;
    }
    return null;
  } catch {
    return null;
  }
}

function saveLicense(v: StoredLicense) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    // Storage can be blocked: the code will simply be asked again
  }
}

export function clearLicense() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

async function post(body: object) {
  const res = await fetch("/api/license", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as {
    ok: boolean;
    reason?: Reason;
    instanceId?: string;
    expiresAt?: string | null;
  };
}

export async function redeemCode(
  key: string
): Promise<
  { ok: true; license: StoredLicense } | { ok: false; reason: Reason }
> {
  try {
    const r = await post({ action: "activate", key });
    if (r.ok && r.instanceId) {
      const license: StoredLicense = {
        key: key.trim(),
        instanceId: r.instanceId,
        expiresAt: r.expiresAt ?? null,
      };
      saveLicense(license);
      return { ok: true, license };
    }
    return { ok: false, reason: r.reason ?? "invalid" };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export async function checkLicense(
  stored: StoredLicense
): Promise<{ ok: boolean; reason?: Reason; expiresAt?: string | null }> {
  try {
    const r = await post({
      action: "validate",
      key: stored.key,
      instanceId: stored.instanceId,
    });
    return r.ok
      ? { ok: true, expiresAt: r.expiresAt ?? stored.expiresAt }
      : { ok: false, reason: r.reason ?? "invalid" };
  } catch {
    return { ok: false, reason: "network" };
  }
}