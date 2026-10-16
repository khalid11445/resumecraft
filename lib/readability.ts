import { ResumeData } from "./resume-schema";
import { Lang, getLabels } from "./labels";
import { countPlaceholders } from "./placeholders";

export type CheckStatus = "ok" | "warn" | "info";
export type Check = {
  id: string;
  status: CheckStatus;
  title: string;
  detail: string;
};
export type ReadabilityResult = {
  text: string;
  pages: number;
  checks: Check[];
};

const MSG = {
  en: {
    textOkT: "Real, selectable text",
    textOkD:
      "Your PDF contains real text that software can read. This is the basic requirement for every system.",
    textBadT: "Almost no readable text",
    textBadD:
      "Very little text was found in the PDF. A resume made of images cannot be read by software.",
    emailOkT: "Email address found",
    emailOkD: "Your email address is in the readable text.",
    emailNoneT: "No email address",
    emailNoneD: "Add an email address: employers need a way to reply.",
    emailLostT: "Email not found in the text",
    emailLostD:
      "An email is entered but was not found in the PDF text. Check that it is written correctly.",
    phoneOkT: "Phone number found",
    phoneOkD: "Your phone number is in the readable text.",
    phoneNoneT: "No phone number",
    phoneNoneD: "Optional, but many employers like to call.",
    nameOkT: "Your name comes first",
    nameOkD: "The first thing a reader finds is your name.",
    nameBadT: "Your name is not the first text",
    nameBadD:
      "Some systems take the first line as your name. In this layout, other text comes before it.",
    oneColT: "Single-column layout",
    oneColD:
      "Text flows in one column from top to bottom, the easiest order for software to follow.",
    twoColT: "Two-column layout",
    twoColD:
      "People like this design, but some systems read across both columns and mix the lines. If an employer's application portal is strict, switch to a single-column design such as Classic, Compact or Elegant.",
    headsOkT: "Plain section titles",
    headsOkD: (list: string) =>
      `Your resume uses simple titles (${list}), which software commonly looks for.`,
    headsBadT: "A section title was not found",
    headsBadD: (list: string) => `These titles were not found in the text: ${list}.`,
    noEduT: "No education listed",
    noEduD: "Add your education: it is one of the first things recruiters look for.",
    noExpT: "No work experience listed",
    noExpD:
      "This is normal for students. Put internships, academic projects or volunteering in Experience or in an extra section so the resume does not look empty.",
    skillsNoneT: "No skills listed",
    skillsNoneD: "Add 5 to 12 skills that match the job you are applying for.",
    skillsManyT: (n: number) => `Many skills (${n})`,
    skillsManyD: "A very long list loses impact. Keep the skills that match the job.",
    skillsOkT: (n: number) => `Skills listed (${n})`,
    skillsOkD: "A short, relevant list is easy to read for both people and software.",
    datesT: "Missing dates",
    datesD: (list: string) =>
      `Add at least a start date to: ${list}. Recruiters check the timeline.`,
    pages1T: "One page",
    pages1D:
      "Quick to read, and the usual expectation for a student or a first job.",
    pages2T: "Two pages",
    pages2D:
      "Fine with a lot of experience. For a student or a first job, one page is usually expected.",
    pagesManyT: (n: number) => `${n} pages`,
    pagesManyD: "Long for a resume. Keep the most relevant parts.",
    brOkT: "No placeholders left",
    brOkD: "No [bracket] remains in your text.",
    brBadT: (n: number) => `${n} placeholder${n > 1 ? "s" : ""} left`,
    brBadD:
      "Replace every [bracket] with your real details before you send the resume.",
    longT: "Some lines are very long",
    longD: (n: number) =>
      `${n} line${n > 1 ? "s are" : " is"} over 200 characters. Short lines are easier to skim: split them or keep the key result.`,
    sumNoneT: "No summary",
    sumNoneD:
      "A profile of two or three sentences helps a reader understand quickly who you are.",
    sumOkT: "Summary present",
    sumOkD: "A short profile at the top helps a reader.",
    photoT: "Photo included",
    photoD:
      "Software ignores photos. In the US, Canada and the UK a photo is usually left out, so check the norms of the country you apply to.",
  },
  fr: {
    textOkT: "Du vrai texte, sélectionnable",
    textOkD:
      "Votre PDF contient du vrai texte qu'un logiciel peut lire. C'est la condition de base pour tous les systèmes.",
    textBadT: "Presque aucun texte lisible",
    textBadD:
      "Très peu de texte a été trouvé dans le PDF. Un CV composé d'images ne peut pas être lu par un logiciel.",
    emailOkT: "Adresse email trouvée",
    emailOkD: "Votre adresse email figure dans le texte lisible.",
    emailNoneT: "Aucune adresse email",
    emailNoneD: "Ajoutez une adresse email : les employeurs doivent pouvoir vous répondre.",
    emailLostT: "Email introuvable dans le texte",
    emailLostD:
      "Un email est saisi mais n'a pas été trouvé dans le texte du PDF. Vérifiez qu'il est bien écrit.",
    phoneOkT: "Numéro de téléphone trouvé",
    phoneOkD: "Votre numéro de téléphone figure dans le texte lisible.",
    phoneNoneT: "Aucun numéro de téléphone",
    phoneNoneD: "Facultatif, mais beaucoup d'employeurs aiment appeler.",
    nameOkT: "Votre nom vient en premier",
    nameOkD: "La première chose qu'un lecteur trouve est votre nom.",
    nameBadT: "Votre nom n'est pas le premier texte",
    nameBadD:
      "Certains systèmes prennent la première ligne comme votre nom. Dans cette mise en page, d'autres textes viennent avant.",
    oneColT: "Mise en page sur une colonne",
    oneColD:
      "Le texte se lit sur une seule colonne, de haut en bas : l'ordre le plus simple à suivre pour un logiciel.",
    twoColT: "Mise en page sur deux colonnes",
    twoColD:
      "Les gens aiment ce design, mais certains systèmes lisent les deux colonnes en travers et mélangent les lignes. Si le portail d'un employeur est strict, passez à un modèle sur une colonne comme Classic, Compact ou Elegant.",
    headsOkT: "Titres de sections simples",
    headsOkD: (list: string) =>
      `Votre CV utilise des titres simples (${list}), que les logiciels recherchent en général.`,
    headsBadT: "Un titre de section est introuvable",
    headsBadD: (list: string) =>
      `Ces titres n'ont pas été trouvés dans le texte : ${list}.`,
    noEduT: "Aucune formation",
    noEduD:
      "Ajoutez votre formation : c'est l'une des premières choses que regardent les recruteurs.",
    noExpT: "Aucune expérience professionnelle",
    noExpD:
      "C'est normal pour un étudiant. Mettez vos stages, projets académiques ou bénévolat dans Expérience ou dans une section supplémentaire pour que le CV ne paraisse pas vide.",
    skillsNoneT: "Aucune compétence",
    skillsNoneD:
      "Ajoutez 5 à 12 compétences en lien avec le poste que vous visez.",
    skillsManyT: (n: number) => `Beaucoup de compétences (${n})`,
    skillsManyD:
      "Une liste très longue perd de son impact. Gardez les compétences utiles pour le poste.",
    skillsOkT: (n: number) => `Compétences listées (${n})`,
    skillsOkD:
      "Une liste courte et pertinente est facile à lire, pour les gens comme pour les logiciels.",
    datesT: "Dates manquantes",
    datesD: (list: string) =>
      `Ajoutez au moins une date de début à : ${list}. Les recruteurs vérifient le parcours.`,
    pages1T: "Une page",
    pages1D:
      "Rapide à lire, et c'est l'attente habituelle pour un étudiant ou un premier emploi.",
    pages2T: "Deux pages",
    pages2D:
      "Acceptable avec beaucoup d'expérience. Pour un étudiant ou un premier emploi, une page est généralement attendue.",
    pagesManyT: (n: number) => `${n} pages`,
    pagesManyD: "Long pour un CV. Gardez les parties les plus pertinentes.",
    brOkT: "Aucun [crochet] restant",
    brOkD: "Plus aucun [crochet] dans votre texte.",
    brBadT: (n: number) => `${n} [crochet]${n > 1 ? "s" : ""} restant${n > 1 ? "s" : ""}`,
    brBadD:
      "Remplacez chaque [crochet] par vos vraies informations avant d'envoyer le CV.",
    longT: "Certaines lignes sont très longues",
    longD: (n: number) =>
      `${n} ligne${n > 1 ? "s dépassent" : " dépasse"} 200 caractères. Les lignes courtes se parcourent plus vite : coupez-les ou gardez le résultat clé.`,
    sumNoneT: "Pas de profil",
    sumNoneD:
      "Un profil de deux ou trois phrases aide le lecteur à comprendre rapidement qui vous êtes.",
    sumOkT: "Profil présent",
    sumOkD: "Un court profil en haut aide le lecteur.",
    photoT: "Photo incluse",
    photoD:
      "Les logiciels ignorent les photos. Aux États-Unis, au Canada et au Royaume-Uni, la photo est généralement omise : vérifiez les usages du pays visé.",
  },
};

const squash = (s: string) => s.replace(/\s+/g, "").toLowerCase();
const digits = (s: string) => s.replace(/\D/g, "");

// Reads the PDF back like a simple text reader: in the order it was written
async function readPdf(blob: Blob) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const doc = await pdfjs.getDocument({ data: await blob.arrayBuffer() }).promise;
  const pages = doc.numPages;
  const out: string[] = [];

  for (let n = 1; n <= pages; n++) {
    const page = await doc.getPage(n);
    const content = await page.getTextContent();

    let lastY: number | null = null;
    let line = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 3) {
        if (line.trim()) out.push(line.trim());
        line = "";
      }
      const needsSpace =
        line !== "" && !line.endsWith(" ") && item.str !== "" && !item.str.startsWith(" ");
      line += (needsSpace ? " " : "") + item.str;
      lastY = y;
    }
    if (line.trim()) out.push(line.trim());
  }

  doc.destroy();
  return { text: out.join("\n"), pages };
}

export async function analyzeResume(
  blob: Blob,
  data: ResumeData,
  columns: 1 | 2,
  resumeLang: Lang,
  ui: Lang
): Promise<ReadabilityResult> {
  const m = MSG[ui];
  const L = getLabels(resumeLang);
  const { text, pages } = await readPdf(blob);
  const flat = squash(text);
  const lower = text.toLowerCase();

  const checks: Check[] = [];
  const add = (id: string, status: CheckStatus, title: string, detail: string) =>
    checks.push({ id, status, title, detail });

  const p = data.personal;

  // Real text
  if (flat.length > 200) add("text", "ok", m.textOkT, m.textOkD);
  else add("text", "warn", m.textBadT, m.textBadD);

  // Email
  const email = (p.email ?? "").trim();
  if (!email) add("email", "warn", m.emailNoneT, m.emailNoneD);
  else if (flat.includes(squash(email))) add("email", "ok", m.emailOkT, m.emailOkD);
  else add("email", "warn", m.emailLostT, m.emailLostD);

  // Phone
  const phone = (p.phone ?? "").trim();
  if (!phone) add("phone", "info", m.phoneNoneT, m.phoneNoneD);
  else if (digits(phone).length >= 6 && digits(text).includes(digits(phone)))
    add("phone", "ok", m.phoneOkT, m.phoneOkD);

  // Name first
  const name = (p.fullName ?? "").trim();
  if (name) {
    if (flat.startsWith(squash(name))) add("name", "ok", m.nameOkT, m.nameOkD);
    else add("name", "warn", m.nameBadT, m.nameBadD);
  }

  // Layout
  if (columns === 1) add("layout", "ok", m.oneColT, m.oneColD);
  else add("layout", "warn", m.twoColT, m.twoColD);

  // Section titles actually present in the text
  const hasExp = data.experience.length > 0;
  const hasEdu = data.education.length > 0;
  const cleanSkills = data.skills.map((s) => s.trim()).filter(Boolean);
  const expected: string[] = [];
  if (hasExp) expected.push(L.experience);
  if (hasEdu) expected.push(L.education);
  if (cleanSkills.length > 0) expected.push(L.skills);
  const missingHeads = expected.filter((h) => !lower.includes(h.toLowerCase()));
  if (expected.length > 0) {
    if (missingHeads.length === 0)
      add("heads", "ok", m.headsOkT, m.headsOkD(expected.join(", ")));
    else add("heads", "warn", m.headsBadT, m.headsBadD(missingHeads.join(", ")));
  }

  // Education / experience
  if (!hasEdu) add("edu", "warn", m.noEduT, m.noEduD);
  if (!hasExp) add("exp", "info", m.noExpT, m.noExpD);

  // Skills
  if (cleanSkills.length === 0) add("skills", "warn", m.skillsNoneT, m.skillsNoneD);
  else if (cleanSkills.length > 18)
    add("skills", "warn", m.skillsManyT(cleanSkills.length), m.skillsManyD);
  else add("skills", "ok", m.skillsOkT(cleanSkills.length), m.skillsOkD);

  // Dates
  const noDate = data.experience
    .filter((j) => !j.startDate.trim())
    .map((j) => j.role.trim() || j.company.trim() || "?");
  if (noDate.length > 0) add("dates", "warn", m.datesT, m.datesD(noDate.join(", ")));

  // Length
  if (pages <= 1) add("pages", "ok", m.pages1T, m.pages1D);
  else if (pages === 2) add("pages", "info", m.pages2T, m.pages2D);
  else add("pages", "warn", m.pagesManyT(pages), m.pagesManyD);

  // Placeholders
  const brackets = countPlaceholders(data);
  if (brackets > 0) add("brackets", "warn", m.brBadT(brackets), m.brBadD);
  else add("brackets", "ok", m.brOkT, m.brOkD);

  // Very long lines
  const lines = [
    ...data.experience.flatMap((j) => j.bullets),
    ...data.customSections.flatMap((s) => s.items),
  ];
  const long = lines.filter((l) => l.length > 200).length;
  if (long > 0) add("long", "info", m.longT, m.longD(long));

  // Summary
  if (!(data.summary ?? "").trim()) add("summary", "info", m.sumNoneT, m.sumNoneD);
  else add("summary", "ok", m.sumOkT, m.sumOkD);

  // Photo
  if (p.photo) add("photo", "info", m.photoT, m.photoD);

  const order: Record<CheckStatus, number> = { warn: 0, info: 1, ok: 2 };
  checks.sort((a, b) => order[a.status] - order[b.status]);

  return { text, pages, checks };
}