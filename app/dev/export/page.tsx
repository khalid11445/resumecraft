"use client";

import { useState } from "react";
import { examples, Example } from "@/lib/examples";
import { getCategory } from "@/lib/categories";
import { getTemplate } from "@/lib/templates";

async function renderPng(ex: Example): Promise<Blob> {
  const { pdf } = await import("@react-pdf/renderer");
  const Template = getTemplate(ex.template).component;
  const data = getCategory(ex.category).starter;

  const pdfBlob = await pdf(<Template data={data} accent={ex.accent} />).toBlob();
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

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportPage() {
  const [status, setStatus] = useState<Record<string, string>>({});

  async function exportOne(ex: Example) {
    setStatus((s) => ({ ...s, [ex.id]: "Working..." }));
    try {
      save(await renderPng(ex), `${ex.id}.png`);
      setStatus((s) => ({ ...s, [ex.id]: "Done" }));
    } catch (e) {
      setStatus((s) => ({
        ...s,
        [ex.id]: e instanceof Error ? e.message : "Error",
      }));
    }
  }

  async function exportAll() {
    for (const ex of examples) {
      await exportOne(ex);
      await new Promise((r) => setTimeout(r, 700));
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Example image generator</h1>
      <p className="mt-2 text-sm text-gray-600">
        Creates one PNG per example. Files go to your Downloads folder, then you
        move them into <code>public/examples</code>. If your browser asks to
        allow multiple downloads, click Allow.
      </p>

      <button
        type="button"
        onClick={exportAll}
        className="mt-6 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        Generate all {examples.length} images
      </button>

      <ul className="mt-6 space-y-2">
        {examples.map((ex) => (
          <li
            key={ex.id}
            className="flex items-center justify-between rounded border border-gray-200 p-3"
          >
            <span className="text-sm">
              {ex.label}
              <span className="ml-2 text-xs text-gray-500">{status[ex.id]}</span>
            </span>
            <button
              type="button"
              onClick={() => exportOne(ex)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}