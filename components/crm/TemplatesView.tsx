"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useCrm } from "@/components/crm/CrmShell";
import { MT } from "@/components/crm/msgText";
import {
  STARTERS,
  VAR_KEYS,
  VarKey,
  renderTemplate,
  varLabel,
} from "@/lib/msgtemplates";

type Tpl = {
  id: string;
  name: string;
  subject: string | null;
  body: string;
  updated_at: string;
};
type Msg = { tone: "ok" | "error"; text: string };

const MAX_TEMPLATES = 50;
const MAX_BODY = 1500;

const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const label = "mb-1 block text-xs font-semibold text-gray-600";
const box = "rounded-xl border border-gray-200 bg-white p-4";
const primary =
  "rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50";
const ghost =
  "rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50";

export default function TemplatesView() {
  const { supabase, orgId, orgName, lang, userId, nameOf } = useCrm();
  const m = MT[lang];

  const [items, setItems] = useState<Tpl[] | null>(null);
  // "new" while writing a new template, an id while editing one
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", subject: "", body: "" });
  const [msg, setMsg] = useState<Msg | null>(null);
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("message_templates")
      .select("id,name,subject,body,updated_at")
      .eq("org_id", orgId)
      .order("name");
    if (error) {
      console.error(error);
      setMsg({ tone: "error", text: m.loadFailed });
      setItems([]);
      return;
    }
    setItems((data ?? []) as Tpl[]);
  }, [supabase, orgId, m]);

  useEffect(() => {
    void load();
  }, [load]);

  const sample = {
    first_name: "Samira",
    full_name: "Samira Alaoui",
    job_title: lang === "fr" ? "Infirmière" : "Nurse",
    client: "Clinique Atlas",
    my_name: nameOf(userId) || (lang === "fr" ? "Votre nom" : "Your name"),
    agency: orgName,
  };

  function startNew() {
    setForm({ name: "", subject: "", body: "" });
    setEditing("new");
    setMsg(null);
  }

  function startEdit(tpl: Tpl) {
    setForm({ name: tpl.name, subject: tpl.subject ?? "", body: tpl.body });
    setEditing(tpl.id);
    setMsg(null);
  }

  function insertVar(key: VarKey) {
    const el = bodyRef.current;
    const token = `{{${key}}}`;
    const start = el?.selectionStart ?? form.body.length;
    const end = el?.selectionEnd ?? form.body.length;
    const next = form.body.slice(0, start) + token + form.body.slice(end);
    if (next.length > MAX_BODY) return;
    setForm((f) => ({ ...f, body: next }));
    const pos = start + token.length;
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(pos, pos);
    });
  }

  function errorText(error: { code?: string; message?: string }): string {
    if (error.code === "23505") return m.nameExists;
    if ((error.message ?? "").includes("template limit")) return m.limitReached;
    return m.saveFailed;
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    const name = form.name.trim();
    const body = form.body.trim();
    if (name.length < 2) {
      setMsg({ tone: "error", text: m.nameShort });
      return;
    }
    if (!body) {
      setMsg({ tone: "error", text: m.bodyEmpty });
      return;
    }
    const subject = form.subject.trim() || null;

    setBusy(true);
    const result =
      editing === "new"
        ? await supabase
            .from("message_templates")
            .insert({ org_id: orgId, name, subject, body })
        : await supabase
            .from("message_templates")
            .update({ name, subject, body })
            .eq("id", editing as string)
            .eq("org_id", orgId);
    setBusy(false);

    if (result.error) {
      console.error(result.error);
      setMsg({ tone: "error", text: errorText(result.error) });
      return;
    }
    setEditing(null);
    setMsg({ tone: "ok", text: m.saved });
    await load();
  }

  async function remove(tpl: Tpl) {
    if (!window.confirm(m.deleteConfirm)) return;
    const { error } = await supabase
      .from("message_templates")
      .delete()
      .eq("id", tpl.id)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setMsg({ tone: "error", text: m.saveFailed });
      return;
    }
    setItems((prev) => (prev ?? []).filter((x) => x.id !== tpl.id));
    if (editing === tpl.id) setEditing(null);
  }

  async function addStarters() {
    setMsg(null);
    const have = new Set((items ?? []).map((x) => x.name));
    const fresh = STARTERS[lang].filter((s) => !have.has(s.name));
    if (fresh.length === 0) {
      setMsg({ tone: "ok", text: m.startersNone });
      return;
    }
    if ((items?.length ?? 0) + fresh.length > MAX_TEMPLATES) {
      setMsg({ tone: "error", text: m.limitReached });
      return;
    }

    setBusy(true);
    const { error } = await supabase.from("message_templates").insert(
      fresh.map((s) => ({
        org_id: orgId,
        name: s.name,
        subject: s.subject || null,
        body: s.body,
      }))
    );
    setBusy(false);
    if (error) {
      console.error(error);
      setMsg({ tone: "error", text: errorText(error) });
      return;
    }
    setMsg({ tone: "ok", text: m.startersAdded(fresh.length) });
    await load();
  }

  const previewText = renderTemplate(form.body, sample, lang);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold text-black">{m.tplTitle}</h1>
          <p className="mt-1 text-sm text-gray-600">{m.tplIntro}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addStarters} disabled={busy} className={ghost}>
            {m.startersBtn}
          </button>
          <button type="button" onClick={startNew} className={primary}>
            + {m.addTemplate}
          </button>
        </div>
      </div>

      {msg ? (
        <p
          className={`mt-4 rounded-lg p-3 text-sm ${
            msg.tone === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {msg.text}
        </p>
      ) : null}

      {editing ? (
        <form onSubmit={save} className={`${box} mt-5`}>
          <h2 className="text-sm font-bold text-gray-900">
            {editing === "new" ? m.newTitle : m.editTitle}
          </h2>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-gray-700">
              <span className={label}>{m.nameLabel}</span>
              <input
                className={input}
                value={form.name}
                maxLength={80}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="text-sm text-gray-700">
              <span className={label}>{m.subjectLabel}</span>
              <input
                className={input}
                value={form.subject}
                maxLength={150}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </label>
          </div>

          <div className="mt-3">
            <span className={label}>{m.variables}</span>
            <div className="flex flex-wrap gap-2">
              {VAR_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => insertVar(k)}
                  className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-700"
                  title={`{{${k}}}`}
                >
                  {varLabel(k, lang)}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-3 block text-sm text-gray-700">
            <span className={label}>{m.bodyLabel}</span>
            <textarea
              ref={bodyRef}
              rows={9}
              className={input}
              value={form.body}
              maxLength={MAX_BODY}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </label>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span>{m.varsHelp}</span>
            <span>
              {form.body.length} / {MAX_BODY}
            </span>
          </div>

          {form.body.trim() ? (
            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-600">{m.preview}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-900">
                {previewText}
              </p>
            </div>
          ) : null}

          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={busy} className={primary}>
              {m.save}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={ghost}>
              {m.cancel}
            </button>
          </div>
        </form>
      ) : null}

      {items === null ? null : items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600">
          {m.emptyTpl}
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((tpl) => (
            <li key={tpl.id} className={box}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
                <div className="flex shrink-0 items-center gap-3">
                  <button type="button" onClick={() => startEdit(tpl)} className={ghost}>
                    {m.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(tpl)}
                    className="text-xs font-semibold text-red-700 hover:underline"
                  >
                    {m.del}
                  </button>
                </div>
              </div>
              {tpl.subject ? (
                <p className="mt-1 truncate text-xs text-gray-500">{tpl.subject}</p>
              ) : null}
              <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm text-gray-700">
                {tpl.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}