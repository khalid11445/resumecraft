"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmShell";
import { JOB_STATUSES, JobStatus } from "@/components/crm/text";

type Job = {
  id: string;
  title: string;
  client: string | null;
  location: string | null;
  status: JobStatus;
  created_at: string;
};

const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const label = "mb-1 block text-xs font-semibold text-gray-600";

const badge: Record<JobStatus, string> = {
  open: "bg-green-100 text-green-800",
  on_hold: "bg-amber-100 text-amber-800",
  closed: "bg-gray-200 text-gray-700",
};

export default function JobsView() {
  const { supabase, orgId, t, base, lang } = useCrm();

  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    client: "",
    location: "",
    status: "open" as JobStatus,
  });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("id,title,client,location,status,created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      setMsg(t.loadError);
      setJobs([]);
      return;
    }
    setJobs((data ?? []) as Job[]);
  }, [supabase, orgId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    if (form.title.trim().length < 2) {
      setMsg(t.needTitle);
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("jobs").insert({
      org_id: orgId,
      title: form.title.trim(),
      client: form.client.trim() || null,
      location: form.location.trim() || null,
      status: form.status,
    });
    setBusy(false);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    setForm({ title: "", client: "", location: "", status: "open" });
    setOpen(false);
    await load();
  }

  async function remove(id: string) {
    if (!window.confirm(t.deleteJobConfirm)) return;
    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    await load();
  }

  const dateText = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black">{t.jobsTitle}</h1>
          <p className="mt-1 text-sm text-gray-600">{t.jobsIntro}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + {t.addJob}
        </button>
      </div>

      {msg ? <p className="mt-4 text-sm text-red-700">{msg}</p> : null}

      {open ? (
        <form
          onSubmit={submit}
          className="mt-5 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2"
        >
          <label className="text-sm text-gray-700 sm:col-span-2">
            <span className={label}>{t.jobTitle}</span>
            <input
              className={input}
              value={form.title}
              maxLength={160}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="text-sm text-gray-700">
            <span className={label}>{t.client}</span>
            <input
              className={input}
              value={form.client}
              maxLength={160}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
            />
          </label>
          <label className="text-sm text-gray-700">
            <span className={label}>{t.location}</span>
            <input
              className={input}
              value={form.location}
              maxLength={120}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </label>
          <label className="text-sm text-gray-700">
            <span className={label}>{t.statusLabel}</span>
            <select
              className={input}
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as JobStatus })
              }
            >
              {JOB_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t.jobStatuses[s]}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {busy ? t.working : t.save}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {t.cancel}
            </button>
          </div>
        </form>
      ) : null}

      {jobs === null ? (
        <p className="mt-8 text-sm text-gray-500">{t.loading}</p>
      ) : jobs.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600">
          {t.jobsEmpty}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {jobs.map((j) => (
            <li
              key={j.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-black">{j.title}</p>
                <p className="truncate text-sm text-gray-600">
                  {[j.client, j.location].filter(Boolean).join(" · ")}
                </p>
                <p className="text-xs text-gray-400">{dateText(j.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge[j.status]}`}
                >
                  {t.jobStatuses[j.status]}
                </span>
                <Link
                  href={`${base}/crm/jobs/${j.id}`}
                  className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                >
                  {t.openPipeline}
                </Link>
                <button
                  type="button"
                  onClick={() => remove(j.id)}
                  className="text-xs font-semibold text-red-700 hover:underline"
                >
                  {t.del}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}