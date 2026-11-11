import type { MetadataRoute } from "next";

// Add NEXT_PUBLIC_SITE_URL (for example https://yourdomain.com) in Vercel
const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

// robots.txt asks search engines to stay away. It does not protect anything:
// the app is protected by login and by the database rules.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/crm",
          "/fr/crm",
          "/join",
          "/fr/join",
          "/login",
          "/signup",
          "/fr/login",
          "/fr/signup",
          "/auth/",
          "/api/",
          "/dev/",
        ],
      },
    ],
    ...(site ? { sitemap: `${site}/sitemap.xml` } : {}),
  };
}