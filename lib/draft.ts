import { ResumeData } from "./resume-schema";

const s = (v: unknown) => (typeof v === "string" ? v : "");
const strs = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
const list = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v)
    ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    : [];
const newId = () => Math.random().toString(36).slice(2, 9);
const id = (v: unknown) => (typeof v === "string" && v ? v : newId());

// Rebuilds a resume from anything found in storage, with safe defaults.
// This keeps an old or damaged draft from breaking the page.
export function normalizeResume(raw: unknown): ResumeData | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const p = (r.personal && typeof r.personal === "object"
    ? r.personal
    : {}) as Record<string, unknown>;

  return {
    personal: {
      fullName: s(p.fullName),
      jobTitle: s(p.jobTitle),
      email: s(p.email),
      phone: s(p.phone),
      location: s(p.location),
      website: s(p.website),
      linkedin: s(p.linkedin),
      photo: s(p.photo),
    },
    summary: s(r.summary),
    experience: list(r.experience).map((j) => ({
      id: id(j.id),
      role: s(j.role),
      company: s(j.company),
      location: s(j.location),
      startDate: s(j.startDate),
      endDate: s(j.endDate),
      bullets: strs(j.bullets),
    })),
    education: list(r.education).map((e) => ({
      id: id(e.id),
      school: s(e.school),
      degree: s(e.degree),
      startDate: s(e.startDate),
      endDate: s(e.endDate),
      details: s(e.details),
    })),
    skills: strs(r.skills),
    customSections: list(r.customSections).map((c) => ({
      id: id(c.id),
      title: s(c.title),
      items: strs(c.items),
    })),
  };
}

export type Draft = {
  // null means the resume text was never changed from the sample
  data: ResumeData | null;
  templateId: string;
  accent: string;
  lang: string;
  savedAt: string;
};

const key = (categoryId: string) => `rc_draft:${categoryId}`;

export function loadDraft(categoryId: string): Draft | null {
  try {
    const raw = window.localStorage.getItem(key(categoryId));
    if (!raw) return null;
    const v = JSON.parse(raw) as Record<string, unknown>;
    return {
      data: normalizeResume(v.data),
      templateId: s(v.templateId),
      accent: s(v.accent),
      lang: s(v.lang),
      savedAt: s(v.savedAt),
    };
  } catch {
    return null;
  }
}

export function saveDraft(categoryId: string, d: Omit<Draft, "savedAt">) {
  try {
    window.localStorage.setItem(
      key(categoryId),
      JSON.stringify({ ...d, savedAt: new Date().toISOString() })
    );
  } catch {
    // Storage can be full or blocked: the resume still works, it is just not saved
  }
}

export function clearDraft(categoryId: string) {
  try {
    window.localStorage.removeItem(key(categoryId));
  } catch {
    // ignore
  }
}