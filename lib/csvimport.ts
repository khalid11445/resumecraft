export const MAX_ROWS = 1000;

export type FieldKey =
  | "fullName"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "city"
  | "headline"
  | "source";

export const FIELDS: FieldKey[] = [
  "fullName",
  "firstName",
  "lastName",
  "email",
  "phone",
  "city",
  "headline",
  "source",
];

// For each field, the index of the CSV column that feeds it (-1 = none)
export type ColumnMap = Record<FieldKey, number>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- Reading the file ----------

export function decodeCsvBytes(buf: ArrayBuffer): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch {
    // Excel on Windows often saves accented text in the Windows-1252 encoding
    return new TextDecoder("windows-1252").decode(buf);
  }
}

function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r\n|\n|\r/, 1)[0] ?? "";
  let best = ",";
  let bestCount = -1;
  for (const d of [",", ";", "\t"]) {
    let count = 0;
    let inQuotes = false;
    for (const ch of firstLine) {
      if (ch === '"') inQuotes = !inQuotes;
      else if (!inQuotes && ch === d) count++;
    }
    if (count > bestCount) {
      best = d;
      bestCount = count;
    }
  }
  return best;
}

// A small CSV reader: quotes, doubled quotes, line breaks inside quotes,
// and the comma, semicolon or tab separators
export function parseCsv(input: string): string[][] {
  let text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;

  // Excel sometimes writes a first line such as "sep=;"
  let forced: string | null = null;
  const sep = /^sep=(.)\r?\n/i.exec(text);
  if (sep) {
    forced = sep[1];
    text = text.slice(sep[0].length);
  }

  const delimiter = forced ?? detectDelimiter(text);
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"' && field === "") {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Empty lines are ignored
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

// ---------- Matching the columns ----------

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const SYNONYMS: Record<FieldKey, string[]> = {
  fullName: [
    "name",
    "fullname",
    "nomcomplet",
    "nomprenom",
    "prenomnom",
    "candidate",
    "candidat",
    "contact",
  ],
  firstName: ["firstname", "first", "givenname", "prenom"],
  lastName: ["lastname", "last", "surname", "familyname", "nomdefamille", "nomfamille"],
  email: ["email", "emailaddress", "mail", "courriel", "adresseemail", "adressemail"],
  phone: [
    "phone",
    "phonenumber",
    "telephone",
    "tel",
    "mobile",
    "gsm",
    "portable",
    "numerodetelephone",
    "numero",
    "whatsapp",
  ],
  city: ["city", "ville", "location", "localisation", "lieu", "town"],
  headline: [
    "headline",
    "title",
    "jobtitle",
    "poste",
    "position",
    "titre",
    "profession",
    "metier",
    "fonction",
    "role",
    "currentposition",
  ],
  source: ["source", "origine", "provenance"],
};

export function autoMap(header: string[]): ColumnMap {
  const normalized = header.map(norm);
  const map = {} as ColumnMap;

  for (const f of FIELDS) {
    map[f] = normalized.findIndex((h) => SYNONYMS[f].includes(h));
  }

  // "Nom" alone: a last name when a first name column exists, otherwise a full name
  const nom = normalized.indexOf("nom");
  if (nom >= 0) {
    if (map.firstName >= 0 && map.lastName < 0) map.lastName = nom;
    else if (map.firstName < 0 && map.fullName < 0) map.fullName = nom;
  }
  return map;
}

// ---------- Duplicates and checks ----------

// Phones are compared by their last 9 digits, so 0612345678,
// +212 612 345 678 and 00212612345678 count as the same number
export function phoneKey(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 9) return digits.slice(-9);
  return digits.length >= 6 ? digits : "";
}

export type RowStatus = "ok" | "invalid" | "dupFile" | "dupExisting";

export type Analyzed = {
  line: number;
  status: RowStatus;
  name: string;
  email: string;
  phone: string;
  city: string;
  headline: string;
  source: string;
  emailDropped: boolean;
};

export function analyze(
  rows: string[][],
  map: ColumnMap,
  existing: { emails: Set<string>; phones: Set<string> }
): Analyzed[] {
  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();

  return rows.map((row, i): Analyzed => {
    const get = (f: FieldKey) => (map[f] >= 0 ? (row[map[f]] ?? "").trim() : "");

    const name = (
      get("fullName") || [get("firstName"), get("lastName")].filter(Boolean).join(" ")
    )
      .replace(/\s+/g, " ")
      .slice(0, 160);

    let email = get("email").toLowerCase().slice(0, 200);
    let emailDropped = false;
    if (email && !EMAIL.test(email)) {
      email = "";
      emailDropped = true;
    }

    const phone = get("phone").slice(0, 40);
    const base = {
      line: i + 2, // the header is line 1
      name,
      email,
      phone,
      city: get("city").slice(0, 120),
      headline: get("headline").slice(0, 200),
      source: get("source").slice(0, 120),
      emailDropped,
    };

    if (name.length < 2) return { ...base, status: "invalid" };

    const pk = phoneKey(phone);
    if ((email && existing.emails.has(email)) || (pk && existing.phones.has(pk))) {
      return { ...base, status: "dupExisting" };
    }
    if ((email && seenEmails.has(email)) || (pk && seenPhones.has(pk))) {
      return { ...base, status: "dupFile" };
    }

    if (email) seenEmails.add(email);
    if (pk) seenPhones.add(pk);
    return { ...base, status: "ok" };
  });
}