"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmShell";
import { IT } from "@/components/crm/importText";
import {
  ColumnMap,
  FIELDS,
  FieldKey,
  MAX_ROWS,
  RowStatus,
  analyze,
  autoMap,
  decodeCsvBytes,
  parseCsv,
  phoneKey,
} from "@/lib/csvimport";

type Existing = { emails: Set<string>; phones: Set<string> };
type Result = { imported: number; skipped: number; failed: boolean };

const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const box = "rounded-xl border border-gray-200 bg-white p-4";
const primary =
  "rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50";
const ghost =
  "rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50";

const badge: Record<RowStatus, string> = {
  ok: "bg-green-100 text-green-800",
  invalid: "bg-red-100 text-red-800",
  dupFile: "bg-amber-100 text-amber-800",
  dupExisting: "bg-amber-100 text-amber-800",
};

export default function ImportView() {
  const { supabase, orgId, t, lang, base } = useCrm();
  const m = IT[lang];
  const fileRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState("");
  const [header, setHeader] = useState<string[]>([]);
  const [data, setData] = useState<string[][]>([]);
  const [map, setMap] = useState<ColumnMap | null>(null);
  const [existing, setExisting] = useState<Existing | null>(null);
  const [capped, setCapped] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  function reset() {
    setFileName("");
    setHeader([]);
    setData([]);
    setMap(null);
    setExisting(null);
    setCapped(false);
    setError("");
    setConsent(false);
    setProgress(0);
    setResult(null);
  }

  // The emails and phone numbers already in the workspace, to spot duplicates
  async function loadExisting(): Promise<boolean> {
    const emails = new Set<string>();
    const phones = new Set<string>();
    const page = 1000;
    const cap = 5000;
    let from = 0;
    let more = false;

    while (from < cap) {
      const { data: rows, error: err } = await supabase
        .from("candidates")
        .select("email,phone")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .order("id")
        .range(from, from + page - 1);

      if (err) {
        console.error(err);
        setError(t.loadError);
        return false;
      }
      (rows ?? []).forEach((r) => {
        const row = r as { email: string | null; phone: string | null };
        if (row.email) emails.add(row.email.trim().toLowerCase());
        const pk = phoneKey(row.phone ?? "");
        if (pk) phones.add(pk);
      });

      if (!rows || rows.length < page) break;
      from += page;
      if (from >= cap) more = true;
    }

    setExisting({ emails, phones });
    setCapped(more);
    return true;
  }

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    reset();
    if (file.size > 2_000_000) {
      setError(m.tooBig);
      return;
    }

    let rows: string[][];
    try {
      rows = parseCsv(decodeCsvBytes(await file.arrayBuffer()));
    } catch {
      setError(m.badFile);
      return;
    }
    if (rows.length < 2) {
      setError(m.noRows);
      return;
    }

    const [head, ...rest] = rows;
    if (rest.length > MAX_ROWS) {
      setError(m.tooMany(MAX_ROWS));
      return;
    }

    setFileName(file.name);
    setHeader(head.map((h) => h.trim()));
    setData(rest);
    setMap(autoMap(head));
    await loadExisting();
  }

  const analyzed = useMemo(
    () => (map && existing ? analyze(data, map, existing) : []),
    [data, map, existing]
  );

  const count = (s: RowStatus) => analyzed.filter((r) => r.status === s).length;
  const okRows = analyzed.filter((r) => r.status === "ok");
  const emailsDropped = analyzed.filter(
    (r) => r.status === "ok" && r.emailDropped
  ).length;
  const nameMapped =
    !!map && (map.fullName >= 0 || map.firstName >= 0 || map.lastName >= 0);

  function setField(field: FieldKey, value: string) {
    setMap((prev) => (prev ? { ...prev, [field]: Number(value) } : prev));
  }

  async function runImport() {
    if (!consent || okRows.length === 0) return;
    setRunning(true);
    setProgress(0);
    setError("");

    const note = `${m.noteText} ${new Date().toISOString().slice(0, 10)}`;
    const skipped = analyzed.length - okRows.length;
    let done = 0;

    for (let i = 0; i < okRows.length; i += 100) {
      const batch = okRows.slice(i, i + 100).map((r) => ({
        org_id: orgId,
        full_name: r.name,
        email: r.email || null,
        phone: r.phone || null,
        city: r.city || null,
        headline: r.headline || null,
        source: r.source || "CSV import",
        consent_recorded: true,
        consent_note: note,
      }));

      const { error: err } = await supabase.from("candidates").insert(batch);
      if (err) {
        console.error(err);
        setRunning(false);
        setResult({ imported: done, skipped, failed: true });
        setData([]);
        return;
      }
      done += batch.length;
      setProgress(done);
    }

    setRunning(false);
    setResult({ imported: done, skipped, failed: false });
    setData([]);
  }

  function downloadTemplate() {
    const sep = lang === "fr" ? ";" : ",";
    const head = (
      lang === "fr"
        ? ["Nom complet", "Email", "Téléphone", "Ville", "Titre", "Source"]
        : ["Full name", "Email", "Phone", "City", "Headline", "Source"]
    ).join(sep);
    const blob = new Blob(["\uFEFF" + head + "\r\n"], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      lang === "fr" ? "modele-import-candidats.csv" : "candidate-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const preview = analyzed.slice(0, 8);
  const loaded = header.length > 0 && !result;
  const ready = loaded && !!existing;

  return (
    <div>
      <Link
        href={`${base}/crm/candidates`}
        className="text-sm font-semibold text-blue-600 hover:underline"
      >
        {m.back}
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-black">{m.title}</h1>
      <p className="mt-1 max-w-3xl text-sm text-gray-600">{m.intro}</p>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>
      ) : null}

      {result ? (
        <section className={`${box} mt-6`}>
          <h2 className="text-lg font-bold text-black">{m.doneTitle}</h2>
          <p className="mt-2 text-sm text-gray-800">
            {m.doneText(result.imported, result.skipped)}
          </p>
          {result.failed ? (
            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              {m.partial(result.imported)}
            </p>
          ) : (
            <p className="mt-3 text-xs text-gray-500">{m.tip}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`${base}/crm/candidates`}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {m.viewCandidates}
            </Link>
            <button type="button" onClick={reset} className={ghost}>
              {m.importAnother}
            </button>
          </div>
        </section>
      ) : null}

      {!loaded && !result ? (
        <section className={`${box} mt-6`}>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            className="hidden"
            onChange={onFile}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={primary}
            >
              {m.chooseFile}
            </button>
            <button type="button" onClick={downloadTemplate} className={ghost}>
              {m.template}
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500">{m.fileHint}</p>
        </section>
      ) : null}

      {loaded ? (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-700">
            <span className="font-semibold">{m.readFile(fileName, data.length)}</span>
            <button type="button" onClick={reset} className={ghost}>
              {m.reset}
            </button>
          </div>

          {!existing ? (
            <p className="text-sm text-gray-500">{m.checking}</p>
          ) : null}
          {capped ? (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              {m.capNote}
            </p>
          ) : null}

          {map ? (
            <section className={box}>
              <h2 className="text-sm font-bold text-gray-900">{m.mapTitle}</h2>
              <p className="mt-1 text-xs text-gray-500">{m.mapHelp}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {FIELDS.map((f) => (
                  <label key={f} className="text-sm text-gray-700">
                    <span className="mb-1 block text-xs font-semibold text-gray-600">
                      {m.fields[f]}
                    </span>
                    <select
                      className={input}
                      value={map[f]}
                      onChange={(e) => setField(f, e.target.value)}
                    >
                      <option value={-1}>{m.none}</option>
                      {header.map((h, i) => (
                        <option key={i} value={i}>
                          {h || m.column(i + 1)}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              {!nameMapped ? (
                <p className="mt-3 text-sm text-red-700">{m.nameNeeded}</p>
              ) : null}
            </section>
          ) : null}

          {ready && nameMapped ? (
            <>
              <section className={box}>
                <h2 className="text-sm font-bold text-gray-900">{m.previewTitle}</h2>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">
                    {m.summaryNew(okRows.length)}
                  </span>
                  {count("dupExisting") > 0 ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                      {m.summaryDupExisting(count("dupExisting"))}
                    </span>
                  ) : null}
                  {count("dupFile") > 0 ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                      {m.summaryDupFile(count("dupFile"))}
                    </span>
                  ) : null}
                  {count("invalid") > 0 ? (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-red-800">
                      {m.summaryInvalid(count("invalid"))}
                    </span>
                  ) : null}
                </div>
                {emailsDropped > 0 ? (
                  <p className="mt-2 text-xs text-amber-800">
                    {m.emailsDropped(emailsDropped)}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-gray-500">{m.skippedNote}</p>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="px-2 py-2">{m.th.line}</th>
                        <th className="px-2 py-2">{m.th.name}</th>
                        <th className="px-2 py-2">{m.th.email}</th>
                        <th className="px-2 py-2">{m.th.phone}</th>
                        <th className="px-2 py-2">{m.th.status}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {preview.map((r) => (
                        <tr key={r.line}>
                          <td className="px-2 py-2 text-xs text-gray-500">{r.line}</td>
                          <td className="px-2 py-2 font-medium text-gray-900">
                            {r.name || "—"}
                          </td>
                          <td className="px-2 py-2 text-gray-700">{r.email || "—"}</td>
                          <td className="px-2 py-2 text-gray-700">{r.phone || "—"}</td>
                          <td className="px-2 py-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge[r.status]}`}
                            >
                              {m.statuses[r.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {m.showing(preview.length, analyzed.length)}
                </p>
              </section>

              <section className={box}>
                <h2 className="text-sm font-bold text-gray-900">{m.consentTitle}</h2>
                {okRows.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-600">{m.nothingToImport}</p>
                ) : (
                  <>
                    <label className="mt-3 flex items-start gap-2 text-sm text-gray-800">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                      />
                      <span>{m.consent}</span>
                    </label>
                    <button
                      type="button"
                      onClick={runImport}
                      disabled={!consent || running}
                      className={`${primary} mt-4`}
                    >
                      {running
                        ? m.importing(progress, okRows.length)
                        : m.importBtn(okRows.length)}
                    </button>
                  </>
                )}
              </section>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}