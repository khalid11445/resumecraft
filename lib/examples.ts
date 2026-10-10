export type Example = {
  id: string;
  category: string;
  template: string;
  accent: string;
  label: string;
};

export const examples: Example[] = [
  { id: "nurse-elegant", category: "nurse", template: "elegant", accent: "#0f766e", label: "Nurse · Elegant · Teal" },
  { id: "student-classic", category: "student", template: "classic", accent: "#c2410c", label: "Student · Classic · Orange" },
  { id: "banking-compact", category: "banking", template: "compact", accent: "#1b2a41", label: "Banking · Compact · Navy" },
  { id: "tech-modern", category: "tech", template: "modern", accent: "#4338ca", label: "Tech · Modern · Indigo" },
  { id: "teacher-elegant", category: "teacher", template: "elegant", accent: "#166534", label: "Teacher · Elegant · Forest" },
  { id: "nurse-modern", category: "nurse", template: "modern", accent: "#9f1239", label: "Nurse · Modern · Burgundy" },
];

export const exampleImage = (id: string) => `/examples/${id}.png`;

// Opens the builder with the same template and color as the example
export const builderLink = (e: Example) =>
  `/builder/${e.category}?template=${e.template}&color=${e.accent.slice(1)}`;