"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Group, hrefFor, linksOf } from "@/lib/sitelinks";

const T = {
  en: {
    seekers: "Job seekers",
    recruiters: "Recruiters",
    pricing: "Pricing",
    login: "Log in",
    ctaSeeker: "Build my resume",
    ctaRecruiter: "Create your workspace",
    menu: "Open the menu",
    closeMenu: "Close the menu",
    mobileSeekers: "For job seekers",
    mobileRecruiters: "For recruiters",
  },
  fr: {
    seekers: "Candidats",
    recruiters: "Recruteurs",
    pricing: "Tarifs",
    login: "Connexion",
    ctaSeeker: "Créer mon CV",
    ctaRecruiter: "Créer votre espace",
    menu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    mobileSeekers: "Pour les candidats",
    mobileRecruiters: "Pour les recruteurs",
  },
};

type MenuId = Extract<Group, "seekers" | "recruiters">;
const MENUS: MenuId[] = ["seekers", "recruiters"];

// Inside the app, the header stays quiet: the CRM has its own menu
const APP_PATH = /^\/(fr\/)?(crm|join)(\/|$)/;
const AUTH_PATH = /^\/(fr\/)?(login|signup)\/?$/;

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const isFr = pathname === "/fr" || pathname.startsWith("/fr/");
  const lang = isFr ? "fr" : "en";
  const t = T[lang];
  const base = isFr ? "/fr" : "";
  const p = isFr ? pathname.replace(/^\/fr/, "") || "/" : pathname;

  const enPath = p;
  const frPath = isFr ? pathname : pathname === "/" ? "/fr" : `/fr${pathname}`;

  const inApp = APP_PATH.test(pathname);
  const onAuth = AUTH_PATH.test(pathname);
  const recruiterContext = /^\/(recruiters|login|signup)/.test(p);

  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [mobile, setMobile] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Menus close when the page changes
  useEffect(() => {
    setOpenMenu(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobile(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isActive = (group: MenuId) =>
    linksOf(group)
      .filter((l) => l.id !== "teamplans")
      .some((l) => {
        const path = l.href.split("#")[0];
        return p === path || p.startsWith(`${path}/`);
      });

  const langSwitch = (
    <div className="flex items-center rounded border border-slate-300 text-xs font-semibold">
      <Link
        href={enPath}
        className={`px-2 py-1 ${
          !isFr ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        EN
      </Link>
      <Link
        href={frPath}
        className={`px-2 py-1 ${
          isFr ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        FR
      </Link>
    </div>
  );

  const logo = (
    <Link href={isFr ? "/fr" : "/"} className="text-lg font-bold text-black">
      Resume<span className="text-blue-600">Craft</span>
    </Link>
  );

  if (inApp) {
    return (
      <header className="sticky top-0 z-40 h-14 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          {logo}
          {langSwitch}
        </div>
      </header>
    );
  }

  const cta = recruiterContext
    ? { href: `${base}/signup`, label: t.ctaRecruiter }
    : { href: `${base}/templates`, label: t.ctaSeeker };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 h-14 border-b border-slate-200/80 bg-white/85 backdrop-blur"
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          {logo}

          <nav className="hidden items-center gap-1 text-sm lg:flex" aria-label="Main">
            {MENUS.map((id) => (
              <div key={id} className="relative">
                <button
                  type="button"
                  aria-expanded={openMenu === id}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu((cur) => (cur === id ? null : id))}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition hover:bg-slate-100 ${
                    isActive(id) || openMenu === id
                      ? "text-slate-900"
                      : "text-slate-600"
                  }`}
                >
                  {t[id]}
                  <span
                    className={`text-[10px] transition ${
                      openMenu === id ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {openMenu === id ? (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-[24rem] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
                      {linksOf(id).map((l) => (
                        <Link
                          key={l.id}
                          href={hrefFor(l.href, lang)}
                          onClick={() => setOpenMenu(null)}
                          className="block rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
                        >
                          <span className="block text-sm font-semibold text-slate-900">
                            {l.title[lang]}
                          </span>
                          <span className="block text-xs text-slate-500">
                            {l.desc[lang]}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}

            <Link
              href={`${base}/pricing`}
              className={`rounded-lg px-3 py-1.5 font-medium transition hover:bg-slate-100 ${
                p.startsWith("/pricing") ? "text-slate-900" : "text-slate-600"
              }`}
            >
              {t.pricing}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!onAuth ? (
            <Link
              href={`${base}/login`}
              className="hidden text-sm font-semibold text-slate-700 hover:text-black sm:inline"
            >
              {t.login}
            </Link>
          ) : null}
          <div className="hidden sm:block">{langSwitch}</div>
          {!onAuth ? (
            <Link
              href={cta.href}
              className="hidden rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:inline-block"
            >
              {cta.label}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => setMobile((v) => !v)}
            aria-label={mobile ? t.closeMenu : t.menu}
            aria-expanded={mobile}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 lg:hidden"
          >
            {mobile ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobile ? (
        <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-slate-200 bg-white p-4 shadow-xl lg:hidden">
          {MENUS.map((id) => (
            <div key={id} className="mb-4">
              <p className="px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                {id === "seekers" ? t.mobileSeekers : t.mobileRecruiters}
              </p>
              <div className="mt-1">
                {linksOf(id).map((l) => (
                  <Link
                    key={l.id}
                    href={hrefFor(l.href, lang)}
                    onClick={() => setMobile(false)}
                    className="block rounded-lg px-2 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    {l.title[lang]}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <Link
            href={`${base}/pricing`}
            onClick={() => setMobile(false)}
            className="block rounded-lg px-2 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {t.pricing}
          </Link>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
            {langSwitch}
            {!onAuth ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`${base}/login`}
                  onClick={() => setMobile(false)}
                  className="text-sm font-semibold text-slate-700"
                >
                  {t.login}
                </Link>
                <Link
                  href={cta.href}
                  onClick={() => setMobile(false)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  {cta.label}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}