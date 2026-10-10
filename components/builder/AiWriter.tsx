"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ResumeData } from "@/lib/resume-schema";

const examples = [
  "I'm in my last year of nursing school. I did clinical placements in the ER, pediatrics and geriatrics, I speak Arabic, French and English, and I want my first hospital job.",
  "I worked 3 years as a sales assistant, then 2 years as a team leader in a clothing store. I want to move into customer service management.",
  "I'm a computer science student. I built a React website for a local shop and I'm looking for a summer internship in web development.",
];

const newId = () => Math.random().toString(36).slice(2, 9);

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
}: {
  form: UseFormReturn<ResumeData>;
  categoryName: string;
}) {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState<"English" | "French">("English");
  const [useCurrent, setUseCurrent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function generate() {
    if (prompt.trim().length < 20) {
      setError("Please write a few more details (at least a couple of sentences).");
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
          language,
          category: categoryName,
          current,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The AI writer is unavailable.");

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
        customSections: r.customSections.map((c) => ({ id: newId(), ...c })),
      });

      setMessage(data.message || "Your resume is ready.");
      setUseCurrent(true);
      setPrompt("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="m-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold text-black">AI Writer</h2>
        <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
          NEW
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">
        Tell us about yourself in your own words and we write the resume for you.
        We never invent facts: missing numbers appear as [brackets] for you to
        fill in.
      </p>

      <textarea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Example: I'm a final-year student, I did 3 placements, I speak 3 languages and I want my first job..."
        className="mt-3 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        {examples.map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPrompt(ex)}
            className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs text-gray-700 hover:border-blue-500"
          >
            Example {i + 1}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "English" | "French")}
          className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-black"
        >
          <option value="English">Write in English</option>
          <option value="French">Write in French</option>
        </select>

        <label className="flex items-center gap-2 text-xs text-gray-700">
          <input
            type="checkbox"
            checked={useCurrent}
            onChange={(e) => setUseCurrent(e.target.checked)}
          />
          Improve my current resume instead of starting over
        </label>

        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="ml-auto rounded bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Writing..." : useCurrent ? "Update my resume" : "Write my resume"}
        </button>
      </div>

      {!useCurrent && (
        <p className="mt-2 text-xs text-gray-500">
          This replaces the resume currently shown.
        </p>
      )}
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      {message ? <p className="mt-2 text-xs text-green-700">{message}</p> : null}
    </div>
  );
}