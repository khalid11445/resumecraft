"use client";

import { useEffect, useState } from "react";
import { Lang } from "@/lib/labels";
import { ResumeData } from "@/lib/resume-schema";
import { matchJob, MatchResult } from "@/lib/jobmatch";

const T = {
  en: {
    title: "Match a job posting",
    intro:
      "Paste a job ad. We list the key terms it uses and show which ones your resume already contains. Everything stays in your browser: the ad is not sent anywhere.",
    placeholder: "Paste the full job posting here...",
    compare: "Compare",
    again: "Compare again",
    tooShort:
      "The text is very short. Paste the full job ad for a useful comparison.",
    summary: (a: number, b: number) =>
      `${a} of ${b} key terms from the ad appear in your resume`,
    covered: "Already in your resume",
    missing: "Not found in your resume",
    none: "None",
    addTip: "Add to my skills",
    added: "Added",
    honest:
      "Add a term only if it is true for you. If you have the skill but used a different word, reword the line in your experience instead of just listing it. Names of companies, cities or tools you do not use can be ignored.",
    overused: "Words repeated many times in your resume",
    overusedHint:
      "Repeating a word to please software makes a resume harder to read, and recruiters notice it.",
    times: "times",
    limits:
      "This is a simple word comparison. It is not a score, and it does not predict how an employer's system or a recruiter will rank you. Specific, true examples matter more than keywords.",
    close: "Close",
  },
  fr: {
    title: "Comparer à une offre d'emploi",
    intro:
      "Collez une offre d'emploi. Nous listons les termes clés qu'elle emploie et montrons lesquels figurent déjà dans votre CV. Tout reste dans votre navigateur : l'offre n'est envoyée nulle part.",
    placeholder: "Collez ici l'offre d'emploi complète...",
    compare: "Comparer",
    again: "Comparer à nouveau",
    tooShort:
      "Le texte est très court. Collez l'offre complète pour obtenir une comparaison utile.",
    summary: (a: number, b: number) =>
      `${a} termes clés sur ${b} de l'offre figurent dans votre CV`,
    covered: "Déjà dans votre CV",
    missing: "Absents de votre CV",
    none: "Aucun",
    addTip: "Ajouter à mes compétences",
    added: "Ajouté",
    honest:
      "N'ajoutez un terme que s'il est vrai pour vous. Si vous avez la compétence mais avec un autre mot, reformulez la ligne de votre expérience plutôt que de simplement la lister. Les noms d'entreprises, de villes ou d'outils que vous n'utilisez pas peuvent être ignorés.",
    overused: "Mots répétés de nombreuses fois dans votre CV",
    overusedHint:
      "Répéter un mot pour plaire à un logiciel rend le CV plus difficile à lire, et les recruteurs le remarquent.",
    times: "fois",
    limits:
      "Il s'agit d'une simple comparaison de mots. Ce n'est pas une note, et cela ne prédit pas comment le système d'un employeur ou un recruteur vous classera. Des exemples précis et vrais comptent plus que les mots-clés.",
    close: "Fermer",
  },
};

export default function JobMatchPanel({
  resume,
  ui,
  onAddSkill,
  onClose,
}: {
  resume: ResumeData;
  ui: Lang;
  onAddSkill: (term: string) => void;
  onClose: () => void;
}) {
  const t = T[ui];
  const [posting, setPosting] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [added, setAdded] = useState<string[]>([]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function compare() {
    setResult(matchJob(posting, resume));
    setAdded([]);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl"
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

        <textarea
          rows={6}
          value={posting}
          onChange={(e) => setPosting(e.target.value)}
          placeholder={t.placeholder}
          className="mt-3 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black"
        />
        <button
          type="button"
          onClick={compare}
          className="mt-2 rounded bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {result ? t.again : t.compare}
        </button>

        {result?.tooShort ? (
          <p className="mt-3 text-sm text-amber-700">{t.tooShort}</p>
        ) : null}

        {result && !result.tooShort ? (
          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-900">
              {t.summary(result.covered.length, result.total)}
            </p>

            <h3 className="mt-4 text-sm font-bold text-green-700">{t.covered}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.covered.length === 0 ? (
                <span className="text-xs text-gray-500">{t.none}</span>
              ) : (
                result.covered.map((r) => (
                  <span
                    key={r.term}
                    className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-800"
                  >
                    ✓ {r.term}
                  </span>
                ))
              )}
            </div>

            <h3 className="mt-4 text-sm font-bold text-amber-700">{t.missing}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.missing.length === 0 ? (
                <span className="text-xs text-gray-500">{t.none}</span>
              ) : (
                result.missing.map((r) => {
                  const done = added.includes(r.term);
                  return (
                    <span
                      key={r.term}
                      className="inline-flex items-center gap-1 rounded-full bg-amber-100 py-1 pl-3 pr-1 text-xs text-amber-900"
                    >
                      {r.term}
                      <button
                        type="button"
                        disabled={done}
                        title={t.addTip}
                        onClick={() => {
                          onAddSkill(r.term);
                          setAdded((a) => [...a, r.term]);
                        }}
                        className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-amber-900 hover:bg-amber-50 disabled:opacity-60"
                      >
                        {done ? t.added : "+"}
                      </button>
                    </span>
                  );
                })
              )}
            </div>

            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
              {t.honest}
            </p>

            {result.overused.length > 0 ? (
              <>
                <h3 className="mt-4 text-sm font-bold text-gray-900">{t.overused}</h3>
                <p className="mt-1 text-xs text-gray-600">{t.overusedHint}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.overused.map((o) => (
                    <span
                      key={o.term}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800"
                    >
                      {o.term} · {o.count} {t.times}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        <p className="mt-5 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
          {t.limits}
        </p>
      </div>
    </div>
  );
}