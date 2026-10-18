import Link from "next/link";
import { Lang } from "@/lib/labels";
import { pfeSections } from "@/lib/pfe";

const T = {
  en: {
    badge: "Students",
    title: "Your PFE guide, from topic to defense",
    intro:
      "A practical roadmap for your final-year project: choosing a topic, planning the months, writing the report and preparing the defense. Rules differ between schools, so always follow your school's guidelines first.",
    resumeCta: "Build my internship resume",
    resumeHref: "/builder/stage",
    letterCta: "Write my request letter",
    letterHref: "/letter",
    interviewCta: "Prepare my interview",
    interviewHref: "/interview",
    stageCta: "When to apply for internships",
    stageHref: "/stage",
    note: "This guide is general advice, not an official rule. Every school has its own requirements for the PFE, so always follow the guidelines of your school and your supervisors.",
  },
  fr: {
    badge: "Étudiants",
    title: "Votre guide PFE, du sujet à la soutenance",
    intro:
      "Une feuille de route pratique pour votre projet de fin d'études : choisir un sujet, planifier les mois, rédiger le rapport et préparer la soutenance. Les règles varient selon les écoles : suivez d'abord les consignes de la vôtre.",
    resumeCta: "Créer mon CV de stage",
    resumeHref: "/fr/builder/stage",
    letterCta: "Rédiger ma demande de stage",
    letterHref: "/fr/letter",
    interviewCta: "Préparer mon entretien",
    interviewHref: "/fr/interview",
    stageCta: "Quand postuler aux stages",
    stageHref: "/fr/stage",
    note: "Ce guide donne des conseils généraux, pas des règles officielles. Chaque école a ses propres exigences pour le PFE : suivez toujours les consignes de votre école et de vos encadrants.",
  },
};

export default function PfeView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const sections = pfeSections[lang];

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
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            {s.title}
          </a>
        ))}
      </div>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mt-12 scroll-mt-20">
          <h2 className="text-xl font-semibold text-slate-900">{s.title}</h2>
          {s.intro ? <p className="mt-2 text-sm text-slate-600">{s.intro}</p> : null}

          {s.table ? (
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">{s.table.headers[0]}</th>
                    <th className="px-4 py-3">{s.table.headers[1]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {s.table.rows.map(([when, what]) => (
                    <tr key={when}>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                        {when}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{what}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {s.items ? (
            s.numbered ? (
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-amber-600">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )
          ) : null}

          {s.note ? (
            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              {s.note}
            </p>
          ) : null}
        </section>
      ))}

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href={t.resumeHref}
          className="inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {t.resumeCta}
        </Link>
        <Link
          href={t.letterHref}
          className="inline-block rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          {t.letterCta}
        </Link>
        <Link
          href={t.interviewHref}
          className="inline-block rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          {t.interviewCta}
        </Link>
        <Link
          href={t.stageHref}
          className="inline-block rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          {t.stageCta}
        </Link>
      </div>

      <p className="mt-10 text-xs text-slate-500">{t.note}</p>
    </main>
  );
}