import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATH = /^\/(fr\/)?(crm|join)(\/|$)/;
const AUTH_PATH = /^\/(fr\/)?(login|signup)\/?$/;

// Only paths of this same site are accepted as a destination
const safeNextPath = (value: string | null) =>
  value && /^\/(?!\/)/.test(value) ? value : null;

// Refreshes the login session and sends visitors to the right page.
// This is a convenience, not the security boundary: the database
// rules (RLS) are what protect the data.
export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const path = request.nextUrl.pathname;
  const prefix = path === "/fr" || path.startsWith("/fr/") ? "/fr" : "";

  // Without the Supabase variables, the rest of the site keeps working
  if (!url || !key) {
    if (PROTECTED_PATH.test(path)) {
      return NextResponse.redirect(new URL(`${prefix}/login`, request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data } = await supabase.auth.getClaims();
    const signedIn = Boolean(data?.claims);

    if (!signedIn && PROTECTED_PATH.test(path)) {
      const login = request.nextUrl.clone();
      login.pathname = `${prefix}/login`;
      login.search = "";
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }

    if (signedIn && AUTH_PATH.test(path)) {
      const target = safeNextPath(request.nextUrl.searchParams.get("next"));
      const dest = request.nextUrl.clone();
      if (target) {
        const parsed = new URL(target, request.url);
        dest.pathname = parsed.pathname;
        dest.search = parsed.search;
      } else {
        dest.pathname = `${prefix}/crm`;
        dest.search = "";
      }
      return NextResponse.redirect(dest);
    }
  } catch (err) {
    console.error("Session check failed:", err);
    if (PROTECTED_PATH.test(path)) {
      return NextResponse.redirect(new URL(`${prefix}/login`, request.url));
    }
  }

  return response;
}