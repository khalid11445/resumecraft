"use client";

import { useEffect, useState } from "react";
import {
  Application,
  STATUSES,
  Status,
  addDays,
  newId,
  safeUrl,
  todayISO,
} from "@/lib/tracker";
import { Tx } from "@/components/tracker/text";

const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const label = "mb-1 block text-xs font-semibold text-gray-600";
const EMAIL = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/;

type Fields = {
  company: string;
  role: string;
  url: string;
  status: Status;
  appliedOn: string;
  followUpOn: string;
  contact: string;
  contactEmail: string;
  notes: string;
  posting: string;
};

export default function ApplicationModal({
  initial,
  t,
  onSave,
  onDelete,
  onClose,
}: {
  initial: Application | null;
  t: Tx;
  onSave: (app: Application) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [f, setF] = useState<Fields>({
    company: initial?.company ?? "",
    role: initial?.role ?? "",
    url: initial?.url ?? "",
    status: initial?.status ?? "saved",
    appliedOn: initial?.appliedOn ?? "",
    followUpOn: initial?.followUpOn ?? "",
    contact: initial?.contact ?? "",
    contactEmail: initial?.contactEmail ?? "",
    notes: initial?.notes ?? "",
    posting: initial?.posting ?? "",
  });
  const [error, setError] = useState("");

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit() {
    if (!f.company.trim() && !f.role.trim()) {
      setError(t.needOne);
      return;
    }
    if (f.url.trim() && !safeUrl(f.url)) {
      setError(t.badUrl);
      return;
    }
    if (f.contactEmail.trim() && !EMAIL.test(f.contactEmail.trim())) {
      setError(t.badEmail);
      return;
    }

    const next: Application = {
      id: initial?.id ?? newId(),
      company: f.company.trim(),
      role: f.role.trim(),
      url: safeUrl(f.url),
      status: f.status,
      appliedOn: f.appliedOn,
      followUpOn: f.followUpOn,
      contact: f.contact.trim(),
      contactEmail: f.contactEmail.trim(),
      notes: f.notes,
      posting: f.posting,
      updatedAt: new Date().toISOString(),
    };

    // Applied with no date: fill in today and a follow-up a week later
    if (next.status === "applied" && !next.appliedOn) {
      next.appliedOn = todayISO();
      if (!next.followUpOn) next.followUpOn = addDays(next.appliedOn, 7);
    }
    onSave(next);
  }

  function quickFollowUp(days: number) {
    set("followUpOn", addDays(f.appliedOn || todayISO(), days));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl">
        <h2 className="text-lg font-bold text-black">
          {initial ? t.editTitle : t.newTitle}
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className={label}>{t.company}</label>
            <input
              className={input}
              value={f.company}
              onChange={(e) => set("company", e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className={label}>{t.role}</label>
            <input
              className={input}
              value={f.role}
              onChange={(e) => set("role", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label className={label}>{t.url}</label>
            <input
              className={input}
              value={f.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://"
            />
          </div>

          <div className="col-span-2">
            <label className={label}>{t.status}</label>
            <select
              className={input}
              value={f.status}
              onChange={(e) => set("status", e.target.value as Status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t.statuses[s]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={label}>{t.applied}</label>
            <input
              type="date"
              className={input}
              value={f.appliedOn}
              onChange={(e) => set("appliedOn", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>{t.followUp}</label>
            <input
              type="date"
              className={input}
              value={f.followUpOn}
              onChange={(e) => set("followUpOn", e.target.value)}
            />
            <div className="mt-1 flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => quickFollowUp(7)}
                className="rounded border border-gray-300 px-2 py-0.5 text-gray-700 hover:bg-gray-50"
              >
                {t.plus7}
              </button>
              <button
                type="button"
                onClick={() => quickFollowUp(14)}
                className="rounded border border-gray-300 px-2 py-0.5 text-gray-700 hover:bg-gray-50"
              >
                {t.plus14}
              </button>
            </div>
          </div>

          <div>
            <label className={label}>{t.contact}</label>
            <input
              className={input}
              value={f.contact}
              onChange={(e) => set("contact", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>{t.contactEmail}</label>
            <input
              className={input}
              value={f.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label className={label}>{t.notes}</label>
            <textarea
              rows={2}
              className={input}
              value={f.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label className={label}>{t.posting}</label>
            <textarea
              rows={4}
              className={input}
              value={f.posting}
              onChange={(e) => set("posting", e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">{t.postingHint}</p>
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={submit}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {t.save}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t.cancel}
          </button>
          {initial ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(t.deleteConfirm)) onDelete(initial.id);
              }}
              className="ml-auto text-sm font-semibold text-red-600 hover:underline"
            >
              {t.delete}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}