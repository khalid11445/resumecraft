"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmShell";
import { MT } from "@/components/crm/msgText";
import { countPlaceholders } from "@/lib/placeholders";
import { whatsappLink } from "@/lib/phone";
import { firstName, renderTemplate } from "@/lib/msgtemplates";

type Tpl = { id: string; name: string; subject: string | null; body: string };
type JobRef = { id: string; title: string; client: string | null };
type Channel = "whatsapp" | "email" | "copy";

const EMAIL = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/;
const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";
const label = "mb-1 block text-xs font-semibold text-gray-600";
const ghost =
  "rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50";
const disabledBtn =
  "cursor-not-allowed rounded bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500";

export default function MessageComposer({
  candidate,
  jobs,
  onLogged,
}: {
  candidate: {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    consent_recorded: boolean;
  };
  jobs: JobRef[];
  onLogged: () => void;
}) {
  const { supabase, orgId, orgName, lang, base, userId, nameOf } = useCrm();
  const m = MT[lang];

  const [templates, setTemplates] = useState<Tpl[] | null>(null);
  const [templateId, setTemplateId] = useState("");
  const [jobId, setJobId] = useState("");
  const [subjectEdit, setSubjectEdit] = useState<string | null>(null);
  const [bodyEdit, setBodyEdit] = useState<string | null>(null);
  const [logNote, setLogNote] = useState(true);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("message_templates")
      .select("id,name,subject,body")
      .eq("org_id", orgId)
      .order("name");
    if (error) {
      console.error(error);
      setMsg(m.composeFailed);
      setTemplates([]);
      return;
    }
    setTemplates((data ?? []) as Tpl[]);
  }, [supabase, orgId, m]);

  useEffect(() => {
    void load();
  }, [load]);

  // A candidate on a single job: that job is used without asking
  useEffect(() => {
    if (jobs.length === 1) setJobId(jobs[0].id);
  }, [jobs]);

  const tpl = templates?.find((x) => x.id === templateId) ?? null;
  const job = jobs.find((j) => j.id === jobId) ?? null;

  const values = {
    first_name: firstName(candidate.full_name),
    full_name: candidate.full_name,
    job_title: job?.title ?? "",
    client: job?.client ?? "",
    my_name: nameOf(userId),
    agency: orgName,
  };

  const builtSubject = tpl ? renderTemplate(tpl.subject || tpl.name, values, lang) : "";
  const builtBody = tpl ? renderTemplate(tpl.body, values, lang) : "";
  const subject = subjectEdit ?? builtSubject;
  const body = bodyEdit ?? builtBody;

  function choose(value: string) {
    setTemplateId(value);
    setSubjectEdit(null);
    setBodyEdit(null);
    setCopied(false);
    setMsg("");
  }

  function chooseJob(value: string) {
    setJobId(value);
    setSubjectEdit(null);
    setBodyEdit(null);
    setCopied(false);
  }

  const wa = whatsappLink(candidate.phone, body);
  const waTooLong = !!wa && wa.length > 4000;
  const emailOk = !!candidate.email && EMAIL.test(candidate.email);
  const mailto = emailOk
    ? `mailto:${candidate.email}?subject=${encodeURIComponent(
        subject.replace(/[\r\n]+/g, " ")
      )}&body=${encodeURIComponent(body)}`
    : null;
  const hasBrackets = countPlaceholders(`${subject}\n${body}`) > 0;

  // The site cannot know whether the message was really sent, so the note
  // says "prepared", never "sent"
  async function log(channel: Channel) {
    if (!logNote || !tpl) return;
    const text =
      channel === "whatsapp"
        ? m.noteWhatsapp(tpl.name)
        : channel === "email"
          ? m.noteEmail(tpl.name)
          : m.noteCopy(tpl.name);
    const { error } = await supabase
      .from("notes")
      .insert({ org_id: orgId, candidate_id: candidate.id, body: text });
    if (error) {
      console.error(error);
      return;
    }
    onLogged();
  }

  async function copyMessage() {
    try {
      const head = lang === "fr" ? "Objet" : "Subject";
      await navigator.clipboard.writeText(
        subject ? `${head}: ${subject}\n\n${body}` : body
      );
      setCopied(true);
      setMsg("");
      void log("copy");
    } catch {
      setMsg(m.copyFailed);
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-bold text-gray-900">{m.composeTitle}</h2>
        <Link
          href={`${base}/crm/templates`}
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          {m.manage}
        </Link>
      </div>
      <p className="mt-1 text-xs text-gray-500">{m.composeIntro}</p>

      {!candidate.consent_recorded ? (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
          {m.consentWarn}
        </p>
      ) : null}

      {templates === null ? null : templates.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">
          {m.noTemplates}{" "}
          <Link
            href={`${base}/crm/templates`}
            className="font-semibold text-blue-600 hover:underline"
          >
            {m.createFirst}
          </Link>
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-gray-700">
              <span className={label}>{m.pickTemplate}</span>
              <select
                className={input}
                value={templateId}
                onChange={(e) => choose(e.target.value)}
              >
                <option value="">{m.chooseTemplate}</option>
                {templates.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </label>

            {jobs.length > 1 ? (
              <label className="text-sm text-gray-700">
                <span className={label}>{m.pickJob}</span>
                <select
                  className={input}
                  value={jobId}
                  onChange={(e) => chooseJob(e.target.value)}
                >
                  <option value="">{m.noJob}</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                      {j.client ? ` · ${j.client}` : ""}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          {tpl ? (
            <div className="mt-4 space-y-3">
              {emailOk ? (
                <label className="block text-sm text-gray-700">
                  <span className={label}>{m.subject}</span>
                  <input
                    className={input}
                    value={subject}
                    maxLength={150}
                    onChange={(e) => setSubjectEdit(e.target.value)}
                  />
                </label>
              ) : null}

              <label className="block text-sm text-gray-700">
                <span className={label}>{m.message}</span>
                <textarea
                  rows={9}
                  className={input}
                  value={body}
                  onChange={(e) => {
                    setBodyEdit(e.target.value);
                    setCopied(false);
                  }}
                />
              </label>

              {hasBrackets ? (
                <p className="text-xs font-semibold text-amber-700">{m.bracketsWarn}</p>
              ) : null}

              <label className="flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={logNote}
                  onChange={(e) => setLogNote(e.target.checked)}
                />
                {m.logNote}
              </label>

              <div className="flex flex-wrap items-center gap-2">
                {wa && !waTooLong ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => void log("whatsapp")}
                    className="rounded bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    {m.whatsapp}
                  </a>
                ) : (
                  <span className={disabledBtn}>{m.whatsapp}</span>
                )}
                {mailto ? (
                  <a
                    href={mailto}
                    onClick={() => void log("email")}
                    className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    {m.email}
                  </a>
                ) : (
                  <span className={disabledBtn}>{m.email}</span>
                )}
                <button type="button" onClick={copyMessage} className={ghost}>
                  {copied ? `✓ ${m.copied}` : m.copy}
                </button>
              </div>

              <div className="space-y-1 text-xs text-gray-500">
                {!candidate.phone ? <p>{m.noPhone}</p> : null}
                {!candidate.email ? <p>{m.noEmail}</p> : null}
                {waTooLong ? <p>{m.tooLong}</p> : null}
                {mailto && mailto.length > 1900 ? <p>{m.longMail}</p> : null}
              </div>
            </div>
          ) : null}
        </>
      )}

      {msg ? <p className="mt-3 text-sm text-red-700">{msg}</p> : null}
    </section>
  );
}