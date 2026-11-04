"use client";

import { useEffect, useState } from "react";
import { Lang } from "@/lib/labels";
import { Application } from "@/lib/tracker";
import { MESSAGE_KINDS, MessageKind, buildMessage } from "@/lib/messages";
import { countPlaceholders } from "@/lib/placeholders";
import { Tx } from "@/components/tracker/text";

const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const label = "mb-1 block text-xs font-semibold text-gray-600";

// A sensible default message for each stage of the application
function defaultKind(app: Application): MessageKind {
  if (app.status === "saved") return "spontaneous";
  if (app.status === "interview" || app.status === "offer") return "thanks";
  if (app.status === "rejected") return "feedback";
  return "followup";
}

export default function MessageModal({
  app,
  uiLang,
  t,
  senderName,
  onClose,
}: {
  app: Application;
  uiLang: Lang;
  t: Tx;
  senderName: string;
  onClose: () => void;
}) {
  const [kind, setKind] = useState<MessageKind>(defaultKind(app));
  const [lang, setLang] = useState<Lang>(uiLang);
  const [subjectEdit, setSubjectEdit] = useState<string | null>(null);
  const [bodyEdit, setBodyEdit] = useState<string | null>(null);
  const [copy, setCopy] = useState<"idle" | "ok" | "failed">("idle");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const built = buildMessage(kind, lang, {
    name: senderName,
    company: app.company,
    role: app.role,
    contact: app.contact,
    appliedOn: app.appliedOn,
  });
  const subject = subjectEdit ?? built.subject;
  const body = bodyEdit ?? built.body;

  function reset() {
    setSubjectEdit(null);
    setBodyEdit(null);
    setCopy("idle");
  }

  async function copyMessage() {
    const label = lang === "fr" ? "Objet" : "Subject";
    try {
      await navigator.clipboard.writeText(`${label}: ${subject}\n\n${body}`);
      setCopy("ok");
    } catch {
      setCopy("failed");
    }
  }

  const mailto = app.contactEmail
    ? `mailto:${app.contactEmail}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    : `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`;

  const hasBrackets = countPlaceholders(`${subject}\n${body}`) > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-black">{t.msgTitle}</h2>
            <p className="text-xs text-gray-500">
              {[app.company, app.role].filter(Boolean).join(" — ")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t.close}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className={label}>{t.msgKind}</label>
            <select
              className={input}
              value={kind}
              onChange={(e) => {
                setKind(e.target.value as MessageKind);
                reset();
              }}
            >
              {MESSAGE_KINDS.map((k) => (
                <option key={k} value={k}>
                  {t.kinds[k]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>{t.msgLanguage}</label>
            <select
              className={input}
              value={lang}
              onChange={(e) => {
                setLang(e.target.value as Lang);
                reset();
              }}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <label className={`${label} mt-4`}>{t.subject}</label>
        <input
          className={input}
          value={subject}
          onChange={(e) => {
            setSubjectEdit(e.target.value);
            setCopy("idle");
          }}
        />

        <label className={`${label} mt-3`}>{t.body}</label>
        <textarea
          rows={12}
          className={input}
          value={body}
          onChange={(e) => {
            setBodyEdit(e.target.value);
            setCopy("idle");
          }}
        />

        {hasBrackets ? (
          <p className="mt-2 text-xs text-amber-700">{t.brackets}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyMessage}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {copy === "ok" ? `✓ ${t.copied}` : t.copy}
          </button>
          <a
            href={mailto}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t.mail}
          </a>
        </div>
        {copy === "failed" ? (
          <p className="mt-2 text-xs text-red-600">{t.copyFailed}</p>
        ) : null}
        {!app.contactEmail ? (
          <p className="mt-2 text-xs text-gray-500">{t.mailHint}</p>
        ) : null}
      </div>
    </div>
  );
}