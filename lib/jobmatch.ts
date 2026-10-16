import { ResumeData } from "./resume-schema";

export type TermResult = { term: string; count: number; covered: boolean };
export type MatchResult = {
  covered: TermResult[];
  missing: TermResult[];
  overused: { term: string; count: number }[];
  total: number;
  tooShort: boolean;
};

const strip = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Very light plural handling for English and French
const stem = (w: string) => {
  if (w.length > 5 && w.endsWith("ies")) return `${w.slice(0, -3)}y`;
  if (w.length > 4 && /[^suis]s$/.test(w)) return w.slice(0, -1);
  return w;
};

const EN_STOP =
  "a an the and or but if then else for to of in on at by with from as is are was were be been being am do does did have has had having this that these those it its you your we our they their he she his her i me my us them who whom which what when where why how not no nor so than too very can could should would may might will shall must about above after again against all also any because before below between both each few further here into just more most other out over own same some such there through under until up while within without per via etc able across among around during upon using use used including include includes plus new good well strong great high highly looking join help helping make making ensure ensuring";

const FR_STOP =
  "le la les un une des du de d l au aux et ou mais si alors donc or ni car que qui quoi dont où ce cet cette ces se sa son ses leur leurs mon ma mes ton ta tes notre nos votre vos nous vous ils elles il elle je tu on en dans sur sous avec sans pour par entre vers chez comme plus moins très aussi ainsi tout tous toute toutes autre autres même être est sont était été avoir a ont avait eu faire fait font peut peuvent doit doivent sera seront serait afin lors selon également notamment sein cadre apprécié appréciée souhaité souhaitée requis requise idéalement bon bonne bons bonnes";

const GENERIC =
  "responsible responsibilities required requirements requirement preferred ideal candidate candidates role roles job jobs position positions company companies team teams work working works year years month months day days week time full part opportunity opportunities benefits offer offering apply application applications skills skill ability abilities knowledge experience experiences degree poste postes mission missions profil recherché recherchons recherche rejoindre rejoignez entreprise société équipe équipes candidat candidats candidature candidatures expérience expériences année années ans mois jour jours temps plein partiel connaissance connaissances compétence compétences capacité capacités maîtrise offre offres avantages rémunération responsable responsabilités cdi cdd";

const STOP = new Set(
  `${EN_STOP} ${FR_STOP} ${GENERIC}`
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => strip(w.toLowerCase()))
);

// Short terms that are real skills
const SHORT = new Set(["ui", "ux", "qa", "ai", "ml", "hr", "bi"]);

// Common skills: these are kept even when they appear only once in the ad
const KNOWN_LIST = [
  "excel", "word", "powerpoint", "outlook", "sap", "erp", "crm", "python", "java",
  "javascript", "typescript", "react", "angular", "vue", "node", "node.js", "php",
  "sql", "mysql", "postgresql", "mongodb", "git", "github", "docker", "kubernetes",
  "aws", "azure", "gcp", "linux", "html", "css", "figma", "photoshop", "illustrator",
  "canva", "autocad", "matlab", "tableau", "power bi", "bloomberg", "vba", "scrum",
  "agile", "jira", "api", "devops", "cybersecurity", "machine learning", "seo",
  "google analytics", "wordpress",
  "ifrs", "gaap", "audit", "financial modeling", "modélisation financière",
  "credit analysis", "analyse de crédit", "risk management", "gestion des risques",
  "reporting", "budgeting", "forecasting", "compliance", "kyc", "aml",
  "bls", "acls", "triage", "patient care", "infection control", "wound care",
  "iv therapy", "perfusion", "pediatrics", "pédiatrie", "icu", "epic",
  "lesson planning", "classroom management", "curriculum", "google classroom",
  "assessment", "évaluation",
  "english", "french", "arabic", "spanish", "german", "anglais", "français",
  "arabe", "espagnol", "allemand",
  "project management", "gestion de projet", "customer service", "service client",
  "communication", "leadership", "negotiation", "négociation",
];

const KNOWN = new Set(
  KNOWN_LIST.map((t) =>
    strip(t.toLowerCase())
      .split(" ")
      .map(stem)
      .join(" ")
  )
);

type Tok = {
  raw: string;
  norm: string;
  start: number;
  end: number;
  startsSentence: boolean;
};

function tokenize(text: string): Tok[] {
  const out: Tok[] = [];
  const re =
    /[A-Za-z0-9\u00C0-\u024F\u0600-\u06FF][A-Za-z0-9\u00C0-\u024F\u0600-\u06FF+#.\-]*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const raw = m[0].replace(/[.\-]+$/, "");
    if (!raw) continue;
    let j = m.index - 1;
    while (j >= 0 && (text[j] === " " || text[j] === "\t")) j--;
    const startsSentence = j < 0 || "\n\r.!?:;•*-–—".includes(text[j]);
    out.push({
      raw,
      norm: strip(raw.toLowerCase()),
      start: m.index,
      end: m.index + raw.length,
      startsSentence,
    });
  }
  return out;
}

function valid(t: Tok): boolean {
  const n = t.norm;
  if (n.length > 30 || STOP.has(n)) return false;
  if (/^[\d.\-+#]+$/.test(n)) return false; // plain numbers
  if (n.length < 3 && !SHORT.has(n) && !/[+#]/.test(n)) return false;
  return true;
}

type Cand = {
  key: string;
  words: string[];
  display: string;
  count: number;
  proper: boolean;
  allcaps: boolean;
  special: boolean;
  bigram: boolean;
};

function extract(text: string) {
  const toks = tokenize(text);
  const uni = new Map<string, Cand>();
  const bi = new Map<string, Cand>();

  const bump = (map: Map<string, Cand>, key: string, words: Tok[], isBi: boolean) => {
    const prev = map.get(key);
    if (prev) {
      prev.count++;
      return;
    }
    map.set(key, {
      key,
      words: words.map((w) => stem(w.norm)),
      display: words.map((w) => w.raw).join(" "),
      count: 1,
      proper: words.some((w) => w.raw[0] !== w.raw[0].toLowerCase() && !w.startsSentence),
      allcaps: words.every(
        (w) => w.raw.length >= 2 && w.raw === w.raw.toUpperCase() && /[A-Z]/.test(w.raw)
      ),
      special: words.some((w) => /[+#.]/.test(w.raw)),
      bigram: isBi,
    });
  };

  for (let i = 0; i < toks.length; i++) {
    const a = toks[i];
    if (!valid(a)) continue;
    bump(uni, stem(a.norm), [a], false);

    const b = toks[i + 1];
    if (b && valid(b) && /^[ \t]+$/.test(text.slice(a.end, b.start))) {
      bump(bi, `${stem(a.norm)} ${stem(b.norm)}`, [a, b], true);
    }
  }
  return { uni, bi };
}

// Everything the reader would see in the resume, without the email, phone or photo
function resumeText(d: ResumeData): string {
  const p = d.personal;
  return [
    p.fullName,
    p.jobTitle,
    p.location,
    d.summary,
    ...d.experience.flatMap((j) => [j.role, j.company, j.location, ...j.bullets]),
    ...d.education.flatMap((e) => [e.school, e.degree, e.details]),
    ...d.skills,
    ...d.customSections.flatMap((s) => [s.title, ...s.items]),
  ]
    .filter(Boolean)
    .join("\n");
}

export function matchJob(posting: string, resume: ResumeData): MatchResult {
  if (posting.trim().length < 150) {
    return { covered: [], missing: [], overused: [], total: 0, tooShort: true };
  }

  const { uni, bi } = extract(posting);

  const include = (c: Cand) =>
    c.count >= 2 || KNOWN.has(c.key) || (!c.bigram && (c.allcaps || c.special));
  const score = (c: Cand) =>
    c.count * 2 +
    (KNOWN.has(c.key) ? 3 : 0) +
    (c.bigram ? 1 : 0) +
    (c.allcaps || c.special ? 1 : 0);

  const chosenBi = [...bi.values()].filter(include);

  // A single word that only ever appears inside a chosen two-word term is dropped
  const swallowed = new Set<string>();
  for (const b of chosenBi) {
    for (const w of b.words) {
      const u = uni.get(w);
      if (u && u.count <= b.count) swallowed.add(w);
    }
  }
  const chosenUni = [...uni.values()].filter(
    (c) => include(c) && !swallowed.has(c.key)
  );

  const chosen = [...chosenBi, ...chosenUni]
    .sort((a, b) => score(b) - score(a))
    .slice(0, 30);

  // Resume side
  const rToks = tokenize(resumeText(resume));
  const rStems = rToks.map((t) => stem(t.norm));
  const rSet = new Set(rStems);
  const rJoined = ` ${rStems.join(" ")} `;

  const results: TermResult[] = chosen.map((c) => ({
    term: c.proper || c.allcaps || c.special ? c.display : c.display.toLowerCase(),
    count: c.count,
    covered: c.bigram ? rJoined.includes(` ${c.key} `) : rSet.has(c.key),
  }));

  // Words repeated many times in the resume
  const freq = new Map<string, { term: string; count: number }>();
  for (const t of rToks) {
    if (!valid(t) || t.norm.length < 4) continue;
    const k = stem(t.norm);
    const cur = freq.get(k);
    if (cur) cur.count++;
    else freq.set(k, { term: t.raw.toLowerCase(), count: 1 });
  }
  const overused = [...freq.values()]
    .filter((f) => f.count >= 6)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    covered: results.filter((r) => r.covered),
    missing: results.filter((r) => !r.covered),
    overused,
    total: results.length,
    tooShort: false,
  };
}