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
import { findEditFields, EditField } from "@/lib/quickedit";
import { templates, getTemplate } from "@/lib/templates";
import { palettes, categoryAccent } from "@/lib/themes";
import { Lang } from "@/lib/labels";
import { getUi } from "@/lib/i18n";

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

  const params = useParams<{ category: string }>();
  const categoryId = String(params.category);
  const category = getCategory(categoryId, uiLang);

  const search = useSearchParams();
  const qTemplate = search.get("template");
  const qColor = search.get("color");
  const qLang = search.get("lang");
  const initialLang: Lang = qLang === "fr" || qLang === "en" ? qLang : uiLang;

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

  const [resumeId] = useState(() => crypto.randomUUID());
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [quick, setQuick] = useState<{
    fields: EditField[];
    x: number;
    y: number;
  } | null>(null);

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

  const freeMode = process.env.NEXT_PUBLIC_FREE_DOWNLOAD === "true";

  // True while any suggested line still contains [brackets]
  const hasPlaceholders = /\[[^\]]*\]/.test(JSON.stringify(liveData));

  function handlePick(text: string, x: number, y: number) {
    const fields = findEditFields(form, text);
    setQuick(fields.length ? { fields, x, y } : null);
  }

  function saveBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDownload() {
    setError("");

    // Temporary: free download while payments are being set up
    if (freeMode) {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(
        <Template data={previewData} accent={accent} lang={lang} />
      ).toBlob();
      saveBlob(blob, `${previewData.personal.fullName || "cv"}.pdf`);
      return;
    }

    setPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          category: category.id,
          template: templateId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : t.somethingWrong);
      setPaying(false);
    }
  }

  // Exports the first page of the resume as a PNG image
  async function handleImage() {
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
        onClick={handleDownload}
        disabled={paying}
        className="rounded bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >
        {paying ? t.openingCheckout : t.downloadPdf}
      </button>
      {freeMode && (
        <button
          type="button"
          onClick={handleImage}
          className="rounded border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-50"
        >
          {t.downloadImage}
        </button>
      )}
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

          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
          {hasPlaceholders ? (
            <p className="mt-2 text-xs text-amber-700">{t.placeholderWarning}</p>
          ) : null}
        </div>

        <AiWriter
          form={form}
          categoryName={category.name}
          resumeLanguage={lang === "fr" ? "French" : "English"}
          t={t}
        />
        <BuilderForm
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
            <div className="flex items-center gap-2">{downloadButtons}</div>
          </div>
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
    </div>
  );
}