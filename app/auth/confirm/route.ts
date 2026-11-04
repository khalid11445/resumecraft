import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Accepts "/crm" or a full address of this same site.
// Anything else becomes "/crm", so the link cannot send people elsewhere.
function safeNext(value: string | null, origin: string): string {
  if (!value) return "/crm";
  try {
    const u = new URL(value, origin);
    if (u.origin !== origin) return "/crm";
    return `${u.pathname}${u.search}`;
  } catch {
    return "/crm";
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"), origin);

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }

  const prefix = next.startsWith("/fr") ? "/fr" : "";
  return NextResponse.redirect(new URL(`${prefix}/login?error=confirm`, origin));
}