"use client";

import { DragEvent, useRef, useState } from "react";
import Link from "next/link";
import { Lang } from "@/lib/labels";
import {
  Check,
  CheckId,
  Country,
  Extract,
  Report,
  analyze,
  extractPdf,
} from "@/lib/checker";

type Msg = { title: string; text: (d: number) => string };
type Messages = Record<CheckId, { pass: Msg; warn?: Msg; fail?: Msg }>;

const EN: Messages = {
  readable: {
    pass: { title: "Text can be read", text: () => "Your PDF contains readable text." },
    fail: {
      title: "Text can be read",
      text: () =>
        "We could not read much text in this PDF. It may be a scanned image, or a design exported as pictures. Applicant tracking systems cannot read images, so export your resume again as a text PDF.",
    },
  },
  pages: {
    pass: { title: "Length", text: (d) => `${d} page(s): a good length.` },
    warn: { title: "Length", text: (d) => `${d} pages: try to shorten it if you can.` },
    fail: { title: "Length", text: (d) => `${d} pages is too long for most employers. Keep the most relevant experience.` },
  },
  words: {
    pass: { title: "Amount of text", text: (d) => `About ${d} words: a good amount.` },
    warn: {
      title: "Amount of text",
      text: (d) =>
        d < 250
          ? `About ${d} words: a bit short. Add detail about your achievements.`
          : `About ${d} words: a bit long. Cut older or less relevant details.`,
    },
    fail: {
      title: "Amount of text",
      text: (d) =>
        d < 250
          ? `About ${d} words: too short. Add your experience, skills and results.`
          : `About ${d} words: too long. Recruiters spend very little time on each resume.`,
    },
  },
  email: {
    pass: { title: "Email address", text: () => "An email address was found." },
    fail: { title: "Email address", text: () => "No email address found. Employers need a way to contact you." },
  },
  phone: {
    pass: { title: "Phone number", text: () => "A phone number was found." },
    fail: { title: "Phone number", text: () => "No phone number found. Add one with your country code, for example +212." },
  },
  experience: {
    pass: { title: "Experience section", text: () => "An experience section was found." },
    fail: { title: "Experience section", text: () => "We could not find an experience section. Add a clearly titled section for your work, internships or projects." },
  },
  education: {
    pass: { title: "Education section", text: () => "An education section was found." },
    fail: { title: "Education section", text: () => "We could not find an education section. Add your diplomas and schools under a clear title." },
  },
  skills: {
    pass: { title: "Skills section", text: () => "A skills section was found." },
    fail: { title: "Skills section", text: () => "We could not find a skills section. A short list of skills helps keyword matching." },
  },
  summary: {
    pass: { title: "Short profile", text: () => "A short profile or summary was found." },
    warn: { title: "Short profile", text: () => "No short profile found. Two or three lines at the top help recruiters understand you quickly." },
  },
  bullets: {
    pass: { title: "Bullet points", text: (d) => `${d} bullet points: easy to scan.` },
    warn: { title: "Bullet points", text: (d) => `Only ${d} bullet point(s). Use bullets to list your achievements.` },
    fail: { title: "Bullet points", text: () => "No bullet points found. Lists are much easier to scan than long paragraphs." },
  },
  numbers: {
    pass: { title: "Measurable results", text: (d) => `${d} measurable results found. Numbers make your impact clear.` },
    warn: { title: "Measurable results", text: (d) => `Only ${d} measurable result(s) found. Add more numbers: percentages, amounts, volumes.` },
    fail: { title: "Measurable results", text: () => "No measurable results found. Add numbers: how many clients, what percentage, how much time saved. Only use real figures." },
  },
  linkedin: {
    pass: { title: "LinkedIn", text: () => "A LinkedIn link was found." },
    warn: { title: "LinkedIn", text: () => "Optional: add your LinkedIn profile link. It is common in Canada and the US." },
  },
  personal: {
    pass: { title: "Personal details", text: () => "Nothing unusual found for the country you chose." },
    fail: { title: "Personal details", text: () => "Personal details such as age, marital status or nationality were found. In Canada and the US, leave them out." },
  },
};

const FR: Messages = {
  readable: {
    pass: { title: "Texte lisible", text: () => "Votre PDF contient du texte lisible." },
    fail: {
      title: "Texte lisible",
      text: () =>
        "Nous n'avons pas pu lire beaucoup de texte dans ce PDF. Il s'agit peut-être d'une image scannée ou d'un design exporté sous forme d'images. Les logiciels de tri des candidatures ne lisent pas les images : exportez à nouveau votre CV en PDF texte.",
    },
  },
  pages: {
    pass: { title: "Longueur", text: (d) => `${d} page(s) : une bonne longueur.` },
    warn: { title: "Longueur", text: (d) => `${d} pages : essayez de raccourcir si vous le pouvez.` },
    fail: { title: "Longueur", text: (d) => `${d} pages, c'est trop long pour la plupart des employeurs. Gardez l'expérience la plus pertinente.` },
  },
  words: {
    pass: { title: "Quantité de texte", text: (d) => `Environ ${d} mots : une bonne quantité.` },
    warn: {
      title: "Quantité de texte",
      text: (d) =>
        d < 250
          ? `Environ ${d} mots : un peu court. Ajoutez du détail sur vos réalisations.`
          : `Environ ${d} mots : un peu long. Coupez les détails anciens ou moins pertinents.`,
    },
    fail: {
      title: "Quantité de texte",
      text: (d) =>
        d < 250
          ? `Environ ${d} mots : trop court. Ajoutez votre expérience, vos compétences et vos résultats.`
          : `Environ ${d} mots : trop long. Les recruteurs passent très peu de temps sur chaque CV.`,
    },
  },
  email: {
    pass: { title: "Adresse e-mail", text: () => "Une adresse e-mail a été trouvée." },
    fail: { title: "Adresse e-mail", text: () => "Aucune adresse e-mail trouvée. Les employeurs doivent pouvoir vous contacter." },
  },
  phone: {
    pass: { title: "Numéro de téléphone", text: () => "Un numéro de téléphone a été trouvé." },
    fail: { title: "Numéro de téléphone", text: () => "Aucun numéro de téléphone trouvé. Ajoutez-en un avec l'indicatif du pays, par exemple +212." },
  },
  experience: {
    pass: { title: "Section expérience", text: () => "Une section expérience a été trouvée." },
    fail: { title: "Section expérience", text: () => "Nous n'avons pas trouvé de section expérience. Ajoutez une section clairement titrée pour vos emplois, stages ou projets." },
  },
  education: {
    pass: { title: "Section formation", text: () => "Une section formation a été trouvée." },
    fail: { title: "Section formation", text: () => "Nous n'avons pas trouvé de section formation. Ajoutez vos diplômes et vos écoles sous un titre clair." },
  },
  skills: {
    pass: { title: "Section compétences", text: () => "Une section compétences a été trouvée." },
    fail: { title: "Section compétences", text: () => "Nous n'avons pas trouvé de section compétences. Une courte liste de compétences aide à la recherche par mots-clés." },
  },
  summary: {
    pass: { title: "Profil", text: () => "Un court profil ou résumé a été trouvé." },
    warn: { title: "Profil", text: () => "Aucun court profil trouvé. Deux ou trois lignes en haut aident les recruteurs à vous comprendre vite." },
  },
  bullets: {
    pass: { title: "Listes à puces", text: (d) => `${d} puces : facile à parcourir.` },
    warn: { title: "Listes à puces", text: (d) => `Seulement ${d} puce(s). Utilisez des puces pour lister vos réalisations.` },
    fail: { title: "Listes à puces", text: () => "Aucune puce trouvée. Les listes sont bien plus faciles à parcourir que de longs paragraphes." },
  },
  numbers: {
    pass: { title: "Résultats chiffrés", text: (d) => `${d} résultats chiffrés trouvés. Les chiffres rendent votre impact clair.` },
    warn: { title: "Résultats chiffrés", text: (d) => `Seulement ${d} résultat(s) chiffré(s) trouvé(s). Ajoutez plus de chiffres : pourcentages, montants, volumes.` },
    fail: { title: "Résultats chiffrés", text: () => "Aucun résultat chiffré trouvé. Ajoutez des chiffres : combien de clients, quel pourcentage, combien de temps gagné. N'utilisez que des chiffres réels." },
  },
  linkedin: {
    pass: { title: "LinkedIn", text: () => "Un lien LinkedIn a été trouvé." },
    warn: { title: "LinkedIn", text: () => "Facultatif : ajoutez le lien de votre profil LinkedIn. C'est courant au Canada et aux États-Unis." },
  },
  personal: {
    pass: { title: "Informations personnelles", text: () => "Rien d'inhabituel trouvé pour le pays choisi." },
    fail: { title: "Informations personnelles", text: () => "Des informations personnelles comme l'âge, la situation familiale ou la nationalité ont été trouvées. Au Canada et aux États-Unis, évitez-les." },
  },
};

const T = {
  en: {
    badge: "Free resume checker",
    title: "Check your resume in seconds",
    intro:
      "Upload your resume as a PDF and get a score with clear tips: missing sections, length, contact details and more.",
    privacy:
      "Your file is read in your browser. It is not uploaded to our servers.",
    country: "Resume for",
    countries: { morocco: "Morocco", canada: "Canada", us: "United States" } as Record<Country, string>,
    drop: "Drop your PDF here, or",
    choose: "choose a file",
    reading: "Reading your resume...",
    tooBig: "This file is larger than 10 MB. Please use a smaller PDF.",
    notPdf: "Please choose a PDF file.",
    readError:
      "We could not open this PDF. It may be damaged or protected by a password.",
    score: "Score",
    outOf: "out of 100",
    levels: ["Needs a lot of work", "Needs work", "Good start", "Strong"],
    pagesLabel: "pages",
    wordsLabel: "words",
    fix: "To fix",
    improve: "To improve",
    good: "Looks good",
    another: "Check another file",
    disclaimer:
      "This checker uses simple rules. It is not an applicant tracking system and cannot promise any result. Treat the score as a guide, not a verdict.",
    ctaTitle: "Want a clean, well-structured version?",
    ctaBuild: "Build my resume",
    ctaHref: "/templates",
    ctaInterview: "Prepare my interview",
    ctaInterviewHref: "/interview",
    unreadableTitle: "We could not read your resume",
  },
  fr: {
    badge: "Vérificateur de CV gratuit",
    title: "Vérifiez votre CV en quelques secondes",
    intro:
      "Téléversez votre CV en PDF et obtenez une note avec des conseils clairs : sections manquantes, longueur, coordonnées et plus.",
    privacy:
      "Votre fichier est lu dans votre navigateur. Il n'est pas envoyé à nos serveurs.",
    country: "CV pour",
    countries: { morocco: "Maroc", canada: "Canada", us: "États-Unis" } as Record<Country, string>,
    drop: "Déposez votre PDF ici, ou",
    choose: "choisissez un fichier",
    reading: "Lecture de votre CV...",
    tooBig: "Ce fichier dépasse 10 Mo. Veuillez utiliser un PDF plus léger.",
    notPdf: "Veuillez choisir un fichier PDF.",
    readError:
      "Nous n'avons pas pu ouvrir ce PDF. Il est peut-être endommagé ou protégé par un mot de passe.",
    score: "Note",
    outOf: "sur 100",
    levels: ["À retravailler en profondeur", "À améliorer", "Bon début", "Solide"],
    pagesLabel: "pages",
    wordsLabel: "mots",
    fix: "À corriger",
    improve: "À améliorer",
    good: "Tout est bon",
    another: "Vérifier un autre fichier",
    disclaimer:
      "Ce vérificateur utilise des règles simples. Ce n'est pas un logiciel de tri des candidatures et il ne peut promettre aucun résultat. Considérez la note comme un guide, pas comme un verdict.",
    ctaTitle: "Envie d'une version propre et bien structurée ?",
    ctaBuild: "Créer mon CV",
    ctaHref: "/fr/templates",
    ctaInterview: "Préparer mon entretien",
    ctaInterviewHref: "/fr/interview",
    unreadableTitle: "Nous n'avons pas pu lire votre CV",
  },
};

const levelIndex = (score: number) => (score >= 85 ? 3 : score >= 65 ? 2 : score >= 40 ? 1 : 0);
const levelColor = ["text-red-600", "text-amber-600", "text-blue-600", "text-emerald-600"];

export default function CheckerClient({ lang }: { lang: Lang }) {
  const t = T[lang];
  const msgs = lang === "fr" ? FR : EN;

  const [country, setCountry] = useState<Country>("morocco");
  const [extract, setExtract] = useState<Extract | null>(null);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const report: Report | null = extract ? analyze(extract, country) : null;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!(file.type === "application/pdf" || /\.pdf$/i.test(file.name))) {
      setError(t.notPdf);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError(t.tooBig);
      return;
    }
    setBusy(true);
    try {
      setExtract(await extractPdf(file));
      setFileName(file.name);
    } catch {
      setExtract(null);
      setError(t.readError);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function reset() {
    setExtract(null);
    setFileName("");
    setError("");
  }

  const group = (status: Check["status"]) =>
    (report?.checks ?? []).filter((c) => c.status === status);

  const renderCheck = (c: Check) => {
    const m = msgs[c.id][c.status] ?? msgs[c.id].pass;
    const icon = c.status === "pass" ? "✓" : c.status === "warn" ? "!" : "✕";
    const color =
      c.status === "pass"
        ? "bg-emerald-100 text-emerald-700"
        : c.status === "warn"
          ? "bg-amber-100 text-amber-700"
          : "bg-red-100 text-red-700";
    return (
      <li key={c.id} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color}`}
        >
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">{m.title}</p>
          <p className="mt-1 text-sm text-slate-600">{m.text(c.detail)}</p>
        </div>
      </li>
    );
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
        {t.badge}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-3 text-slate-600">{t.intro}</p>
      <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
        {t.privacy}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-600">{t.country}</span>
        {(Object.keys(t.countries) as Country[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCountry(c)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              country === c
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-300 bg-white text-slate-900"
            }`}
          >
            {t.countries[c]}
          </button>
        ))}
      </div>

      {!report ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`mt-6 rounded-2xl border-2 border-dashed p-10 text-center ${
            dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"
          }`}
        >
          {busy ? (
            <p className="text-sm text-slate-600">{t.reading}</p>
          ) : (
            <p className="text-sm text-slate-600">
              {t.drop}{" "}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="font-semibold text-blue-600 underline"
              >
                {t.choose}
              </button>
            </p>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {report ? (
        <div className="mt-8">
          <p className="text-sm text-slate-500">{fileName}</p>

          {report.unreadable ? (
            <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="font-semibold text-red-900">{t.unreadableTitle}</p>
              <p className="mt-2 text-sm text-red-800">
                {msgs.readable.fail?.text(report.words)}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-6 rounded-2xl bg-slate-950 p-6 text-white">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    {t.score}
                  </p>
                  <p className="text-5xl font-semibold">
                    {report.score}
                    <span className="ml-2 text-sm font-normal text-slate-400">
                      {t.outOf}
                    </span>
                  </p>
                </div>
                <div>
                  <p className={`text-lg font-semibold ${levelColor[levelIndex(report.score)]} brightness-150`}>
                    {t.levels[levelIndex(report.score)]}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {report.pages} {t.pagesLabel} · {report.words} {t.wordsLabel}
                  </p>
                </div>
              </div>

              {group("fail").length > 0 ? (
                <>
                  <h2 className="mt-8 font-semibold text-slate-900">{t.fix}</h2>
                  <ul className="mt-3 space-y-3">{group("fail").map(renderCheck)}</ul>
                </>
              ) : null}
              {group("warn").length > 0 ? (
                <>
                  <h2 className="mt-8 font-semibold text-slate-900">{t.improve}</h2>
                  <ul className="mt-3 space-y-3">{group("warn").map(renderCheck)}</ul>
                </>
              ) : null}
              {group("pass").length > 0 ? (
                <>
                  <h2 className="mt-8 font-semibold text-slate-900">{t.good}</h2>
                  <ul className="mt-3 space-y-3">{group("pass").map(renderCheck)}</ul>
                </>
              ) : null}
            </>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              {t.another}
            </button>
          </div>

          <div className="mt-10 rounded-2xl bg-slate-50 p-6">
            <p className="font-semibold text-slate-900">{t.ctaTitle}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={t.ctaHref}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {t.ctaBuild}
              </Link>
              <Link
                href={t.ctaInterviewHref}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-white"
              >
                {t.ctaInterview}
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-10 text-xs text-slate-500">{t.disclaimer}</p>
    </main>
  );
}