"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ResumeData } from "@/lib/resume-schema";
import { Lang } from "@/lib/labels";
import { Ui } from "@/lib/i18n";

const newId = () => Math.random().toString(36).slice(2, 9);
const CONSENT_KEY = "rc_ai_consent";

const CONSENT = {
  en: {
    text: "I understand that the text I write here is sent to an AI service, which may be located outside Morocco, to write my draft. I will not include ID numbers or other sensitive details.",
    needed: "Please tick the box to confirm before using the AI Writer.",
  },
  fr: {
    text: "Je comprends que le texte que j'écris ici est envoyé à un service d'IA, qui peut être situé hors du Maroc, pour rédiger mon brouillon. Je n'y mettrai ni numéro de pièce d'identité ni autre information sensible.",
    needed: "Cochez la case pour confirmer avant d'utiliser le Rédacteur IA.",
  },
};

type AiResume = {
  personal: Record<string, string>;
  summary: string;
  experience: {
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  education: {
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    details: string;
  }[];
  skills: string[];
  customSections: { title: string; items: string[] }[];
};

export default function AiWriter({
  form,
  categoryName,
  resumeLanguage,
  uiLang,
  t,
  onApplied,
}: {
  form: UseFormReturn<ResumeData>;
  categoryName: string;
  resumeLanguage: "English" | "French";
  uiLang: Lang;
  t: Ui;
  onApplied?: () => void;
}) {
  const c = CONSENT[uiLang];

  const [prompt, setPrompt] = useState("");
  const [useCurrent, setUseCurrent] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Remember the confirmation on this device
  useEffect(() => {
    try {
      if (window.localStorage.getItem(CONSENT_KEY) === "1") setAgreed(true);
    } catch {
      // ignore
    }
  }, []);

  function toggleAgreed(value: boolean) {
    setAgreed(value);
    try {
      if (value) window.localStorage.setItem(CONSENT_KEY, "1");
      else window.localStorage.removeItem(CONSENT_KEY);
    } catch {
      // ignore
    }
  }

  async function generate() {
    if (!agreed) {
      setError(c.needed);
      return;
    }
    if (prompt.trim().length < 20) {
      setError(t.aiTooShort);
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const values = form.getValues();
      const current = useCurrent
        ? { ...values, personal: { ...values.personal, photo: undefined } }
        : undefined;

      const res = await fetch("/api/ai-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          language: resumeLanguage,
          category: categoryName,
          current,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.aiUnavailable);

      const r = data.resume as AiResume;

      form.reset({
        personal: {
          fullName: r.personal.fullName ?? "",
          jobTitle: r.personal.jobTitle ?? "",
          email: r.personal.email ?? "",
          phone: r.personal.phone ?? "",
          location: r.personal.location ?? "",
          website: r.personal.website ?? "",
          linkedin: r.personal.linkedin ?? "",
          photo: values.personal.photo,
        },
        summary: r.summary ?? "",
        experience: r.experience.map((j) => ({ id: newId(), ...j })),
        education: r.education.map((e) => ({ id: newId(), ...e })),
        skills: r.skills ?? [],
        customSections: r.customSections.map((s) => ({ id: newId(), ...s })),
      });
      onApplied?.();

      setMessage(data.message || t.aiReady);
      setUseCurrent(true);
      setPrompt("");
    } catch (e) {
      setError(e instanceof Error ? e.message : t.somethingWrong);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="m-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold text-black">{t.aiTitle}</h2>
        <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
          {t.aiNew}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">
        {t.aiIntro(t.langNames[resumeLanguage])}
      </p>

      <textarea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={t.aiPlaceholder}
        className="mt-3 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        {t.aiExamples.map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPrompt(ex)}
            className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs text-gray-700 hover:border-blue-500"
          >
            {t.aiExample} {i + 1}
          </button>
        ))}
      </div>

      <label className="mt-3 flex items-start gap-2 text-xs text-gray-700">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={agreed}
          onChange={(e) => toggleAgreed(e.target.checked)}
        />
        <span>{c.text}</span>
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-700">
          <input
            type="checkbox"
            checked={useCurrent}
            onChange={(e) => setUseCurrent(e.target.checked)}
          />
          {t.aiImprove}
        </label>

        <button
          type="button"
          onClick={generate}
          disabled={loading || !agreed}
          className="ml-auto rounded bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t.aiWriting : useCurrent ? t.aiUpdate : t.aiWrite}
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        {useCurrent ? t.aiTip : t.aiReplaces}
      </p>
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      {message ? <p className="mt-2 text-xs text-green-700">{message}</p> : null}
    </div>
  );
}