"use client";

import { useState } from "react";
import { examples, Example } from "@/lib/examples";
import { getCategory } from "@/lib/catalog";
import { getTemplate } from "@/lib/templates";
import { Lang } from "@/lib/labels";

async function renderPng(ex: Example, lang: Lang): Promise<Blob> {
  const { pdf } = await import("@react-pdf/renderer");
  const Template = getTemplate(ex.template).component;
  const data = getCategory(ex.category, lang).starter;

  const pdfBlob = await pdf(
    <Template data={data} accent={ex.accent} lang={lang} />
  ).toBlob();
  const buffer = await pdfBlob.arrayBuffer();

  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: 2 });

  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  doc.destroy();

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("PNG failed"))),
      "image/png"
    )
  );
}

async function saveToProject(ex: Example, lang: Lang, blob: Blob) {
  const form = new FormData();
  form.append("file", blob, "image.png");
  form.append("name", ex.id);
  form.append("lang", lang);

  const res = await fetch("/api/dev/save-example", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Save failed");
  return data.filename as string;
}

export default function ExportPage() {
  const [status, setStatus] = useState<Record<string, string>>({});

  async function exportOne(ex: Example, lang: Lang) {
    const key = `${lang}:${ex.id}`;
    setStatus((s) => ({ ...s, [key]: "Working..." }));
    try {
      const blob = await renderPng(ex, lang);
      const filename = await saveToProject(ex, lang, blob);
      setStatus((s) => ({ ...s, [key]: `Saved: ${filename}` }));
    } catch (e) {
      setStatus((s) => ({
        ...s,
        [key]: `Error: ${e instanceof Error ? e.message : "unknown"}`,
      }));
    }
  }

  async function exportAll(lang: Lang) {
    for (const ex of examples) {
      await exportOne(ex, lang);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Example image generator</h1>
      <p className="mt-2 text-sm text-gray-600">
        Creates one image per example and saves it directly into{" "}
        <code>public/examples</code>. No download or file moving needed. Works
        only with <code>npm run dev</code> on your computer.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => exportAll("en")}
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Generate and save English images ({examples.length})
        </button>
        <button
          type="button"
          onClick={() => exportAll("fr")}
          className="rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
        >
          Generate and save French images ({examples.length})
        </button>
      </div>

      <ul className="mt-6 space-y-2">
        {examples.map((ex) => (
          <li key={ex.id} className="rounded border border-gray-200 p-3 text-sm">
            <p className="font-medium">{ex.label}</p>
            {(["en", "fr"] as Lang[]).map((l) => (
              <p key={l} className="mt-1 flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => exportOne(ex, l)}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {l.toUpperCase()}
                </button>
                <span
                  className={
                    status[`${l}:${ex.id}`]?.startsWith("Error")
                      ? "text-red-600"
                      : "text-gray-600"
                  }
                >
                  {status[`${l}:${ex.id}`] ?? ""}
                </span>
              </p>
            ))}
          </li>
        ))}
      </ul>
    </main>
  );
}