"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Lang } from "@/lib/labels";
import {
  Application,
  STATUSES,
  Status,
  loadApplications,
  saveApplications,
  newId,
  safeUrl,
  exportBackup,
  importBackup,
  toCsv,
} from "@/lib/tracker";

const T = {
  en: {
    badge: "Application tracker",
    title: "Keep track of every application",
    intro:
      "Add each job you apply to, move it through the stages, and set a date to follow up. No account needed.",
    privacy:
      "Your applications are saved in this browser, on this device only. If you clear your browser data or change device, they are lost. Download a backup to keep a copy.",
    statuses: {
      saved: "To apply",
      applied: "Applied",
      interview: "Interview",
      offer: "Offer",
      rejected: "Rejected",
    } as Record<Status, string>,
    add: "Add an application",
    editTitle: "Edit application",
    newTitle: "New application",
    company: "Company",
    role: "Job title",
    status: "Stage",
    applied: "Date applied",
    followUp: "Follow up on",
    url: "Link to the offer (optional)",
    notes: "Notes (optional)",
    save: "Save",
    cancel: "Cancel",
    required: "Please enter the company and the job title.",
    emptyColumn: "Nothing here yet",
    emptyAll: "No applications yet. Add the first one to start tracking.",
    total: (n: number) => `${n} application(s)`,
    move: "Move to",
    edit: "Edit",
    del: "Delete",
    deleteConfirm: "Delete this application? This cannot be undone.",
    appliedOn: "Applied",
    followUpOn: "Follow up",
    due: "Follow up due",
    openOffer: "Open the offer",
    backup: "Download backup",
    restore: "Restore from backup",
    csv: "Download as spreadsheet (CSV)",
    restored: (n: number) =>
      n > 0 ? `${n} application(s) restored.` : "Nothing new to restore from this file.",
    failed:
      "Your changes could not be saved. Your browser storage may be full or blocked.",
    loading: "Loading your applications...",
    csvHeaders: ["Company", "Job title", "Stage", "Date applied", "Follow up on", "Link", "Notes"],
    toolsTitle: "Get ready for the next step",
    resume: "Tailor my resume",
    interview: "Prepare my interview",
    jobs: "Find job offers",
    resumeHref: "/templates",
    interviewHref: "/interview",
    jobsHref: "/jobs",
  },
  fr: {
    badge: "Suivi de candidatures",
    title: "Suivez chacune de vos candidatures",
    intro:
      "Ajoutez chaque poste auquel vous postulez, faites-le avancer d'étape en étape et fixez une date de relance. Aucun compte nécessaire.",
    privacy:
      "Vos candidatures sont enregistrées dans ce navigateur, sur cet appareil uniquement. Si vous effacez les données du navigateur ou changez d'appareil, elles sont perdues. Téléchargez une sauvegarde pour en garder une copie.",
    statuses: {
      saved: "À postuler",
      applied: "Postulé",
      interview: "Entretien",
      offer: "Offre",
      rejected: "Refusé",
    } as Record<Status, string>,
    add: "Ajouter une candidature",
    editTitle: "Modifier la candidature",
    newTitle: "Nouvelle candidature",
    company: "Entreprise",
    role: "Intitulé du poste",
    status: "Étape",
    applied: "Date de candidature",
    followUp: "Relancer le",
    url: "Lien de l'offre (facultatif)",
    notes: "Notes (facultatif)",
    save: "Enregistrer",
    cancel: "Annuler",
    required: "Veuillez saisir l'entreprise et l'intitulé du poste.",
    emptyColumn: "Rien pour le moment",
    emptyAll: "Aucune candidature pour le moment. Ajoutez la première pour commencer le suivi.",
    total: (n: number) => `${n} candidature(s)`,
    move: "Déplacer vers",
    edit: "Modifier",
    del: "Supprimer",
    deleteConfirm: "Supprimer cette candidature ? Cette action est irréversible.",
    appliedOn: "Postulé le",
    followUpOn: "Relance le",
    due: "Relance à faire",
    openOffer: "Ouvrir l'offre",
    backup: "Télécharger une sauvegarde",
    restore: "Restaurer une sauvegarde",
    csv: "Télécharger en tableur (CSV)",
    restored: (n: number) =>
      n > 0 ? `${n} candidature(s) restaurée(s).` : "Rien de nouveau à restaurer depuis ce fichier.",
    failed:
      "Vos modifications n'ont pas pu être enregistrées. Le stockage de votre navigateur est peut-être plein ou bloqué.",
    loading: "Chargement de vos candidatures...",
    csvHeaders: ["Entreprise", "Poste", "Étape", "Date de candidature", "Relancer le", "Lien", "Notes"],
    toolsTitle: "Préparez la suite",
    resume: "Adapter mon CV",
    interview: "Préparer mon entretien",
    jobs: "Trouver des offres",
    resumeHref: "/fr/templates",
    interviewHref: "/fr/interview",
    jobsHref: "/fr/jobs",
  },
};

type FormState = {
  company: string;
  role: string;
  status: Status;
  appliedDate: string;
  followUp: string;
  url: string;
  notes: string;
};

const todayStr = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

const emptyForm = (): FormState => ({
  company: "",
  role: "",
  status: "applied",
  appliedDate: todayStr(),
  followUp: "",
  url: "",
  notes: "",
});

const field =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900";
const btn =
  "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50";

export default function TrackerClient({ lang }: { lang: Lang }) {
  const t = T[lang];
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  const [items, setItems] = useState<Application[] | null>(null);
  const [today, setToday] = useState("");
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ company: "", role: "", status: "applied", appliedDate: "", followUp: "", url: "", notes: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setItems(loadApplications());
    setToday(todayStr());
  }, []);

  function persist(next: Application[]) {
    setItems(next);
    setMessage(saveApplications(next) ? "" : t.failed);
  }

  function openNew() {
    setEditingId(null);
    setForm(emptyForm());
    setFormOpen(true);
    setMessage("");
  }

  function openEdit(a: Application) {
    setEditingId(a.id);
    setForm({
      company: a.company,
      role: a.role,
      status: a.status,
      appliedDate: a.appliedDate,
      followUp: a.followUp,
      url: a.url,
      notes: a.notes,
    });
    setFormOpen(true);
    setMessage("");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!items) return;
    if (!form.company.trim() || !form.role.trim()) {
      setMessage(t.required);
      return;
    }
    const now = new Date().toISOString();
    if (editingId) {
      persist(
        items.map((a) =>
          a.id === editingId
            ? {
                ...a,
                ...form,
                company: form.company.trim(),
                role: form.role.trim(),
                updatedAt: now,
              }
            : a
        )
      );
    } else {
      persist([
        {
          id: newId(),
          ...form,
          company: form.company.trim(),
          role: form.role.trim(),
          updatedAt: now,
        },
        ...items,
      ]);
    }
    setFormOpen(false);
    setEditingId(null);
  }

  function move(a: Application, status: Status) {
    if (!items) return;
    persist(
      items.map((x) =>
        x.id === a.id ? { ...x, status, updatedAt: new Date().toISOString() } : x
      )
    );
  }

  function remove(a: Application) {
    if (!items || !window.confirm(t.deleteConfirm)) return;
    persist(items.filter((x) => x.id !== a.id));
  }

  function download(content: string, type: string, filename: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  const stamp = () => new Date().toISOString().slice(0, 10);

  function onBackup() {
    if (!items) return;
    download(exportBackup(items), "application/json", `resumecraft-tracker-${stamp()}.json`);
  }

  function onCsv() {
    if (!items) return;
    download(
      toCsv(items, t.csvHeaders, (s) => t.statuses[s]),
      "text/csv;charset=utf-8",
      `applications-${stamp()}.csv`
    );
  }

  async function onRestore(file: File | undefined) {
    if (!file || !items) return;
    const result = importBackup(await file.text(), items);
    if (result.added > 0) persist(result.items);
    setMessage(t.restored(result.added));
    if (fileRef.current) fileRef.current.value = "";
  }

  const byStatus = (s: Status) =>
    (items ?? [])
      .filter((a) => a.status === s)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  const fmtDate = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString(locale, { dateStyle: "medium" });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
        {t.badge}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">{t.intro}</p>
      <p className="mt-3 max-w-2xl rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
        {t.privacy}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={openNew}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + {t.add}
        </button>
        <button type="button" onClick={onBackup} className={btn}>
          {t.backup}
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className={btn}>
          {t.restore}
        </button>
        <button type="button" onClick={onCsv} className={btn}>
          {t.csv}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => onRestore(e.target.files?.[0])}
        />
        {items ? (
          <span className="ml-1 text-sm text-slate-500">{t.total(items.length)}</span>
        ) : null}
      </div>

      {message ? (
        <p className="mt-4 text-sm font-medium text-red-700" role="status">
          {message}
        </p>
      ) : null}

      {formOpen ? (
        <form
          onSubmit={submit}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <p className="font-semibold text-slate-900">
            {editingId ? t.editTitle : t.newTitle}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-700">
              {t.company}
              <input
                className={field}
                value={form.company}
                maxLength={120}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>
            <label className="text-sm text-slate-700">
              {t.role}
              <input
                className={field}
                value={form.role}
                maxLength={160}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </label>
            <label className="text-sm text-slate-700">
              {t.status}
              <select
                className={field}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t.statuses[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-700">
              {t.applied}
              <input
                type="date"
                className={field}
                value={form.appliedDate}
                onChange={(e) => setForm({ ...form, appliedDate: e.target.value })}
              />
            </label>
            <label className="text-sm text-slate-700">
              {t.followUp}
              <input
                type="date"
                className={field}
                value={form.followUp}
                onChange={(e) => setForm({ ...form, followUp: e.target.value })}
              />
            </label>
            <label className="text-sm text-slate-700">
              {t.url}
              <input
                className={field}
                value={form.url}
                maxLength={500}
                placeholder="https://"
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </label>
            <label className="text-sm text-slate-700 sm:col-span-2">
              {t.notes}
              <textarea
                className={field}
                rows={3}
                value={form.notes}
                maxLength={2000}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {t.save}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setEditingId(null);
                setMessage("");
              }}
              className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {t.cancel}
            </button>
          </div>
        </form>
      ) : null}

      {items === null ? (
        <p className="mt-8 text-sm text-slate-500">{t.loading}</p>
      ) : (
        <>
          {items.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600">
              {t.emptyAll}
            </p>
          ) : null}

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {STATUSES.map((s) => {
              const list = byStatus(s);
              return (
                <section key={s} className="rounded-2xl bg-slate-50 p-3">
                  <h2 className="flex items-center justify-between px-1 text-sm font-semibold text-slate-900">
                    {t.statuses[s]}
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-600">
                      {list.length}
                    </span>
                  </h2>
                  <div className="mt-3 space-y-3">
                    {list.length === 0 ? (
                      <p className="px-1 py-3 text-xs text-slate-400">{t.emptyColumn}</p>
                    ) : null}
                    {list.map((a) => {
                      const link = safeUrl(a.url);
                      const due =
                        !!a.followUp &&
                        !!today &&
                        a.followUp <= today &&
                        (a.status === "applied" || a.status === "interview");
                      return (
                        <div
                          key={a.id}
                          className="rounded-xl border border-slate-200 bg-white p-3"
                        >
                          <p className="font-semibold text-slate-900">{a.company}</p>
                          <p className="text-sm text-slate-600">{a.role}</p>
                          {a.appliedDate ? (
                            <p className="mt-2 text-xs text-slate-500">
                              {t.appliedOn} {fmtDate(a.appliedDate)}
                            </p>
                          ) : null}
                          {a.followUp ? (
                            <p
                              className={`text-xs ${
                                due ? "font-semibold text-red-700" : "text-slate-500"
                              }`}
                            >
                              {due ? `${t.due} · ` : `${t.followUpOn} `}
                              {fmtDate(a.followUp)}
                            </p>
                          ) : null}
                          {a.notes ? (
                            <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                              {a.notes}
                            </p>
                          ) : null}
                          {link ? (
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline"
                            >
                              {t.openOffer} ↗
                            </a>
                          ) : null}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <select
                              aria-label={t.move}
                              value={a.status}
                              onChange={(e) => move(a, e.target.value as Status)}
                              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800"
                            >
                              {STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {t.statuses[st]}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => openEdit(a)}
                              className="text-xs font-semibold text-slate-700 hover:underline"
                            >
                              {t.edit}
                            </button>
                            <button
                              type="button"
                              onClick={() => remove(a)}
                              className="text-xs font-semibold text-red-700 hover:underline"
                            >
                              {t.del}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-12">
        <p className="font-semibold text-slate-900">{t.toolsTitle}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href={t.resumeHref}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {t.resume}
          </Link>
          <Link
            href={t.interviewHref}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            {t.interview}
          </Link>
          <Link
            href={t.jobsHref}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            {t.jobs}
          </Link>
        </div>
      </div>
    </main>
  );
}