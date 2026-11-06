"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmShell";
import { HT } from "@/components/crm/homeText";

type Cand = { id: string; full_name: string };
type TaskRow = {
  id: string;
  title: string;
  due_on: string | null;
  done: boolean;
  candidate_id: string | null;
  candidates: Cand | Cand[] | null;
};
type Group = "overdue" | "today" | "upcoming" | "nodate";

const GROUPS: Group[] = ["overdue", "today", "upcoming", "nodate"];
const SELECT = "id,title,due_on,done,candidate_id,candidates(id,full_name)";

const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const label = "mb-1 block text-xs font-semibold text-gray-600";

const groupTone: Record<Group, string> = {
  overdue: "text-red-700",
  today: "text-amber-700",
  upcoming: "text-gray-800",
  nodate: "text-gray-500",
};

const one = (c: Cand | Cand[] | null): Cand | null =>
  Array.isArray(c) ? c[0] ?? null : c;

function localISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export default function TasksView() {
  const { supabase, orgId, t, lang, base } = useCrm();
  const h = HT[lang];
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  const [today, setToday] = useState<string | null>(null);
  const [open, setOpen] = useState<TaskRow[] | null>(null);
  const [done, setDone] = useState<TaskRow[] | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [options, setOptions] = useState<Cand[]>([]);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [candidate, setCandidate] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setToday(localISO(new Date()));
  }, []);

  const load = useCallback(async () => {
    const [o, c] = await Promise.all([
      supabase
        .from("tasks")
        .select(SELECT)
        .eq("org_id", orgId)
        .eq("done", false)
        .order("due_on", { ascending: true, nullsFirst: false })
        .limit(500),
      supabase
        .from("candidates")
        .select("id,full_name")
        .eq("org_id", orgId)
        .order("full_name")
        .limit(500),
    ]);
    if (o.error || c.error) {
      console.error(o.error ?? c.error);
      setMsg(t.loadError);
      setOpen([]);
      return;
    }
    setOpen((o.data ?? []) as unknown as TaskRow[]);
    setOptions((c.data ?? []) as Cand[]);
  }, [supabase, orgId, t]);

  const loadDone = useCallback(async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select(SELECT)
      .eq("org_id", orgId)
      .eq("done", true)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) {
      console.error(error);
      setMsg(t.loadError);
      setDone([]);
      return;
    }
    setDone((data ?? []) as unknown as TaskRow[]);
  }, [supabase, orgId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (showDone) void loadDone();
  }, [showDone, loadDone]);

  const groups = useMemo(() => {
    const g: Record<Group, TaskRow[]> = {
      overdue: [],
      today: [],
      upcoming: [],
      nodate: [],
    };
    (open ?? []).forEach((tk) => {
      if (!tk.due_on) g.nodate.push(tk);
      else if (!today) g.upcoming.push(tk);
      else if (tk.due_on < today) g.overdue.push(tk);
      else if (tk.due_on === today) g.today.push(tk);
      else g.upcoming.push(tk);
    });
    return g;
  }, [open, today]);

  const dateOnly = (iso: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return iso;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString(
      locale,
      { day: "numeric", month: "short", year: "numeric" }
    );
  };

  async function addTask(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    const text = title.trim();
    if (!text) {
      setMsg(h.needTask);
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("tasks").insert({
      org_id: orgId,
      candidate_id: candidate || null,
      title: text,
      due_on: due || null,
    });
    setBusy(false);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    setTitle("");
    setDue("");
    setCandidate("");
    await load();
  }

  async function toggle(tk: TaskRow) {
    setMsg("");
    const { error } = await supabase
      .from("tasks")
      .update({ done: !tk.done })
      .eq("id", tk.id)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    await load();
    if (showDone) await loadDone();
  }

  async function remove(tk: TaskRow) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", tk.id)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    setOpen((prev) => (prev ?? []).filter((x) => x.id !== tk.id));
    setDone((prev) => (prev ? prev.filter((x) => x.id !== tk.id) : prev));
  }

  const row = (tk: TaskRow) => {
    const c = one(tk.candidates);
    return (
      <li
        key={tk.id}
        className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
      >
        <input
          type="checkbox"
          className="mt-1"
          checked={tk.done}
          onChange={() => toggle(tk)}
          aria-label={tk.title}
        />
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium ${
              tk.done ? "text-gray-400 line-through" : "text-gray-900"
            }`}
          >
            {tk.title}
          </p>
          <p className="text-xs text-gray-500">
            {c ? (
              <Link
                href={`${base}/crm/candidates/${c.id}`}
                className="text-blue-700 hover:underline"
              >
                {c.full_name}
              </Link>
            ) : null}
            {c && tk.due_on ? " · " : ""}
            {tk.due_on ? dateOnly(tk.due_on) : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => remove(tk)}
          className="text-xs font-semibold text-red-700 hover:underline"
        >
          {h.deleteTask}
        </button>
      </li>
    );
  };

  const total = (open ?? []).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-black">{h.tasksTitle}</h1>
      <p className="mt-1 text-sm text-gray-600">{h.tasksIntro}</p>

      <form
        onSubmit={addTask}
        className="mt-5 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <label className="text-sm text-gray-700 lg:col-span-2">
          <span className={label}>{h.taskLabel}</span>
          <input
            className={input}
            value={title}
            maxLength={200}
            placeholder={h.taskPlaceholder}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="text-sm text-gray-700">
          <span className={label}>{h.forCandidate}</span>
          <select
            className={input}
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
          >
            <option value="">{h.noCandidate}</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.full_name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-gray-700">
          <span className={label}>{h.dueLabel}</span>
          <input
            type="date"
            className={input}
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </label>
        <div className="sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            disabled={busy}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? t.working : `+ ${h.addTask}`}
          </button>
        </div>
      </form>

      {msg ? <p className="mt-4 text-sm text-red-700">{msg}</p> : null}

      {open === null ? (
        <p className="mt-6 text-sm text-gray-500">{t.loading}</p>
      ) : total === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600">
          {h.allClear}
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {GROUPS.map((g) =>
            groups[g].length === 0 ? null : (
              <section key={g}>
                <h2
                  className={`mb-2 text-sm font-bold uppercase tracking-wider ${groupTone[g]}`}
                >
                  {h.groups[g]} · {groups[g].length}
                </h2>
                <ul className="space-y-2">{groups[g].map(row)}</ul>
              </section>
            )
          )}
        </div>
      )}

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setShowDone((v) => !v)}
          className="text-sm font-semibold text-gray-600 hover:underline"
        >
          {showDone ? "▾" : "▸"} {showDone ? h.hideDone : h.showDone}
        </button>
        {showDone ? (
          <div className="mt-3">
            <h2 className="mb-2 text-sm font-bold text-gray-700">{h.doneTitle}</h2>
            {done === null ? (
              <p className="text-sm text-gray-500">{t.loading}</p>
            ) : done.length === 0 ? (
              <p className="text-sm text-gray-500">{h.noDone}</p>
            ) : (
              <ul className="space-y-2">{done.map(row)}</ul>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}