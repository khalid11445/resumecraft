import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/catalog";
import { examples, exampleImage, builderLink, exampleLabel } from "@/lib/examples";
import { categoryAccent, palettes } from "@/lib/themes";
import { Lang } from "@/lib/labels";

// Update this list when you add a new layout
const LAYOUTS = ["Elegant", "Bold", "Timeline", "Modern", "Classic", "Compact"];

const T = {
  en: {
    badge: "New: AI Writer drafts your resume for you",
    h1Before: "A resume that looks like you ",
    h1Highlight: "hired a designer",
    sub: "Pick your profession, let the AI Writer draft it, click anything to edit, and download. No design skills needed.",
    cta: "Build my resume",
    secondary: "See examples",
    note: "No sign-up needed to start building.",
    statLabels: ["professions", "layouts", "colors"],
    chipAi: "✦ AI Writer",
    chipEdit: "Click to edit",
    chipLayouts: (n: number) => `${n} layouts`,
    marquee: [
      "Nurses",
      "Students",
      "Bankers",
      "Developers",
      "Teachers",
      "First jobs",
      "Internships",
      "Career changes",
    ],
    featuresTitle: "Everything you need, nothing you don't",
    featuresSub:
      "Built to get you from a blank page to a finished resume without fighting a design tool.",
    aiLabel: "AI Writer",
    aiTitle: "Tell your story. Get a full first draft.",
    aiText:
      "Describe your situation in your own words. Then keep chatting to refine it: shorter, more formal, add a new job.",
    aiUser:
      "I'm a final-year nursing student. ER and pediatrics placements, I speak Arabic, French and English. Looking for my first hospital job.",
    aiBot:
      "✦ Done. I wrote your summary, placements, and skills. Replace the [brackets] with your real numbers. Nothing was invented.",
    aiCaption: "Illustration of the AI Writer",
    editLabel: "Edit anywhere",
    editTitle: "Click the resume itself",
    editText:
      "No hunting through form fields. Click any text on the preview and change it on the spot.",
    editTag: "Edit text ✎",
    lookLabel: "Look",
    lookTitle: (n: number, m: number) => `${n} layouts, ${m} colors`,
    lookText: "Switch design at any time without retyping a word.",
    sugLabel: "Suggestions",
    sugTitle: "Never stare at a blank line",
    sugText:
      "Ready-made bullet points for your role. Click to add, then make them yours.",
    sugItems: [
      "+ Triaged and treated [X]+ patients per shift",
      "+ Built responsive interfaces with React",
      "+ Served [X]+ customers per shift",
    ],
    honestLabel: "Honest by design",
    honestTitle: "Your facts, not ours",
    honestItems: [
      "✓ Missing numbers stay as [brackets] until you fill them",
      "✓ A warning appears if any [bracket] is left",
      "✓ Photo is optional, you decide",
      "✓ Student? Mark studies as still in progress",
    ],
    profTitle: "Start with your profession",
    profSub: "Each one comes with the right sections and example content.",
    profGo: "Start building",
    galleryTitle: "Pick a design, make it yours",
    gallerySub:
      "Click any example to open it in the builder with the same layout and color.",
    galleryUse: "Use this design →",
    stepsTitle: "Three steps",
    steps: [
      {
        n: "01",
        title: "Pick your profession",
        text: "Start with the right sections and example content for your field.",
      },
      {
        n: "02",
        title: "Write it your way",
        text: "Fill the form, use suggestions, or let the AI Writer draft it. Click any text on the preview to fix it.",
      },
      {
        n: "03",
        title: "Choose a look and download",
        text: "Switch layouts and colors anytime, then download your resume.",
      },
    ],
    faqTitle: "Questions, answered honestly",
    faqs: [
      {
        q: "Is it free?",
        a: "You can pick a profession, build, and preview your resume for free. See the Pricing page for how downloads work.",
      },
      {
        q: "Will my resume pass applicant tracking systems (ATS)?",
        a: "No tool can promise that, because every employer's system reads files differently. Simple single-column layouts such as Classic and Compact use real, selectable text and are generally easier for software to read. Two-column designs like Modern look great to people but can be harder for some systems.",
      },
      {
        q: "Does the AI make things up?",
        a: "We tell it to use only what you write and to leave a [bracket] placeholder where a number is missing. Still, read every line before you send your resume: you are responsible for what it says.",
      },
      {
        q: "Is my information private?",
        a: "What you type stays in your browser while you build. If you use the AI Writer, the text you submit is sent to our AI provider to produce your draft. See the Privacy policy for details.",
      },
      {
        q: "Should I add a photo?",
        a: "It depends on the country. Photos are common in many places but usually left out in the US, Canada, and the UK. It is optional here, so you decide.",
      },
    ],
    faqMore: "More details in our",
    privacyLabel: "Privacy policy",
    and: "and",
    refundLabel: "Refund policy",
    finalTitle: "Your next resume is a few minutes away",
    finalText: "Start for free and watch it take shape as you type.",
  },
  fr: {
    badge: "Nouveau : le Rédacteur IA écrit votre CV avec vous",
    h1Before: "Un CV qui donne l'impression d'avoir fait appel à ",
    h1Highlight: "un designer",
    sub: "Choisissez votre métier, laissez le Rédacteur IA écrire un premier jet, cliquez sur n'importe quel texte pour le modifier, puis téléchargez. Aucune compétence en design nécessaire.",
    cta: "Créer mon CV",
    secondary: "Voir les exemples",
    note: "Aucune inscription pour commencer.",
    statLabels: ["métiers", "modèles", "couleurs"],
    chipAi: "✦ Rédacteur IA",
    chipEdit: "Cliquez pour modifier",
    chipLayouts: (n: number) => `${n} modèles`,
    marquee: [
      "Infirmiers",
      "Étudiants",
      "Banque",
      "Développeurs",
      "Enseignants",
      "Premier emploi",
      "Stages",
      "Reconversion",
    ],
    featuresTitle: "Tout ce qu'il faut, rien de superflu",
    featuresSub:
      "Conçu pour passer d'une page blanche à un CV terminé sans lutter contre un outil de design.",
    aiLabel: "Rédacteur IA",
    aiTitle: "Racontez votre parcours. Obtenez un premier jet complet.",
    aiText:
      "Décrivez votre situation avec vos propres mots. Continuez ensuite la conversation pour affiner : plus court, plus formel, ajouter un poste.",
    aiUser:
      "Je suis en dernière année d'études d'infirmier. Stages aux urgences et en pédiatrie, je parle arabe, français et anglais. Je cherche mon premier poste à l'hôpital.",
    aiBot:
      "✦ C'est fait. J'ai rédigé votre profil, vos stages et vos compétences. Remplacez les [crochets] par vos vrais chiffres. Rien n'a été inventé.",
    aiCaption: "Illustration du Rédacteur IA",
    editLabel: "Modifiez partout",
    editTitle: "Cliquez sur le CV lui-même",
    editText:
      "Plus besoin de chercher dans les champs d'un formulaire. Cliquez sur un texte de l'aperçu et modifiez-le sur place.",
    editTag: "Modifier le texte ✎",
    lookLabel: "Style",
    lookTitle: (n: number, m: number) => `${n} modèles, ${m} couleurs`,
    lookText: "Changez de design à tout moment sans retaper un mot.",
    sugLabel: "Suggestions",
    sugTitle: "Ne restez jamais devant une ligne vide",
    sugText:
      "Des missions prêtes à l'emploi pour votre poste. Cliquez pour ajouter, puis faites-les vôtres.",
    sugItems: [
      "+ Prise en charge de [X]+ patients par garde",
      "+ Création d'interfaces responsives avec React",
      "+ Accueil de [X]+ clients par jour",
    ],
    honestLabel: "Honnête par conception",
    honestTitle: "Vos faits, pas les nôtres",
    honestItems: [
      "✓ Les chiffres manquants restent entre [crochets] jusqu'à ce que vous les remplissiez",
      "✓ Un avertissement s'affiche s'il reste un [crochet]",
      "✓ La photo est optionnelle, c'est vous qui décidez",
      "✓ Étudiant ? Indiquez que vos études sont en cours",
    ],
    profTitle: "Commencez avec votre métier",
    profSub: "Chacun vient avec les bonnes sections et un contenu d'exemple.",
    profGo: "Commencer",
    galleryTitle: "Choisissez un design, faites-le vôtre",
    gallerySub:
      "Cliquez sur un exemple pour l'ouvrir dans le créateur avec le même modèle et la même couleur.",
    galleryUse: "Utiliser ce design →",
    stepsTitle: "Trois étapes",
    steps: [
      {
        n: "01",
        title: "Choisissez votre métier",
        text: "Partez des bonnes sections et d'un contenu d'exemple pour votre domaine.",
      },
      {
        n: "02",
        title: "Écrivez à votre façon",
        text: "Remplissez le formulaire, utilisez les suggestions ou laissez le Rédacteur IA rédiger. Cliquez sur un texte de l'aperçu pour le corriger.",
      },
      {
        n: "03",
        title: "Choisissez un style et téléchargez",
        text: "Changez de modèle et de couleur à tout moment, puis téléchargez votre CV.",
      },
    ],
    faqTitle: "Vos questions, des réponses honnêtes",
    faqs: [
      {
        q: "C'est gratuit ?",
        a: "Vous pouvez choisir un métier, créer et prévisualiser votre CV gratuitement. Consultez la page Tarifs pour le téléchargement.",
      },
      {
        q: "Mon CV passera-t-il les logiciels de tri des candidatures (ATS) ?",
        a: "Aucun outil ne peut le promettre, car chaque employeur utilise un logiciel différent. Les modèles simples sur une colonne, comme Classic et Compact, utilisent du vrai texte sélectionnable et sont en général plus faciles à lire pour un logiciel. Les designs à deux colonnes, comme Modern, plaisent aux recruteurs mais peuvent être plus difficiles à lire pour certains systèmes.",
      },
      {
        q: "L'IA invente-t-elle des choses ?",
        a: "Nous lui demandons de n'utiliser que ce que vous écrivez et de laisser un [crochet] quand un chiffre manque. Relisez malgré tout chaque ligne avant d'envoyer votre CV : vous êtes responsable de son contenu.",
      },
      {
        q: "Mes informations sont-elles privées ?",
        a: "Ce que vous saisissez reste dans votre navigateur pendant la création. Si vous utilisez le Rédacteur IA, le texte envoyé est transmis à notre prestataire d'IA pour produire votre brouillon. Voir la politique de confidentialité.",
      },
      {
        q: "Faut-il ajouter une photo ?",
        a: "Cela dépend du pays. Les photos sont courantes dans beaucoup d'endroits, mais généralement omises aux États-Unis, au Canada et au Royaume-Uni. Elle est optionnelle ici : vous décidez.",
      },
    ],
    faqMore: "Plus de détails dans notre",
    privacyLabel: "politique de confidentialité",
    and: "et notre",
    refundLabel: "politique de remboursement",
    finalTitle: "Votre prochain CV est à quelques minutes",
    finalText: "Commencez gratuitement et regardez-le prendre forme pendant que vous écrivez.",
  },
};

export default function HomeView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const base = lang === "fr" ? "/fr" : "";
  const categories = getCategories(lang);
  const hero = examples.slice(0, 3);
  const stats = [categories.length, LAYOUTS.length, palettes.length];

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div className="motion-safe:animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200">
              <span className="text-amber-300">✦</span> {t.badge}
            </span>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
              {t.h1Before}
              <span className="bg-linear-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                {t.h1Highlight}
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base text-slate-300 sm:text-lg">
              {t.sub}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`${base}/templates`}
                className="rounded-lg bg-amber-300 px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-300/20 transition hover:-translate-y-0.5 hover:bg-amber-200"
              >
                {t.cta}
              </Link>
              <Link
                href={`${base}/examples`}
                className="rounded-lg border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t.secondary}
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-400">{t.note}</p>

            <div className="mt-10 flex gap-8 border-t border-white/10 pt-6">
              {stats.map((n, i) => (
                <div key={t.statLabels[i]}>
                  <p className="text-2xl font-semibold text-white">{n}</p>
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    {t.statLabels[i]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Fan of real resumes */}
          <div className="relative mx-auto h-[420px] w-full max-w-[520px] sm:h-[540px]">
            <div className="absolute left-0 top-16 w-[44%] -rotate-6">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl shadow-black/50 motion-safe:animate-float-slow">
                <Image
                  src={exampleImage(hero[1].id, lang)}
                  alt={exampleLabel(hero[1], lang)}
                  width={1190}
                  height={1684}
                  sizes="(min-width: 1024px) 22vw, 40vw"
                  className="h-auto w-full"
                />
              </div>
            </div>

            <div className="absolute right-0 top-20 w-[44%] rotate-6">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl shadow-black/50 [animation-delay:-4s] motion-safe:animate-float-slow">
                <Image
                  src={exampleImage(hero[2].id, lang)}
                  alt={exampleLabel(hero[2], lang)}
                  width={1190}
                  height={1684}
                  sizes="(min-width: 1024px) 22vw, 40vw"
                  className="h-auto w-full"
                />
              </div>
            </div>

            <div className="absolute left-[26%] top-0 z-10 w-[48%]">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl shadow-black/60 motion-safe:animate-float">
                <Image
                  src={exampleImage(hero[0].id, lang)}
                  alt={exampleLabel(hero[0], lang)}
                  width={1190}
                  height={1684}
                  sizes="(min-width: 1024px) 24vw, 45vw"
                  loading="eager"
                  className="h-auto w-full"
                />
              </div>
            </div>

            <span className="absolute -left-1 bottom-12 z-20 rounded-full border border-white/20 bg-slate-900/80 px-3 py-1.5 text-xs text-white backdrop-blur">
              {t.chipAi}
            </span>
            <span className="absolute -right-1 bottom-24 z-20 rounded-full border border-white/20 bg-slate-900/80 px-3 py-1.5 text-xs text-white backdrop-blur">
              {t.chipEdit}
            </span>
            <span className="absolute bottom-2 left-1/3 z-20 rounded-full border border-white/20 bg-slate-900/80 px-3 py-1.5 text-xs text-white backdrop-blur">
              {t.chipLayouts(LAYOUTS.length)}
            </span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="overflow-hidden border-b border-slate-200 bg-white py-4">
        <div className="flex w-max whitespace-nowrap text-sm font-medium text-slate-500 motion-safe:animate-marquee">
          {[...t.marquee, ...t.marquee].map((item, i) => (
            <span key={i} className="mr-10 flex items-center gap-10">
              {item}
              <span className="text-amber-500">✦</span>
            </span>
          ))}
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

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {/* AI Writer */}
            <div className="rounded-2xl bg-slate-950 p-7 text-white lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
                {t.aiLabel}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{t.aiTitle}</h3>
              <p className="mt-2 max-w-md text-sm text-slate-400">{t.aiText}</p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-white/10 px-4 py-3 text-slate-100">
                  {t.aiUser}
                </div>
                <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-indigo-500/30 px-4 py-3 text-indigo-50">
                  {t.aiBot}
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">{t.aiCaption}</p>
            </div>

            {/* Click to edit */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                {t.editLabel}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {t.editTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{t.editText}</p>
              <div className="relative mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="h-3 w-1/2 rounded bg-slate-800" />
                <div className="mt-2 h-2 w-1/3 rounded bg-amber-400" />
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-full rounded bg-slate-200" />
                  <div className="h-2 w-11/12 rounded bg-blue-200 ring-2 ring-blue-500" />
                  <div className="h-2 w-4/5 rounded bg-slate-200" />
                </div>
                <div className="absolute -bottom-3 right-3 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-lg">
                  {t.editTag}
                </div>
              </div>
            </div>

            {/* Layouts and colors */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                {t.lookLabel}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {t.lookTitle(LAYOUTS.length, palettes.length)}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{t.lookText}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {palettes.map((p) => (
                  <span
                    key={p.id}
                    title={p.name}
                    className="h-6 w-6 rounded-full ring-2 ring-white ring-offset-1 ring-offset-slate-200"
                    style={{ backgroundColor: p.accent }}
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {LAYOUTS.map((l) => (
                  <span
                    key={l}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                {t.sugLabel}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {t.sugTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{t.sugText}</p>
              <div className="mt-5 space-y-2">
                {t.sugItems.map((item) => (
                  <div
                    key={item}
                    className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Honest */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                {t.honestLabel}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {t.honestTitle}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {t.honestItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONS */}
      <section id="professions" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.profTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            {t.profSub}
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`${base}/builder/${c.id}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: categoryAccent[c.id] ?? "#1b2a41" }}
                />
                <h3 className="text-lg font-semibold text-slate-900">{c.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.recommendedSections.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-900">
                  {t.profGo}{" "}
                  <span className="inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            {t.galleryTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            {t.gallerySub}
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {examples.map((ex) => (
              <Link
                key={ex.id}
                href={builderLink(ex, lang)}
                className="group block"
              >
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <Image
                    src={exampleImage(ex.id, lang)}
                    alt={exampleLabel(ex, lang)}
                    width={1190}
                    height={1684}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-medium text-slate-900">
                  {exampleLabel(ex, lang)}
                </p>
                <p className="text-center text-xs font-medium text-amber-700">
                  {t.galleryUse}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
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
            {t.faqMore}{" "}
            <Link href={`${base}/privacy`} className="underline">
              {t.privacyLabel}
            </Link>{" "}
            {t.and}{" "}
            <Link href={`${base}/refund`} className="underline">
              {t.refundLabel}
            </Link>
            .
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
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-300">
              {t.finalText}
            </p>
            <Link
              href={`${base}/templates`}
              className="mt-8 inline-block rounded-lg bg-amber-300 px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-300/20 transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              {t.cta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}