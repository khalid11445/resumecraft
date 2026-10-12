export const palettes = [
  { id: "navy", name: "Navy", accent: "#1b2a41" },
  { id: "teal", name: "Teal", accent: "#0f766e" },
  { id: "indigo", name: "Indigo", accent: "#4338ca" },
  { id: "burgundy", name: "Burgundy", accent: "#9f1239" },
  { id: "forest", name: "Forest", accent: "#166534" },
  { id: "orange", name: "Orange", accent: "#c2410c" },
  { id: "graphite", name: "Graphite", accent: "#334155" },
];

// Default color for each profession, so every category looks different
export const categoryAccent: Record<string, string> = {
  nurse: "#0f766e",
  student: "#c2410c",
  banking: "#1b2a41",
  tech: "#4338ca",
  teacher: "#166534",
  stage: "#0e7490",
};