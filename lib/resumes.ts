import { loadDraft, normalizeResume } from "./draft";

// Saved resumes live in this browser only (localStorage).
// A resume is stored under "rc_draft:<category>" or "rc_draft:<category>~<slot>".
const PREFIX = "rc_draft:";
const LABELS = "rc_labels";
const KEY_OK = /^[a-z0-9-]+(~[a-z0-9]{1,12})?$/i;

export type ResumeItem = {
  key: string; // category or category~slot
  category: string;
  slot: string | null;
  label: string; // custom name given by the visitor, or ""
  name: string;
  jobTitle: string;
  templateId: string;
  accent: string;
  lang: string;
  savedAt: string;
};

export const newSlot = () => Math.random().toString(36).slice(2, 8);

function readLabels(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(LABELS);
    const v = raw ? JSON.parse(raw) : {};
    return v && typeof v === "object" ? (v as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeLabels(labels: Record<string, string>) {
  try {
    window.localStorage.setItem(LABELS, JSON.stringify(labels));
  } catch {
    // storage full or blocked: the label is simply not kept
  }
}

export function listResumes(): ResumeItem[] {
  const items: ResumeItem[] = [];
  try {
    const labels = readLabels();
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const key = k.slice(PREFIX.length);
      if (!KEY_OK.test(key)) continue;
      const d = loadDraft(key);
      // A resume that was never edited is not listed
      if (!d || !d.data) continue;
      const [category, slot] = key.split("~");
      items.push({
        key,
        category,
        slot: slot ?? null,
        label: labels[key] ?? "",
        name: d.data.personal.fullName,
        jobTitle: d.data.personal.jobTitle ?? "",
        templateId: d.templateId,
        accent: d.accent,
        lang: d.lang,
        savedAt: d.savedAt,
      });
    }
  } catch {
    // ignore
  }
  return items.sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
}

export function duplicateResume(key: string, copyLabel: string): boolean {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return false;
    const category = key.split("~")[0];
    const newKey = `${category}~${newSlot()}`;
    const v = JSON.parse(raw) as Record<string, unknown>;
    window.localStorage.setItem(
      PREFIX + newKey,
      JSON.stringify({ ...v, savedAt: new Date().toISOString() })
    );
    const labels = readLabels();
    labels[newKey] = copyLabel;
    writeLabels(labels);
    return true;
  } catch {
    return false;
  }
}

export function deleteResume(key: string) {
  try {
    window.localStorage.removeItem(PREFIX + key);
    const labels = readLabels();
    delete labels[key];
    writeLabels(labels);
  } catch {
    // ignore
  }
}

export function renameResume(key: string, label: string) {
  const labels = readLabels();
  if (label.trim()) labels[key] = label.trim().slice(0, 60);
  else delete labels[key];
  writeLabels(labels);
}

export function exportBackup(): string {
  const drafts: Record<string, unknown> = {};
  for (const item of listResumes()) {
    const raw = window.localStorage.getItem(PREFIX + item.key);
    if (raw) drafts[item.key] = JSON.parse(raw);
  }
  return JSON.stringify(
    {
      app: "resumecraft",
      version: 1,
      exportedAt: new Date().toISOString(),
      drafts,
      labels: readLabels(),
    },
    null,
    2
  );
}

// Imported resumes are always added as new copies, so nothing is overwritten
export function importBackup(text: string, importedLabel: string): number {
  let count = 0;
  try {
    const v = JSON.parse(text) as Record<string, unknown>;
    if (!v || v.app !== "resumecraft" || typeof v.drafts !== "object" || !v.drafts) {
      return 0;
    }
    const labels = readLabels();
    const oldLabels = (v.labels && typeof v.labels === "object"
      ? v.labels
      : {}) as Record<string, string>;
    for (const [key, raw] of Object.entries(v.drafts as Record<string, unknown>)) {
      if (!KEY_OK.test(key) || !raw || typeof raw !== "object") continue;
      const d = raw as Record<string, unknown>;
      const data = normalizeResume(d.data);
      if (!data) continue;
      const category = key.split("~")[0];
      const newKey = `${category}~${newSlot()}`;
      window.localStorage.setItem(
        PREFIX + newKey,
        JSON.stringify({
          data,
          templateId: typeof d.templateId === "string" ? d.templateId : "",
          accent: typeof d.accent === "string" ? d.accent : "",
          lang: typeof d.lang === "string" ? d.lang : "",
          savedAt: new Date().toISOString(),
        })
      );
      labels[newKey] =
        typeof oldLabels[key] === "string" && oldLabels[key]
          ? oldLabels[key]
          : importedLabel;
      count++;
    }
    writeLabels(labels);
  } catch {
    return count;
  }
  return count;
}