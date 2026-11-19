import Image from "next/image";
import Link from "next/link";
import { Lang } from "@/lib/labels";
import { getCategories } from "@/lib/catalog";
import { examples, exampleImage, builderLink, exampleLabel } from "@/lib/examples";
import { categoryAccent } from "@/lib/themes";
import { hrefFor, linkById } from "@/lib/sitelinks";
import { AppFrame, BoardMock } from "@/components/site/Mockups";
import ProductTour from "@/components/site/ProductTour";

const T = {
  en: {
    eyebrow: "Resumes that get read · Hiring that stays organized",
    h1a: "The smarter way to get hired,",
    h1b: "and to hire.",
    sub: "Build a clear, professional resume in minutes. Or run your recruiting from one simple CRM, built for small agencies and HR teams.",
    ctaSeeker: "Build my resume",
    ctaRecruiter: "Explore the CRM",
    note: "Free to start. No credit card needed.",
    frame: "ResumeCraft · Pipeline",

    splitTitle: "Two ways to use ResumeCraft",
    seekers: {
      title: "For job seekers",
      text: "Everything to apply well, from the first resume to the interview.",
      points: [
        "A resume for your profession, in French or English",
        "Internship and PFE guide with a request letter",
        "An application tracker with follow-up reminders",
        "Interview preparation, question by question",
      ],
      link: "Build my resume",
    },
    recruiters: {
      title: "For recruiters and HR teams",
      text: "One place for your jobs, candidates, notes and follow-ups.",
      points: [
        "A pipeline board for every job",
        "CVs, notes and tasks on each candidate",
        "WhatsApp and email message templates",
        "Invite your team with a link",
      ],
      link: "Explore the CRM",
    },

    seekersEyebrow: "For job seekers",
    seekersTitle: "Resumes designed to be read",
    seekersSub:
      "Clean layouts that people and software can read, with the right sections for your profession.",
    useDesign: "Use this design →",
    professionsTitle: "Start with your profession",
    toolsTitle: "Everything around the resume",
    open: "Open",

    crmEyebrow: "For recruiters",
    crmTitle: "See the CRM in 25 seconds",
    crmSub:
      "A short animated tour of the product. It uses sample data and needs no sign-up.",
    benefits: [
      {
        title: "Never lose a candidate",
        text: "Every person sits in a stage, on a board your whole team can see.",
        id: "pipeline",
      },
      {
        title: "Message faster, stay in control",
        text: "Templates fill in each candidate's details. You press send yourself.",
        id: "messages",
      },
      {
        title: "Work as a team",
        text: "Invite colleagues with a link and assign tasks to a person.",
        id: "team",
      },
    ],
    crmCta: "Create your free workspace",
    crmMore: "See all CRM features",

    stepsTitle: "Getting started takes minutes",
    tracks: [
      {
        title: "Job seekers",
        steps: [
          "Pick your profession",
          "Edit with a live preview",
          "Download your resume",
        ],
      },
      {
        title: "Recruiters",
        steps: [
          "Create your workspace",
          "Add a job and your candidates",
          "Move them through the pipeline",
        ],
      },
    ],

    trustTitle: "Honest by design",
    trust: [
      {
        title: "No invented facts",
        text: "Missing details stay visible as [brackets], so you never send a blank or a made-up number.",
      },
      {
        title: "Your data stays separate",
        text: "Each CRM workspace is separate: only its members can see its data.",
      },
      {
        title: "You stay in control",
        text: "Messages open in WhatsApp or your email app. We send nothing for you.",
      },
      {
        title: "No surprise charges",
        text: "Build and preview for free. For individuals, one payment, no subscription.",
      },
    ],
    trustLink: "Read how we handle data",

    faqTitle: "Questions, answered honestly",
    faqs: [
      {
        q: "Is it free?",
        a: "You can build and preview a resume for free, and create a free CRM workspace with limits shown in its Plan tab. Downloading a resume uses a one-time pass. See the Pricing page.",
      },
      {
        q: "Will my resume pass applicant tracking systems (ATS)?",
        a: "No tool can promise that, because every employer's system reads files differently. Simple single-column layouts use real, selectable text and are generally easier for software to read. Two-column designs can be harder for some systems.",
      },
      {
        q: "Is my information private?",
        a: "What you type in the resume builder stays in your browser. CRM data is stored in your private workspace, visible only to its members. See the Privacy policy for details.",
      },
      {
        q: "Does the CRM send messages to candidates?",
        a: "No. The WhatsApp, call and email buttons open your own apps, and you send the message yourself.",
      },
      {
        q: "Can my whole team use the CRM?",
        a: "Yes. The owner invites colleagues with a link and gives each person a role. Tasks can be assigned to a person.",
      },
    ],

    finalTitle: "Ready to start?",
    finalText: "Pick the side that fits you. Both are free to try.",
    privacy: "Privacy policy",
  },
  fr: {
    eyebrow: "Des CV qui se font lire · Un recrutement bien organisé",
    h1a: "La façon la plus maligne de se faire embaucher,",
    h1b: "et d'embaucher.",
    sub: "Créez un CV clair et professionnel en quelques minutes. Ou pilotez votre recrutement depuis un CRM simple, pensé pour les petits cabinets et les équipes RH.",
    ctaSeeker: "Créer mon CV",
    ctaRecruiter: "Découvrir le CRM",
    note: "Gratuit pour commencer. Aucune carte bancaire nécessaire.",
    frame: "ResumeCraft · Pipeline",

    splitTitle: "Deux façons d'utiliser ResumeCraft",
    seekers: {
      title: "Pour les candidats",
      text: "Tout pour bien postuler, du premier CV à l'entretien.",
      points: [
        "Un CV adapté à votre métier, en français ou en anglais",
        "Un guide stage et PFE avec une lettre de demande",
        "Un suivi de candidatures avec rappels de relance",
        "Une préparation à l'entretien, question par question",
      ],
      link: "Créer mon CV",
    },
    recruiters: {
      title: "Pour les recruteurs et les équipes RH",
      text: "Un seul endroit pour vos offres, vos candidats, vos notes et vos relances.",
      points: [
        "Un tableau de pipeline pour chaque offre",
        "CV, notes et tâches sur chaque candidat",
        "Des modèles de messages WhatsApp et email",
        "Invitez votre équipe avec un lien",
      ],
      link: "Découvrir le CRM",
    },

    seekersEyebrow: "Pour les candidats",
    seekersTitle: "Des CV pensés pour être lus",
    seekersSub:
      "Des mises en page claires, lisibles par les personnes comme par les logiciels, avec les bonnes sections pour votre métier.",
    useDesign: "Utiliser ce design →",
    professionsTitle: "Commencez avec votre métier",
    toolsTitle: "Tout ce qui entoure le CV",
    open: "Ouvrir",

    crmEyebrow: "Pour les recruteurs",
    crmTitle: "Découvrez le CRM en 25 secondes",
    crmSub:
      "Une courte visite animée du produit. Elle utilise des données d'exemple et ne demande aucune inscription.",
    benefits: [
      {
        title: "Ne perdez plus aucun candidat",
        text: "Chaque personne est dans une étape, sur un tableau que toute l'équipe voit.",
        id: "pipeline",
      },
      {
        title: "Écrivez plus vite, gardez la main",
        text: "Les modèles remplissent les informations de chaque candidat. Vous envoyez vous-même.",
        id: "messages",
      },
      {
        title: "Travaillez en équipe",
        text: "Invitez vos collègues avec un lien et assignez des tâches à une personne.",
        id: "team",
      },
    ],
    crmCta: "Créer votre espace gratuit",
    crmMore: "Voir toutes les fonctions du CRM",

    stepsTitle: "Démarrer prend quelques minutes",
    tracks: [
      {
        title: "Candidats",
        steps: [
          "Choisissez votre métier",
          "Modifiez avec un aperçu en direct",
          "Téléchargez votre CV",
        ],
      },
      {
        title: "Recruteurs",
        steps: [
          "Créez votre espace",
          "Ajoutez une offre et vos candidats",
          "Faites-les avancer dans le pipeline",
        ],
      },
    ],

    trustTitle: "Honnête par conception",
    trust: [
      {
        title: "Aucun fait inventé",
        text: "Les informations manquantes restent visibles entre [crochets] : vous n'envoyez jamais un blanc ni un chiffre inventé.",
      },
      {
        title: "Vos données restent séparées",
        text: "Chaque espace du CRM est séparé : seuls ses membres voient ses données.",
      },
      {
        title: "Vous gardez la main",
        text: "Les messages s'ouvrent dans WhatsApp ou votre messagerie. Nous n'envoyons rien à votre place.",
      },
      {
        title: "Pas de mauvaise surprise",
        text: "Créez et prévisualisez gratuitement. Pour les particuliers, un seul paiement, sans abonnement.",
      },
    ],
    trustLink: "Lire comment nous traitons les données",

    faqTitle: "Vos questions, des réponses honnêtes",
    faqs: [
      {
        q: "C'est gratuit ?",
        a: "Vous pouvez créer et prévisualiser un CV gratuitement, et créer un espace CRM gratuit avec des limites indiquées dans son onglet Formule. Le téléchargement d'un CV passe par un accès à paiement unique. Voir la page Tarifs.",
      },
      {
        q: "Mon CV passera-t-il les logiciels de tri des candidatures (ATS) ?",
        a: "Aucun outil ne peut le promettre, car chaque employeur utilise un logiciel différent. Les mises en page simples sur une colonne utilisent du vrai texte sélectionnable et sont en général plus faciles à lire pour un logiciel. Les designs à deux colonnes peuvent être plus difficiles pour certains systèmes.",
      },
      {
        q: "Mes informations sont-elles privées ?",
        a: "Ce que vous saisissez dans le créateur de CV reste dans votre navigateur. Les données du CRM sont conservées dans votre espace privé, visible uniquement par ses membres. Voir la Politique de confidentialité.",
      },
      {
        q: "Le CRM envoie-t-il des messages aux candidats ?",
        a: "Non. Les boutons WhatsApp, appel et email ouvrent vos propres applications, et c'est vous qui envoyez le message.",
      },
      {
        q: "Toute mon équipe peut-elle utiliser le CRM ?",
        a: "Oui. Le propriétaire invite ses collègues avec un lien et donne à chacun un rôle. Les tâches peuvent être assignées à une personne.",
      },
    ],

    finalTitle: "Prêt à commencer ?",
    finalText: "Choisissez le côté qui vous correspond. Les deux sont gratuits à essayer.",
    privacy: "Politique de confidentialité",
  },
};

const TOOL_IDS = ["tracker", "interview", "letter", "stage"];

export default function HomeView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const base = lang === "fr" ? "/fr" : "";
  const categories = getCategories(lang);
  const featured = examples.slice(0, 3);

  const primaryBtn =
    "rounded-lg bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-300/20 transition hover:-translate-y-0.5 hover:bg-amber-200";
  const ghostBtn =
    "rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10";

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div className="motion-safe:animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200">
              <span className="text-amber-300">✦</span> {t.eyebrow}
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {t.h1a}{" "}
              <span className="bg-linear-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                {t.h1b}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
              {t.sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`${base}/templates`} className={primaryBtn}>
                {t.ctaSeeker}
              </Link>
              <Link href={`${base}/recruiters`} className={ghostBtn}>
                {t.ctaRecruiter}
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">{t.note}</p>
          </div>

          <div className="relative mx-auto w-full max-w-xl pb-8">
            <AppFrame title={t.frame}>
              <BoardMock lang={lang} step={2} />
            </AppFrame>
            <div className="absolute -bottom-2 -left-3 hidden w-28 -rotate-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl sm:block md:w-36">
              <Image
                src={exampleImage(examples[0].id, lang)}
                alt={exampleLabel(examples[0], lang)}
                width={1190}
                height={1684}
                sizes="144px"
                loading="eager"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TWO AUDIENCES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.splitTitle}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { data: t.seekers, href: `${base}/templates`, tone: "from-blue-50" },
              { data: t.recruiters, href: `${base}/recruiters`, tone: "from-amber-50" },
            ].map(({ data, href, tone }) => (
              <div
                key={data.title}
                className={`flex flex-col rounded-3xl border border-slate-200 bg-linear-to-b ${tone} to-white p-8`}
              >
                <h3 className="text-xl font-semibold text-slate-900">{data.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{data.text}</p>
                <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                  {data.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="text-emerald-600">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className="mt-8 inline-block self-start rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  {data.link} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOB SEEKERS */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-amber-700">
            {t.seekersEyebrow}
          </p>
          <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.seekersTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            {t.seekersSub}
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {featured.map((ex, i) => (
              <Link key={ex.id} href={builderLink(ex, lang)} className="group block">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <Image
                    src={exampleImage(ex.id, lang)}
                    alt={exampleLabel(ex, lang)}
                    width={1190}
                    height={1684}
                    sizes="(min-width: 640px) 33vw, 100vw"
                    loading={i === 0 ? "eager" : "lazy"}
                    className="h-auto w-full"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-medium text-slate-900">
                  {exampleLabel(ex, lang)}
                </p>
                <p className="text-center text-xs font-medium text-amber-700">
                  {t.useDesign}
                </p>
              </Link>
            ))}
          </div>

          <h3 className="mt-16 text-center text-lg font-semibold text-slate-900">
            {t.professionsTitle}
          </h3>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`${base}/builder/${c.id}`}
                className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-900 hover:shadow"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: categoryAccent[c.id] ?? "#1b2a41" }}
                />
                {c.name}
              </Link>
            ))}
          </div>

          <h3 className="mt-16 text-center text-lg font-semibold text-slate-900">
            {t.toolsTitle}
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOOL_IDS.map((id) => {
              const l = linkById(id);
              if (!l) return null;
              return (
                <Link
                  key={id}
                  href={hrefFor(l.href, lang)}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-md"
                >
                  <p className="font-semibold text-slate-900">{l.title[lang]}</p>
                  <p className="mt-1 text-sm text-slate-600">{l.desc[lang]}</p>
                  <p className="mt-4 text-xs font-semibold text-blue-600">
                    {t.open}{" "}
                    <span className="inline-block transition group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* RECRUITERS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-amber-700">
            {t.crmEyebrow}
          </p>
          <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.crmTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            {t.crmSub}
          </p>

          <div className="mt-10">
            <ProductTour lang={lang} />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {t.benefits.map((b) => {
              const l = linkById(b.id);
              return (
                <Link
                  key={b.id}
                  href={l ? hrefFor(l.href, lang) : `${base}/recruiters`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-md"
                >
                  <h3 className="font-semibold text-slate-900">{b.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{b.text}</p>
                  <p className="mt-4 text-xs font-semibold text-blue-600">
                    {t.open}{" "}
                    <span className="inline-block transition group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`${base}/signup`}
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {t.crmCta}
            </Link>
            <Link
              href={`${base}/recruiters`}
              className="text-sm font-semibold text-slate-900 underline"
            >
              {t.crmMore}
            </Link>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.stepsTitle}
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {t.tracks.map((track) => (
              <div key={track.title}>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  {track.title}
                </p>
                <ol className="mt-4 space-y-4">
                  {track.steps.map((s, i) => (
                    <li key={s} className="flex items-center gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        {i + 1}
                      </span>
                      <span className="text-slate-800">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.trustTitle}
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.trust.map((x) => (
              <div key={x.title} className="rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900">{x.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{x.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm">
            <Link href={`${base}/privacy`} className="font-semibold text-blue-600 underline">
              {t.trustLink}
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20">
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
            <Link href={`${base}/pricing`} className="underline">
              {lang === "fr" ? "Tarifs" : "Pricing"}
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
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={`${base}/templates`} className={primaryBtn}>
                {t.ctaSeeker}
              </Link>
              <Link href={`${base}/signup`} className={ghostBtn}>
                {t.crmCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}