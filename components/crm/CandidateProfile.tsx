"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCrm } from "@/components/crm/CrmShell";
import { PT } from "@/components/crm/profileText";
import { Stage } from "@/components/crm/text";

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
};
type Note = {
  id: string;
  body: string;
  author_id: string | null;
  created_at: string;
};
type Task = {
  id: string;
  title: string;
  due_on: string | null;
  done: boolean;
  created_at: string;
};
type JobRef = { id: string; title: string; client: string | null };
type AppRow = {
  id: string;
  stage: Stage;
  job_id: string;
  jobs: JobRef | JobRef[] | null;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A number written without a country code (for example 0600000000) is read
// as a Moroccan number. Change this if your customers work in another country.
const DEFAULT_COUNTRY = "212";

const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const label = "mb-1 block text-xs font-semibold text-gray-600";
const box = "rounded-xl border border-gray-200 bg-white p-4";
const primary =
  "rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50";
const ghost =
  "rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50";

const jobOf = (j: JobRef | JobRef[] | null): JobRef | null =>
  Array.isArray(j) ? j[0] ?? null : j;

function localISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function whatsappLink(phone: string | null): string | null {
  if (!phone) return null;
  const raw = phone.trim();
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (!raw.startsWith("+")) {
    if (digits.startsWith("00")) digits = digits.slice(2);
    else if (digits.startsWith("0")) digits = DEFAULT_COUNTRY + digits.slice(1);
  }
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}`;
}

function telLink(phone: string | null): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.replace(/\D/g, "").length >= 6 ? `tel:${cleaned}` : null;
}

export default function CandidateProfile() {
  const { supabase, orgId, t, lang, base } = useCrm();
  const p = PT[lang];
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const candId = String(params.id ?? "");
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  // undefined = still loading, null = not found
  const [cand, setCand] = useState<Cand | null | undefined>(undefined);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [apps, setApps] = useState<AppRow[]>([]);
  const [jobOptions, setJobOptions] = useState<JobRef[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    headline: "",
    source: "",
    consent: false,
    consent_note: "",
  });
  const [noteText, setNoteText] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [pickJob, setPickJob] = useState("");
  const [showDone, setShowDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setToday(localISO(new Date()));
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, [supabase]);

  const load = useCallback(async () => {
    if (!UUID.test(candId)) {
      setCand(null);
      return;
    }

    const { data: c, error: ce } = await supabase
      .from("candidates")
      .select(
        "id,full_name,email,phone,city,headline,source,consent_recorded,consent_note"
      )
      .eq("id", candId)
      .eq("org_id", orgId)
      .maybeSingle();
    if (ce) {
      console.error(ce);
      setMsg(t.loadError);
      setCand(null);
      return;
    }
    if (!c) {
      setCand(null);
      return;
    }
    setCand(c as Cand);

    const [n, tk, ap, jb] = await Promise.all([
      supabase
        .from("notes")
        .select("id,body,author_id,created_at")
        .eq("candidate_id", candId)
        .eq("org_id", orgId)
        .order("created_at", { ascending: false }),
      supabase
        .from("tasks")
        .select("id,title,due_on,done,created_at")
        .eq("candidate_id", candId)
        .eq("org_id", orgId)
        .order("created_at", { ascending: false }),
      supabase
        .from("applications")
        .select("id,stage,job_id,jobs(id,title,client)")
        .eq("candidate_id", candId)
        .eq("org_id", orgId),
      supabase
        .from("jobs")
        .select("id,title,client")
        .eq("org_id", orgId)
        .neq("status", "closed")
        .order("created_at", { ascending: false }),
    ]);

    if (n.error || tk.error || ap.error || jb.error) {
      console.error(n.error ?? tk.error ?? ap.error ?? jb.error);
      setMsg(t.loadError);
    }
    setNotes((n.data ?? []) as Note[]);
    setTasks((tk.data ?? []) as Task[]);
    setApps((ap.data ?? []) as unknown as AppRow[]);
    setJobOptions((jb.data ?? []) as JobRef[]);
  }, [supabase, orgId, candId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const { openTasks, doneTasks } = useMemo(() => {
    const open = tasks
      .filter((x) => !x.done)
      .sort((a, b) => {
        if (a.due_on && b.due_on) {
          return a.due_on < b.due_on ? -1 : a.due_on > b.due_on ? 1 : 0;
        }
        if (a.due_on) return -1;
        if (b.due_on) return 1;
        return a.created_at < b.created_at ? 1 : -1;
      });
    return { openTasks: open, doneTasks: tasks.filter((x) => x.done) };
  }, [tasks]);

  const freeJobs = jobOptions.filter((j) => !apps.some((a) => a.job_id === j.id));

  const dateOnly = (iso: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return iso;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString(
      locale,
      { day: "numeric", month: "short", year: "numeric" }
    );
  };

  function startEdit() {
    if (!cand) return;
    setForm({
      full_name: cand.full_name,
      email: cand.email ?? "",
      phone: cand.phone ?? "",
      city: cand.city ?? "",
      headline: cand.headline ?? "",
      source: cand.source ?? "",
      consent: cand.consent_recorded,
      consent_note: cand.consent_note ?? "",
    });
    setMsg("");
    setEditing(true);
  }

  async function saveCandidate(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    if (form.full_name.trim().length < 2) {
      setMsg(t.needName);
      return;
    }
    if (form.email.trim() && !EMAIL.test(form.email.trim())) {
      setMsg(t.badEmailField);
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("candidates")
      .update({
        full_name: form.full_name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
        headline: form.headline.trim() || null,
        source: form.source.trim() || null,
        consent_recorded: form.consent,
        consent_note: form.consent_note.trim() || null,
      })
      .eq("id", candId)
      .eq("org_id", orgId);
    setBusy(false);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    setEditing(false);
    await load();
  }

  async function deleteCandidate() {
    if (!window.confirm(t.deleteCandConfirm)) return;
    const { error } = await supabase
      .from("candidates")
      .delete()
      .eq("id", candId)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    router.push(`${base}/crm/candidates`);
  }

  async function addNote(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    const body = noteText.trim();
    if (!body) {
      setMsg(p.needNote);
      return;
    }
    const { error } = await supabase
      .from("notes")
      .insert({ org_id: orgId, candidate_id: candId, body });
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    setNoteText("");
    await load();
  }

  async function deleteNote(id: string) {
    if (!window.confirm(p.deleteNoteConfirm)) return;
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  async function addTask(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    const title = taskTitle.trim();
    if (!title) {
      setMsg(p.needTask);
      return;
    }
    const { error } = await supabase.from("tasks").insert({
      org_id: orgId,
      candidate_id: candId,
      title,
      due_on: taskDue || null,
    });
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    setTaskTitle("");
    setTaskDue("");
    await load();
  }

  async function toggleTask(task: Task) {
    const before = tasks;
    setTasks((prev) =>
      prev.map((x) => (x.id === task.id ? { ...x, done: !x.done } : x))
    );
    const { error } = await supabase
      .from("tasks")
      .update({ done: !task.done })
      .eq("id", task.id)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setTasks(before);
      setMsg(t.saveError);
    }
  }

  async function deleteTask(id: string) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    setTasks((prev) => prev.filter((x) => x.id !== id));
  }

  async function addToJob() {
    if (!pickJob) return;
    setMsg("");
    const { error } = await supabase.from("applications").insert({
      org_id: orgId,
      job_id: pickJob,
      candidate_id: candId,
      stage: "sourced",
    });
    if (error) {
      if (error.code === "23505") setMsg(p.alreadyOnJob);
      else {
        console.error(error);
        setMsg(t.saveError);
      }
      return;
    }
    setPickJob("");
    await load();
  }

  if (cand === undefined) {
    return <p className="text-sm text-gray-500">{t.loading}</p>;
  }
  if (cand === null) {
    return (
      <div>
        <p className="text-sm text-gray-700">{p.notFound}</p>
        <Link
          href={`${base}/crm/candidates`}
          className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
        >
          {p.back}
        </Link>
      </div>
    );
  }

  const wa = whatsappLink(cand.phone);
  const tel = telLink(cand.phone);
  const mail = cand.email && EMAIL.test(cand.email) ? `mailto:${cand.email}` : null;

  return (
    <div>
      <Link
        href={`${base}/crm/candidates`}
        className="text-sm font-semibold text-blue-600 hover:underline"
      >
        {p.back}
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black">{cand.full_name}</h1>
          {cand.headline ? (
            <p className="text-sm text-gray-600">{cand.headline}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
            >
              {p.whatsapp}
            </a>
          ) : null}
          {tel ? (
            <a href={tel} className={ghost}>
              {p.call}
            </a>
          ) : null}
          {mail ? (
            <a href={mail} className={ghost}>
              {p.emailAction}
            </a>
          ) : null}
        </div>
      </div>

      {msg ? <p className="mt-4 text-sm text-red-700">{msg}</p> : null}

      {!cand.consent_recorded ? (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          {p.consentMissing}
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left column: details and jobs */}
        <div className="space-y-6 lg:col-span-1">
          <section className={box}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">{p.details}</h2>
              {!editing ? (
                <button type="button" onClick={startEdit} className={ghost}>
                  {p.edit}
                </button>
              ) : null}
            </div>

            {editing ? (
              <form onSubmit={saveCandidate} className="mt-3 space-y-3">
                <label className="block text-sm text-gray-700">
                  <span className={label}>{t.fullName}</span>
                  <input
                    className={input}
                    value={form.full_name}
                    maxLength={160}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                </label>
                <label className="block text-sm text-gray-700">
                  <span className={label}>Email</span>
                  <input
                    className={input}
                    value={form.email}
                    maxLength={200}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </label>
                <label className="block text-sm text-gray-700">
                  <span className={label}>{t.phone}</span>
                  <input
                    className={input}
                    value={form.phone}
                    maxLength={40}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </label>
                <label className="block text-sm text-gray-700">
                  <span className={label}>{t.city}</span>
                  <input
                    className={input}
                    value={form.city}
                    maxLength={120}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </label>
                <label className="block text-sm text-gray-700">
                  <span className={label}>{t.headline}</span>
                  <input
                    className={input}
                    value={form.headline}
                    maxLength={200}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  />
                </label>
                <label className="block text-sm text-gray-700">
                  <span className={label}>{t.source}</span>
                  <input
                    className={input}
                    value={form.source}
                    maxLength={120}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                  />
                </label>
                <label className="flex items-start gap-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  />
                  <span>{p.consentLabel}</span>
                </label>
                <label className="block text-sm text-gray-700">
                  <span className={label}>{p.consentNoteLabel}</span>
                  <input
                    className={input}
                    value={form.consent_note}
                    maxLength={500}
                    onChange={(e) =>
                      setForm({ ...form, consent_note: e.target.value })
                    }
                  />
                </label>
                <div className="flex gap-2">
                  <button type="submit" disabled={busy} className={primary}>
                    {busy ? t.working : t.save}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className={ghost}
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            ) : (
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  ["Email", cand.email],
                  [t.phone, cand.phone],
                  [t.city, cand.city],
                  [t.source, cand.source],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <dt className="text-xs font-semibold text-gray-500">{k}</dt>
                    <dd className="text-gray-900">{v || "—"}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-xs font-semibold text-gray-500">
                    {cand.consent_recorded ? t.consentYes : t.consentNo}
                  </dt>
                  {cand.consent_note ? (
                    <dd className="text-gray-900">{cand.consent_note}</dd>
                  ) : null}
                </div>
              </dl>
            )}
          </section>

          <section className={box}>
            <h2 className="text-sm font-bold text-gray-900">{p.jobs}</h2>
            {apps.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">{p.noJobs}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {apps.map((a) => {
                  const j = jobOf(a.jobs);
                  return (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      {j ? (
                        <Link
                          href={`${base}/crm/jobs/${j.id}`}
                          className="truncate font-semibold text-blue-700 hover:underline"
                        >
                          {j.title}
                        </Link>
                      ) : (
                        <span>—</span>
                      )}
                      <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                        {t.stages[a.stage]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            {freeJobs.length > 0 ? (
              <div className="mt-4">
                <span className={label}>{p.addToJob}</span>
                <div className="flex gap-2">
                  <select
                    className={input}
                    value={pickJob}
                    onChange={(e) => setPickJob(e.target.value)}
                  >
                    <option value="">{p.pickJob}</option>
                    {freeJobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                        {j.client ? ` · ${j.client}` : ""}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addToJob}
                    disabled={!pickJob}
                    className={primary}
                  >
                    {p.addBtn}
                  </button>
                </div>
              </div>
            ) : null}
          </section>

          <button
            type="button"
            onClick={deleteCandidate}
            className="text-xs font-semibold text-red-700 hover:underline"
          >
            {p.deleteCandidate}
          </button>
        </div>

        {/* Right column: tasks and notes */}
        <div className="space-y-6 lg:col-span-2">
          <section className={box}>
            <h2 className="text-sm font-bold text-gray-900">{p.tasks}</h2>

            <form onSubmit={addTask} className="mt-3 flex flex-wrap items-end gap-2">
              <label className="min-w-[12rem] flex-1 text-sm text-gray-700">
                <span className={label}>{p.taskLabel}</span>
                <input
                  className={input}
                  value={taskTitle}
                  maxLength={200}
                  placeholder={p.taskPlaceholder}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </label>
              <label className="text-sm text-gray-700">
                <span className={label}>{p.dueLabel}</span>
                <input
                  type="date"
                  className={input}
                  value={taskDue}
                  onChange={(e) => setTaskDue(e.target.value)}
                />
              </label>
              <button type="submit" className={primary}>
                {p.addTask}
              </button>
            </form>

            {openTasks.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">{p.noTasks}</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {openTasks.map((task) => {
                  const late = !!task.due_on && !!today && task.due_on < today;
                  const isToday = !!task.due_on && task.due_on === today;
                  return (
                    <li
                      key={task.id}
                      className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={task.done}
                        onChange={() => toggleTask(task)}
                        aria-label={task.title}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {task.title}
                        </p>
                        {task.due_on ? (
                          <p className="text-xs text-gray-500">
                            {dateOnly(task.due_on)}
                          </p>
                        ) : null}
                      </div>
                      {late ? (
                        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                          {p.overdue}
                        </span>
                      ) : isToday ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                          {p.dueToday}
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="text-xs font-semibold text-red-700 hover:underline"
                      >
                        {p.deleteTask}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {doneTasks.length > 0 ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowDone((v) => !v)}
                  className="text-xs font-semibold text-gray-600 hover:underline"
                >
                  {showDone ? "▾" : "▸"} {p.completed(doneTasks.length)}
                </button>
                {showDone ? (
                  <ul className="mt-2 space-y-2">
                    {doneTasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center gap-3 text-sm text-gray-500"
                      >
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleTask(task)}
                          aria-label={task.title}
                        />
                        <span className="flex-1 line-through">{task.title}</span>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="text-xs font-semibold text-red-700 hover:underline"
                        >
                          {p.deleteTask}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className={box}>
            <h2 className="text-sm font-bold text-gray-900">{p.notes}</h2>

            <form onSubmit={addNote} className="mt-3">
              <textarea
                className={input}
                rows={3}
                value={noteText}
                maxLength={5000}
                placeholder={p.notePlaceholder}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">{p.noteHint}</p>
              <button type="submit" className={`${primary} mt-2`}>
                {p.addNote}
              </button>
            </form>

            {notes.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">{p.noNotes}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {notes.map((n) => {
                  const mine = !!userId && n.author_id === userId;
                  return (
                    <li
                      key={n.id}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                      <p className="whitespace-pre-wrap text-sm text-gray-900">
                        {n.body}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {mine ? p.you : p.teammate} ·{" "}
                          {new Date(n.created_at).toLocaleString(locale, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        {mine ? (
                          <button
                            type="button"
                            onClick={() => deleteNote(n.id)}
                            className="font-semibold text-red-700 hover:underline"
                          >
                            {t.del}
                          </button>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}