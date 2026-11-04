export type Status = "saved" | "applied" | "interview" | "offer" | "rejected";

export const STATUSES: Status[] = [
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
];

export type Application = {
  id: string;
  company: string;
  role: string;
  url: string;
  status: Status;
  appliedOn: string; // yyyy-mm-dd or ""
  followUpOn: string; // yyyy-mm-dd or ""
  contact: string;
  contactEmail: string;
  notes: string;
  posting: string;
  updatedAt: string;
};

const STORAGE_KEY = "rc_tracker";
const MAX_ITEMS = 500;

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.slice(0, max) : "";
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

export function newId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // fall through to the simple id below
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

// Only http and https links are kept, so a pasted "javascript:" link can never run
export function safeUrl(value: string): string {
  const v = value.trim();
  if (!v) return "";
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withScheme);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

// Rebuilds an application from anything found in storage or in an imported file
export function normalizeApplication(raw: unknown): Application | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const company = str(r.company, 200).trim();
  const role = str(r.role, 200).trim();
  if (!company && !role) return null;

  const appliedOn = str(r.appliedOn, 10);
  const followUpOn = str(r.followUpOn, 10);

  return {
    id: str(r.id, 100) || newId(),
    company,
    role,
    url: safeUrl(str(r.url, 500)),
    status: STATUSES.includes(r.status as Status) ? (r.status as Status) : "saved",
    appliedOn: isDate(appliedOn) ? appliedOn : "",
    followUpOn: isDate(followUpOn) ? followUpOn : "",
    contact: str(r.contact, 200),
    contactEmail: str(r.contactEmail, 200),
    notes: str(r.notes, 5000),
    posting: str(r.posting, 20000),
    updatedAt: str(r.updatedAt, 40),
  };
}

export function loadApplications(): Application[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const v = JSON.parse(raw) as unknown;
    const arr = Array.isArray(v) ? v : (v as { items?: unknown } | null)?.items;
    if (!Array.isArray(arr)) return [];
    return arr
      .map(normalizeApplication)
      .filter((x): x is Application => x !== null)
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

// Returns false when the browser refused to store the list (full or blocked)
export function saveApplications(items: Application[]): boolean {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, items })
    );
    return true;
  } catch {
    return false;
  }
}

export function exportJson(items: Application[]): string {
  return JSON.stringify(
    { app: "resumecraft-tracker", version: 1, items },
    null,
    2
  );
}

export function parseImport(text: string): Application[] | null {
  try {
    const v = JSON.parse(text) as unknown;
    const arr = Array.isArray(v) ? v : (v as { items?: unknown } | null)?.items;
    if (!Array.isArray(arr)) return null;
    return arr
      .map(normalizeApplication)
      .filter((x): x is Application => x !== null)
      .slice(0, MAX_ITEMS);
  } catch {
    return null;
  }
}

// ---- Dates (local time, no time zone surprises) ----

export function toISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Only call this from an effect or an event handler, never while rendering
export const todayISO = () => toISODate(new Date());

export function addDays(iso: string, days: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "";
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function formatDate(iso: string, locale: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "";
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString(
    locale,
    { day: "numeric", month: "long", year: "numeric" }
  );
}

export function isFollowUpDue(app: Application, today: string | null): boolean {
  return (
    !!today &&
    !!app.followUpOn &&
    app.followUpOn <= today &&
    (app.status === "applied" || app.status === "interview")
  );
}

// Moving a card to "Applied" fills in today's date and a follow-up 7 days later
export function withStatus(app: Application, status: Status): Application {
  const next: Application = {
    ...app,
    status,
    updatedAt: new Date().toISOString(),
  };
  if (status === "applied" && !next.appliedOn) {
    next.appliedOn = todayISO();
    if (!next.followUpOn) next.followUpOn = addDays(next.appliedOn, 7);
  }
  return next;
}