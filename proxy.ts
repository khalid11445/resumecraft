import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Only the app, invitation and login pages are touched
export const config = {
  matcher: [
    "/crm/:path*",
    "/fr/crm/:path*",
    "/join/:path*",
    "/fr/join/:path*",
    "/login",
    "/signup",
    "/fr/login",
    "/fr/signup",
  ],
};