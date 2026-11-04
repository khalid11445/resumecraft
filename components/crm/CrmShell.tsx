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

type Ctx = {
  supabase: SupabaseClient;
  orgId: string;
  orgName: string;
  lang: Lang;
  t: Tx;
  base: string;
};

const CrmContext = createContext<Ctx | null>(null);

export function useCrm(): Ctx {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used inside CrmShell");
  return ctx;
}

type Status = "loading" | "ready" | "noorg" | "error" | "config";

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
  const base = lang === "fr" ? "/fr" : "";
  const router = useRouter();
  const pathname = usePathname() || "";
  const supabase = useMemo(
    () => (supabaseConfigured ? createClient() : null),
    []
  );

  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState<{ id: string; name: string } | null>(null);
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
    setEmail(u.user.email ?? "");

    const { data, error } = await supabase
      .from("memberships")
      .select("org_id, organizations(name)")
      .order("created_at", { ascending: true })
      .limit(1);

    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }
    if (!data || data.length === 0) {
      setStatus("noorg");
      return;
    }

    const row = data[0] as unknown as {
      org_id: string;
      organizations: { name: string } | { name: string }[] | null;
    };
    const rel = Array.isArray(row.organizations)
      ? row.organizations[0]
      : row.organizations;
    setOrg({ id: row.org_id, name: rel?.name ?? "" });
    setStatus("ready");
  }, [supabase, router, base]);

  useEffect(() => {
    void load();
  }, [load]);

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

  if (!supabase || !org) return null;

  const jobsActive = !pathname.startsWith(`${base}/crm/candidates`);
  const link = (active: boolean) =>
    `rounded px-3 py-1.5 text-sm font-semibold ${
      active ? "bg-slate-900 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <CrmContext.Provider
      value={{ supabase, orgId: org.id, orgName: org.name, lang, t, base }}
    >
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm font-bold text-black">{org.name}</span>
            <Link href={`${base}/crm`} className={link(jobsActive)}>
              {t.navJobs}
            </Link>
            <Link
              href={`${base}/crm/candidates`}
              className={link(!jobsActive)}
            >
              {t.navCandidates}
            </Link>
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
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </CrmContext.Provider>
  );
}