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
  status: Status;
  appliedDate: string; // yyyy-mm-dd or ""
  followUp: string; // yyyy-mm-dd or ""
  url: string;
  notes: string;
  updatedAt: string;
};

// A different key from the other tracker, so the two never mix their data
const STORAGE_KEY = "rc_applications_v1";
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

// Only http and https links are returned, so a pasted "javascript:" link can never run
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

// Rebuilds an application from anything found in storage or in a backup file
function normalize(raw: unknown): Application | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const company = str(r.company, 120).trim();
  const role = str(r.role, 160).trim();
  if (!company && !role) return null;

  const appliedDate = str(r.appliedDate, 10);
  const followUp = str(r.followUp, 10);

  return {
    id: str(r.id, 100) || newId(),
    company,
    role,
    status: STATUSES.includes(r.status as Status) ? (r.status as Status) : "saved",
    appliedDate: isDate(appliedDate) ? appliedDate : "",
    followUp: isDate(followUp) ? followUp : "",
    url: str(r.url, 500),
    notes: str(r.notes, 2000),
    updatedAt: str(r.updatedAt, 40),
  };
}

function toList(text: string): Application[] | null {
  try {
    const v = JSON.parse(text) as unknown;
    const arr = Array.isArray(v) ? v : (v as { items?: unknown } | null)?.items;
    if (!Array.isArray(arr)) return null;
    return arr
      .map(normalize)
      .filter((x): x is Application => x !== null)
      .slice(0, MAX_ITEMS);
  } catch {
    return null;
  }
}

export function loadApplications(): Application[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? toList(raw) ?? [] : [];
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

export function exportBackup(items: Application[]): string {
  return JSON.stringify(
    { app: "resumecraft-applications", version: 1, items },
    null,
    2
  );
}

// Adds the applications of a backup file to the current list, without duplicates
export function importBackup(
  text: string,
  current: Application[]
): { items: Application[]; added: number } {
  const parsed = toList(text);
  if (!parsed) return { items: current, added: 0 };

  const known = new Set(current.map((x) => x.id));
  const fresh = parsed.filter((x) => !known.has(x.id));
  return {
    items: [...fresh, ...current].slice(0, MAX_ITEMS),
    added: fresh.length,
  };
}

export function toCsv(
  items: Application[],
  headers: string[],
  statusLabel: (s: Status) => string
): string {
  const cell = (value: string) => {
    let s = value.replace(/\r?\n/g, " ");
    // Stops a spreadsheet from running a pasted formula
    if (/^[=+\-@\t]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };

  const rows = items.map((a) =>
    [
      a.company,
      a.role,
      statusLabel(a.status),
      a.appliedDate,
      a.followUp,
      a.url,
      a.notes,
    ]
      .map(cell)
      .join(",")
  );

  // The first character lets Excel read accented letters correctly
  return "\uFEFF" + [headers.map(cell).join(","), ...rows].join("\r\n");
}