// Job application tracker. Everything is saved in this browser (localStorage).
export const STATUSES = ["saved", "applied", "interview", "offer", "rejected"] as const;
export type Status = (typeof STATUSES)[number];

export type Application = {
  id: string;
  company: string;
  role: string;
  status: Status;
  appliedDate: string; // YYYY-MM-DD or ""
  followUp: string; // YYYY-MM-DD or ""
  url: string;
  notes: string;
  updatedAt: string;
};

const KEY = "rc_applications";
const DATE_OK = /^\d{4}-\d{2}-\d{2}$/;

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.slice(0, max) : "");
const date = (v: unknown) => (typeof v === "string" && DATE_OK.test(v) ? v : "");
const isStatus = (v: unknown): v is Status =>
  typeof v === "string" && (STATUSES as readonly string[]).includes(v);

export const newId = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

function clean(raw: unknown): Application | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const company = str(r.company, 120).trim();
  const role = str(r.role, 160).trim();
  if (!company && !role) return null;
  return {
    id: str(r.id, 40) || newId(),
    company,
    role,
    status: isStatus(r.status) ? r.status : "applied",
    appliedDate: date(r.appliedDate),
    followUp: date(r.followUp),
    url: str(r.url, 500),
    notes: str(r.notes, 2000),
    updatedAt: str(r.updatedAt, 40) || new Date().toISOString(),
  };
}

export function loadApplications(): Application[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const v = JSON.parse(raw);
    if (!Array.isArray(v)) return [];
    return v.map(clean).filter((x): x is Application => x !== null);
  } catch {
    return [];
  }
}

// Returns false when the browser storage is full or blocked
export function saveApplications(items: Application[]): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

// Only web links are turned into clickable links
export function safeUrl(u: string): string {
  const value = u.trim();
  if (!value) return "";
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const x = new URL(withScheme);
    return x.protocol === "http:" || x.protocol === "https:" ? x.toString() : "";
  } catch {
    return "";
  }
}

export function exportBackup(items: Application[]): string {
  return JSON.stringify(
    {
      app: "resumecraft-tracker",
      version: 1,
      exportedAt: new Date().toISOString(),
      applications: items,
    },
    null,
    2
  );
}

// Entries that already exist (same id) are skipped, so restoring twice is safe
export function importBackup(
  text: string,
  existing: Application[]
): { items: Application[]; added: number } {
  try {
    const v = JSON.parse(text) as Record<string, unknown>;
    if (!v || v.app !== "resumecraft-tracker" || !Array.isArray(v.applications)) {
      return { items: existing, added: 0 };
    }
    const ids = new Set(existing.map((a) => a.id));
    const added: Application[] = [];
    for (const raw of v.applications) {
      const a = clean(raw);
      if (!a || ids.has(a.id)) continue;
      ids.add(a.id);
      added.push(a);
    }
    return { items: [...added, ...existing], added: added.length };
  } catch {
    return { items: existing, added: 0 };
  }
}

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

// Opens correctly in Excel, including accents
export function toCsv(
  items: Application[],
  headers: string[],
  statusLabel: (s: Status) => string
): string {
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
      .map(csvCell)
      .join(",")
  );
  return "\uFEFF" + [headers.map(csvCell).join(","), ...rows].join("\r\n");
}