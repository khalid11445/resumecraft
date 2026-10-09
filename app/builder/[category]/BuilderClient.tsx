"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, ResumeData } from "@/lib/resume-schema";
import { getCategory } from "@/lib/categories";
import BuilderForm from "@/components/builder/BuilderForm";
import PdfPreview from "@/components/builder/PdfPreview";
import { templates, getTemplate } from "@/lib/templates";
import { palettes, categoryAccent } from "@/lib/themes";

export default function BuilderPage() {
  const params = useParams<{ category: string }>();
  const category = getCategory(String(params.category));
  const [templateId, setTemplateId] = useState("elegant");
  const Template = getTemplate(templateId).component;
  const [accent, setAccent] = useState(
    categoryAccent[category.id] ?? palettes[0].accent
  );

  const [resumeId] = useState(() => crypto.randomUUID());
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: category.starter,
    mode: "onChange",
  });

  const liveData = form.watch() as ResumeData;

  const [previewData, setPreviewData] = useState<ResumeData>(category.starter);
  useEffect(() => {
    const t = setTimeout(() => setPreviewData(structuredClone(liveData)), 500);
    return () => clearTimeout(t);
  }, [JSON.stringify(liveData)]); // eslint-disable-line react-hooks/exhaustive-deps

  const freeMode = process.env.NEXT_PUBLIC_FREE_DOWNLOAD === "true";

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
        <Template data={previewData} accent={accent} />
      ).toBlob();
      saveBlob(blob, `${previewData.personal.fullName || "resume"}.pdf`);
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
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPaying(false);
    }
  }

  // Exports the first page of the resume as a PNG image
  async function handleImage() {
    setError("");
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const pdfBlob = await pdf(
        <Template data={previewData} accent={accent} />
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
        if (blob) saveBlob(blob, `${previewData.personal.fullName || "resume"}.png`);
      }, "image/png");
      doc.destroy();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the image");
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      <div className="w-1/2 overflow-y-auto border-r border-gray-300 bg-white">
        <div className="border-b border-gray-200 p-4">
          <p className="text-xs text-gray-500">Category</p>
          <p className="font-semibold text-black">{category.name}</p>
          <p className="mt-1 text-xs text-gray-500">
            Suggested sections: {category.recommendedSections.join(", ")}
          </p>

          {/* Templates */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`rounded border px-3 py-1 text-sm ${
                  templateId === t.id
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Colors */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">Color</span>
            {palettes.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.name}
                aria-label={p.name}
                onClick={() => setAccent(p.accent)}
                className={`h-6 w-6 rounded-full border-2 ${
                  accent === p.accent
                    ? "border-black"
                    : "border-white ring-1 ring-gray-300"
                }`}
                style={{ backgroundColor: p.accent }}
              />
            ))}
          </div>

          {/* Downloads */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={paying}
              className="rounded bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {paying ? "Opening checkout..." : "Download PDF"}
            </button>
            {freeMode && (
              <button
                type="button"
                onClick={handleImage}
                className="rounded border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-50"
              >
                Download image
              </button>
            )}
          </div>
          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
        </div>
        <BuilderForm form={form} />
      </div>

      <div className="w-1/2">
        <PdfPreview Template={Template} data={previewData} accent={accent} />
      </div>
    </div>
  );
}