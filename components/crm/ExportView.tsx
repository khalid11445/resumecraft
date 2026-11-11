"use client";

import { useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmShell";
import { ET } from "@/components/crm/exportText";
import { Stage } from "@/components/crm/text";
import { csvText, downloadText, fetchAll } from "@/lib/exportdata";

type Cand = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  headline: string | null;
  source: string | null;
  consent_recorded: boolean;
  consent_note: string | null;
  created_at: string;
};
type App = { candidate_id: string; job_id: string; stage: string };
type Job = { id: string; title: string };
type Row = Record<string, unknown>;

type Msg = { tone: "ok" | "warn" | "error"; text: string };

const box = "rounded-xl border border-gray-200 bg-white p-5";
const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const primary =
  "rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50";

const tone: Record<Msg["tone"], string> = {
  ok: "bg-green-50 text-green-800",
  warn: "bg-amber-50 text-amber-900",
  error: "bg-red-50 text-red-800",
};

export default function ExportView() {
  const { supabase, orgId, orgName, t, lang, base, role, members } = useCrm();
  const m = ET[lang];

  const [separator, setSeparator] = useState(lang === "fr" ? ";" : ",");
  const [busy, setBusy] = useState<"csv" | "backup" | null>(null);
  const [msg, setMsg] = useState<Msg | null>(null);

  const canBackup = role === "owner" || role === "admin";
  const stamp = () => new Date().toISOString().slice(0, 10);

  async function exportCsv() {
    setBusy("csv");
    setMsg(null);
    try {
      const [c, a, j] = await Promise.all([
        fetchAll<Cand>(
          supabase,
          "candidates",
          "id,full_name,email,phone,city,headline,source,consent_recorded,consent_note,created_at",
          orgId
        ),
        fetchAll<App>(supabase, "applications", "candidate_id,job_id,stage", orgId),
        fetchAll<Job>(supabase, "jobs", "id,title", orgId),
      ]);

      const titles = new Map(j.rows.map((x) => [x.id, x.title]));
      const jobsBy = new Map<string, string[]>();
      a.rows.forEach((x) => {
        const title = titles.get(x.job_id);
        if (!title) return;
        const stage = t.stages[x.stage as Stage] ?? x.stage;
        const list = jobsBy.get(x.candidate_id) ?? [];
        list.push(`${title} (${stage})`);
        jobsBy.set(x.candidate_id, list);
      });

      const rows: string[][] = [
        m.csvHeader,
        ...c.rows.map((r) => [
          r.full_name,
          r.email ?? "",
          r.phone ?? "",
          r.city ?? "",
          r.headline ?? "",
          r.source ?? "",
          (jobsBy.get(r.id) ?? []).join("; "),
          r.consent_recorded ? m.yes : m.no,
          r.consent_note ?? "",
          r.created_at.slice(0, 10),
        ]),
      ];

      downloadText(
        csvText(rows, separator),
        "text/csv;charset=utf-8",
        `${m.csvFile}-${stamp()}.csv`
      );

      const truncated = c.truncated || a.truncated || j.truncated;
      setMsg(
        truncated
          ? { tone: "warn", text: `${m.doneCsv(c.rows.length)} ${m.truncated}` }
          : { tone: "ok", text: m.doneCsv(c.rows.length) }
      );
    } catch (err) {
      console.error(err);
      setMsg({ tone: "error", text: m.failed });
    } finally {
      setBusy(null);
    }
  }

  async function exportBackup() {
    setBusy("backup");
    setMsg(null);
    try {
      const [jobs, cands, apps, notes, tasks] = await Promise.all([
        fetchAll<Row>(
          supabase,
          "jobs",
          "id,title,client,location,status,description,created_by,created_at",
          orgId
        ),
        fetchAll<Row>(
          supabase,
          "candidates",
          "id,full_name,email,phone,city,headline,source,consent_recorded,consent_note,created_by,created_at",
          orgId
        ),
        fetchAll<Row>(
          supabase,
          "applications",
          "id,job_id,candidate_id,stage,created_at,updated_at",
          orgId
        ),
        fetchAll<Row>(
          supabase,
          "notes",
          "id,candidate_id,body,author_id,created_at",
          orgId
        ),
        fetchAll<Row>(
          supabase,
          "tasks",
          "id,candidate_id,title,due_on,done,assigned_to,created_by,created_at",
          orgId
        ),
      ]);

      const nameById = new Map(members.map((x) => [x.user_id, x.name]));
      const nameOf = (id: unknown) =>
        typeof id === "string" ? nameById.get(id) ?? null : null;

      const backup = {
        format: "resumecraft-crm-backup",
        version: 1,
        exportedAt: new Date().toISOString(),
        workspace: { name: orgName },
        members: members.map((x) => ({ name: x.name, email: x.email, role: x.role })),
        jobs: jobs.rows,
        candidates: cands.rows,
        applications: apps.rows,
        notes: notes.rows.map((r) => ({ ...r, author_name: nameOf(r.author_id) })),
        tasks: tasks.rows.map((r) => ({
          ...r,
          assigned_to_name: nameOf(r.assigned_to),
        })),
      };

      downloadText(
        JSON.stringify(backup, null, 2),
        "application/json",
        `${m.backupFile}-${stamp()}.json`
      );

      const truncated = [jobs, cands, apps, notes, tasks].some((x) => x.truncated);
      setMsg(
        truncated
          ? { tone: "warn", text: `${m.doneBackup} ${m.truncated}` }
          : { tone: "ok", text: m.doneBackup }
      );
    } catch (err) {
      console.error(err);
      setMsg({ tone: "error", text: m.failed });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <Link
        href={`${base}/crm/candidates`}
        className="text-sm font-semibold text-blue-600 hover:underline"
      >
        {m.back}
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-black">{m.title}</h1>
      <p className="mt-1 text-sm text-gray-600">{m.intro}</p>
      <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
        {m.warning}
      </p>

      {busy ? <p className="mt-4 text-sm text-gray-600">{m.working}</p> : null}
      {msg ? (
        <p className={`mt-4 rounded-lg p-3 text-sm ${tone[msg.tone]}`}>{msg.text}</p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className={box}>
          <h2 className="text-lg font-bold text-black">{m.csvTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{m.csvText}</p>

          <label className="mt-4 block text-sm text-gray-700">
            <span className="mb-1 block text-xs font-semibold text-gray-600">
              {m.sepLabel}
            </span>
            <select
              className={input}
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
            >
              <option value=";">{m.sepSemicolon}</option>
              <option value=",">{m.sepComma}</option>
            </select>
          </label>
          <p className="mt-2 text-xs text-gray-500">{m.sepHint}</p>

          <button
            type="button"
            onClick={exportCsv}
            disabled={busy !== null}
            className={`${primary} mt-4`}
          >
            {m.csvBtn}
          </button>
          <p className="mt-3 text-xs text-gray-500">{m.formulaNote}</p>
        </section>

        <section className={box}>
          <h2 className="text-lg font-bold text-black">{m.backupTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{m.backupText}</p>
          {canBackup ? (
            <button
              type="button"
              onClick={exportBackup}
              disabled={busy !== null}
              className={`${primary} mt-4`}
            >
              {m.backupBtn}
            </button>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{m.adminOnly}</p>
          )}
        </section>
      </div>
    </div>
  );
}