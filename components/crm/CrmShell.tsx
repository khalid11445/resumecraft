"use client";

import {
  FormEvent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { Lang } from "@/lib/labels";
import { CT, Tx } from "@/components/crm/text";
import { HT } from "@/components/crm/homeText";
import { TMT } from "@/components/crm/teamText";

export type Role = "owner" | "admin" | "member";
export type Member = { user_id: string; role: Role; name: string; email: string };

type Ctx = {
  supabase: SupabaseClient;
  orgId: string;
  orgName: string;
  lang: Lang;
  t: Tx;
  base: string;
  userId: string;
  role: Role;
  members: Member[];
  nameOf: (id: string | null) => string;
  reloadMembers: () => Promise<void>;
};

const CrmContext = createContext<Ctx | null>(null);

export function useCrm(): Ctx {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used inside CrmShell");
  return ctx;
}

type Status = "loading" | "ready" | "noorg" | "error" | "config";
type OrgRef = { id: string; name: string; role: Role };

const ORG_KEY = "rc_org";
const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";

export default function CrmShell({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const t = CT[lang];
  const h = HT[lang];
  const tm = TMT[lang];
  const base = lang === "fr" ? "/fr" : "";
  const router = useRouter();
  const pathname = usePathname() || "";
  const supabase = useMemo(
    () => (supabaseConfigured ? createClient() : null),
    []
  );

  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [orgs, setOrgs] = useState<OrgRef[]>([]);
  const [orgId, setOrgId] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [orgName, setOrgName] = useState("");
  const [orgMsg, setOrgMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("config");
      return;
    }

    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      router.replace(`${base}/login`);
      return;
    }
    setUserId(u.user.id);
    setEmail(u.user.email ?? "");

    const { data, error } = await supabase
      .from("memberships")
      .select("org_id, role, organizations(name)")
      .eq("user_id", u.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }

    const list: OrgRef[] = (data ?? []).map((row) => {
      const r = row as unknown as {
        org_id: string;
        role: Role;
        organizations: { name: string } | { name: string }[] | null;
      };
      const rel = Array.isArray(r.organizations)
        ? r.organizations[0]
        : r.organizations;
      return { id: r.org_id, role: r.role, name: rel?.name ?? "" };
    });

    if (list.length === 0) {
      setStatus("noorg");
      return;
    }

    let stored = "";
    try {
      stored = window.localStorage.getItem(ORG_KEY) ?? "";
    } catch {
      // storage blocked: the first workspace is used
    }
    const chosen = list.find((o) => o.id === stored) ?? list[0];

    setOrgs(list);
    setOrgId(chosen.id);
    setStatus("ready");
  }, [supabase, router, base]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadMembers = useCallback(
    async (id: string) => {
      if (!supabase || !id) return;

      const { data: ms, error } = await supabase
        .from("memberships")
        .select("user_id, role")
        .eq("org_id", id);
      if (error || !ms) {
        console.error(error);
        return;
      }

      const ids = ms.map((m) => m.user_id as string);
      const { data: ps } = await supabase
        .from("profiles")
        .select("id, email, display_name")
        .in("id", ids);

      const byId = new Map<string, { email: string; name: string }>();
      (ps ?? []).forEach((p) => {
        const row = p as { id: string; email: string | null; display_name: string | null };
        byId.set(row.id, { email: row.email ?? "", name: row.display_name ?? "" });
      });

      setMembers(
        ms.map((m) => {
          const info = byId.get(m.user_id as string);
          const mail = info?.email ?? "";
          return {
            user_id: m.user_id as string,
            role: m.role as Role,
            email: mail,
            name: info?.name || mail.split("@")[0] || "—",
          };
        })
      );
    },
    [supabase]
  );

  useEffect(() => {
    if (orgId) void loadMembers(orgId);
  }, [orgId, loadMembers]);

  function switchOrg(id: string) {
    setMembers([]);
    setOrgId(id);
    try {
      window.localStorage.setItem(ORG_KEY, id);
    } catch {
      // ignore
    }
  }

  async function createOrg(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    if (orgName.trim().length < 2) {
      setOrgMsg(t.orgError);
      return;
    }
    setBusy(true);
    setOrgMsg("");
    const { error } = await supabase.rpc("create_organization", {
      org_name: orgName.trim(),
    });
    setBusy(false);
    if (error) {
      console.error(error);
      setOrgMsg(t.orgError);
      return;
    }
    setStatus("loading");
    await load();
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.replace(`${base}/login`);
    router.refresh();
  }

  const notice = (text: string) => (
    <p className="mx-auto max-w-xl px-6 py-16 text-center text-sm text-gray-600">
      {text}
    </p>
  );

  if (status === "config") return notice(t.configError);
  if (status === "error") return notice(t.loadError);
  if (status === "loading") return notice(t.loading);

  if (status === "noorg") {
    return (
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-2xl font-bold text-black">{t.orgTitle}</h1>
        <p className="mt-2 text-sm text-gray-600">{t.orgText}</p>
        <form onSubmit={createOrg} className="mt-6 space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            {t.orgName}
            <input
              className={`${input} mt-1`}
              value={orgName}
              maxLength={120}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </label>
          {orgMsg ? <p className="text-sm text-red-700">{orgMsg}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? t.working : t.orgCreate}
          </button>
        </form>
      </main>
    );
  }

  const current = orgs.find((o) => o.id === orgId);
  if (!supabase || !current) return null;

  // The path without the language prefix, so "/fr/crm/jobs" reads "/crm/jobs"
  const p = pathname.startsWith("/fr") ? pathname.slice(3) || "/" : pathname;

  const nav = [
    { href: `${base}/crm`, label: h.navDashboard, active: p === "/crm" || p === "/crm/" },
    { href: `${base}/crm/jobs`, label: t.navJobs, active: p.startsWith("/crm/jobs") },
    {
      href: `${base}/crm/candidates`,
      label: t.navCandidates,
      active: p.startsWith("/crm/candidates"),
    },
    { href: `${base}/crm/tasks`, label: h.navTasks, active: p.startsWith("/crm/tasks") },
    { href: `${base}/crm/team`, label: tm.navTeam, active: p.startsWith("/crm/team") },
  ];

  const link = (active: boolean) =>
    `rounded px-3 py-1.5 text-sm font-semibold ${
      active ? "bg-slate-900 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  const nameOf = (id: string | null) =>
    id ? members.find((m) => m.user_id === id)?.name ?? "" : "";

  return (
    <CrmContext.Provider
      value={{
        supabase,
        orgId: current.id,
        orgName: current.name,
        lang,
        t,
        base,
        userId,
        role: current.role,
        members,
        nameOf,
        reloadMembers: () => loadMembers(current.id),
      }}
    >
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {orgs.length > 1 ? (
              <select
                aria-label={tm.switchWorkspace}
                value={orgId}
                onChange={(e) => switchOrg(e.target.value)}
                className="mr-2 rounded border border-gray-300 bg-white px-2 py-1 text-sm font-bold text-black"
              >
                {orgs.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="mr-2 text-sm font-bold text-black">{current.name}</span>
            )}
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={link(n.active)}>
                {n.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="hidden sm:inline">{email}</span>
            <button
              type="button"
              onClick={signOut}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-50"
            >
              {t.signOut}
            </button>
          </div>
        </div>
      </div>
      <main key={current.id} className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </CrmContext.Provider>
  );
}