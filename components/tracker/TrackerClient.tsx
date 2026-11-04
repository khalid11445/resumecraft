"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Lang } from "@/lib/labels";
import {
  Application,
  STATUSES,
  Status,
  exportJson,
  formatDate,
  isFollowUpDue,
  loadApplications,
  parseImport,
  saveApplications,
  todayISO,
  withStatus,
} from "@/lib/tracker";
import { addSkillToLatestDraft, loadLatestDraft } from "@/lib/draft";
import { ResumeData } from "@/lib/resume-schema";
import { TT } from "@/components/tracker/text";
import ApplicationModal from "@/components/tracker/ApplicationModal";
import MessageModal from "@/components/tracker/MessageModal";
import JobMatchPanel from "@/components/builder/JobMatchPanel";

type Notice = {
  text: string;
  tone: "info" | "warn";
  link?: { href: string; label: string };
};

const smallBtn =
  "rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50";

export default function TrackerClient({ uiLang = "en" }: { uiLang?: Lang }) {
  const t = TT[uiLang];
  const base = uiLang === "fr" ? "/fr" : "";
  const locale = uiLang === "fr" ? "fr-FR" : "en-US";

  const [items, setItems] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [today, setToday] = useState<string | null>(null);
  const [senderName, setSenderName] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [dragOver, setDragOver] = useState<Status | null>(null);

  const [editing, setEditing] = useState<Application | "new" | null>(null);
  const [messageFor, setMessageFor] = useState<Application | null>(null);
  const [matchFor, setMatchFor] = useState<{
    app: Application;
    resume: ResumeData;
  } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // Load everything once the page is open in the browser
  useEffect(() => {
    setItems(loadApplications());
    setToday(todayISO());
    setSenderName(loadLatestDraft()?.draft.data?.personal.fullName ?? "");
    setLoaded(true);
  }, []);

  // Save after every change
  useEffect(() => {
    if (!loaded) return;
    setSaveFailed(!saveApplications(items));
  }, [items, loaded]);

  const counts = useMemo(() => {
    const c: Record<Status, number> = {
      saved: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    items.forEach((i) => {
      c[i.status] += 1;
    });
    return c;
  }, [items]);

  const dueCount = items.filter((i) => isFollowUpDue(i, today)).length;

  function upsert(app: Application) {
    setItems((prev) =>
      prev.some((x) => x.id === app.id)
        ? prev.map((x) => (x.id === app.id ? app : x))
        : [app, ...prev]
    );
    setEditing(null);
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setEditing(null);
  }

  function move(id: string, status: Status) {
    setItems((prev) =>
      prev.map((x) => (x.id === id && x.status !== status ? withStatus(x, status) : x))
    );
  }

  function onDragStart(e: DragEvent<HTMLElement>, id: string) {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e: DragEvent<HTMLElement>, status: Status) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    setDragOver(null);
    if (id) move(id, status);
  }

  // The comparison uses the resume you edited most recently in the builder
  function openMatch(app: Application) {
    const latest = loadLatestDraft();
    if (!latest || !latest.draft.data) {
      setNotice({
        tone: "warn",
        text: t.noResume,
        link: { href: `${base}/templates`, label: t.openBuilder },
      });
      return;
    }
    setMatchFor({ app, resume: latest.draft.data });
  }

  function exportAll() {
    const blob = new Blob([exportJson(items)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resumecraft-applications.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 2_000_000) {
      setNotice({ tone: "warn", text: t.importError });
      return;
    }
    const parsed = parseImport(await file.text());
    if (!parsed) {
      setNotice({ tone: "warn", text: t.importError });
      return;
    }

    const known = new Set(items.map((x) => x.id));
    const fresh = parsed.filter((x) => !known.has(x.id));
    if (fresh.length === 0) {
      setNotice({ tone: "info", text: t.importNone });
      return;
    }
    setItems((prev) => [...fresh, ...prev].slice(0, 500));
    setNotice({ tone: "info", text: t.imported(fresh.length) });
  }

  function renderCard(app: Application) {
    const due = isFollowUpDue(app, today);

    return (
      <div
        key={app.id}
        draggable
        onDragStart={(e) => onDragStart(e, app.id)}
        className="cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm active:cursor-grabbing"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-black">
              {app.company || app.role}
            </p>
            {app.company && app.role ? (
              <p className="truncate text-sm text-gray-600">{app.role}</p>
            ) : null}
          </div>
          {app.url ? (
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              title={t.openJob}
              aria-label={t.openJob}
              className="shrink-0 text-sm font-semibold text-blue-600 hover:underline"
            >
              ↗
            </a>
          ) : null}
        </div>

        {app.appliedOn ? (
          <p className="mt-2 text-xs text-gray-500">
            {t.appliedOn} {formatDate(app.appliedOn, locale)}
          </p>
        ) : null}
        {app.followUpOn ? (
          <p className="text-xs text-gray-500">
            {t.followUpOn} {formatDate(app.followUpOn, locale)}
          </p>
        ) : null}
        {due ? (
          <span className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            {t.due}
          </span>
        ) : null}

        <select
          value={app.status}
          onChange={(e) => move(app.id, e.target.value as Status)}
          aria-label={t.status}
          className="mt-3 w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-black"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t.statuses[s]}
            </option>
          ))}
        </select>

        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" onClick={() => setEditing(app)} className={smallBtn}>
            {t.edit}
          </button>
          <button type="button" onClick={() => setMessageFor(app)} className={smallBtn}>
            {t.messages}
          </button>
          <button type="button" onClick={() => openMatch(app)} className={smallBtn}>
            {t.match}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-black">{t.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{t.intro}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + {t.add}
          </button>
          <button type="button" onClick={exportAll} className={smallBtn}>
            {t.export}
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={smallBtn}
          >
            {t.import}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onImport}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <Link
          href={`${base}/templates`}
          className="font-semibold text-blue-600 hover:underline"
        >
          {t.myResume}
        </Link>
        <span className="text-gray-300">|</span>
        <Link
          href={`${base}/letter`}
          className="font-semibold text-blue-600 hover:underline"
        >
          {t.letter}
        </Link>
      </div>

      {saveFailed ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {t.saveFailed}
        </p>
      ) : null}

      {notice ? (
        <div
          className={`mt-4 flex items-start justify-between gap-3 rounded-lg p-3 text-sm ${
            notice.tone === "warn"
              ? "bg-amber-50 text-amber-900"
              : "bg-blue-50 text-blue-900"
          }`}
        >
          <p>
            {notice.text}
            {notice.link ? (
              <>
                {" "}
                <Link href={notice.link.href} className="font-semibold underline">
                  {notice.link.label}
                </Link>
              </>
            ) : null}
          </p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="shrink-0 text-xs font-semibold underline"
          >
            {t.dismiss}
          </button>
        </div>
      ) : null}

      {loaded && items.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <span
              key={s}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
            >
              {t.statuses[s]} · {counts[s]}
            </span>
          ))}
          {dueCount > 0 ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              {t.stats} · {dueCount}
            </span>
          ) : null}
        </div>
      ) : null}

      {loaded && items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <h2 className="text-lg font-semibold text-black">{t.emptyTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            {t.emptyText}
          </p>
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="mt-5 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + {t.add}
          </button>
        </div>
      ) : null}

      {items.length > 0 ? (
        <>
          <p className="mt-4 hidden text-xs text-gray-500 md:block">{t.dragHint}</p>
          <div className="mt-4 md:flex md:items-start md:gap-4 md:overflow-x-auto md:pb-4">
            {STATUSES.map((status) => {
              const col = items.filter((i) => i.status === status);
              return (
                <section
                  key={status}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(status);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => onDrop(e, status)}
                  className={`mb-4 rounded-xl border p-3 md:mb-0 md:w-72 md:shrink-0 ${
                    col.length === 0 ? "hidden md:block" : ""
                  } ${
                    dragOver === status
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <h2 className="flex items-center justify-between text-sm font-bold text-gray-800">
                    {t.statuses[status]}
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-600">
                      {col.length}
                    </span>
                  </h2>
                  <div className="mt-3 space-y-3">
                    {col.length === 0 ? (
                      <p className="text-xs text-gray-400">{t.emptyColumn}</p>
                    ) : (
                      col.map(renderCard)
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      ) : null}

      <p className="mt-6 text-xs text-gray-500">{t.storageNote}</p>

      {editing ? (
        <ApplicationModal
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? null : editing}
          t={t}
          onSave={upsert}
          onDelete={remove}
          onClose={() => setEditing(null)}
        />
      ) : null}

      {messageFor ? (
        <MessageModal
          app={messageFor}
          uiLang={uiLang}
          t={t}
          senderName={senderName}
          onClose={() => setMessageFor(null)}
        />
      ) : null}

      {matchFor ? (
        <JobMatchPanel
          resume={matchFor.resume}
          ui={uiLang}
          initialPosting={matchFor.app.posting}
          onAddSkill={(term) => {
            addSkillToLatestDraft(term);
          }}
          onClose={() => setMatchFor(null)}
        />
      ) : null}
    </main>
  );
}