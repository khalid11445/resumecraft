import Link from "next/link";
import { Lang } from "@/lib/labels";

const T = {
  en: {
    badge: "Internship season",
    title: "Get your internship application ready",
    intro:
      "A one-page resume, the right title, and a clear idea of when to apply. Start from a resume made for internship applications, with academic projects, languages and student activities.",
    cta: "Build my internship resume",
    calendarTitle: "When to apply",
    typeHeader: "Type of internship",
    whenHeader: "When to apply",
    rows: [
      {
        type: "Final-year project internship (PFE) starting January to June, or February to July",
        when: "Apply from October to December",
      },
      {
        type: "Post-graduation internship (Idmaj)",
        when: "Apply from September. Recruiters are most active from September to March",
      },
      {
        type: "Other internships",
        when: "Timing varies. Follow your school's calendar",
      },
    ],
    prepTitle: "What to prepare",
    prep: [
      "A one-page resume. For a student, one page is the usual expectation.",
      "A clear title, such as “Software engineering intern” rather than just “Student”.",
      "A short internship request or cover letter: up to three paragraphs on one page, stating the type of internship, its duration and the period.",
      "The internship agreement (convention de stage), which normally involves three parties: you, your school and the company.",
      "At the end: ask for a detailed internship certificate and, if possible, a recommendation letter.",
    ],
    note: "This information is indicative. It comes from recruitment guides such as Jobsquare, not from an official source. Your school may set its own calendar and rules, so always check with your internship office.",
    builderHref: "/builder/stage",
  },
  fr: {
    badge: "Saison des stages",
    title: "Préparez votre candidature de stage",
    intro:
      "Un CV d'une page, le bon intitulé et une idée claire du moment où postuler. Partez d'un CV pensé pour les candidatures de stage, avec projets académiques, langues et vie associative.",
    cta: "Créer mon CV de stage",
    calendarTitle: "Quand postuler",
    typeHeader: "Type de stage",
    whenHeader: "Quand postuler",
    rows: [
      {
        type: "Stage de fin d'études (PFE) de janvier à juin, ou de février à juillet",
        when: "Postulez d'octobre à décembre",
      },
      {
        type: "Stage post-diplôme (Idmaj)",
        when: "Postulez dès septembre. Les recruteurs sont les plus actifs de septembre à mars",
      },
      {
        type: "Autres stages",
        when: "Les dates varient. Suivez le calendrier de votre école",
      },
    ],
    prepTitle: "À préparer",
    prep: [
      "Un CV d'une page. Pour un étudiant, une page est l'attente habituelle.",
      "Un intitulé clair, comme « Stagiaire ingénieur logiciel » plutôt que simplement « Étudiant ».",
      "Une courte demande de stage ou lettre de motivation : trois paragraphes au maximum sur une page, en indiquant le type de stage, sa durée et la période.",
      "La convention de stage, qui implique normalement trois parties : vous, votre école et l'entreprise.",
      "À la fin : demandez un certificat de stage détaillé et, si possible, une lettre de recommandation.",
    ],
    note: "Ces informations sont indicatives. Elles proviennent de guides de recrutement comme Jobsquare, et non d'une source officielle. Votre école peut avoir son propre calendrier et ses propres règles : vérifiez toujours auprès de votre service des stages.",
    builderHref: "/fr/builder/stage",
  },
};

export default function StageView({ lang }: { lang: Lang }) {
  const t = T[lang];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
        {t.badge}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-3 text-slate-600">{t.intro}</p>
      <Link
        href={t.builderHref}
        className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
      >
        {t.cta}
      </Link>

      <h2 className="mt-14 text-xl font-semibold text-slate-900">
        {t.calendarTitle}
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">{t.typeHeader}</th>
              <th className="px-4 py-3">{t.whenHeader}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {t.rows.map((r) => (
              <tr key={r.type}>
                <td className="px-4 py-3 text-slate-800">{r.type}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{r.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-14 text-xl font-semibold text-slate-900">{t.prepTitle}</h2>
      <ul className="mt-4 space-y-3 text-sm text-slate-700">
        {t.prep.map((p) => (
          <li key={p} className="flex gap-3">
            <span className="text-amber-600">✓</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <p className="mt-10 rounded-lg bg-slate-50 p-4 text-xs text-slate-600">
        {t.note}
      </p>
    </main>
  );
}