import type { MetadataRoute } from "next";

const PATHS = [
  "",
  "/templates",
  "/builder/nurse",
  "/builder/student",
  "/builder/banking",
  "/builder/tech",
  "/builder/teacher",
  "/builder/stage",
  "/stage",
  "/letter",
  "/tracker",
  "/interview",
  "/examples",
  "/pricing",
  "/recruiters",
  "/privacy",
  "/terms",
  "/refund",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  // Without a real address the file stays empty: absolute links are required
  if (!site) return [];

  return PATHS.flatMap((p) => {
    const en = `${site}${p}`;
    const fr = `${site}/fr${p}`;
    return [
      { url: en, alternates: { languages: { en, fr } } },
      { url: fr, alternates: { languages: { en, fr } } },
    ];
  });
}