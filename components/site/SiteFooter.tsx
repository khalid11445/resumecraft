"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { hrefFor, linksOf } from "@/lib/sitelinks";

const T = {
  en: {
    tagline:
      "Resumes that get read, and a simple CRM for hiring teams. In French and English.",
    seekers: "Job seekers",
    recruiters: "Recruiters",
    company: "Company",
    login: "Log in",
    signup: "Create your workspace",
    rights: "© 2026 ResumeCraft",
  },
  fr: {
    tagline:
      "Des CV qui se font lire, et un CRM simple pour les équipes de recrutement. En français et en anglais.",
    seekers: "Candidats",
    recruiters: "Recruteurs",
    company: "Société",
    login: "Connexion",
    signup: "Créer votre espace",
    rights: "© 2026 ResumeCraft",
  },
};

const APP_PATH = /^\/(fr\/)?(crm|join)(\/|$)/;

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const isFr = pathname === "/fr" || pathname.startsWith("/fr/");
  const lang = isFr ? "fr" : "en";
  const t = T[lang];
  const base = isFr ? "/fr" : "";

  // The app has its own screens, so no big footer there
  if (APP_PATH.test(pathname)) {
    return (
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        {t.rights}
      </footer>
    );
  }

  const column = (title: string, group: "seekers" | "recruiters" | "company") => (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {linksOf(group).map((l) => (
          <li key={l.id}>
            <Link
              href={hrefFor(l.href, lang)}
              className="text-slate-600 hover:text-slate-900 hover:underline"
            >
              {l.title[lang]}
            </Link>
          </li>
        ))}
        {group === "recruiters" ? (
          <>
            <li>
              <Link
                href={`${base}/signup`}
                className="font-semibold text-slate-900 hover:underline"
              >
                {t.signup}
              </Link>
            </li>
            <li>
              <Link
                href={`${base}/login`}
                className="text-slate-600 hover:text-slate-900 hover:underline"
              >
                {t.login}
              </Link>
            </li>
          </>
        ) : null}
      </ul>
    </div>
  );

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href={isFr ? "/fr" : "/"} className="text-lg font-bold text-black">
              Resume<span className="text-blue-600">Craft</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500">{t.tagline}</p>
          </div>
          {column(t.seekers, "seekers")}
          {column(t.recruiters, "recruiters")}
          {column(t.company, "company")}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400">
          <p>{t.rights}</p>
          <p>
            <Link href="/" className="hover:text-slate-700">
              English
            </Link>
            {" · "}
            <Link href="/fr" className="hover:text-slate-700">
              Français
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}