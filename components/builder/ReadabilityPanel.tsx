"use client";

import { useEffect } from "react";
import { Lang } from "@/lib/labels";
import { CheckStatus, ReadabilityResult } from "@/lib/readability";

const T = {
  en: {
    title: "Readability check",
    intro:
      "We read your PDF the way a simple text reader would, then checked the points that most often cause trouble.",
    toFix: "to fix",
    toNote: "to note",
    fine: "fine",
    seenTitle: "What a text reader sees",
    seenHint:
      "Your text in the order it is written in the file. Real systems may order it differently.",
    limits:
      "This check is not a score and not a promise. Employers use many different systems, and the same resume can look different in each. We show no ATS score on purpose: there is no universal one. What recruiters decide on is your content: clear, specific and true.",
    close: "Close",
  },
  fr: {
    title: "Contrôle de lisibilité",
    intro:
      "Nous avons lu votre PDF comme le ferait un simple lecteur de texte, puis vérifié les points qui posent le plus souvent problème.",
    toFix: "à corriger",
    toNote: "à noter",
    fine: "corrects",
    seenTitle: "Ce que voit un lecteur de texte",
    seenHint:
      "Votre texte dans l'ordre où il est écrit dans le fichier. Les vrais systèmes peuvent l'ordonner autrement.",
    limits:
      "Ce contrôle n'est ni une note ni une promesse. Les employeurs utilisent des systèmes très différents, et le même CV peut s'y présenter différemment. Nous n'affichons volontairement aucun score ATS : il n'en existe pas d'universel. Ce qui décide les recruteurs, c'est votre contenu : clair, précis et vrai.",
    close: "Fermer",
  },
};

const ICON: Record<CheckStatus, string> = { ok: "✓", warn: "!", info: "i" };
const BADGE: Record<CheckStatus, string> = {
  ok: "bg-green-100 text-green-700",
  warn: "bg-amber-100 text-amber-800",
  info: "bg-blue-100 text-blue-700",
};

export default function ReadabilityPanel({
  result,
  ui,
  onClose,
}: {
  result: ReadabilityResult;
  ui: Lang;
  onClose: () => void;
}) {
  const t = T[ui];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const count = (s: CheckStatus) => result.checks.filter((c) => c.status === s).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-black">{t.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t.close}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-600">{t.intro}</p>

        <p className="mt-3 text-sm font-medium text-gray-800">
          {count("warn")} {t.toFix} · {count("info")} {t.toNote} · {count("ok")} {t.fine}
        </p>

        <ul className="mt-4 space-y-3">
          {result.checks.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${BADGE[c.status]}`}
              >
                {ICON[c.status]}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                <p className="text-sm text-gray-600">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>

        <details className="mt-5 rounded-lg border border-gray-200">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-800">
            {t.seenTitle}
          </summary>
          <div className="border-t border-gray-200 p-4">
            <p className="mb-2 text-xs text-gray-500">{t.seenHint}</p>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded bg-gray-50 p-3 text-xs text-gray-800">
              {result.text}
            </pre>
          </div>
        </details>

        <p className="mt-5 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
          {t.limits}
        </p>
      </div>
    </div>
  );
}