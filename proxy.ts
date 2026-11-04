import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Only the app and login pages are touched: the rest of your site is unaffected
export const config = {
  matcher: [
    "/crm/:path*",
    "/fr/crm/:path*",
    "/login",
    "/signup",
    "/fr/login",
    "/fr/signup",
  ],
};