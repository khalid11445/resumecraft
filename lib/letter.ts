import { Lang } from "./labels";

export type InternshipKind = "pfe" | "standard" | "postgrad";

export type LetterData = {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderCity: string;
  recipientCompany: string;
  recipientContact: string;
  recipientCity: string;
  date: string;
  kind: InternshipKind;
  field: string;
  duration: string;
  period: string;
  school: string;
  degree: string;
  why: string;
  skills: string;
};

const KIND: Record<Lang, Record<InternshipKind, string>> = {
  fr: {
    pfe: "stage de fin d'études (PFE)",
    standard: "stage",
    postgrad: "stage post-diplôme",
  },
  en: {
    pfe: "final-year project internship (PFE)",
    standard: "internship",
    postgrad: "post-graduation internship",
  },
};

export const kindLabel = (lang: Lang, kind: InternshipKind) => KIND[lang][kind];

// Empty values become a visible [placeholder]
const or = (value: string, placeholder: string) =>
  value.trim() || `[${placeholder}]`;

// Makes sure a sentence ends with punctuation
const sentence = (value: string) => {
  const s = value.trim();
  return /[.!?\]]$/.test(s) ? s : `${s}.`;
};

export type LetterText = {
  senderName: string;
  senderLines: string[];
  recipientLines: string[];
  dateLine: string;
  subject: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
};

export function buildLetter(d: LetterData, lang: Lang): LetterText {
  const kind = kindLabel(lang, d.kind);
  const field = d.field.trim();
  const duration = d.duration.trim();
  const period = d.period.trim();
  const school = d.school.trim();
  const city = d.senderCity.trim();
  const contact = d.recipientContact.trim();
  const date = or(d.date, "date");

  const senderLines = [d.senderEmail, d.senderPhone, city]
    .map((s) => s.trim())
    .filter(Boolean);

  if (lang === "fr") {
    return {
      senderName: or(d.senderName, "Votre nom"),
      senderLines,
      recipientLines: [
        or(d.recipientCompany, "Entreprise"),
        contact ? `À l'attention de ${contact}` : "",
        d.recipientCity.trim(),
      ].filter(Boolean),
      dateLine: `${city ? `${city}, le ` : "Le "}${date}`,
      subject: `Objet : Demande de ${kind}${field ? ` en ${field}` : ""}${
        duration ? ` — ${duration}` : ""
      }${period ? `, à partir de ${period}` : ""}`,
      salutation: "Madame, Monsieur,",
      paragraphs: [
        `Actuellement étudiant(e) en ${or(d.degree, "filière ou diplôme")}${
          school ? ` à ${school}` : ""
        }, je vous adresse ma candidature pour un ${kind}${
          field ? ` en ${field}` : ""
        } de ${or(duration, "durée")}, à partir de ${or(period, "période")}.`,
        `${sentence(
          or(d.why, "En une ou deux phrases : pourquoi cette entreprise vous attire")
        )} ${sentence(
          or(d.skills, "Citez deux ou trois compétences ou projets en lien avec ce stage")
        )}`,
        `Disponible à partir de ${or(
          period,
          "période"
        )}, je serais heureux(se) de vous rencontrer afin de vous présenter plus en détail ma motivation et mon parcours. Vous trouverez mon CV ci-joint.`,
      ],
      closing:
        "Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
    };
  }

  const article = /^[aeiou]/i.test(kind) ? "an" : "a";

  return {
    senderName: or(d.senderName, "Your name"),
    senderLines,
    recipientLines: [
      or(d.recipientCompany, "Company"),
      contact ? `Attn: ${contact}` : "",
      d.recipientCity.trim(),
    ].filter(Boolean),
    dateLine: `${city ? `${city}, ` : ""}${date}`,
    subject: `Subject: Application for ${article} ${kind}${
      field ? ` in ${field}` : ""
    }${duration ? ` — ${duration}` : ""}${period ? `, starting ${period}` : ""}`,
    salutation: "Dear Sir or Madam,",
    paragraphs: [
      `I am currently a student in ${or(d.degree, "program or degree")}${
        school ? ` at ${school}` : ""
      }, and I am writing to apply for ${article} ${kind}${
        field ? ` in ${field}` : ""
      } lasting ${or(duration, "duration")}, starting ${or(period, "start date")}.`,
      `${sentence(
        or(d.why, "In one or two sentences: why this company appeals to you")
      )} ${sentence(
        or(d.skills, "Mention two or three skills or projects relevant to this internship")
      )}`,
      `I am available from ${or(
        period,
        "start date"
      )} and would be glad to meet you to discuss my motivation and background in more detail. Please find my resume attached. Thank you for considering my application.`,
    ],
    closing: "Yours sincerely,",
  };
}