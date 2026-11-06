"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmShell";
import { HT } from "@/components/crm/homeText";
import { STAGES, Stage } from "@/components/crm/text";

type Cand = { id: string; full_name: string };
type TaskRow = {
  id: string;
  title: string;
  due_on: string | null;
  candidates: Cand | Cand[] | null;
};
type Recent = {
  id: string;
  full_name: string;
  headline: string | null;
  city: string | null;
};
type Data = {
  openJobs: number;
  candidates: number;
  stages: Record<Stage, number>;
  overdue: number;
  dueToday: number;
  next: TaskRow[];
  recent: Recent[];
};

const head = { count: "exact" as const, head: true };

const one = (c: Cand | Cand[] | null): Cand | null =>
  Array.isArray(c) ? c[0] ?? null : c;

function localISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const barColor: Record<Stage, string> = {
  sourced: "bg-slate-400",
  contacted: "bg-blue-400",
  interview: "bg-indigo-500",
  offer: "bg-amber-500",
  hired: "bg-green-500",
  rejected: "bg-gray-300",
};

export default function DashboardView() {
  const { supabase, orgId, orgName, t, lang, base } = useCrm();
  const h = HT[lang];
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  const [today, setToday] = useState<string | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setToday(localISO(new Date()));
  }, []);

  const load = useCallback(
    async (day: string) => {
      const [jobsQ, candQ, overdueQ, todayQ, nextQ, recentQ] = await Promise.all([
        supabase
          .from("jobs")
          .select("id", head)
          .eq("org_id", orgId)
          .eq("status", "open"),
        supabase.from("candidates").select("id", head).eq("org_id", orgId),
        supabase
          .from("tasks")
          .select("id", head)
          .eq("org_id", orgId)
          .eq("done", false)
          .lt("due_on", day),
        supabase
          .from("tasks")
          .select("id", head)
          .eq("org_id", orgId)
          .eq("done", false)
          .eq("due_on", day),
        supabase
          .from("tasks")
          .select("id,title,due_on,candidates(id,full_name)")
          .eq("org_id", orgId)
          .eq("done", false)
          .order("due_on", { ascending: true, nullsFirst: false })
          .limit(5),
        supabase
          .from("candidates")
          .select("id,full_name,headline,city")
          .eq("org_id", orgId)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const stageRes = await Promise.all(
        STAGES.map((s) =>
          supabase
            .from("applications")
            .select("id", head)
            .eq("org_id", orgId)
            .eq("stage", s)
        )
      );

      const failed = [jobsQ, candQ, overdueQ, todayQ, nextQ, recentQ, ...stageRes].find(
        (r) => r.error
      );
      if (failed) {
        console.error(failed.error);
        setError(true);
        return;
      }

      const stages = {} as Record<Stage, number>;
      STAGES.forEach((s, i) => {
        stages[s] = stageRes[i].count ?? 0;
      });

      setError(false);
      setData({
        openJobs: jobsQ.count ?? 0,
        candidates: candQ.count ?? 0,
        stages,
        overdue: overdueQ.count ?? 0,
        dueToday: todayQ.count ?? 0,
        next: (nextQ.data ?? []) as unknown as TaskRow[],
        recent: (recentQ.data ?? []) as Recent[],
      });
    },
    [supabase, orgId]
  );

  useEffect(() => {
    if (today) void load(today);
  }, [today, load]);

  const dateOnly = (iso: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return iso;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString(
      locale,
      { day: "numeric", month: "short" }
    );
  };

  if (error) return <p className="text-sm text-red-700">{t.loadError}</p>;
  if (!data) return <p className="text-sm text-gray-500">{t.loading}</p>;

  const active =
    data.stages.sourced +
    data.stages.contacted +
    data.stages.interview +
    data.stages.offer;
  const maxStage = Math.max(1, ...STAGES.map((s) => data.stages[s]));
  const totalPipeline = STAGES.reduce((n, s) => n + data.stages[s], 0);
  const dueCount = data.overdue + data.dueToday;
  const isEmpty = data.openJobs === 0 && data.candidates === 0;

  const card = (
    title: string,
    value: number,
    hint?: string,
    tone?: "alert"
  ) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </p>
      <p
        className={`mt-1 text-3xl font-bold ${
          tone === "alert" ? "text-red-700" : "text-black"
        }`}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-black">{h.welcome(orgName)}</h1>
      <p className="mt-1 text-sm text-gray-600">{h.dashIntro}</p>

      {isEmpty ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <h2 className="text-lg font-semibold text-black">{h.startTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            {h.startText}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href={`${base}/crm/jobs`}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {h.startJob}
            </Link>
            <Link
              href={`${base}/crm/candidates`}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              {h.startCand}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {card(h.statOpenJobs, data.openJobs)}
        {card(h.statCandidates, data.candidates)}
        {card(h.statActive, active, h.statActiveHint)}
        {card(
          h.statTasks,
          dueCount,
          h.statTasksHint(data.overdue, data.dueToday),
          data.overdue > 0 ? "alert" : undefined
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-bold text-gray-900">{h.byStage}</h2>
          {totalPipeline === 0 ? (
            <p className="mt-3 text-sm text-gray-500">{h.noPipeline}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {STAGES.map((s) => (
                <li key={s}>
                  <div className="flex items-center justify-between text-xs text-gray-700">
                    <span>{t.stages[s]}</span>
                    <span className="font-semibold">{data.stages[s]}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full ${barColor[s]}`}
                      style={{
                        width: `${
                          data.stages[s] === 0
                            ? 0
                            : Math.max(4, (data.stages[s] / maxStage) * 100)
                        }%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">{h.nextTasks}</h2>
              <Link
                href={`${base}/crm/tasks`}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {h.seeAll}
              </Link>
            </div>
            {data.next.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">{h.noNext}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {data.next.map((tk) => {
                  const c = one(tk.candidates);
                  const late = !!tk.due_on && !!today && tk.due_on < today;
                  return (
                    <li key={tk.id} className="flex items-start justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {tk.title}
                        </p>
                        {c ? (
                          <Link
                            href={`${base}/crm/candidates/${c.id}`}
                            className="text-xs text-blue-700 hover:underline"
                          >
                            {c.full_name}
                          </Link>
                        ) : null}
                      </div>
                      {tk.due_on ? (
                        <span
                          className={`shrink-0 text-xs font-semibold ${
                            late ? "text-red-700" : "text-gray-500"
                          }`}
                        >
                          {dateOnly(tk.due_on)}
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">{h.recent}</h2>
              <Link
                href={`${base}/crm/candidates`}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {h.seeAll}
              </Link>
            </div>
            {data.recent.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">{h.noRecent}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {data.recent.map((c) => (
                  <li key={c.id} className="text-sm">
                    <Link
                      href={`${base}/crm/candidates/${c.id}`}
                      className="font-medium text-gray-900 hover:text-blue-700 hover:underline"
                    >
                      {c.full_name}
                    </Link>
                    <span className="text-xs text-gray-500">
                      {" "}
                      {[c.headline, c.city].filter(Boolean).join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}