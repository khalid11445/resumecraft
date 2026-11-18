"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmShell";
import { SET } from "@/components/crm/settingsText";
import { removeCandidateFiles } from "@/lib/candfiles";

const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const box = "rounded-xl border border-gray-200 bg-white p-5";
const primary =
  "rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50";

export default function SettingsView() {
  const { supabase, orgId, orgName, lang, base, role } = useCrm();
  const m = SET[lang];

  const canRename = role === "owner" || role === "admin";
  const isOwner = role === "owner";

  const [name, setName] = useState(orgName);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null
  );

  async function rename(e: FormEvent) {
    e.preventDefault();
    const value = name.trim();
    if (value.length < 2) {
      setMsg({ tone: "error", text: m.nameShort });
      return;
    }
    if (value === orgName) return;

    setBusy(true);
    setMsg(null);
    const { data, error } = await supabase
      .from("organizations")
      .update({ name: value })
      .eq("id", orgId)
      .select("id");
    setBusy(false);

    if (error || !data || data.length === 0) {
      console.error(error);
      setMsg({ tone: "error", text: m.failed });
      return;
    }
    setMsg({ tone: "ok", text: m.renamed });
    setTimeout(() => window.location.reload(), 700);
  }

  async function deleteWorkspace() {
    if (typed.trim() !== orgName) return;
    setBusy(true);
    setMsg(null);

    // The stored files go first: the database cannot delete them itself
    if (!(await removeCandidateFiles(supabase, orgId, null))) {
      setBusy(false);
      setMsg({ tone: "error", text: m.failed });
      return;
    }

    const { error } = await supabase.rpc("delete_organization", { p_org: orgId });
    if (error) {
      console.error(error);
      setBusy(false);
      setMsg({ tone: "error", text: m.failed });
      return;
    }

    try {
      window.localStorage.removeItem("rc_org");
    } catch {
      // ignore
    }
    window.location.href = `${base}/crm`;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-black">{m.title}</h1>
      <p className="mt-1 text-sm text-gray-600">{m.intro}</p>

      {msg ? (
        <p
          className={`mt-4 rounded-lg p-3 text-sm ${
            msg.tone === "ok"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {msg.text}
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className={box}>
          <h2 className="text-sm font-bold text-gray-900">{m.nameTitle}</h2>
          {canRename ? (
            <form onSubmit={rename} className="mt-3 space-y-3">
              <label className="block text-sm text-gray-700">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  {m.nameLabel}
                </span>
                <input
                  className={input}
                  value={name}
                  maxLength={120}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <button type="submit" disabled={busy} className={primary}>
                {m.save}
              </button>
            </form>
          ) : (
            <>
              <p className="mt-3 text-sm font-semibold text-gray-900">{orgName}</p>
              <p className="mt-1 text-xs text-gray-500">{m.readOnly}</p>
            </>
          )}
        </section>

        <section className={box}>
          <h2 className="text-sm font-bold text-gray-900">{m.dataTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{m.dataText}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
            <Link
              href={`${base}/crm/export`}
              className="text-blue-600 hover:underline"
            >
              {m.exportLink}
            </Link>
            <Link
              href={`${base}/crm/import`}
              className="text-blue-600 hover:underline"
            >
              {m.importLink}
            </Link>
          </div>
        </section>

        <section className={`${box} border-red-200`}>
          <h2 className="text-sm font-bold text-red-800">{m.dangerTitle}</h2>
          {isOwner ? (
            <>
              <p className="mt-2 text-sm text-gray-700">{m.dangerText}</p>
              <p className="mt-3 text-xs font-semibold text-gray-600">
                {m.typeToConfirm(orgName)}
              </p>
              <input
                className={`${input} mt-1`}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={deleteWorkspace}
                disabled={busy || typed.trim() !== orgName}
                className="mt-3 rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-40"
              >
                {busy ? m.deleting : m.deleteBtn}
              </button>
            </>
          ) : (
            <p className="mt-2 text-sm text-gray-600">{m.ownerOnly}</p>
          )}
        </section>

        <section className={box}>
          <h2 className="text-sm font-bold text-gray-900">{m.accountTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{m.accountText}</p>
          <Link
            href={`${base}/privacy`}
            className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
          >
            {m.privacyLink}
          </Link>
        </section>
      </div>
    </div>
  );
}