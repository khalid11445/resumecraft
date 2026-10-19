"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; title: string; desc: string };
type Menu = { id: string; label: string; items: Item[] };
type Text = {
  menus: Menu[];
  pricing: string;
  cta: string;
  openMenu: string;
  closeMenu: string;
};

const T: Record<"en" | "fr", Text> = {
  en: {
    menus: [
      {
        id: "resumes",
        label: "Resumes",
        items: [
          {
            href: "/templates",
            title: "Templates",
            desc: "Pick a design made for your profession",
          },
          {
            href: "/examples",
            title: "Examples",
            desc: "See finished resumes for inspiration",
          },
                    {
            href: "/checker",
            title: "Resume checker",
            desc: "Upload your PDF and get a score with tips",
          },
                    {
            href: "/my-resumes",
            title: "My resumes",
            desc: "Open, duplicate and back up your saved resumes",
          },
        ],
      },
      {
        id: "students",
        label: "Students",
        items: [
          {
            href: "/stage",
            title: "Internships",
            desc: "Resume, request letter and when to apply",
          },
          {
            href: "/pfe",
            title: "PFE guide",
            desc: "From topic to report and defense",
          },
          {
            href: "/study-abroad",
            title: "Study abroad",
            desc: "France and Canada: steps and documents",
          },
        ],
      },
      {
        id: "career",
        label: "Career",
        items: [
          {
            href: "/interview",
            title: "Interview prep",
            desc: "Common questions with sample answers",
          },
          {
            href: "/letter",
            title: "Letter builder",
            desc: "Write a cover or request letter",
          },
          {
            href: "/jobs",
            title: "Jobs in Morocco",
            desc: "Where to find offers and how to apply",
          },
                    {
            href: "/tracker",
            title: "Application tracker",
            desc: "Follow every application and your follow-up dates",
          },
        ],
      },
    ],
    pricing: "Pricing",
    cta: "Build my resume",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  fr: {
    menus: [
      {
        id: "resumes",
        label: "CV",
        items: [
          {
            href: "/templates",
            title: "Modèles",
            desc: "Choisissez un design adapté à votre métier",
          },
          {
            href: "/examples",
            title: "Exemples",
            desc: "Voyez des CV terminés pour vous inspirer",
          },
                    {
            href: "/checker",
            title: "Vérificateur de CV",
            desc: "Téléversez votre PDF et obtenez une note avec des conseils",
          },
                    {
            href: "/my-resumes",
            title: "Mes CV",
            desc: "Ouvrez, dupliquez et sauvegardez vos CV",
          },
        ],
      },
      {
        id: "students",
        label: "Étudiants",
        items: [
          {
            href: "/stage",
            title: "Stages",
            desc: "CV, demande de stage et quand postuler",
          },
          {
            href: "/pfe",
            title: "Guide PFE",
            desc: "Du sujet au rapport et à la soutenance",
          },
          {
            href: "/study-abroad",
            title: "Études à l'étranger",
            desc: "France et Canada : étapes et documents",
          },
        ],
      },
      {
        id: "career",
        label: "Carrière",
        items: [
          {
            href: "/interview",
            title: "Préparation d'entretien",
            desc: "Questions fréquentes avec exemples de réponses",
          },
          {
            href: "/letter",
            title: "Créateur de lettre",
            desc: "Rédigez une lettre de motivation ou de demande",
          },
          {
            href: "/jobs",
            title: "Emploi au Maroc",
            desc: "Où trouver des offres et comment postuler",
          },
                    {
            href: "/tracker",
            title: "Suivi de candidatures",
            desc: "Suivez chaque candidature et vos dates de relance",
          },
        ],
      },
    ],
    pricing: "Tarifs",
    cta: "Créer mon CV",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const isFr = pathname === "/fr" || pathname.startsWith("/fr/");
  const lang = isFr ? "fr" : "en";
  const t = T[lang];
  const base = isFr ? "/fr" : "";

  const enPath = isFr ? pathname.replace(/^\/fr/, "") || "/" : pathname;
  const frPath = isFr ? pathname : pathname === "/" ? "/fr" : `/fr${pathname}`;

  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Close the menus when clicking outside or pressing Escape
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(null);
        setMobileOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeAll = () => {
    setOpen(null);
    setMobileOpen(false);
  };

  const isActive = (m: Menu) =>
    m.items.some((i) => enPath === i.href || enPath.startsWith(`${i.href}/`));
  const pricingActive = enPath === "/pricing";

  const linkBase =
    "rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors";

  return (
    <header
      ref={headerRef}
      style={{
        fontFamily:
          "var(--font-display), var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
      className="sticky top-0 z-50 h-14 border-b border-slate-200/70 bg-white/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href={isFr ? "/fr" : "/"}
          onClick={closeAll}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 3h7l5 5v13H7z" />
              <path d="M14 3v5h5" />
              <path d="M10 13h6M10 17h6" />
            </svg>
          </span>
          <span className="text-[19px] font-bold tracking-tight text-slate-900">
            Resume<span className="text-blue-600">Craft</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {t.menus.map((m) => {
            const isOpen = open === m.id;
            const active = isActive(m);
            return (
              <div
                key={m.id}
                className="relative"
                onMouseEnter={() => setOpen(m.id)}
                onMouseLeave={() => setOpen(null)}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(m.id)}
                  className={`${linkBase} flex items-center gap-1 ${
                    isOpen || active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {m.label}
                  <Chevron open={isOpen} />
                </button>

                {isOpen ? (
                  <div className="absolute left-0 top-full w-80 pt-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                      {m.items.map((i) => (
                        <Link
                          key={i.href}
                          href={`${base}${i.href}`}
                          onClick={closeAll}
                          className="block rounded-xl px-3 py-2.5 hover:bg-slate-50"
                        >
                          <span className="block text-sm font-semibold text-slate-900">
                            {i.title}
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                            {i.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}

          <Link
            href={`${base}/pricing`}
            onClick={closeAll}
            className={`${linkBase} ${
              pricingActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {t.pricing}
          </Link>
        </nav>

        {/* Right side: language, call to action, mobile button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center rounded-full bg-slate-100 p-0.5 text-xs font-semibold">
            <Link
              href={enPath}
              onClick={closeAll}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                !isFr
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              EN
            </Link>
            <Link
              href={frPath}
              onClick={closeAll}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                isFr
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              FR
            </Link>
          </div>

          <Link
            href={`${base}/templates`}
            onClick={closeAll}
            className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/40 sm:inline-flex"
          >
            {t.cta}
            <Arrow />
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? t.closeMenu : t.openMenu}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen ? (
        <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-slate-200 bg-white px-4 pb-5 pt-3 shadow-xl md:hidden">
          {t.menus.map((m) => (
            <div key={m.id} className="mb-3">
              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {m.label}
              </p>
              {m.items.map((i) => (
                <Link
                  key={i.href}
                  href={`${base}${i.href}`}
                  onClick={closeAll}
                  className="mt-1 block rounded-xl px-3 py-2.5 hover:bg-slate-50"
                >
                  <span className="block text-sm font-semibold text-slate-900">
                    {i.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {i.desc}
                  </span>
                </Link>
              ))}
            </div>
          ))}
          <Link
            href={`${base}/pricing`}
            onClick={closeAll}
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            {t.pricing}
          </Link>
          <Link
            href={`${base}/templates`}
            onClick={closeAll}
            className="mt-3 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/30"
          >
            {t.cta}
          </Link>
        </div>
      ) : null}
    </header>
  );
}