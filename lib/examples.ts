import { Lang } from "./labels";

export type Example = {
  id: string;
  category: string;
  template: string;
  accent: string;
  label: string;
};

export const examples: Example[] = [
  { id: "nurse-elegant", category: "nurse", template: "elegant", accent: "#0f766e", label: "Nurse · Elegant · Teal" },
  { id: "student-bold", category: "student", template: "bold", accent: "#c2410c", label: "Student · Bold · Orange" },
  { id: "banking-classic", category: "banking", template: "classic", accent: "#1b2a41", label: "Banking · Classic · Navy" },
  { id: "tech-modern", category: "tech", template: "modern", accent: "#4338ca", label: "Tech · Modern · Indigo" },
  { id: "teacher-timeline", category: "teacher", template: "timeline", accent: "#166534", label: "Teacher · Timeline · Forest" },
  { id: "nurse-compact", category: "nurse", template: "compact", accent: "#9f1239", label: "Nurse · Compact · Burgundy" },
];

// Turn this to true once the French images exist in public/examples
const HAS_FR_IMAGES = false;

export const exampleImage = (id: string, lang: Lang = "en") =>
  lang === "fr" && HAS_FR_IMAGES ? `/examples/${id}-fr.png` : `/examples/${id}.png`;

// Opens the builder with the same template and color as the example
export const builderLink = (e: Example, lang: Lang = "en") =>
  `${lang === "fr" ? "/fr" : ""}/builder/${e.category}?template=${e.template}&color=${e.accent.slice(1)}`;

const SHORT_FR: Record<string, string> = {
  nurse: "Infirmier",
  student: "Étudiant",
  banking: "Banque",
  tech: "Tech",
  teacher: "Enseignant",
};

export const exampleLabel = (e: Example, lang: Lang = "en") =>
  lang === "fr"
    ? `${SHORT_FR[e.category] ?? e.category} · ${
        e.template.charAt(0).toUpperCase() + e.template.slice(1)
      }`
    : e.label;