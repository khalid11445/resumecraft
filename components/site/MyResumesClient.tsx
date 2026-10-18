"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lang } from "@/lib/labels";
import { getCategories } from "@/lib/catalog";
import { getTemplate } from "@/lib/templates";
import {
  ResumeItem,
  listResumes,
  duplicateResume,
  deleteResume,
  renameResume,
  exportBackup,
  importBackup,
  newSlot,
} from "@/lib/resumes";

const T = {
  en: {
    badge: "My resumes",
    title: "All your resumes in one place",
    intro:
      "Open, duplicate, rename or delete the resumes you saved. Duplicate a resume to adapt it to a different job in seconds.",
    privacy:
      "Your resumes are saved in this browser, on this device only. If you clear your browser data or change device, they are lost. Download a backup to keep a copy.",
    loading: "Loading your resumes...",
    emptyTitle: "No saved resumes yet",
    emptyText:
      "Start a resume and edit it. It will appear here automatically.",
    start: "Build my resume",
    startAnother: "Start another resume",
    chooseProfession: "Profession",
    startBtn: "Start",
    open: "Open",
    duplicate: "Duplicate",
    rename: "Rename",
    del: "Delete",
    renamePrompt: "Name for this resume:",
    deleteConfirm: "Delete this resume from this device? This cannot be undone.",
    copySuffix: "(copy)",
    importedLabel: "Imported resume",
    untitled: "Untitled resume",
    saved: "Saved",
    backup: "Download backup",
    restore: "Restore from backup",
    restored: (n: number) =>
      n > 0 ? `${n} resume(s) restored as new copies.` : "No resume could be restored from this file.",
    duplicated: "Resume duplicated.",
    failed: "The action could not be completed. Your browser storage may be full or blocked.",
    langNames: { en: "English", fr: "Français" } as Record<string, string>,
  },
  fr: {
    badge: "Mes CV",
    title: "Tous vos CV au même endroit",
    intro:
      "Ouvrez, dupliquez, renommez ou supprimez les CV que vous avez enregistrés. Dupliquez un CV pour l'adapter à un autre poste en quelques secondes.",
    privacy:
      "Vos CV sont enregistrés dans ce navigateur, sur cet appareil uniquement. Si vous effacez les données du navigateur ou changez d'appareil, ils sont perdus. Téléchargez une sauvegarde pour en garder une copie.",
    loading: "Chargement de vos CV...",
    emptyTitle: "Aucun CV enregistré pour le moment",
    emptyText:
      "Commencez un CV et modifiez-le. Il apparaîtra ici automatiquement.",
    start: "Créer mon CV",
    startAnother: "Commencer un autre CV",
    chooseProfession: "Métier",
    startBtn: "Commencer",
    open: "Ouvrir",
    duplicate: "Dupliquer",
    rename: "Renommer",
    del: "Supprimer",
    renamePrompt: "Nom de ce CV :",
    deleteConfirm: "Supprimer ce CV de cet appareil ? Cette action est irréversible.",
    copySuffix: "(copie)",
    importedLabel: "CV importé",
    untitled: "CV sans titre",
    saved: "Enregistré le",
    backup: "Télécharger une sauvegarde",
    restore: "Restaurer une sauvegarde",
    restored: (n: number) =>
      n > 0 ? `${n} CV restauré(s) sous forme de nouvelles copies.` : "Aucun CV n'a pu être restauré depuis ce fichier.",
    duplicated: "CV dupliqué.",
    failed: "L'action n'a pas pu être effectuée. Le stockage de votre navigateur est peut-être plein ou bloqué.",
    langNames: { en: "English", fr: "Français" } as Record<string, string>,
  },
};

export default function MyResumesClient({ lang }: { lang: Lang }) {
  const t = T[lang];
  const base = lang === "fr" ? "/fr" : "";
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const router = useRouter();
  const categories = getCategories(lang);

  const [items, setItems] = useState<ResumeItem[] | null>(null);
  const [message, setMessage] = useState("");
  const [newCat, setNewCat] = useState(categories[0]?.id ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => setItems(listResumes());

  useEffect(() => {
    setItems(listResumes());
  }, []);

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  const openHref = (r: ResumeItem) =>
    `${base}/builder/${r.category}${r.slot ? `?slot=${r.slot}` : ""}`;

  const titleOf = (r: ResumeItem) =>
    r.label || [r.name, r.jobTitle].filter(Boolean).join(" · ") || t.untitled;

  function onDuplicate(r: ResumeItem) {
    const ok = duplicateResume(r.key, `${titleOf(r)} ${t.copySuffix}`);
    setMessage(ok ? t.duplicated : t.failed);
    refresh();
  }

  function onRename(r: ResumeItem) {
    const v = window.prompt(t.renamePrompt, r.label || titleOf(r));
    if (v === null) return;
    renameResume(r.key, v);
    refresh();
  }

  function onDelete(r: ResumeItem) {
    if (!window.confirm(t.deleteConfirm)) return;
    deleteResume(r.key);
    setMessage("");
    refresh();
  }

  function onBackup() {
    try {
      const blob = new Blob([exportBackup()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resumecraft-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage(t.failed);
    }
  }

  async function onRestore(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    const n = importBackup(text, t.importedLabel);
    setMessage(t.restored(n));
    refresh();
    if (fileRef.current) fileRef.current.value = "";
  }

  function onStartAnother() {
    if (!newCat) return;
    router.push(`${base}/builder/${newCat}?slot=${newSlot()}`);
  }

  const btn =
    "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
        {t.badge}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-3 text-slate-600">{t.intro}</p>
      <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
        {t.privacy}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button type="button" onClick={onBackup} className={btn}>
          {t.backup}
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className={btn}>
          {t.restore}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => onRestore(e.target.files?.[0])}
        />
      </div>

      {message ? (
        <p className="mt-4 text-sm font-medium text-slate-700" role="status">
          {message}
        </p>
      ) : null}

      <div className="mt-8 space-y-3">
        {items === null ? (
          <p className="text-sm text-slate-500">{t.loading}</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-semibold text-slate-900">{t.emptyTitle}</p>
            <p className="mt-1 text-sm text-slate-600">{t.emptyText}</p>
            <Link
              href={`${base}/templates`}
              className="mt-5 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {t.start}
            </Link>
          </div>
        ) : (
          items.map((r) => (
            <div
              key={r.key}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-1 h-4 w-4 shrink-0 rounded-full ring-1 ring-slate-300"
                  style={{
                    backgroundColor: /^#[0-9a-fA-F]{6}$/.test(r.accent)
                      ? r.accent
                      : "#1b2a41",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {titleOf(r)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {categoryName(r.category)}
                    {" · "}
                    {getTemplate(r.templateId).name}
                    {r.lang ? ` · ${t.langNames[r.lang] ?? r.lang}` : ""}
                    {" · "}
                    {t.saved}{" "}
                    {new Date(r.savedAt).toLocaleDateString(locale, {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={openHref(r)}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  {t.open}
                </Link>
                <button type="button" onClick={() => onDuplicate(r)} className={btn}>
                  {t.duplicate}
                </button>
                <button type="button" onClick={() => onRename(r)} className={btn}>
                  {t.rename}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(r)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  {t.del}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-10 rounded-2xl bg-slate-50 p-5">
        <p className="font-semibold text-slate-900">{t.startAnother}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="text-sm text-slate-600" htmlFor="new-resume-profession">
            {t.chooseProfession}
          </label>
          <select
            id="new-resume-profession"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onStartAnother}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {t.startBtn}
          </button>
        </div>
      </div>
    </main>
  );
}