import Link from "next/link";
import { Lang } from "@/lib/labels";
import { jobGroups } from "@/lib/jobs-ma";

const T = {
  en: {
    badge: "Jobs in Morocco",
    title: "Where to find job offers in Morocco",
    intro:
      "A short list of places to look for offers and to apply. Prepare your resume first, then apply to a few offers that really match your profile.",
    open: "Open the site",
    tipsTitle: "Tips before you apply",
    tips: [
      "Tailor your resume to each offer: reuse the keywords of the job posting, as long as they are true for you.",
      "Check the date of the offer and the required experience and diploma before you apply.",
      "If a company has no open offer for your profile, a spontaneous application on its recruitment page is worth a try.",
      "Be careful with scams: a real employer does not ask you to pay to be recruited or to send money for a file.",
    ],
    resumeCta: "Build my resume",
    resumeHref: "/templates",
    interviewCta: "Prepare my interview",
    interviewHref: "/interview",
    note: "These sites are independent from ResumeCraft. Offers, rules and addresses can change, so check each site yourself.",
  },
  fr: {
    badge: "Emploi au Maroc",
    title: "Où trouver des offres d'emploi au Maroc",
    intro:
      "Une courte liste d'endroits où chercher des offres et postuler. Préparez d'abord votre CV, puis postulez à quelques offres qui correspondent vraiment à votre profil.",
    open: "Ouvrir le site",
    tipsTitle: "Conseils avant de postuler",
    tips: [
      "Adaptez votre CV à chaque offre : reprenez les mots-clés de l'annonce, à condition qu'ils soient vrais pour vous.",
      "Vérifiez la date de l'offre, l'expérience et le diplôme demandés avant de postuler.",
      "Si une entreprise n'a pas d'offre pour votre profil, une candidature spontanée sur sa page de recrutement mérite d'être tentée.",
      "Méfiez-vous des arnaques : un vrai employeur ne vous demande pas de payer pour être recruté ni d'envoyer de l'argent pour un dossier.",
    ],
    resumeCta: "Créer mon CV",
    resumeHref: "/fr/templates",
    interviewCta: "Préparer mon entretien",
    interviewHref: "/fr/interview",
    note: "Ces sites sont indépendants de ResumeCraft. Les offres, les règles et les adresses peuvent changer : vérifiez chaque site par vous-même.",
  },
};

export default function JobsView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const groups = jobGroups[lang];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
        {t.badge}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-3 text-slate-600">{t.intro}</p>

      {groups.map((g) => (
        <section key={g.id} className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900">{g.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{g.intro}</p>
          <div className="mt-4 space-y-3">
            {g.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
              >
                <span className="font-medium text-slate-900">{l.name}</span>
                <span className="ml-2 text-xs font-semibold text-blue-600">
                  {t.open} ↗
                </span>
                <span className="mt-1 block text-sm text-slate-600">{l.text}</span>
              </a>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="font-semibold text-slate-900">{t.tipsTitle}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {t.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={t.resumeHref}
          className="inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {t.resumeCta}
        </Link>
        <Link
          href={t.interviewHref}
          className="inline-block rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          {t.interviewCta}
        </Link>
      </div>

      <p className="mt-10 text-xs text-slate-500">{t.note}</p>
    </main>
  );
}