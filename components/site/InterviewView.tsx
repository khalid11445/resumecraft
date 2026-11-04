import Link from "next/link"; import ShareButtons from "@/components/site/ShareButtons";
import { Lang } from "@/lib/labels";
import { interview } from "@/lib/interview";

const T = {
  en: {
    badge: "Interview preparation",
    title: "Prepare for your job interview",
    intro:
      "Common interview questions by profession, with advice and a sample answer to adapt. Replace everything in [brackets] with your own real experience.",
    starTitle: "The STAR method",
    starText:
      "For questions that start with “Tell me about a time...”, structure your answer in four parts:",
    star: [
      ["Situation", "the context, in one or two sentences"],
      ["Task", "what you had to achieve"],
      ["Action", "what you personally did"],
      ["Result", "what happened, with a number if you have one"],
    ],
    tip: "Advice",
    example: "Sample answer",
    cta: "Build my resume",
    ctaHref: "/templates",
    note: "These are general tips, not official guidance. Adapt every answer to your own experience and to the job you are applying for. Never invent facts: recruiters check.",
  },
  fr: {
    badge: "Préparation d'entretien",
    title: "Préparez votre entretien d'embauche",
    intro:
      "Les questions d'entretien courantes par métier, avec des conseils et un exemple de réponse à adapter. Remplacez tout ce qui est entre [crochets] par votre propre expérience réelle.",
    starTitle: "La méthode STAR",
    starText:
      "Pour les questions du type « Parlez-moi d'une fois où... », structurez votre réponse en quatre parties :",
    star: [
      ["Situation", "le contexte, en une ou deux phrases"],
      ["Tâche", "ce que vous deviez accomplir"],
      ["Action", "ce que vous avez fait personnellement"],
      ["Résultat", "ce qui s'est passé, avec un chiffre si vous en avez un"],
    ],
    tip: "Conseil",
    example: "Exemple de réponse",
    cta: "Créer mon CV",
    ctaHref: "/fr/templates",
    note: "Ce sont des conseils généraux, pas des consignes officielles. Adaptez chaque réponse à votre propre expérience et au poste visé. N'inventez jamais de faits : les recruteurs vérifient.",
  },
};

export default function InterviewView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const groups = interview[lang];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
        {t.badge}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-3 text-slate-600">{t.intro}</p><ShareButtons lang={lang} />

      <div className="mt-6 flex flex-wrap gap-2">
        {groups.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            {g.title}
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="font-semibold text-slate-900">{t.starTitle}</h2>
        <p className="mt-1 text-sm text-slate-600">{t.starText}</p>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {t.star.map(([name, desc]) => (
            <li key={name}>
              <span className="font-semibold">{name}</span> : {desc}
            </li>
          ))}
        </ul>
      </div>

      {groups.map((g) => (
        <section key={g.id} id={g.id} className="mt-12 scroll-mt-6">
          <h2 className="text-xl font-semibold text-slate-900">{g.title}</h2>
          <div className="mt-4 space-y-3">
            {g.items.map((item) => (
              <details
                key={item.q}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <summary className="cursor-pointer font-medium text-slate-900">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm text-slate-700">
                  <span className="font-semibold">{t.tip} : </span>
                  {item.tip}
                </p>
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  <span className="font-semibold">{t.example} : </span>
                  {item.example}
                </p>
              </details>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12">
        <Link
          href={t.ctaHref}
          className="inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {t.cta}
        </Link>
      </div>

      <p className="mt-10 text-xs text-slate-500">{t.note}</p>
    </main>
  );
}