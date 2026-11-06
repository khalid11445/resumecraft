"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Role, useCrm } from "@/components/crm/CrmShell";
import { TMT } from "@/components/crm/teamText";

type Invite = {
  id: string;
  email: string | null;
  role: Role;
  token: string;
  created_at: string;
  expires_at: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const label = "mb-1 block text-xs font-semibold text-gray-600";
const box = "rounded-xl border border-gray-200 bg-white p-4";
const primary =
  "rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50";
const ghost =
  "rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50";

const roleBadge: Record<Role, string> = {
  owner: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  member: "bg-gray-100 text-gray-700",
};

export default function TeamView() {
  const { supabase, orgId, t, lang, base, userId, role, members, reloadMembers } =
    useCrm();
  const m = TMT[lang];
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  const canManage = role === "owner" || role === "admin";
  const isOwner = role === "owner";
  const ownerCount = members.filter((x) => x.role === "owner").length;

  const [origin, setOrigin] = useState("");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteRole, setInviteRole] = useState<Role>("member");
  const [inviteEmail, setInviteEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [nameMsg, setNameMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Fills the name box with your current name
  useEffect(() => {
    const me = members.find((x) => x.user_id === userId);
    if (me) setName(me.name);
  }, [members, userId]);

  const loadInvites = useCallback(async () => {
    if (!canManage) return;
    const { data, error } = await supabase
      .from("invitations")
      .select("id,email,role,token,created_at,expires_at")
      .eq("org_id", orgId)
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      setMsg(t.loadError);
      return;
    }
    setInvites((data ?? []) as Invite[]);
  }, [supabase, orgId, canManage, t]);

  useEffect(() => {
    void loadInvites();
  }, [loadInvites]);

  const linkFor = (token: string) => `${origin}${base}/join/${token}`;

  async function saveName(e: FormEvent) {
    e.preventDefault();
    setNameMsg("");
    const value = name.trim();
    if (!value) {
      setNameMsg(m.needName);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: value })
      .eq("id", userId);
    if (error) {
      console.error(error);
      setNameMsg(m.failed);
      return;
    }
    setNameMsg(m.nameSaved);
    await reloadMembers();
  }

  async function createInvite(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    const mail = inviteEmail.trim();
    if (mail && !EMAIL.test(mail)) {
      setMsg(m.badEmail);
      return;
    }
    setBusy(true);
    const { error } = await supabase.rpc("create_invitation", {
      p_org: orgId,
      p_role: inviteRole,
      p_email: mail || null,
    });
    setBusy(false);
    if (error) {
      console.error(error);
      setMsg(m.failed);
      return;
    }
    setInviteEmail("");
    await loadInvites();
  }

  async function copyLink(inv: Invite) {
    try {
      await navigator.clipboard.writeText(linkFor(inv.token));
      setCopiedId(inv.id);
      setMsg("");
    } catch {
      setMsg(m.copyFailed);
    }
  }

  async function revoke(inv: Invite) {
    const { error } = await supabase
      .from("invitations")
      .delete()
      .eq("id", inv.id)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setMsg(m.failed);
      return;
    }
    setInvites((prev) => prev.filter((x) => x.id !== inv.id));
  }

  async function changeRole(userIdTarget: string, next: Role) {
    setMsg("");
    const { error } = await supabase.rpc("set_member_role", {
      p_org: orgId,
      p_user: userIdTarget,
      p_role: next,
    });
    if (error) {
      console.error(error);
      setMsg(m.failed);
      return;
    }
    await reloadMembers();
  }

  async function removeMember(userIdTarget: string, self: boolean) {
    if (!window.confirm(self ? m.leaveConfirm : m.removeConfirm)) return;
    setMsg("");
    const { error } = await supabase.rpc("remove_member", {
      p_org: orgId,
      p_user: userIdTarget,
    });
    if (error) {
      console.error(error);
      setMsg(m.failed);
      return;
    }
    if (self) {
      window.localStorage.removeItem("rc_org");
      window.location.href = `${base}/crm`;
      return;
    }
    await reloadMembers();
  }

  const dateText = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      <h1 className="text-2xl font-bold text-black">{m.teamTitle}</h1>
      <p className="mt-1 text-sm text-gray-600">{m.teamIntro}</p>

      {msg ? <p className="mt-4 text-sm text-red-700">{msg}</p> : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className={box}>
            <h2 className="text-sm font-bold text-gray-900">{m.members}</h2>
            <p className="mt-1 text-xs text-gray-500">{m.roleHelp}</p>

            <ul className="mt-4 divide-y divide-gray-100">
              {members.map((mem) => {
                const self = mem.user_id === userId;
                const canChange = isOwner && !self && mem.role !== "owner";
                const canRemove =
                  !self &&
                  mem.role !== "owner" &&
                  (isOwner || (role === "admin" && mem.role === "member"));
                const canLeave = self && !(mem.role === "owner" && ownerCount <= 1);

                return (
                  <li
                    key={mem.user_id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {mem.name}
                        {self ? (
                          <span className="font-normal text-gray-500"> ({m.you})</span>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-gray-500">{mem.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleBadge[mem.role]}`}
                      >
                        {m.roles[mem.role]}
                      </span>
                      {canChange ? (
                        <button
                          type="button"
                          onClick={() =>
                            changeRole(
                              mem.user_id,
                              mem.role === "admin" ? "member" : "admin"
                            )
                          }
                          className={ghost}
                        >
                          {mem.role === "admin" ? m.makeMember : m.makeAdmin}
                        </button>
                      ) : null}
                      {canRemove ? (
                        <button
                          type="button"
                          onClick={() => removeMember(mem.user_id, false)}
                          className="text-xs font-semibold text-red-700 hover:underline"
                        >
                          {m.remove}
                        </button>
                      ) : null}
                      {canLeave ? (
                        <button
                          type="button"
                          onClick={() => removeMember(mem.user_id, true)}
                          className="text-xs font-semibold text-red-700 hover:underline"
                        >
                          {m.leave}
                        </button>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={box}>
            <h2 className="text-sm font-bold text-gray-900">{m.inviteTitle}</h2>
            {canManage ? (
              <>
                <p className="mt-1 text-xs text-gray-500">{m.inviteText}</p>
                <form
                  onSubmit={createInvite}
                  className="mt-4 grid gap-3 sm:grid-cols-3"
                >
                  <label className="text-sm text-gray-700">
                    <span className={label}>{m.roleLabel}</span>
                    <select
                      className={input}
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as Role)}
                    >
                      <option value="member">{m.roles.member}</option>
                      {isOwner ? <option value="admin">{m.roles.admin}</option> : null}
                    </select>
                  </label>
                  <label className="text-sm text-gray-700 sm:col-span-2">
                    <span className={label}>{m.emailLabel}</span>
                    <input
                      className={input}
                      value={inviteEmail}
                      maxLength={200}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </label>
                  <div className="sm:col-span-3">
                    <button type="submit" disabled={busy} className={primary}>
                      {busy ? t.working : m.createLink}
                    </button>
                  </div>
                </form>

                <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-gray-500">
                  {m.pending}
                </h3>
                {invites.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">{m.noPending}</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {invites.map((inv) => (
                      <li
                        key={inv.id}
                        className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                          <span>
                            {m.roles[inv.role]} ·{" "}
                            {inv.email ? m.forEmail(inv.email) : m.anyEmail}
                          </span>
                          <span>{m.expires(dateText(inv.expires_at))}</span>
                        </div>
                        <input
                          readOnly
                          value={origin ? linkFor(inv.token) : ""}
                          onFocus={(e) => e.currentTarget.select()}
                          className={`${input} mt-2 font-mono text-xs`}
                        />
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => copyLink(inv)}
                            className={ghost}
                          >
                            {copiedId === inv.id ? `✓ ${m.copied}` : m.copy}
                          </button>
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              linkFor(inv.token)
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            {m.share}
                          </a>
                          <button
                            type="button"
                            onClick={() => revoke(inv)}
                            className="text-xs font-semibold text-red-700 hover:underline"
                          >
                            {m.revoke}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-500">{m.noAccess}</p>
            )}
          </section>
        </div>

        <section className={`${box} h-fit`}>
          <h2 className="text-sm font-bold text-gray-900">{m.myName}</h2>
          <p className="mt-1 text-xs text-gray-500">{m.myNameHint}</p>
          <form onSubmit={saveName} className="mt-3 space-y-2">
            <input
              className={input}
              value={name}
              maxLength={120}
              onChange={(e) => {
                setName(e.target.value);
                setNameMsg("");
              }}
            />
            <button type="submit" className={primary}>
              {m.saveName}
            </button>
            {nameMsg ? <p className="text-xs text-gray-600">{nameMsg}</p> : null}
          </form>
        </section>
      </div>
    </div>
  );
}