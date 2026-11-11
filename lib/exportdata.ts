import type { SupabaseClient } from "@supabase/supabase-js";

const PAGE = 1000;
const MAX_ROWS = 20000;

// Reads a whole table of the workspace, one page at a time
export async function fetchAll<T>(
  supabase: SupabaseClient,
  table: string,
  columns: string,
  orgId: string
): Promise<{ rows: T[]; truncated: boolean }> {
  const rows: T[] = [];
  let truncated = false;

  for (let from = 0; ; from += PAGE) {
    if (from >= MAX_ROWS) {
      truncated = true;
      break;
    }
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq("org_id", orgId)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);

    if (error) throw error;
    const batch = (data ?? []) as unknown as T[];
    rows.push(...batch);
    if (batch.length < PAGE) break;
  }
  return { rows, truncated };
}

// A spreadsheet runs a cell that starts with = + - or @ as a formula.
// Such text gets a leading apostrophe. Plain numbers and phone numbers
// (digits and phone punctuation only) cannot do anything harmful and are kept.
const DANGEROUS = /^[=+\-@\t\r]/;
const PLAIN_NUMBER = /^[+\-]?[\d\s().-]+$/;

export function csvCell(value: string): string {
  let s = value.replace(/\r?\n|\r/g, " ");
  if (DANGEROUS.test(s) && !PLAIN_NUMBER.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

// The first character lets Excel read accented letters correctly
export function csvText(rows: string[][], separator: string): string {
  return (
    "\uFEFF" +
    rows.map((r) => r.map(csvCell).join(separator)).join("\r\n") +
    "\r\n"
  );
}

export function downloadText(content: string, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}