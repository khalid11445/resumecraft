"use client";

import { useCallback, useEffect, useState } from "react";
import { useCrm } from "@/components/crm/CrmShell";
import { PLT } from "@/components/crm/planText";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/contact";

type PlanId = "free" | "team";
type Status = {
  plan: PlanId;
  valid_until: string | null;
  max_candidates: number | null;
  max_members: number | null;
  max_files: number | null;
  candidates: number;
  members: number;
  files: number;
  pending_invites: number;
};
type Limit = {
  plan: PlanId;
  max_candidates: number | null;
  max_members: number | null;
  max_files: number | null;
};

const box = "rounded-xl border border-gray-200 bg-white p-5";
const DAY = 86_400_000;

export default function PlanView() {
  const { supabase, orgId, orgName, lang, role } = useCrm();
  const m = PLT[lang];
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  const [status, setStatus] = useState<Status | null>(null);
  const [limits, setLimits] = useState<Limit[]>([]);
  const [error, setError] = useState(false);
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNowMs(Date.now());
  }, []);

  const load = useCallback(async () => {
    const [s, l] = await Promise.all([
      supabase.rpc("org_plan_status", { p_org: orgId }),
      supabase.from("plan_limits").select("plan,max_candidates,max_members,max_files"),
    ]);
    if (s.error || l.error || !s.data) {
      console.error(s.error ?? l.error);
      setError(true);
      return;
    }
    setError(false);
    setStatus(s.data as Status);
    setLimits((l.data ?? []) as Limit[]);
  }, [supabase, orgId]);

  useEffect(() => {
    void load();
  }, [load]);

  const dateText = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const valueText = (v: number | null) => (v === null ? m.unlimited : String(v));

  function usageRow(label: string, used: number, max: number | null) {
    const pct = max === null || max === 0 ? 0 : Math.min(100, (used / max) * 100);
    const over = max !== null && used > max;
    const full = max !== null && used >= max;
    const near = max !== null && !full && used >= max * 0.8;

    return (
      <div key={label}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-900">{label}</span>
          <span className="text-gray-700">
            {max === null ? `${used} · ${m.unlimited}` : m.of(used, max)}
          </span>
        </div>
        {max !== null ? (
          <div className="mt-1 h-2 rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full ${
                full ? "bg-red-500" : near ? "bg-amber-500" : "bg-blue-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        ) : null}
        {over ? (
          <p className="mt-1 text-xs text-red-700">{m.over}</p>
        ) : near ? (
          <p className="mt-1 text-xs text-amber-700">{m.near}</p>
        ) : null}
      </div>
    );
  }

  async function copyId() {
    try {
      await navigator.clipboard.writeText(orgId);
      setCopied(true);
    } catch {
      // the id stays visible on the page, so it can be copied by hand
    }
  }

  if (error) return <p className="text-sm text-red-700">{m.loadError}</p>;
  if (!status) return <p className="text-sm text-gray-500">…</p>;

  const isPro = status.plan === "team";
  const canUpgrade = role === "owner" || role === "admin";
  const contactReady = !/example\.com$/i.test(CONTACT_EMAIL.trim());

  const endMs = status.valid_until ? new Date(status.valid_until).getTime() : null;
  const expired = !isPro && endMs !== null && nowMs !== null && endMs < nowMs;
  const daysLeft =
    isPro && endMs !== null && nowMs !== null
      ? Math.ceil((endMs - nowMs) / DAY)
      : null;
  const endsSoon = daysLeft !== null && daysLeft <= 30;

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    m.mailSubject(orgName)
  )}&body=${encodeURIComponent(m.mailBody(orgName, orgId))}`;
  const wa = WHATSAPP_NUMBER.replace(/\D/g, "");
  const waLink = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent(m.waText(orgName))}`
    : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-black">{m.title}</h1>
      <p className="mt-1 text-sm text-gray-600">{m.intro}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className={box}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {m.current}
          </p>
          <p className="mt-1 text-3xl font-bold text-black">
            {m.planNames[status.plan]}
          </p>
          {isPro ? (
            <p className="mt-1 text-sm text-gray-600">
              {status.valid_until ? m.activeUntil(dateText(status.valid_until)) : m.noEnd}
            </p>
          ) : null}
          {expired && status.valid_until ? (
            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              {m.expiredOn(dateText(status.valid_until))}
            </p>
          ) : null}
          {endsSoon && status.valid_until && daysLeft !== null ? (
            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              {m.endsSoon(dateText(status.valid_until), daysLeft)}
            </p>
          ) : null}

          <h2 className="mt-6 text-sm font-bold text-gray-900">{m.usage}</h2>
          <div className="mt-3 space-y-4">
            {usageRow(m.candidates, status.candidates, status.max_candidates)}
            {usageRow(m.members, status.members, status.max_members)}
            {usageRow(m.files, status.files, status.max_files)}
          </div>
          {status.pending_invites > 0 ? (
            <p className="mt-3 text-xs text-gray-500">{m.pending(status.pending_invites)}</p>
          ) : null}
        </section>

        <section className={box}>
          <h2 className="text-sm font-bold text-gray-900">{m.compareTitle}</h2>
          <table className="mt-3 w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="py-2">{m.colPlan}</th>
                <th className="py-2">{m.candidates}</th>
                <th className="py-2">{m.members}</th>
                <th className="py-2">{m.files}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(["free", "team"] as PlanId[]).map((p) => {
                const l = limits.find((x) => x.plan === p);
                return (
                  <tr key={p} className={status.plan === p ? "bg-blue-50" : ""}>
                    <td className="py-2 font-semibold text-gray-900">
                      {m.planNames[p]}
                      {status.plan === p ? (
                        <span className="ml-2 text-xs font-normal text-blue-700">
                          ({m.you})
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2 text-gray-700">
                      {l ? valueText(l.max_candidates) : "—"}
                    </td>
                                        <td className="py-2 text-gray-700">
                      {l ? valueText(l.max_members) : "—"}
                    </td>
                    <td className="py-2 text-gray-700">
                      {l ? valueText(l.max_files) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>

      {!isPro ? (
        <section className={`${box} mt-6`}>
          <h2 className="text-lg font-bold text-black">{m.upgradeTitle}</h2>
          {canUpgrade ? (
            <>
              <p className="mt-2 max-w-3xl text-sm text-gray-700">{m.upgradeText}</p>
              <p className="mt-2 text-xs text-gray-500">{m.upgradeNote}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-xs font-semibold text-gray-600">{m.wsId}</span>
                <code className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
                  {orgId}
                </code>
                <button
                  type="button"
                  onClick={copyId}
                  className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                >
                  {copied ? `✓ ${m.copied}` : m.copy}
                </button>
              </div>

              {contactReady ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={mailto}
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    {m.emailBtn}
                  </a>
                  {waLink ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      {m.whatsappBtn}
                    </a>
                  ) : null}
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">{m.notReady}</p>
              )}
            </>
          ) : (
            <p className="mt-2 text-sm text-gray-600">{m.ownerOnly}</p>
          )}
        </section>
      ) : null}
    </div>
  );
}