"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Lang } from "@/lib/labels";
import { palettes } from "@/lib/themes";
import { LetterData, InternshipKind, buildLetter } from "@/lib/letter";
import LetterDocument from "@/components/letter/LetterDocument";
import DocPreview from "@/components/builder/DocPreview";

const T = {
  en: {
    title: "Internship request letter",
    intro:
      "Fill in the form and the letter builds itself: who you are, why this company, and when you are available. Anything left empty shows as a [bracket].",
    you: "About you",
    company: "The company",
    internship: "The internship",
    studies: "Your studies",
    message: "Your message",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    city: "Your city",
    companyName: "Company",
    contact: "Contact person (optional)",
    companyCity: "Company city (optional)",
    kind: "Type of internship",
    kinds: {
      pfe: "Final-year project (PFE)",
      standard: "Internship",
      postgrad: "Post-graduation internship",
    } as Record<InternshipKind, string>,
    field: "Field or role (optional)",
    fieldPh: "e.g. software engineering",
    duration: "Duration",
    durationPh: "e.g. 6 months",
    period: "Start period",
    periodPh: "e.g. February 2027",
    school: "School",
    degree: "Degree or program",
    date: "Date (filled in automatically)",
    why: "Why this company?",
    whyHint:
      "One or two specific sentences: a project, product or value of the company. Avoid generic phrases.",
    skills: "What you bring",
    skillsHint:
      "Two or three skills or projects that match this internship. Only write what is true.",
    letterLanguage: "Letter language",
    color: "Color",
    download: "Download PDF",
    working: "Creating the file...",
    warning:
      "Parts of the letter still show [brackets] or are empty. Fill them in before you send it.",
    error: "Could not create the PDF",
    tip: "Send it together with your resume, and check your school's rules about the internship agreement (convention de stage).",
    preview: "Live preview",
    loading: "Loading preview...",
    tabEdit: "Edit",
    tabPreview: "Preview",
  },
  fr: {
    title: "Demande de stage",
    intro:
      "Remplissez le formulaire et la lettre se construit toute seule : qui vous êtes, pourquoi cette entreprise, et quand vous êtes disponible. Tout champ vide apparaît entre [crochets].",
    you: "Vous",
    company: "L'entreprise",
    internship: "Le stage",
    studies: "Vos études",
    message: "Votre message",
    fullName: "Nom complet",
    email: "Email",
    phone: "Téléphone",
    city: "Votre ville",
    companyName: "Entreprise",
    contact: "Personne à contacter (facultatif)",
    companyCity: "Ville de l'entreprise (facultatif)",
    kind: "Type de stage",
    kinds: {
      pfe: "Stage de fin d'études (PFE)",
      standard: "Stage",
      postgrad: "Stage post-diplôme",
    } as Record<InternshipKind, string>,
    field: "Domaine ou poste (facultatif)",
    fieldPh: "ex. génie logiciel",
    duration: "Durée",
    durationPh: "ex. 6 mois",
    period: "Période de début",
    periodPh: "ex. février 2027",
    school: "École",
    degree: "Diplôme ou filière",
    date: "Date (remplie automatiquement)",
    why: "Pourquoi cette entreprise ?",
    whyHint:
      "Une ou deux phrases précises : un projet, un produit ou une valeur de l'entreprise. Évitez les phrases génériques.",
    skills: "Ce que vous apportez",
    skillsHint:
      "Deux ou trois compétences ou projets en lien avec ce stage. N'écrivez que ce qui est vrai.",
    letterLanguage: "Langue de la lettre",
    color: "Couleur",
    download: "Télécharger le PDF",
    working: "Création du fichier...",
    warning:
      "Certaines parties de la lettre affichent encore des [crochets] ou sont vides. Complétez-les avant de l'envoyer.",
    error: "Impossible de créer le PDF",
    tip: "Envoyez-la avec votre CV, et vérifiez les règles de votre école sur la convention de stage.",
    preview: "Aperçu en direct",
    loading: "Chargement de l'aperçu...",
    tabEdit: "Modifier",
    tabPreview: "Aperçu",
  },
};

type Fields = Omit<LetterData, "date">;
type Tab = "edit" | "preview";

const empty: Fields = {
  senderName: "",
  senderEmail: "",
  senderPhone: "",
  senderCity: "",
  recipientCompany: "",
  recipientContact: "",
  recipientCity: "",
  kind: "pfe",
  field: "",
  duration: "",
  period: "",
  school: "",
  degree: "",
  why: "",
  skills: "",
};

const input =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm text-black bg-white";
const label = "block text-xs font-semibold text-gray-600 mb-1";
const h2 = "text-base font-bold text-black mt-6 mb-3";
const hintText = "mt-1 text-xs text-gray-500";

const tabClass = (active: boolean) =>
  `flex-1 py-2.5 text-sm font-semibold ${
    active ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
  }`;

export default function LetterClient({ uiLang = "en" }: { uiLang?: Lang }) {
  const t = T[uiLang];

  const [tab, setTab] = useState<Tab>("edit");
  const [fields, setFields] = useState<Fields>(empty);
  const [lang, setLang] = useState<Lang>(uiLang);
  const [accent, setAccent] = useState("#0e7490");
  const [dateOverride, setDateOverride] = useState("");
  const [today, setToday] = useState<Date | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // The current date is read after the page loads
  useEffect(() => {
    setToday(new Date());
  }, []);

  const autoDate = today
    ? today.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const data: LetterData = { ...fields, date: dateOverride.trim() || autoDate };

  function bind(key: Exclude<keyof Fields, "kind">) {
    return {
      value: fields[key],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFields((prev) => ({ ...prev, [key]: value }));
      },
    };
  }

  // The preview waits for a pause in typing
  const nowKey = JSON.stringify({ data, lang, accent });
  const [shown, setShown] = useState({ data, lang, accent });
  useEffect(() => {
    const timer = setTimeout(() => setShown({ data, lang, accent }), 400);
    return () => clearTimeout(timer);
  }, [nowKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const liveText = buildLetter(data, lang);
  const missing =
    /\[[^\]]*\]/.test([liveText.subject, ...liveText.paragraphs].join(" ")) ||
    !fields.recipientCompany.trim() ||
    !fields.senderName.trim();

  const shownText = buildLetter(shown.data, shown.lang);
  const element = <LetterDocument text={shownText} accent={shown.accent} />;

  async function download() {
    setBusy(true);
    setError("");
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(
        <LetterDocument text={liveText} accent={accent} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const base = fields.senderName.trim() || "letter";
      a.download = `${base}-${lang === "fr" ? "demande-de-stage" : "internship-letter"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.error);
    } finally {
      setBusy(false);
    }
  }

  // Pieces used in two places: the edit panel and the mobile preview bar
  const colorDots = palettes.map((p) => (
    <button
      key={p.id}
      type="button"
      title={p.name}
      aria-label={p.name}
      onClick={() => setAccent(p.accent)}
      className={`h-6 w-6 shrink-0 rounded-full border-2 ${
        accent === p.accent ? "border-black" : "border-white ring-1 ring-gray-300"
      }`}
      style={{ backgroundColor: p.accent }}
    />
  ));

  const downloadButton = (
    <button
      type="button"
      onClick={download}
      disabled={busy}
      className="rounded bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
    >
      {busy ? t.working : t.download}
    </button>
  );

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] w-full flex-col lg:flex-row">
      {/* Tabs, phones and tablets only */}
      <div className="flex shrink-0 border-b border-gray-200 bg-white lg:hidden">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={tabClass(tab === "edit")}
        >
          {t.tabEdit}
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={tabClass(tab === "preview")}
        >
          {t.tabPreview}
        </button>
      </div>

      {/* Edit panel */}
      <div
        className={`${
          tab === "edit" ? "block" : "hidden"
        } min-h-0 w-full flex-1 overflow-y-auto border-gray-300 bg-white lg:block lg:w-1/2 lg:flex-none lg:border-r`}
      >
        <div className="border-b border-gray-200 p-4">
          <h1 className="text-lg font-bold text-black">{t.title}</h1>
          <p className="mt-1 text-xs text-gray-600">{t.intro}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">{t.letterLanguage}</span>
            {(["en", "fr"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`rounded border px-3 py-1 text-sm ${
                  lang === l
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                {l === "en" ? "English" : "Français"}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">{t.color}</span>
            {colorDots}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {downloadButton}
          </div>
          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
          {missing ? <p className="mt-2 text-xs text-amber-700">{t.warning}</p> : null}
        </div>

        <div className="p-4">
          <h2 className={h2}>{t.you}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={label}>{t.fullName}</label>
              <input className={input} {...bind("senderName")} />
            </div>
            <div>
              <label className={label}>{t.email}</label>
              <input className={input} {...bind("senderEmail")} />
            </div>
            <div>
              <label className={label}>{t.phone}</label>
              <input className={input} {...bind("senderPhone")} />
            </div>
            <div>
              <label className={label}>{t.city}</label>
              <input className={input} {...bind("senderCity")} />
            </div>
            <div>
              <label className={label}>{t.date}</label>
              <input
                className={input}
                value={dateOverride}
                placeholder={autoDate}
                onChange={(e) => setDateOverride(e.target.value)}
              />
            </div>
          </div>

          <h2 className={h2}>{t.company}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={label}>{t.companyName}</label>
              <input className={input} {...bind("recipientCompany")} />
            </div>
            <div>
              <label className={label}>{t.contact}</label>
              <input className={input} {...bind("recipientContact")} />
            </div>
            <div>
              <label className={label}>{t.companyCity}</label>
              <input className={input} {...bind("recipientCity")} />
            </div>
          </div>

          <h2 className={h2}>{t.internship}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={label}>{t.kind}</label>
              <select
                className={input}
                value={fields.kind}
                onChange={(e) =>
                  setFields((prev) => ({
                    ...prev,
                    kind: e.target.value as InternshipKind,
                  }))
                }
              >
                {(Object.keys(t.kinds) as InternshipKind[]).map((k) => (
                  <option key={k} value={k}>
                    {t.kinds[k]}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className={label}>{t.field}</label>
              <input className={input} placeholder={t.fieldPh} {...bind("field")} />
            </div>
            <div>
              <label className={label}>{t.duration}</label>
              <input
                className={input}
                placeholder={t.durationPh}
                {...bind("duration")}
              />
            </div>
            <div>
              <label className={label}>{t.period}</label>
              <input className={input} placeholder={t.periodPh} {...bind("period")} />
            </div>
          </div>

          <h2 className={h2}>{t.studies}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>{t.school}</label>
              <input className={input} {...bind("school")} />
            </div>
            <div>
              <label className={label}>{t.degree}</label>
              <input className={input} {...bind("degree")} />
            </div>
          </div>

          <h2 className={h2}>{t.message}</h2>
          <label className={label}>{t.why}</label>
          <textarea rows={3} className={input} {...bind("why")} />
          <p className={hintText}>{t.whyHint}</p>

          <label className={`${label} mt-4`}>{t.skills}</label>
          <textarea rows={3} className={input} {...bind("skills")} />
          <p className={hintText}>{t.skillsHint}</p>

          <p className="mt-6 rounded bg-gray-50 p-3 text-xs text-gray-600">{t.tip}</p>
        </div>
      </div>

      {/* Preview panel */}
      <div
        className={`${
          tab === "preview" ? "flex" : "hidden"
        } min-h-0 w-full flex-1 flex-col lg:flex lg:w-1/2 lg:flex-none`}
      >
        {/* Compact controls, phones and tablets only */}
        <div className="shrink-0 space-y-2 border-b border-gray-200 bg-white p-2 lg:hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {colorDots}
            </div>
            {downloadButton}
          </div>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          {missing ? <p className="text-xs text-amber-700">{t.warning}</p> : null}
        </div>

        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0">
            <DocPreview
              element={element}
              docKey={JSON.stringify(shown)}
              hint={t.preview}
              loadingText={t.loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}