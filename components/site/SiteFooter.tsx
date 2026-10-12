"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const T = {
  en: {
    templates: "Templates",
    stage: "Internships",
    examples: "Examples",
    pricing: "Pricing",
    privacy: "Privacy",
    terms: "Terms",
    refund: "Refunds",
  },
  fr: {
    templates: "Modèles",
    stage: "Stage / PFE",
    examples: "Exemples",
    pricing: "Tarifs",
    privacy: "Confidentialité",
    terms: "Conditions",
    refund: "Remboursements",
  },
};

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const isFr = pathname === "/fr" || pathname.startsWith("/fr/");
  const t = T[isFr ? "fr" : "en"];
  const base = isFr ? "/fr" : "";

  const links = [
    { href: `${base}/templates`, label: t.templates },
    { href: `${base}/stage`, label: t.stage },
    { href: `${base}/examples`, label: t.examples },
    { href: `${base}/pricing`, label: t.pricing },
    { href: `${base}/privacy`, label: t.privacy },
    { href: `${base}/terms`, label: t.terms },
    { href: `${base}/refund`, label: t.refund },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white py-6 text-sm text-gray-500">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6">
        <p>© 2026 ResumeCraft</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-black">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}