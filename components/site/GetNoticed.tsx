"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type State = "idle" | "sending" | "done" | "error" | "closed";

export default function GetNoticed() {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot, humans leave it empty
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!agree) return;
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      if (res.status === 503) {
        setState("closed");
        return;
      }
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="rounded-md bg-white/10 px-5 py-4 text-sm text-white">
        ✦ Thank you! We will email you when new tools are ready.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="notice-email" className="sr-only">
          Your email
        </label>
        <input
          id="notice-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@gmail.com"
          className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-violet-300 focus:outline-none"
        />
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
        />
        <button
          type="submit"
          disabled={!agree || state === "sending"}
          className="rc-btn shrink-0 rounded-md px-6 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {state === "sending" ? "Sending..." : "Notify me"}
        </button>
      </div>

      <label className="mt-3 flex items-start gap-2 text-xs text-slate-300">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          I agree to receive emails about ResumeCraft. See our{" "}
          <Link href="/privacy" className="underline">
            Privacy policy
          </Link>
          .
        </span>
      </label>

      {state === "error" ? (
        <p className="mt-3 text-xs text-red-300">
          Something went wrong. Please try again.
        </p>
      ) : null}
      {state === "closed" ? (
        <p className="mt-3 text-xs text-amber-200">
          Sign-ups are not open yet. Please check back soon.
        </p>
      ) : null}
    </form>
  );
}