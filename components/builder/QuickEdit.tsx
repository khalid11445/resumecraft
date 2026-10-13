"use client";

import { useEffect, useState } from "react";
import { EditField } from "@/lib/quickedit";
import { Ui } from "@/lib/i18n";

const box =
  "w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-black bg-white";

export default function QuickEdit({
  fields,
  x,
  y,
  t,
  onClose,
}: {
  fields: EditField[];
  x: number;
  y: number;
  t: Ui;
  onClose: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.id, f.value]))
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // On a phone the editor slides up from the bottom instead of floating
  const isMobile = window.innerWidth < 640;

  const width = 320;
  const left = Math.max(8, Math.min(x - width / 2, window.innerWidth - width - 8));
  const top = Math.max(8, Math.min(y + 14, window.innerHeight - 300));

  return (
    <div
      className={
        isMobile
          ? "fixed inset-x-0 bottom-0 z-50 max-h-[70dvh] overflow-y-auto rounded-t-2xl border-t border-gray-300 bg-white p-4 shadow-2xl"
          : "fixed z-50 rounded-lg border border-gray-300 bg-white p-3 shadow-xl"
      }
      style={isMobile ? undefined : { left, top, width }}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600">{t.editOnResume}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
        >
          {t.done}
        </button>
      </div>

      <div className="space-y-2">
        {fields.map((f, idx) => (
          <div key={f.id}>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              {t.quickLabels[f.label] ?? f.label}
            </label>
            {f.multiline ? (
              <textarea
                rows={3}
                autoFocus={idx === 0}
                className={box}
                value={values[f.id] ?? ""}
                onChange={(e) => {
                  setValues((v) => ({ ...v, [f.id]: e.target.value }));
                  f.set(e.target.value);
                }}
              />
            ) : (
              <input
                autoFocus={idx === 0}
                className={box}
                value={values[f.id] ?? ""}
                onChange={(e) => {
                  setValues((v) => ({ ...v, [f.id]: e.target.value }));
                  f.set(e.target.value);
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}