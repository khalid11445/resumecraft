import Link from "next/link";
import { Lang } from "@/lib/labels";
import {
  AppFrame,
  BoardMock,
  MessageMock,
  ProfileMock,
  TeamMock,
} from "@/components/site/Mockups";
import ProductTour from "@/components/site/ProductTour";
import RelatedLinks from "@/components/site/RelatedLinks";

const T = {
  en: {
    badge: "Early access",
    h1a: "A simple recruiting CRM for",
    h1b: "small agencies and HR teams",
    sub: "Keep your jobs, candidates, pipeline, notes and follow-ups in one place. In French and English, and simple enough to start in minutes.",
    primary: "Create your workspace",
    secondary: "Log in",
    note: "Free to start. No credit card needed.",
    chips: [
      ["tour", "Tour"],
      ["pipeline", "Pipeline"],
      ["candidates", "Candidates"],
      ["messages", "Messages"],
      ["team", "Team"],
      ["data", "Your data"],
      ["plans", "Plans"],
      ["faq", "FAQ"],
    ],
    tourTitle: "See it in 25 seconds",
    tourSub: "An animated tour with sample data. No sign-up needed.",

    features: {
      pipeline: {
        eyebrow: "Jobs and pipeline",
        title: "Every search, on one board",
        text: "Each job has its own board. Move candidates from sourced to hired and see where every search stands.",
        points: [
          "Six stages: sourced, contacted, interview, offer, hired, rejected",
          "Drag cards, or use a menu on your phone",
          "A dashboard with counts and your next tasks",
        ],
      },
      candidates: {
        eyebrow: "Candidates and CVs",
        title: "One page per candidate",
        text: "Everything about a person in one place, instead of scattered between a spreadsheet, a folder and your phone.",
        points: [
          "Contact details with one-tap WhatsApp, call and email",
          "Attach CVs in PDF or Word, and other documents",
          "A timeline of notes that shows who wrote each one",
          "Tasks with due dates, with overdue and due-today flagged",
        ],
      },
      messages: {
        eyebrow: "Message templates",
        title: "Write less, follow up more",
        text: "Shared templates fill in each candidate's details. Open the message in WhatsApp or your email app, then press send yourself.",
        points: [
          "Templates in French or English for your whole team",
          "Missing details stay visible as [brackets]",
          "We send nothing for you, so nothing goes out by mistake",
        ],
      },
      team: {
        eyebrow: "Teams and roles",
        title: "Built for more than one recruiter",
        text: "Invite colleagues with a link, give them a role and share the work.",
        points: [
          "Invitations by link: no email needed, you can send it on WhatsApp",
          "Owner, admin and member roles",
          "Assign tasks and filter by who owns them",
        ],
      },
    },

    dataTitle: "Your data, under your control",
    dataText: "A recruiting tool holds other people's personal data, so it has to be easy to manage.",
    dataPoints: [
      "Each workspace is separate: only its members see its data",
      "Import your existing list from a CSV file, with a preview and duplicate detection",
      "Export your candidates and a full backup whenever you want",
      "Record the lawful basis for each person, with a warning when it is missing",
      "Delete a candidate with their files, or a whole workspace",
    ],
    dataLink: "Read how we handle data",

    plansTitle: "Start free, upgrade when you need more",
    plansText:
      "Prices for teams are agreed with each customer in this early phase.",
    free: {
      name: "Free",
      text: "Create a workspace and try everything. Limits on candidates, teammates and attached files are shown in the Plan tab of your workspace.",
    },
    pro: {
      name: "Pro",
      text: "No candidate limit and more teammates. We invoice you and activate your workspace by hand, then you keep working as before.",
    },
    plansLink: "See plans for teams",

    laterTitle: "Not available yet",
    laterText: "We would rather tell you now than surprise you later.",
    later: [
      "Email reminders and notifications",
      "Restoring a backup file into a workspace",
      "Previewing attached files without downloading them",
      "Arabic interface",
    ],

    faqTitle: "Questions, answered honestly",
    faqs: [
      {
        q: "Is it free?",
        a: "You can create a free workspace and try it. The free plan has limits, shown in the Plan tab. A Pro plan removes them. In this early phase, paid plans are agreed with each customer, invoiced by us and activated by hand. We will announce prices before we charge anyone.",
      },
      {
        q: "Is my candidates' data safe?",
        a: "Each workspace is separate, so members of one workspace cannot see another's data. You are still responsible for having a lawful basis to keep each person's data. See our Privacy policy.",
      },
      {
        q: "Can my whole team use it?",
        a: "Yes. The owner invites teammates with a link and gives each person a role, admin or member. Tasks can be assigned to a person.",
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
    h1a: "Un CRM de recrutement simple pour",
    h1b: "les petits cabinets et les équipes RH",
    sub: "Gardez vos offres, vos candidats, votre pipeline, vos notes et vos relances au même endroit. En français et en anglais, et assez simple pour démarrer en quelques minutes.",
    primary: "Créer votre espace",
    secondary: "Se connecter",
    note: "Gratuit pour commencer. Aucune carte bancaire nécessaire.",
    chips: [
      ["tour", "Visite"],
      ["pipeline", "Pipeline"],
      ["candidates", "Candidats"],
      ["messages", "Messages"],
      ["team", "Équipe"],
      ["data", "Vos données"],
      ["plans", "Formules"],
      ["faq", "FAQ"],
    ],
    tourTitle: "Voyez-le en 25 secondes",
    tourSub: "Une visite animée avec des données d'exemple. Aucune inscription nécessaire.",

    features: {
      pipeline: {
        eyebrow: "Offres et pipeline",
        title: "Chaque recherche, sur un seul tableau",
        text: "Chaque offre a son propre tableau. Faites avancer les candidats de sourcé à embauché et voyez où en est chaque recherche.",
        points: [
          "Six étapes : sourcé, contacté, entretien, offre, embauché, refusé",
          "Glissez les cartes, ou utilisez un menu sur téléphone",
          "Un tableau de bord avec les chiffres et vos prochaines tâches",
        ],
      },
      candidates: {
        eyebrow: "Candidats et CV",
        title: "Une page par candidat",
        text: "Tout ce qui concerne une personne au même endroit, plutôt que dispersé entre un tableur, un dossier et votre téléphone.",
        points: [
          "Coordonnées avec WhatsApp, appel et email en un geste",
          "Joignez des CV en PDF ou Word, et d'autres documents",
          "Un historique de notes qui indique qui a écrit chacune",
          "Des tâches avec échéance, avec les retards et les tâches du jour signalés",
        ],
      },
      messages: {
        eyebrow: "Modèles de messages",
        title: "Écrivez moins, relancez plus",
        text: "Des modèles partagés remplissent les informations de chaque candidat. Ouvrez le message dans WhatsApp ou votre messagerie, puis envoyez-le vous-même.",
        points: [
          "Des modèles en français ou en anglais pour toute votre équipe",
          "Les informations manquantes restent visibles entre [crochets]",
          "Nous n'envoyons rien à votre place : rien ne part par erreur",
        ],
      },
      team: {
        eyebrow: "Équipes et rôles",
        title: "Pensé pour plus d'un recruteur",
        text: "Invitez vos collègues avec un lien, donnez-leur un rôle et partagez le travail.",
        points: [
          "Invitations par lien : aucun email nécessaire, vous pouvez l'envoyer sur WhatsApp",
          "Rôles propriétaire, admin et membre",
          "Assignez des tâches et filtrez par responsable",
        ],
      },
    },

    dataTitle: "Vos données, sous votre contrôle",
    dataText:
      "Un outil de recrutement contient les données personnelles d'autres personnes : il doit donc être facile à gérer.",
    dataPoints: [
      "Chaque espace est séparé : seuls ses membres voient ses données",
      "Importez votre liste existante depuis un fichier CSV, avec aperçu et détection des doublons",
      "Exportez vos candidats et une sauvegarde complète quand vous le voulez",
      "Enregistrez la base légale de chaque personne, avec un avertissement quand elle manque",
      "Supprimez un candidat avec ses fichiers, ou un espace entier",
    ],
    dataLink: "Lire comment nous traitons les données",

    plansTitle: "Démarrez gratuitement, passez à Pro quand il le faut",
    plansText:
      "Les tarifs pour les équipes sont convenus avec chaque client pendant cette première phase.",
    free: {
      name: "Gratuite",
      text: "Créez un espace et essayez tout. Les limites de candidats, de collègues et de fichiers joints sont indiquées dans l'onglet Formule de votre espace.",
    },
    pro: {
      name: "Pro",
      text: "Aucune limite de candidats et plus de collègues. Nous vous facturons et activons votre espace à la main, puis vous continuez à travailler comme avant.",
    },
    plansLink: "Voir les formules pour les équipes",

    laterTitle: "Pas encore disponible",
    laterText:
      "Nous préférons vous le dire maintenant plutôt que vous surprendre plus tard.",
    later: [
      "Rappels et notifications par email",
      "Restauration d'un fichier de sauvegarde dans un espace",
      "Aperçu des fichiers joints sans les télécharger",
      "Interface en arabe",
    ],

    faqTitle: "Vos questions, des réponses honnêtes",
    faqs: [
      {
        q: "C'est gratuit ?",
        a: "Vous pouvez créer un espace gratuit et l'essayer. La formule gratuite a des limites, indiquées dans l'onglet Formule. Une formule Pro les supprime. Dans cette première phase, les formules payantes sont convenues avec chaque client, facturées par nous et activées à la main. Nous annoncerons les tarifs avant de facturer qui que ce soit.",
      },
      {
        q: "Les données de mes candidats sont-elles en sécurité ?",
        a: "Chaque espace est séparé : les membres d'un espace ne voient pas les données d'un autre. Vous restez responsable d'avoir une base légale pour conserver les données de chaque personne. Voir notre Politique de confidentialité.",
      },
      {
        q: "Toute mon équipe peut-elle l'utiliser ?",
        a: "Oui. Le propriétaire invite ses collègues avec un lien et donne à chacun un rôle, admin ou membre. Les tâches peuvent être assignées à une personne.",
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

type FeatureId = "pipeline" | "candidates" | "messages" | "team";
const FEATURES: FeatureId[] = ["pipeline", "candidates", "messages", "team"];

export default function RecruitersView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const base = lang === "fr" ? "/fr" : "";

  const mock = (id: FeatureId) =>
    id === "pipeline" ? (
      <BoardMock lang={lang} step={2} />
    ) : id === "candidates" ? (
      <ProfileMock lang={lang} step={3} />
    ) : id === "messages" ? (
      <MessageMock lang={lang} step={3} />
    ) : (
      <TeamMock lang={lang} step={3} />
    );

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200">
            <span className="text-amber-300">✦</span> {t.badge}
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            {t.h1a}{" "}
            <span className="bg-linear-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">
              {t.h1b}
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
        </div>
      </section>

      {/* IN-PAGE NAVIGATION */}
      <nav
        aria-label="On this page"
        className="sticky top-14 z-30 border-b border-slate-200 bg-white/90 backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 py-2.5">
          {t.chips.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* TOUR */}
      <section id="tour" className="scroll-mt-28 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.tourTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            {t.tourSub}
          </p>
          <div className="mt-10">
            <ProductTour lang={lang} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      {FEATURES.map((id, i) => {
        const f = t.features[id];
        return (
          <section
            key={id}
            id={id}
            className={`scroll-mt-28 py-20 ${i % 2 === 0 ? "bg-slate-50" : "bg-white"}`}
          >
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  {f.eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {f.title}
                </h2>
                <p className="mt-3 text-slate-600">{f.text}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  {f.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="text-emerald-600">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <AppFrame title="ResumeCraft">{mock(id)}</AppFrame>
              </div>
            </div>
          </section>
        );
      })}

      {/* DATA */}
      <section id="data" className="scroll-mt-28 bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-semibold tracking-tight">{t.dataTitle}</h2>
          <p className="mt-3 max-w-2xl text-slate-300">{t.dataText}</p>
          <ul className="mt-8 space-y-3 text-sm text-slate-200">
            {t.dataPoints.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="text-amber-300">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`${base}/privacy`}
            className="mt-8 inline-block text-sm font-semibold text-amber-300 underline"
          >
            {t.dataLink}
          </Link>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="scroll-mt-28 bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.plansTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            {t.plansText}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[t.free, t.pro].map((p, i) => (
              <div
                key={p.name}
                className={`rounded-3xl p-8 ${
                  i === 1
                    ? "border-2 border-slate-900"
                    : "border border-slate-200"
                }`}
              >
                <h3 className="text-xl font-semibold text-slate-900">{p.name}</h3>
                <p className="mt-3 text-sm text-slate-600">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href={`${base}/pricing#teams`}
              className="text-sm font-semibold text-slate-900 underline"
            >
              {t.plansLink}
            </Link>
          </div>

          <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-dashed border-slate-300 p-6">
            <h3 className="font-semibold text-slate-900">{t.laterTitle}</h3>
            <p className="mt-1 text-sm text-slate-600">{t.laterText}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
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
      <section id="faq" className="scroll-mt-28 bg-slate-50 py-20">
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
      <section className="px-6 py-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-950 px-8 py-16 text-center text-white">
          <div className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.finalTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-300">{t.finalText}</p>
            <Link
              href={`${base}/signup`}
              className="mt-8 inline-block rounded-lg bg-amber-300 px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-300/20 transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              {t.primary}
            </Link>
          </div>
        </div>
      </section>

      <RelatedLinks lang={lang} current="crm" />
    </main>
  );
}