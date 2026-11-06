import Link from "next/link";
import { Lang } from "@/lib/labels";

const T = {
  en: {
    badge: "Early access",
    h1Before: "A simple recruiting CRM for ",
    h1Highlight: "small agencies and HR teams",
    sub: "Keep your jobs, candidates, pipeline, notes and follow-ups in one place. In French and English, and simple enough to start in minutes.",
    primary: "Create your workspace",
    secondary: "Log in",
    note: "No credit card needed.",
    board: ["Sourced", "Interview", "Offer", "Hired"],
    illustration: "Illustration of the pipeline board",

    featuresTitle: "What you can do today",
    featuresSub: "Everything below works now. Nothing here is a promise.",
    features: [
      {
        title: "Jobs",
        text: "Keep every position you are filling in one list, with client, location and status.",
      },
      {
        title: "Pipeline board",
        text: "Move candidates from sourced to hired by dragging cards, or with a menu on your phone.",
      },
      {
        title: "Candidate profiles",
        text: "Contact details, the jobs they are on, a timeline of notes and a list of tasks, on one page.",
      },
      {
        title: "Tasks and dashboard",
        text: "Set due dates, see what is overdue or due today across all candidates, and check your numbers at a glance.",
      },
      {
        title: "One-tap contact",
        text: "WhatsApp, call and email buttons that open your own apps. We send nothing for you.",
      },
      {
        title: "Consent reminders",
        text: "Record the lawful basis for each candidate and get a warning when it is missing.",
      },
    ],

    stepsTitle: "Start in three steps",
    steps: [
      {
        n: "01",
        title: "Create your workspace",
        text: "Sign up with your email and name your agency or team.",
      },
      {
        n: "02",
        title: "Add a job and candidates",
        text: "Add the position, then add people to its pipeline.",
      },
      {
        n: "03",
        title: "Follow up",
        text: "Write notes, set tasks with dates, and move candidates forward.",
      },
    ],

    dataTitle: "Your data, kept separate",
    dataPoints: [
      "Each workspace is separate: only its members can see its data.",
      "You decide what to store. Add only people you have a lawful reason to keep.",
      "You can delete a candidate, along with their notes and tasks, at any time.",
    ],
    dataLink: "Read how we handle data",

    laterTitle: "Not available yet",
    laterText: "We would rather tell you now than surprise you later.",
    later: [
      "Teammates and roles: today a workspace has one user",
      "Email reminders and notifications",
      "Importing candidates from a spreadsheet",
      "Arabic interface",
    ],

    faqTitle: "Questions, answered honestly",
    faqs: [
      {
        q: "Is it free?",
        a: "Right now you can create a workspace and try it. We will announce pricing before we charge anyone.",
      },
      {
        q: "Is my candidates' data safe?",
        a: "Each workspace is separate, so members of one workspace cannot see another's data. You are still responsible for having a lawful basis to keep each person's data. See our Privacy policy.",
      },
      {
        q: "Can my whole team use it?",
        a: "Not yet. Today a workspace has one user. Teammates are the next feature we want to build.",
      },
      {
        q: "Does it send emails or messages to candidates?",
        a: "No. The WhatsApp, call and email buttons open your own apps, and you send the message yourself.",
      },
      {
        q: "Does it work on my phone?",
        a: "Yes. On a small screen the pipeline columns stack, and each card has a menu to change its stage.",
      },
    ],

    finalTitle: "Try it with your next search",
    finalText: "Create a workspace in a minute and add your first job.",
    privacy: "Privacy policy",
    terms: "Terms",
  },
  fr: {
    badge: "Accès anticipé",
    h1Before: "Un CRM de recrutement simple pour ",
    h1Highlight: "les petits cabinets et les équipes RH",
    sub: "Gardez vos offres, vos candidats, votre pipeline, vos notes et vos relances au même endroit. En français et en anglais, et assez simple pour démarrer en quelques minutes.",
    primary: "Créer votre espace",
    secondary: "Se connecter",
    note: "Aucune carte bancaire nécessaire.",
    board: ["Sourcé", "Entretien", "Offre", "Embauché"],
    illustration: "Illustration du tableau de pipeline",

    featuresTitle: "Ce que vous pouvez faire aujourd'hui",
    featuresSub: "Tout ce qui suit fonctionne dès maintenant. Rien n'est une promesse.",
    features: [
      {
        title: "Offres",
        text: "Gardez tous les postes que vous pourvoyez dans une seule liste, avec client, lieu et statut.",
      },
      {
        title: "Tableau de pipeline",
        text: "Faites avancer les candidats de sourcé à embauché en glissant les cartes, ou avec un menu sur téléphone.",
      },
      {
        title: "Fiches candidats",
        text: "Coordonnées, offres concernées, historique de notes et liste de tâches, sur une seule page.",
      },
      {
        title: "Tâches et tableau de bord",
        text: "Fixez des échéances, voyez ce qui est en retard ou à faire aujourd'hui pour tous vos candidats, et suivez vos chiffres d'un coup d'œil.",
      },
      {
        title: "Contact en un geste",
        text: "Des boutons WhatsApp, appel et email qui ouvrent vos propres applications. Nous n'envoyons rien à votre place.",
      },
      {
        title: "Rappels de consentement",
        text: "Enregistrez la base légale de chaque candidat et recevez un avertissement quand elle manque.",
      },
    ],

    stepsTitle: "Démarrez en trois étapes",
    steps: [
      {
        n: "01",
        title: "Créez votre espace",
        text: "Inscrivez-vous avec votre email et nommez votre cabinet ou votre équipe.",
      },
      {
        n: "02",
        title: "Ajoutez une offre et des candidats",
        text: "Ajoutez le poste, puis ajoutez des personnes à son pipeline.",
      },
      {
        n: "03",
        title: "Relancez",
        text: "Écrivez des notes, fixez des tâches avec des dates et faites avancer les candidats.",
      },
    ],

    dataTitle: "Vos données, bien séparées",
    dataPoints: [
      "Chaque espace est séparé : seuls ses membres voient ses données.",
      "Vous décidez de ce que vous enregistrez. N'ajoutez que des personnes que vous avez une raison légale de conserver.",
      "Vous pouvez supprimer un candidat, avec ses notes et ses tâches, à tout moment.",
    ],
    dataLink: "Lire comment nous traitons les données",

    laterTitle: "Pas encore disponible",
    laterText: "Nous préférons vous le dire maintenant plutôt que vous surprendre plus tard.",
    later: [
      "Collègues et rôles : aujourd'hui, un espace n'a qu'un utilisateur",
      "Rappels et notifications par email",
      "Import de candidats depuis un tableur",
      "Interface en arabe",
    ],

    faqTitle: "Vos questions, des réponses honnêtes",
    faqs: [
      {
        q: "C'est gratuit ?",
        a: "Pour l'instant, vous pouvez créer un espace et l'essayer. Nous annoncerons les tarifs avant de facturer qui que ce soit.",
      },
      {
        q: "Les données de mes candidats sont-elles en sécurité ?",
        a: "Chaque espace est séparé : les membres d'un espace ne voient pas les données d'un autre. Vous restez responsable d'avoir une base légale pour conserver les données de chaque personne. Voir notre Politique de confidentialité.",
      },
      {
        q: "Toute mon équipe peut-elle l'utiliser ?",
        a: "Pas encore. Aujourd'hui, un espace n'a qu'un utilisateur. Les collègues sont la prochaine fonction que nous voulons construire.",
      },
      {
        q: "Envoie-t-il des emails ou des messages aux candidats ?",
        a: "Non. Les boutons WhatsApp, appel et email ouvrent vos propres applications, et c'est vous qui envoyez le message.",
      },
      {
        q: "Est-ce que ça marche sur mon téléphone ?",
        a: "Oui. Sur un petit écran, les colonnes du pipeline s'empilent, et chaque carte a un menu pour changer d'étape.",
      },
    ],

    finalTitle: "Essayez-le pour votre prochaine recherche",
    finalText: "Créez un espace en une minute et ajoutez votre première offre.",
    privacy: "Politique de confidentialité",
    terms: "Conditions",
  },
};

// Only a drawing of the board: no real names or data
function BoardPreview({ labels }: { labels: string[] }) {
  const counts = [3, 2, 1, 1];
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-4"
    >
      {labels.map((label, i) => (
        <div key={label} className="rounded-xl bg-white/10 p-3">
          <p className="text-xs font-semibold text-slate-200">{label}</p>
          <div className="mt-3 space-y-2">
            {Array.from({ length: counts[i] ?? 1 }).map((_, k) => (
              <div key={k} className="rounded-lg bg-white p-2.5">
                <div className="h-2 w-3/4 rounded bg-slate-800" />
                <div className="mt-1.5 h-1.5 w-1/2 rounded bg-slate-300" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecruitersView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const base = lang === "fr" ? "/fr" : "";

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200">
            <span className="text-amber-300">✦</span> {t.badge}
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            {t.h1Before}
            <span className="bg-linear-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">
              {t.h1Highlight}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
            {t.sub}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={`${base}/signup`}
              className="rounded-lg bg-amber-300 px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-300/20 transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              {t.primary}
            </Link>
            <Link
              href={`${base}/login`}
              className="rounded-lg border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t.secondary}
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">{t.note}</p>

          <div className="mx-auto mt-12 max-w-3xl text-left">
            <BoardPreview labels={t.board} />
            <p className="mt-2 text-center text-xs text-slate-500">
              {t.illustration}
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.featuresTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            {t.featuresSub}
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h3 className="font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.stepsTitle}
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {t.steps.map((s) => (
              <div key={s.n}>
                <p className="text-5xl font-semibold text-slate-200">{s.n}</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DATA + LATER */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-xl font-semibold text-slate-900">{t.dataTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {t.dataPoints.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="text-emerald-600">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`${base}/privacy`}
              className="mt-5 inline-block text-sm font-semibold text-blue-600 underline"
            >
              {t.dataLink}
            </Link>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-7">
            <h2 className="text-xl font-semibold text-slate-900">{t.laterTitle}</h2>
            <p className="mt-1 text-sm text-slate-600">{t.laterText}</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {t.later.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="text-slate-400">○</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.faqTitle}
          </h2>
          <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {t.faqs.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-900">
                  {f.q}
                  <span className="text-slate-400 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href={`${base}/privacy`} className="underline">
              {t.privacy}
            </Link>{" "}
            ·{" "}
            <Link href={`${base}/terms`} className="underline">
              {t.terms}
            </Link>
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-950 px-8 py-16 text-center text-white">
          <div className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.finalTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-300">
              {t.finalText}
            </p>
            <Link
              href={`${base}/signup`}
              className="mt-8 inline-block rounded-lg bg-amber-300 px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-300/20 transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              {t.primary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}