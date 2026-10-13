"use client";

import { ReactElement, useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";

const ZOOMS = [0.75, 1, 1.25, 1.5, 2];

export default function DocPreview({
  element,
  docKey,
  hint,
  loadingText,
}: {
  element: ReactElement;
  docKey: string;
  hint?: string;
  loadingText?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runRef = useRef(0);
  const elementRef = useRef(element);
  elementRef.current = element;

  const [ready, setReady] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(1);
  const [boxWidth, setBoxWidth] = useState(0);
  const zoom = ZOOMS[zoomIndex];

  // Tracks the visible width (0 while hidden on the other mobile tab)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = Math.round(el.clientWidth);
      setBoxWidth((prev) =>
        prev === 0 || w === 0 || Math.abs(prev - w) > 24 ? w : prev
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (boxWidth < 120) return;
    const run = ++runRef.current;

    (async () => {
      try {
        const blob = await pdf(
          elementRef.current as Parameters<typeof pdf>[0]
        ).toBlob();
        if (run !== runRef.current) return;

        const buffer = await blob.arrayBuffer();
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const doc = await pdfjs.getDocument({ data: buffer }).promise;
        if (run !== runRef.current) return;

        const container = containerRef.current;
        if (!container) return;

        const width = Math.max((boxWidth - 32) * zoom, 200);
        const renderScale = Math.max(window.devicePixelRatio || 1, 2);
        const pages: HTMLDivElement[] = [];

        for (let n = 1; n <= doc.numPages; n++) {
          const page = await doc.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const cssScale = width / base.width;
          const cssViewport = page.getViewport({ scale: cssScale });
          const hiViewport = page.getViewport({ scale: cssScale * renderScale });

          const wrapper = document.createElement("div");
          wrapper.className = "relative mx-auto mb-4 shrink-0 bg-white shadow-md";
          wrapper.style.width = `${Math.floor(cssViewport.width)}px`;
          wrapper.style.height = `${Math.floor(cssViewport.height)}px`;

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(hiViewport.width);
          canvas.height = Math.floor(hiViewport.height);
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          canvas.style.display = "block";

          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport: hiViewport }).promise;
          if (run !== runRef.current) return;

          wrapper.appendChild(canvas);
          pages.push(wrapper);
        }

        container.replaceChildren(...pages);
        setReady(true);
        doc.destroy();
      } catch (err) {
        console.error("Preview error:", err);
      }
    })();
  }, [docKey, zoom, boxWidth]);

  return (
    <div className="flex h-full w-full flex-col bg-gray-100">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 text-xs text-gray-600">
        <span className="truncate pr-2">{hint ?? ""}</span>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            disabled={zoomIndex === 0}
            onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
            className="h-6 w-6 rounded border border-gray-300 font-bold disabled:opacity-40"
          >
            −
          </button>
          <span className="w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            disabled={zoomIndex === ZOOMS.length - 1}
            onClick={() => setZoomIndex((i) => Math.min(ZOOMS.length - 1, i + 1))}
            className="h-6 w-6 rounded border border-gray-300 font-bold disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        {!ready && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            {loadingText ?? "Loading preview..."}
          </p>
        )}
        <div ref={containerRef} className="h-full w-full overflow-auto p-4" />
      </div>
    </div>
  );
}