export type ResumeFormat = "morocco" | "canada" | "us";

export const FORMAT_IDS: ResumeFormat[] = ["morocco", "canada", "us"];

export const isFormat = (v: unknown): v is ResumeFormat =>
  v === "morocco" || v === "canada" || v === "us";

// Morocco uses A4 paper. Canada and the United States use Letter.
export const pageSizeFor = (f: ResumeFormat): "A4" | "LETTER" =>
  f === "morocco" ? "A4" : "LETTER";

// A photo is common in Morocco, and not used in Canada or the United States
export const allowsPhoto = (f: ResumeFormat) => f === "morocco";

type FormatCopy = { name: string; tips: string[] };

export const formatCopy: Record<
  "en" | "fr",
  {
    label: string;
    photoHidden: string;
    note: string;
    formats: Record<ResumeFormat, FormatCopy>;
  }
> = {
  en: {
    label: "Country format",
    photoHidden: "Your photo is hidden in this format.",
    note: "These are common conventions. Always follow the job posting if it asks for something different.",
    formats: {
      morocco: {
        name: "Morocco",
        tips: [
          "A4 page.",
          "A photo is optional and common in Moroccan and French-style resumes.",
          "One page when possible. Two pages are fine with a lot of experience.",
        ],
      },
      canada: {
        name: "Canada",
        tips: [
          "Letter page (8.5 × 11 in).",
          "No photo. Leave out age, date of birth, marital status and religion.",
          "Aim for one to two pages. Contact details: name, city, email, phone, LinkedIn.",
        ],
      },
      us: {
        name: "United States",
        tips: [
          "Letter page (8.5 × 11 in).",
          "No photo, and no age, date of birth or marital status.",
          "One page is the usual expectation for most candidates.",
        ],
      },
    },
  },
  fr: {
    label: "Format du pays",
    photoHidden: "Votre photo est masquée dans ce format.",
    note: "Ce sont des usages courants. Suivez toujours l'offre d'emploi si elle demande autre chose.",
    formats: {
      morocco: {
        name: "Maroc",
        tips: [
          "Page A4.",
          "La photo est facultative et courante dans les CV marocains et de style français.",
          "Une page si possible. Deux pages sont acceptables avec beaucoup d'expérience.",
        ],
      },
      canada: {
        name: "Canada",
        tips: [
          "Page Letter (8,5 × 11 po).",
          "Pas de photo. Évitez l'âge, la date de naissance, la situation familiale et la religion.",
          "Visez une à deux pages. Coordonnées : nom, ville, courriel, téléphone, LinkedIn.",
        ],
      },
      us: {
        name: "États-Unis",
        tips: [
          "Page Letter (8,5 × 11 po).",
          "Pas de photo, ni âge, date de naissance ou situation familiale.",
          "Une page est l'attente habituelle pour la plupart des candidats.",
        ],
      },
    },
  },
};