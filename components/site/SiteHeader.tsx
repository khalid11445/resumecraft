"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const T = {
  en: {
    templates: "Templates",
    stage: "Internships",
    tracker: "Tracker",
        crm: "For recruiters",
    examples: "Examples",
    pricing: "Pricing",
    login: "Log in",
    cta: "Build my resume",
  },
  fr: {
    templates: "Modèles",
    stage: "Stage / PFE",
    tracker: "Suivi",
        crm: "Recruteurs",
    examples: "Exemples",
    pricing: "Tarifs",
    login: "Connexion",
    cta: "Créer mon CV",
  },
};

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const isFr = pathname === "/fr" || pathname.startsWith("/fr/");
  const lang = isFr ? "fr" : "en";
  const t = T[lang];
  const base = isFr ? "/fr" : "";

  const enPath = isFr ? pathname.replace(/^\/fr/, "") || "/" : pathname;
  const frPath = isFr ? pathname : pathname === "/" ? "/fr" : `/fr${pathname}`;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const links = [
    { href: `${base}/templates`, label: t.templates, wide: false },
    { href: `${base}/stage`, label: t.stage, wide: false },
    { href: `${base}/tracker`, label: t.tracker, wide: true },
        { href: `${base}/recruiters`, label: t.crm, wide: true },
    { href: `${base}/examples`, label: t.examples, wide: false },
    { href: `${base}/pricing`, label: t.pricing, wide: false },
  ];

  return (
    <header className="h-14 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link href={isFr ? "/fr" : "/"} className="text-lg font-bold text-black">
          Resume<span className="text-blue-600">Craft</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm sm:gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`hidden text-gray-700 hover:text-black ${
                l.wide ? "lg:inline" : "md:inline"
              }`}
            >
              {l.label}
            </Link>
          ))}

          <Link
            href={`${base}/login`}
            className="hidden font-semibold text-gray-700 hover:text-black sm:inline"
          >
            {t.login}
          </Link>

          <div className="flex items-center rounded border border-gray-300 text-xs font-semibold">
            <Link
              href={enPath}
              className={`px-2 py-1 ${
                !isFr ? "bg-slate-900 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              EN
            </Link>
            <Link
              href={frPath}
              className={`px-2 py-1 ${
                isFr ? "bg-slate-900 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              FR
            </Link>
          </div>

          <Link
            href={`${base}/templates`}
            className="rounded bg-blue-600 px-4 py-1.5 font-semibold text-white hover:bg-blue-700"
          >
            {t.cta}
          </Link>
        </nav>
      </div>
    </header>
  );
}