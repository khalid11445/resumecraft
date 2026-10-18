import Link from "next/link";
import { Lang } from "@/lib/labels";
import { countries } from "@/lib/study-abroad";

const T = {
  en: {
    badge: "Students",
    title: "Study abroad guides",
    intro:
      "Practical guides for Moroccan students who want to continue their studies abroad. Each guide gives the main steps, the documents to prepare and the official sources. Rules and dates change every year, so always confirm on the official websites linked below.",
    stepsTitle: "Main steps",
    docsTitle: "Documents to prepare",
    timelineTitle: "Timing",
    linksTitle: "Official sources",
    toolsTitle: "Prepare your documents",
    open: "Open",
    note: "Last reviewed: October 2026. This guide is general information, not legal or immigration advice, and ResumeCraft is not affiliated with Campus France or the Government of Canada. Admission and visa decisions belong to the institutions and the authorities.",
    prefix: "",
  },
  fr: {
    badge: "Étudiants",
    title: "Guides pour étudier à l'étranger",
    intro:
      "Des guides pratiques pour les étudiants marocains qui veulent poursuivre leurs études à l'étranger. Chaque guide donne les grandes étapes, les documents à préparer et les sources officielles. Les règles et les dates changent chaque année : confirmez toujours sur les sites officiels indiqués ci-dessous.",
    stepsTitle: "Étapes principales",
    docsTitle: "Documents à préparer",
    timelineTitle: "Calendrier",
    linksTitle: "Sources officielles",
    toolsTitle: "Préparez vos documents",
    open: "Ouvrir",
    note: "Dernière vérification : octobre 2026. Ce guide donne des informations générales, pas un conseil juridique ou d'immigration, et ResumeCraft n'est pas affilié à Campus France ni au gouvernement du Canada. Les décisions d'admission et de visa appartiennent aux établissements et aux autorités.",
    prefix: "/fr",
  },
};

export default function StudyAbroadView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const list = countries[lang];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
        {t.badge}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-3 text-slate-600">{t.intro}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {list.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            {c.name}
          </a>
        ))}
      </div>

      {list.map((c) => (
        <section key={c.id} id={c.id} className="mt-14 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-slate-900">{c.name}</h2>
          <p className="mt-2 text-sm text-slate-600">{c.summary}</p>

          <h3 className="mt-8 font-semibold text-slate-900">{t.stepsTitle}</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {c.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>

          <h3 className="mt-8 font-semibold text-slate-900">{t.docsTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {c.documents.map((d) => (
              <li key={d} className="flex gap-3">
                <span className="text-amber-600">✓</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-semibold text-slate-900">{t.timelineTitle}</h3>
          <p className="mt-3 text-sm text-slate-700">{c.timeline}</p>
          {c.extra ? (
            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              {c.extra}
            </p>
          ) : null}

          <h3 className="mt-8 font-semibold text-slate-900">{t.linksTitle}</h3>
          <div className="mt-3 space-y-2">
            {c.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm hover:bg-slate-50"
              >
                <span className="font-medium text-slate-900">{l.label}</span>
                <span className="ml-2 text-xs font-semibold text-blue-600">
                  {t.open} ↗
                </span>
              </a>
            ))}
          </div>

          <h3 className="mt-8 font-semibold text-slate-900">{t.toolsTitle}</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {c.tools.map((tool, i) => (
              <Link
                key={tool.href}
                href={`${t.prefix}${tool.href}`}
                className={
                  i === 0
                    ? "inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    : "inline-block rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                }
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </section>
      ))}

      <p className="mt-14 rounded-lg bg-slate-50 p-4 text-xs text-slate-600">
        {t.note}
      </p>
    </main>
  );
}