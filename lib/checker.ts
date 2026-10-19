// Free resume checker. The PDF is read in the visitor's browser: it is never uploaded.
export type Country = "morocco" | "canada" | "us";
export type CheckStatus = "pass" | "warn" | "fail";
export type CheckId =
  | "readable"
  | "pages"
  | "words"
  | "email"
  | "phone"
  | "experience"
  | "education"
  | "skills"
  | "summary"
  | "bullets"
  | "numbers"
  | "linkedin"
  | "personal";

export type Check = {
  id: CheckId;
  status: CheckStatus;
  points: number;
  max: number;
  detail: number; // a number used in the message (pages, words, count...)
};

export type Report = {
  unreadable: boolean;
  score: number;
  pages: number;
  words: number;
  checks: Check[];
};

export type Extract = { pages: number; text: string };

export async function extractPdf(file: File): Promise<Extract> {
  const buffer = await file.arrayBuffer();
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const pages = doc.numPages;
  const maxPages = Math.min(pages, 6);
  let text = "";
  for (let n = 1; n <= maxPages; n++) {
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    for (const item of content.items) {
      if ("str" in item) text += item.str + (item.hasEOL ? "\n" : " ");
    }
    text += "\n";
  }
  doc.destroy();
  return { pages, text };
}

const has = (lower: string, words: string[]) => words.some((w) => lower.includes(w));

const SECTION_WORDS = {
  experience: [
    "experience",
    "expérience",
    "experiences",
    "work history",
    "employment",
    "parcours professionnel",
    "stage",
    "internship",
  ],
  education: [
    "education",
    "formation",
    "études",
    "etudes",
    "diplôme",
    "diplome",
    "diploma",
    "academic",
    "cursus",
    "licence",
    "master",
    "bachelor",
    "dut",
  ],
  skills: ["skills", "compétences", "competences", "savoir-faire", "outils", "tools"],
  summary: [
    "summary",
    "profile",
    "profil",
    "objective",
    "objectif",
    "about me",
    "à propos",
    "a propos",
  ],
};

const PERSONAL_WORDS = [
  "date of birth",
  "born on",
  "marital status",
  "né le",
  "née le",
  "date de naissance",
  "situation familiale",
  "célibataire",
  "marié",
  "mariée",
  "nationalité",
  "nationality",
  "religion",
];

const METRIC =
  /(\d+[.,]?\d*\s?(%|\+|k\b|m\b|mad\b|dh\b|€|\$|usd|eur))|(\b\d{2,}\s+(clients?|patients?|customers?|users?|students?|élèves|étudiants|projets?|projects?|employees|employés|teams?|équipes?|ventes|sales|dossiers|comptes))/gi;

const BULLET_LINE = /^\s*[•●▪◦·‣\-–—*\uf0a7\uf0b7]\s*\S/;

export function analyze(extract: Extract, country: Country): Report {
  const text = extract.text;
  const lower = text.toLowerCase();
  const words = text
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9À-ÿ\u0600-\u06FF]/.test(w)).length;

  const checks: Check[] = [];
  const add = (
    id: CheckId,
    status: CheckStatus,
    max: number,
    detail = 0
  ) => {
    const points = status === "pass" ? max : status === "warn" ? Math.round(max / 2) : 0;
    checks.push({ id, status, points, max, detail });
  };

  // No text: a scanned or image-only PDF cannot be read by software
  if (words < 40) {
    add("readable", "fail", 20, words);
    return {
      unreadable: true,
      score: 0,
      pages: extract.pages,
      words,
      checks,
    };
  }
  add("readable", "pass", 20, words);

  // Length in pages
  const maxGoodPages = country === "us" ? 1 : 2;
  if (extract.pages <= maxGoodPages) add("pages", "pass", 10, extract.pages);
  else if (extract.pages === maxGoodPages + 1) add("pages", "warn", 10, extract.pages);
  else add("pages", "fail", 10, extract.pages);

  // Amount of text
  if (words >= 250 && words <= 800) add("words", "pass", 10, words);
  else if ((words >= 150 && words < 250) || (words > 800 && words <= 1100))
    add("words", "warn", 10, words);
  else add("words", "fail", 10, words);

  // Contact details
  add("email", /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(text) ? "pass" : "fail", 10);
  const phoneMatches = text.match(/\+?\d[\d\s().-]{7,}\d/g) ?? [];
  const hasPhone = phoneMatches.some((m) => {
    const digits = m.replace(/\D/g, "").length;
    return digits >= 8 && digits <= 15;
  });
  add("phone", hasPhone ? "pass" : "fail", 5);

  // Sections
  add("experience", has(lower, SECTION_WORDS.experience) ? "pass" : "fail", 10);
  add("education", has(lower, SECTION_WORDS.education) ? "pass" : "fail", 10);
  add("skills", has(lower, SECTION_WORDS.skills) ? "pass" : "fail", 5);
  add("summary", has(lower, SECTION_WORDS.summary) ? "pass" : "warn", 5);

  // Bullet points
  const bullets = text.split("\n").filter((l) => BULLET_LINE.test(l)).length;
  add("bullets", bullets >= 5 ? "pass" : bullets >= 1 ? "warn" : "fail", 10, bullets);

  // Measurable results
  const metrics = (text.match(METRIC) ?? []).length;
  add("numbers", metrics >= 3 ? "pass" : metrics >= 1 ? "warn" : "fail", 10, metrics);

  // Optional extras
  add("linkedin", lower.includes("linkedin") ? "pass" : "warn", 5);

  // Personal details: normal in Morocco, usually left out in Canada and the US
  const hasPersonal = has(lower, PERSONAL_WORDS);
  add(
    "personal",
    country !== "morocco" && hasPersonal ? "fail" : "pass",
    5
  );

  const total = checks.reduce((n, c) => n + c.max, 0);
  const got = checks.reduce((n, c) => n + c.points, 0);

  return {
    unreadable: false,
    score: Math.round((100 * got) / total),
    pages: extract.pages,
    words,
    checks,
  };
}