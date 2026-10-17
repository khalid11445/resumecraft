"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, ResumeData } from "@/lib/resume-schema";
import { getCategory } from "@/lib/catalog";
import BuilderForm from "@/components/builder/BuilderForm";
import AiWriter from "@/components/builder/AiWriter";
import QuickEdit from "@/components/builder/QuickEdit";
import PdfPreview from "@/components/builder/PdfPreview";
import ReadabilityPanel from "@/components/builder/ReadabilityPanel";
import JobMatchPanel from "@/components/builder/JobMatchPanel";
import { findEditFields, EditField } from "@/lib/quickedit";
import { analyzeResume, ReadabilityResult } from "@/lib/readability";
import { countPlaceholders } from "@/lib/placeholders";
import { loadDraft, saveDraft, clearDraft, normalizeResume } from "@/lib/draft";
import { templates, getTemplate } from "@/lib/templates";
import { palettes, categoryAccent } from "@/lib/themes";
import { Lang } from "@/lib/labels";
import { getUi } from "@/lib/i18n";
import { useDownloadGate } from "@/lib/useDownloadGate";

type Tab = "edit" | "preview";

const tabClass = (active: boolean) =>
  `flex-1 py-2.5 text-sm font-semibold ${
    active ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
  }`;

export default function BuilderClient({ uiLang = "en" }: { uiLang?: Lang }) {
  const t = getUi(uiLang);
  const tabLabels =
    uiLang === "fr"
      ? { edit: "Modifier", preview: "Aperçu" }
      : { edit: "Edit", preview: "Preview" };
  const checkLabels =
    uiLang === "fr"
      ? {
          check: "Vérifier la lisibilité",
          checking: "Analyse...",
          match: "Comparer à une offre",
        }
      : {
          check: "Check readability",
          checking: "Checking...",
          match: "Match a job posting",
        };
  const draftText =
    uiLang === "fr"
      ? {
          saved: "Enregistré automatiquement sur cet appareil.",
          restored: (d: string) => `Brouillon restauré (${d}).`,
          startOver: "Recommencer",
          confirm: "Effacer votre CV actuel et recommencer à zéro ?",
          shared:
            "Ordinateur partagé ? Cliquez sur « Recommencer » quand vous avez terminé.",
        }
      : {
          saved: "Saved automatically on this device.",
          restored: (d: string) => `Draft restored (${d}).`,
          startOver: "Start over",
          confirm: "Erase your current resume and start from scratch?",
          shared: "Shared computer? Click “Start over” when you are done.",
        };

  // Set NEXT_PUBLIC_AI_ENABLED=false to hide the AI Writer
  const aiEnabled = process.env.NEXT_PUBLIC_AI_ENABLED !== "false";

  const params = useParams<{ category: string }>();
  const categoryId = String(params.category);
  const category = getCategory(categoryId, uiLang);

  const search = useSearchParams();
  const qTemplate = search.get("template");
  const qColor = search.get("color");
  const qLang = search.get("lang");
  const initialLang: Lang = qLang === "fr" || qLang === "en" ? qLang : uiLang;

  const gate = useDownloadGate(uiLang);

  const [tab, setTab] = useState<Tab>("edit");
  const [lang, setLang] = useState<Lang>(initialLang);
  const [templateId, setTemplateId] = useState(
    templates.some((x) => x.id === qTemplate) ? (qTemplate as string) : "elegant"
  );
  const Template = getTemplate(templateId).component;
  const [accent, setAccent] = useState(
    qColor && /^[0-9a-fA-F]{6}$/.test(qColor)
      ? `#${qColor}`
      : categoryAccent[category.id] ?? palettes[0].accent
  );

  const starter = getCategory(categoryId, initialLang).starter;

  const [checking, setChecking] = useState(false);
  const [report, setReport] = useState<ReadabilityResult | null>(null);
  const [matchOpen, setMatchOpen] = useState(false);
  const [error, setError] = useState("");
  const [quick, setQuick] = useState<{
    fields: EditField[];
    x: number;
    y: number;
  } | null>(null);

  // Saved draft: true once the restore attempt is done, and when it was saved
  const [restored, setRestored] = useState(false);
  const [restoredAt, setRestoredAt] = useState<string | null>(null);
  // Changing this number rebuilds the form panel so its small local states
  // (photo checkbox, "currently working" boxes) match the new content
  const [formVersion, setFormVersion] = useState(0);

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: starter,
    mode: "onChange",
  });

  const liveData = form.watch() as ResumeData;

  const [previewData, setPreviewData] = useState<ResumeData>(starter);
  useEffect(() => {
    const timer = setTimeout(() => setPreviewData(structuredClone(liveData)), 500);
    return () => clearTimeout(timer);
  }, [JSON.stringify(liveData)]); // eslint-disable-line react-hooks/exhaustive-deps

  // Restore the saved draft once, when the page opens
  useEffect(() => {
    const draft = loadDraft(categoryId);
    if (draft) {
      // A link from the examples gallery keeps its own template and color
      if (!qTemplate && templates.some((x) => x.id === draft.templateId)) {
        setTemplateId(draft.templateId);
      }
      if (!qColor && /^#[0-9a-fA-F]{6}$/.test(draft.accent)) {
        setAccent(draft.accent);
      }
      // Only a resume the visitor really edited is restored
      if (draft.data) {
        form.reset(draft.data);
        setPreviewData(structuredClone(draft.data));
        if (!qLang && (draft.lang === "en" || draft.lang === "fr")) {
          setLang(draft.lang);
        }
        setRestoredAt(draft.savedAt || null);
        setFormVersion((v) => v + 1);
      }
    }
    setRestored(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save the draft shortly after every change
  useEffect(() => {
    if (!restored) return;

    const timer = setTimeout(() => {
      // A resume still identical to the sample is not saved as content
      const json = JSON.stringify(normalizeResume(liveData));
      const untouched = (["en", "fr"] as Lang[]).some(
        (l) =>
          JSON.stringify(normalizeResume(getCategory(categoryId, l).starter)) === json
      );
      saveDraft(categoryId, {
        data: untouched ? null : liveData,
        templateId,
        accent,
        lang,
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [restored, categoryId, templateId, accent, lang, JSON.stringify(liveData)]); // eslint-disable-line react-hooks/exhaustive-deps

  function startOver() {
    if (!window.confirm(draftText.confirm)) return;
    clearDraft(categoryId);
    form.reset(starter);
    setPreviewData(structuredClone(starter));
    setRestoredAt(null);
    setFormVersion((v) => v + 1);
  }

  // True while any suggested line still contains a [bracket] placeholder
  const hasPlaceholders = countPlaceholders(liveData) > 0;

  function handlePick(text: string, x: number, y: number) {
    const fields = findEditFields(form, text);
    setQuick(fields.length ? { fields, x, y } : null);
  }

  // Adds a term to the skills list (used by the job-posting match)
  function addSkill(term: string) {
    const current = (form.getValues("skills") ?? []).filter((s) => s.trim());
    if (current.some((s) => s.trim().toLowerCase() === term.toLowerCase())) return;
    form.setValue("skills", [...current, term], { shouldDirty: true });
  }

  function saveBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // The two download actions. They are wrapped by gate.run() on the buttons
  async function doDownload() {
    setError("");
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(
        <Template data={previewData} accent={accent} lang={lang} />
      ).toBlob();
      saveBlob(blob, `${previewData.personal.fullName || "cv"}.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.somethingWrong);
    }
  }

  // Exports the first page of the resume as a PNG image
  async function doImage() {
    setError("");
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const pdfBlob = await pdf(
        <Template data={previewData} accent={accent} lang={lang} />
      ).toBlob();
      const buffer = await pdfBlob.arrayBuffer();

      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const doc = await pdfjs.getDocument({ data: buffer }).promise;
      const page = await doc.getPage(1);
      const viewport = page.getViewport({ scale: 2.5 });

      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;

      canvas.toBlob((blob) => {
        if (blob) saveBlob(blob, `${previewData.personal.fullName || "cv"}.png`);
      }, "image/png");
      doc.destroy();
    } catch (e) {
      setError(e instanceof Error ? e.message : t.imageError);
    }
  }

  // Builds the PDF and reads it back like a simple text reader
  async function handleCheck() {
    setError("");
    setChecking(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(
        <Template data={previewData} accent={accent} lang={lang} />
      ).toBlob();
      setReport(
        await analyzeResume(
          blob,
          previewData,
          getTemplate(templateId).columns,
          lang,
          uiLang
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : t.somethingWrong);
    } finally {
      setChecking(false);
    }
  }

  const locale = uiLang === "fr" ? "fr-FR" : "en-US";

  // Small line shown once a valid code is saved in this browser
  const passText = gate.pass.active
    ? `${uiLang === "fr" ? "Accès au téléchargement actif" : "Download pass active"}${
        gate.pass.expiresAt
          ? ` ${uiLang === "fr" ? "jusqu'au" : "until"} ${new Date(
              gate.pass.expiresAt
            ).toLocaleDateString(locale)}`
          : ""
      }`
    : "";

  // Pieces used in two places: the edit panel and the mobile preview bar
  const templateButtons = templates.map((tpl) => (
    <button
      key={tpl.id}
      type="button"
      onClick={() => setTemplateId(tpl.id)}
      className={`shrink-0 whitespace-nowrap rounded border px-3 py-1 text-sm ${
        templateId === tpl.id
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-gray-300 bg-white text-black"
      }`}
    >
      {tpl.name}
    </button>
  ));

  const colorDots = palettes.map((p) => (
    <button
      key={p.id}
      type="button"
      title={p.name}
      aria-label={p.name}
      onClick={() => setAccent(p.accent)}
      className={`h-6 w-6 shrink-0 rounded-full border-2 ${
        accent === p.accent ? "border-black" : "border-white ring-1 ring-gray-300"
      }`}
      style={{ backgroundColor: p.accent }}
    />
  ));

  const downloadButtons = (
    <>
      <button
        type="button"
        onClick={() => gate.run(doDownload)}
        className="rounded bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
      >
        {t.downloadPdf}
      </button>
      <button
        type="button"
        onClick={() => gate.run(doImage)}
        className="rounded border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-50"
      >
        {t.downloadImage}
      </button>
      <button
        type="button"
        onClick={handleCheck}
        disabled={checking}
        className="rounded border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-50 disabled:opacity-50"
      >
        {checking ? checkLabels.checking : checkLabels.check}
      </button>
      <button
        type="button"
        onClick={() => setMatchOpen(true)}
        className="rounded border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-50"
      >
        {checkLabels.match}
      </button>
    </>
  );

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] w-full flex-col lg:flex-row">
      {/* Tabs, phones and tablets only */}
      <div className="flex shrink-0 border-b border-gray-200 bg-white lg:hidden">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={tabClass(tab === "edit")}
        >
          {tabLabels.edit}
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={tabClass(tab === "preview")}
        >
          {tabLabels.preview}
        </button>
      </div>

      {/* Edit panel */}
      <div
        className={`${
          tab === "edit" ? "block" : "hidden"
        } min-h-0 w-full flex-1 overflow-y-auto border-gray-300 bg-white lg:block lg:w-1/2 lg:flex-none lg:border-r`}
      >
        <div className="border-b border-gray-200 p-4">
          <p className="text-xs text-gray-500">{t.category}</p>
          <p className="font-semibold text-black">{category.name}</p>
          <p className="mt-1 text-xs text-gray-500">
            {t.suggestedSections}: {category.recommendedSections.join(", ")}
          </p>

          {/* Resume language */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">{t.resumeLanguage}</span>
            {(["en", "fr"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`rounded border px-3 py-1 text-sm ${
                  lang === l
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                {l === "en" ? "English" : "Français"}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {templateButtons}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">{t.color}</span>
            {colorDots}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {downloadButtons}
          </div>

          {passText ? (
            <p className="mt-2 text-xs text-green-700">✓ {passText}</p>
          ) : null}
          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
          {hasPlaceholders ? (
            <p className="mt-2 text-xs text-amber-700">{t.placeholderWarning}</p>
          ) : null}

          {restored ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
              <span>
                {restoredAt
                  ? draftText.restored(
                      new Date(restoredAt).toLocaleString(locale, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    )
                  : draftText.saved}
              </span>
              <button
                type="button"
                onClick={startOver}
                className="font-semibold text-red-600 hover:underline"
              >
                {draftText.startOver}
              </button>
            </div>
          ) : null}
          <p className="mt-1 text-xs text-gray-400">{draftText.shared}</p>
        </div>

        {aiEnabled ? (
          <AiWriter
            form={form}
            categoryName={category.name}
            resumeLanguage={lang === "fr" ? "French" : "English"}
            uiLang={uiLang}
            t={t}
            onApplied={() => setFormVersion((v) => v + 1)}
          />
        ) : null}
        <BuilderForm
          key={formVersion}
          form={form}
          categoryId={category.id}
          t={t}
          contentLang={lang}
        />
      </div>

      {/* Preview panel */}
      <div
        className={`${
          tab === "preview" ? "flex" : "hidden"
        } min-h-0 w-full flex-1 flex-col lg:flex lg:w-1/2 lg:flex-none`}
      >
        {/* Compact controls, phones and tablets only */}
        <div className="shrink-0 space-y-2 border-b border-gray-200 bg-white p-2 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">{templateButtons}</div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {colorDots}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {downloadButtons}
            </div>
          </div>
          {passText ? <p className="text-xs text-green-700">✓ {passText}</p> : null}
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          {hasPlaceholders ? (
            <p className="text-xs text-amber-700">{t.placeholderWarning}</p>
          ) : null}
        </div>

        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0">
            <PdfPreview
              Template={Template}
              data={previewData}
              accent={accent}
              lang={lang}
              hint={t.previewHint}
              loadingText={t.loadingPreview}
              onPickText={handlePick}
            />
          </div>
        </div>
      </div>

      {quick ? (
        <QuickEdit
          key={`${quick.fields.map((f) => f.id).join("|")}-${quick.x}-${quick.y}`}
          fields={quick.fields}
          x={quick.x}
          y={quick.y}
          t={t}
          onClose={() => setQuick(null)}
        />
      ) : null}

      {report ? (
        <ReadabilityPanel
          result={report}
          ui={uiLang}
          onClose={() => setReport(null)}
        />
      ) : null}

      {matchOpen ? (
        <JobMatchPanel
          resume={liveData}
          ui={uiLang}
          onAddSkill={addSkill}
          onClose={() => setMatchOpen(false)}
        />
      ) : null}

      {gate.modal}
    </div>
  );
}