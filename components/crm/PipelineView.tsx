"use client";

import { DragEvent, FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCrm } from "@/components/crm/CrmShell";
import { STAGES, Stage } from "@/components/crm/text";

type Cand = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  headline: string | null;
};
type Row = {
  id: string;
  stage: Stage;
  candidate_id: string;
  candidates: Cand | Cand[] | null;
};
type Job = { id: string; title: string; client: string | null; location: string | null };
type Option = { id: string; full_name: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const label = "mb-1 block text-xs font-semibold text-gray-600";

const one = (c: Cand | Cand[] | null): Cand | null =>
  Array.isArray(c) ? c[0] ?? null : c;

const emptyNew = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  headline: "",
  source: "",
};

export default function PipelineView() {
  const { supabase, orgId, t, base } = useCrm();
  const params = useParams<{ id: string }>();
  const jobId = String(params.id ?? "");

  // undefined = still loading, null = not found
  const [job, setJob] = useState<Job | null | undefined>(undefined);
  const [rows, setRows] = useState<Row[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [existing, setExisting] = useState("");
  const [nc, setNc] = useState(emptyNew);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState<Stage | null>(null);

  const load = useCallback(async () => {
    if (!UUID.test(jobId)) {
      setJob(null);
      return;
    }

    const { data: j, error: je } = await supabase
      .from("jobs")
      .select("id,title,client,location")
      .eq("id", jobId)
      .eq("org_id", orgId)
      .maybeSingle();
    if (je) {
      console.error(je);
      setMsg(t.loadError);
      setJob(null);
      return;
    }
    if (!j) {
      setJob(null);
      return;
    }
    setJob(j as Job);

    const { data: apps, error: ae } = await supabase
      .from("applications")
      .select(
        "id,stage,candidate_id,candidates(id,full_name,email,phone,city,headline)"
      )
      .eq("job_id", jobId)
      .eq("org_id", orgId);
    if (ae) {
      console.error(ae);
      setMsg(t.loadError);
      return;
    }
    setRows((apps ?? []) as unknown as Row[]);

    const { data: cands } = await supabase
      .from("candidates")
      .select("id,full_name")
      .eq("org_id", orgId)
      .order("full_name")
      .limit(500);
    setOptions((cands ?? []) as Option[]);
  }, [supabase, orgId, jobId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg("");

    let candidateId = existing;

    if (!candidateId) {
      const name = nc.full_name.trim();
      if (name.length < 2) {
        setMsg(t.needName);
        return;
      }
      if (nc.email.trim() && !EMAIL.test(nc.email.trim())) {
        setMsg(t.badEmailField);
        return;
      }
      if (!consent) {
        setMsg(t.consentNeeded);
        return;
      }
    }

    setBusy(true);

    if (!candidateId) {
      const { data, error } = await supabase
        .from("candidates")
        .insert({
          org_id: orgId,
          full_name: nc.full_name.trim(),
          email: nc.email.trim() || null,
          phone: nc.phone.trim() || null,
          city: nc.city.trim() || null,
          headline: nc.headline.trim() || null,
          source: nc.source.trim() || null,
          consent_recorded: true,
        })
        .select("id")
        .single();
      if (error || !data) {
        console.error(error);
        setBusy(false);
        setMsg(t.saveError);
        return;
      }
      candidateId = data.id as string;
    }

    const { error: ae } = await supabase.from("applications").insert({
      org_id: orgId,
      job_id: jobId,
      candidate_id: candidateId,
      stage: "sourced",
    });
    setBusy(false);

    if (ae) {
      if (ae.code === "23505") setMsg(t.already);
      else {
        console.error(ae);
        setMsg(t.saveError);
      }
      return;
    }

    setExisting("");
    setNc(emptyNew);
    setConsent(false);
    setOpen(false);
    await load();
  }

  async function move(id: string, stage: Stage) {
    const before = rows;
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, stage } : r)));
    const { error } = await supabase
      .from("applications")
      .update({ stage })
      .eq("id", id)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setRows(before);
      setMsg(t.saveError);
    }
  }

  async function removeCard(id: string) {
    if (!window.confirm(t.removeConfirm)) return;
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function onDragStart(e: DragEvent<HTMLElement>, id: string) {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e: DragEvent<HTMLElement>, stage: Stage) {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData("text/plain");
    const row = rows.find((r) => r.id === id);
    if (row && row.stage !== stage) void move(id, stage);
  }

  if (job === undefined) {
    return <p className="text-sm text-gray-500">{t.loading}</p>;
  }
  if (job === null) {
    return (
      <div>
        <p className="text-sm text-gray-700">{t.jobNotFound}</p>
        <Link
          href={`${base}/crm`}
          className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
        >
          {t.back}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`${base}/crm`}
        className="text-sm font-semibold text-blue-600 hover:underline"
      >
        {t.back}
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black">{job.title}</h1>
          <p className="text-sm text-gray-600">
            {[job.client, job.location].filter(Boolean).join(" · ")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + {t.addCandidate}
        </button>
      </div>

      {msg ? <p className="mt-4 text-sm text-red-700">{msg}</p> : null}

      {open ? (
        <form
          onSubmit={submit}
          className="mt-5 rounded-xl border border-gray-200 bg-white p-4"
        >
          {options.length > 0 ? (
            <label className="block text-sm text-gray-700">
              <span className={label}>{t.pickExisting}</span>
              <select
                className={input}
                value={existing}
                onChange={(e) => setExisting(e.target.value)}
              >
                <option value="">—</option>
                {options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.full_name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {!existing ? (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {t.orNew}
              </p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <label className="text-sm text-gray-700 sm:col-span-2">
                  <span className={label}>{t.fullName}</span>
                  <input
                    className={input}
                    value={nc.full_name}
                    maxLength={160}
                    onChange={(e) => setNc({ ...nc, full_name: e.target.value })}
                  />
                </label>
                <label className="text-sm text-gray-700">
                  <span className={label}>Email</span>
                  <input
                    className={input}
                    value={nc.email}
                    maxLength={200}
                    onChange={(e) => setNc({ ...nc, email: e.target.value })}
                  />
                </label>
                <label className="text-sm text-gray-700">
                  <span className={label}>{t.phone}</span>
                  <input
                    className={input}
                    value={nc.phone}
                    maxLength={40}
                    onChange={(e) => setNc({ ...nc, phone: e.target.value })}
                  />
                </label>
                <label className="text-sm text-gray-700">
                  <span className={label}>{t.city}</span>
                  <input
                    className={input}
                    value={nc.city}
                    maxLength={120}
                    onChange={(e) => setNc({ ...nc, city: e.target.value })}
                  />
                </label>
                <label className="text-sm text-gray-700">
                  <span className={label}>{t.source}</span>
                  <input
                    className={input}
                    value={nc.source}
                    maxLength={120}
                    onChange={(e) => setNc({ ...nc, source: e.target.value })}
                  />
                </label>
                <label className="text-sm text-gray-700 sm:col-span-2">
                  <span className={label}>{t.headline}</span>
                  <input
                    className={input}
                    value={nc.headline}
                    maxLength={200}
                    onChange={(e) => setNc({ ...nc, headline: e.target.value })}
                  />
                </label>
              </div>
              <label className="mt-3 flex items-start gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>{t.consent}</span>
              </label>
            </>
          ) : null}

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {busy ? t.working : t.addToPipeline}
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

      <p className="mt-5 hidden text-xs text-gray-500 md:block">{t.dragHint}</p>

      <div className="mt-3 md:flex md:items-start md:gap-4 md:overflow-x-auto md:pb-4">
        {STAGES.map((stage) => {
          const col = rows.filter((r) => r.stage === stage);
          return (
            <section
              key={stage}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(stage);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => onDrop(e, stage)}
              className={`mb-4 rounded-xl border p-3 md:mb-0 md:w-64 md:shrink-0 ${
                col.length === 0 ? "hidden md:block" : ""
              } ${
                dragOver === stage
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <h2 className="flex items-center justify-between text-sm font-bold text-gray-800">
                {t.stages[stage]}
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-600">
                  {col.length}
                </span>
              </h2>

              <div className="mt-3 space-y-3">
                {col.length === 0 ? (
                  <p className="text-xs text-gray-400">{t.emptyColumn}</p>
                ) : (
                  col.map((r) => {
                    const c = one(r.candidates);
                    return (
                      <div
                        key={r.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, r.id)}
                        className="cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm active:cursor-grabbing"
                      >
                                                {c ? (
                          <Link
                            href={`${base}/crm/candidates/${c.id}`}
                            className="font-semibold text-black hover:text-blue-700 hover:underline"
                          >
                            {c.full_name}
                          </Link>
                        ) : (
                          <p className="font-semibold text-black">—</p>
                        )}
                        {c?.headline ? (
                          <p className="text-sm text-gray-600">{c.headline}</p>
                        ) : null}
                        <p className="mt-1 text-xs text-gray-500">
                          {[c?.city, c?.phone, c?.email]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        <select
                          aria-label={t.move}
                          value={r.stage}
                          onChange={(e) => move(r.id, e.target.value as Stage)}
                          className="mt-3 w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-black"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              {t.stages[s]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeCard(r.id)}
                          className="mt-2 text-xs font-semibold text-red-700 hover:underline"
                        >
                          {t.remove}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}