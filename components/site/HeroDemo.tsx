"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Demo text only. Brackets show where the user adds real details.
const PHRASES = [
  "Managed a team of [number] and improved [metric] by [%]",
  "Handled customer requests and solved issues quickly",
  "Built and shipped [feature] used by [number] people",
];

function useTypewriter(list: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(list[0]);
      return;
    }
    const full = list[index];
    let timer: number | undefined;

    if (!deleting && text === full) {
      timer = window.setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((index + 1) % list.length);
    } else {
      timer = window.setTimeout(
        () =>
          setText(
            deleting
              ? full.slice(0, text.length - 1)
              : full.slice(0, text.length + 1)
          ),
        deleting ? 18 : 38
      );
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [text, deleting, index, list]);

  return text;
}

const sparkles = [
  { symbol: "✦", className: "left-[4%] top-[10%] text-2xl text-violet-300", delay: "0s" },
  { symbol: "✧", className: "right-[6%] top-[42%] text-xl text-cyan-300", delay: "0.8s" },
  { symbol: "✦", className: "bottom-[6%] left-[14%] text-lg text-fuchsia-300", delay: "1.4s" },
];

export default function HeroDemo() {
  const text = useTypewriter(PHRASES);

  return (
    <div className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[30rem]">
      {/* Example resumes floating behind */}
      <div className="rc-float absolute -left-2 top-8 w-[46%] -rotate-6 overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-white/10">
        <div className="relative aspect-[210/297]">
          <Image
            src="/examples/nurse-modern.png"
            alt="Nurse resume, Modern design"
            fill
            priority
            sizes="(min-width: 1024px) 200px, 40vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="rc-float-slow absolute -right-2 top-2 w-[46%] rotate-6 overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-white/10">
        <div className="relative aspect-[210/297]">
          <Image
            src="/examples/tech-modern.png"
            alt="Developer resume, Modern design"
            fill
            priority
            sizes="(min-width: 1024px) 200px, 40vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Resume being written */}
      <div className="absolute inset-x-[7%] top-[22%] z-10 rounded-xl bg-white p-5 text-slate-800 shadow-2xl ring-1 ring-violet-300/40">
        <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full rc-btn px-3 py-1 text-[11px] font-semibold shadow-lg">
          <span className="rc-twinkle" aria-hidden="true">✦</span>
          AI rewriting
        </span>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full rc-btn" aria-hidden="true" />
          <div className="flex-1 space-y-2" aria-hidden="true">
            <div className="h-3 w-1/2 rounded bg-slate-800" />
            <div className="h-2 w-1/3 rounded bg-violet-300" />
          </div>
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-700">
          Experience
        </p>
        <div className="mt-2 flex gap-2 text-[13px] leading-snug">
          <span className="text-violet-500" aria-hidden="true">•</span>
          <p className="min-h-[3.6rem] flex-1">
            {text}
            <span className="rc-caret ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-violet-600" aria-hidden="true" />
          </p>
        </div>

        <div className="mt-3 space-y-2" aria-hidden="true">
          <div className="h-2 w-5/6 rounded bg-slate-200" />
          <div className="h-2 w-2/3 rounded bg-slate-200" />
        </div>
        <p className="mt-4 text-[10px] text-slate-400">
          Example text. AI writing is coming soon.
        </p>
      </div>

      {sparkles.map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`rc-twinkle absolute z-20 ${s.className}`}
          style={{ animationDelay: s.delay }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}