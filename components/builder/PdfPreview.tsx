"use client";

import { ComponentType, useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume-schema";

type Props = {
  Template: ComponentType<{ data: ResumeData }>;
  data: ResumeData;
};

export default function PdfPreview({ Template, data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Each change starts a new "run"; older runs stop when a newer one begins
    const run = ++runRef.current;

    (async () => {
      try {
        const blob = await pdf(<Template data={data} />).toBlob();
        if (run !== runRef.current) return;

        const buffer = await blob.arrayBuffer();
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const doc = await pdfjs.getDocument({ data: buffer }).promise;
        if (run !== runRef.current) return;

        const container = containerRef.current;
        if (!container) return;

        const width = Math.max(container.clientWidth - 32, 200);
        const dpr = window.devicePixelRatio || 1;
        const canvases: HTMLCanvasElement[] = [];

        // Draw every page off-screen first
        for (let n = 1; n <= doc.numPages; n++) {
          const page = await doc.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const scale = width / base.width;
          const viewport = page.getViewport({ scale: scale * dpr });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = `${width}px`;
          canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;
          canvas.className = "mx-auto mb-4 bg-white shadow-md";

          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          await page.render({ canvasContext: ctx, viewport }).promise;
          if (run !== runRef.current) return;
          canvases.push(canvas);
        }

        // Swap everything at once: no flash, scroll position is kept
        container.replaceChildren(...canvases);
        setReady(true);
        doc.destroy();
      } catch (err) {
        console.error("Preview error:", err);
      }
    })();
  }, [Template, data]);

  return (
    <div className="relative h-full w-full bg-gray-100">
      {!ready && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
          Loading preview...
        </p>
      )}
      <div ref={containerRef} className="h-full w-full overflow-y-auto p-4" />
    </div>
  );
}