import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const CRM_PATH = /^\/(fr\/)?crm(\/|$)/;
const AUTH_PATH = /^\/(fr\/)?(login|signup)\/?$/;

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
    if (CRM_PATH.test(path)) {
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

    if (!signedIn && CRM_PATH.test(path)) {
      const login = request.nextUrl.clone();
      login.pathname = `${prefix}/login`;
      login.search = "";
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }

    if (signedIn && AUTH_PATH.test(path)) {
      const crm = request.nextUrl.clone();
      crm.pathname = `${prefix}/crm`;
      crm.search = "";
      return NextResponse.redirect(crm);
    }
  } catch (err) {
    console.error("Session check failed:", err);
    if (CRM_PATH.test(path)) {
      return NextResponse.redirect(new URL(`${prefix}/login`, request.url));
    }
  }

  return response;
}