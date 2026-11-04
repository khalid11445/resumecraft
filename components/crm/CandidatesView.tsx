"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmShell";

type Cand = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  headline: string | null;
  consent_recorded: boolean;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const label = "mb-1 block text-xs font-semibold text-gray-600";

const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  headline: "",
  source: "",
};

export default function CandidatesView() {
  const { supabase, orgId, t, base } = useCrm();

  const [items, setItems] = useState<Cand[] | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [consent, setConsent] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("candidates")
      .select("id,full_name,email,phone,city,headline,consent_recorded")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error(error);
      setMsg(t.loadError);
      setItems([]);
      return;
    }
    setItems((data ?? []) as Cand[]);
  }, [supabase, orgId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!items) return [];
    if (!q) return items;
    return items.filter((c) =>
      [c.full_name, c.city, c.headline]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q))
    );
  }, [items, query]);

  async function submit(e: FormEvent) {
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
    if (!consent) {
      setMsg(t.consentNeeded);
      return;
    }

    setBusy(true);
    const { error } = await supabase.from("candidates").insert({
      org_id: orgId,
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      city: form.city.trim() || null,
      headline: form.headline.trim() || null,
      source: form.source.trim() || null,
      consent_recorded: true,
    });
    setBusy(false);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    setForm(emptyForm);
    setConsent(false);
    setOpen(false);
    await load();
  }

  async function remove(id: string) {
    if (!window.confirm(t.deleteCandConfirm)) return;
    const { error } = await supabase
      .from("candidates")
      .delete()
      .eq("id", id)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      setMsg(t.saveError);
      return;
    }
    await load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black">{t.candTitle}</h1>
          <p className="mt-1 text-sm text-gray-600">{t.candIntro}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + {t.addCand}
        </button>
      </div>

      {msg ? <p className="mt-4 text-sm text-red-700">{msg}</p> : null}

      {open ? (
        <form
          onSubmit={submit}
          className="mt-5 rounded-xl border border-gray-200 bg-white p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-gray-700 sm:col-span-2">
              <span className={label}>{t.fullName}</span>
              <input
                className={input}
                value={form.full_name}
                maxLength={160}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </label>
            <label className="text-sm text-gray-700">
              <span className={label}>Email</span>
              <input
                className={input}
                value={form.email}
                maxLength={200}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="text-sm text-gray-700">
              <span className={label}>{t.phone}</span>
              <input
                className={input}
                value={form.phone}
                maxLength={40}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="text-sm text-gray-700">
              <span className={label}>{t.city}</span>
              <input
                className={input}
                value={form.city}
                maxLength={120}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </label>
            <label className="text-sm text-gray-700">
              <span className={label}>{t.source}</span>
              <input
                className={input}
                value={form.source}
                maxLength={120}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              />
            </label>
            <label className="text-sm text-gray-700 sm:col-span-2">
              <span className={label}>{t.headline}</span>
              <input
                className={input}
                value={form.headline}
                maxLength={200}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
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
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {busy ? t.working : t.save}
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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          className={`${input} sm:w-80`}
          placeholder={t.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {items ? (
          <span className="text-sm text-gray-500">{t.candCount(filtered.length)}</span>
        ) : null}
      </div>

      {items === null ? (
        <p className="mt-6 text-sm text-gray-500">{t.loading}</p>
      ) : filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600">
          {t.candEmpty}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filtered.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="min-w-0">
                                <Link
                  href={`${base}/crm/candidates/${c.id}`}
                  className="block truncate font-semibold text-black hover:text-blue-700 hover:underline"
                >
                  {c.full_name}
                </Link>
                {c.headline ? (
                  <p className="truncate text-sm text-gray-600">{c.headline}</p>
                ) : null}
                <p className="truncate text-xs text-gray-500">
                  {[c.city, c.phone, c.email].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    c.consent_recorded
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {c.consent_recorded ? t.consentYes : t.consentNo}
                </span>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  className="text-xs font-semibold text-red-700 hover:underline"
                >
                  {t.del}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}