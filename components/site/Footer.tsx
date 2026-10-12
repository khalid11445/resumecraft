"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Fill these in when you have them. Empty values are hidden automatically.
const SUPPORT_EMAIL = ""; // for example "support@yoursite.com"
const SOCIALS: { name: string; url: string }[] = [
  { name: "LinkedIn", url: "" },
  { name: "Instagram", url: "" },
  { name: "Facebook", url: "" },
  { name: "X", url: "" },
  { name: "YouTube", url: "" },
];

const COUNTRIES = [
  "Morocco",
  "France",
  "Spain",
  "Belgium",
  "Canada",
  "United States",
  "United Kingdom",
  "Germany",
  "Other",
];

const soon = (
  <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
    Soon
  </span>
);

export default function Footer() {
  const [country, setCountry] = useState("");

  useEffect(() => {
    try {
      setCountry(localStorage.getItem("rc-country") ?? "");
    } catch {
      /* storage can be blocked */
    }
  }, []);

  const socials = SOCIALS.filter((s) => s.url);

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-white">
            Resume<span className="text-violet-400">Craft</span>
          </p>
          <p className="mt-3 text-sm text-slate-400">
            Build, edit and polish your resume right on the page.
          </p>

          <label htmlFor="country" className="mt-6 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Select your country
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              try {
                localStorage.setItem("rc-country", e.target.value);
              } catch {
                /* ignore */
              }
            }}
            className="mt-2 w-full rounded-md border border-white/20 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            <option value="">Choose...</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500">
            Country formats (such as US Letter) are planned.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Resume makers</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/templates" className="hover:text-white">Build my resume</Link></li>
            <li><Link href="/examples" className="hover:text-white">Resume examples</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Job seeker resources</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Cover letters {soon}</li>
            <li>Interview guides {soon}</li>
            <li>Career coach {soon}</li>
            <li>AI resume writing {soon}</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Company and support</p>
          <ul className="mt-4 space-y-2 text-sm">
            {SUPPORT_EMAIL ? (
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white">
                  Contact support
                </a>
              </li>
            ) : null}
            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            <li><Link href="/refund" className="hover:text-white">Refunds</Link></li>
          </ul>

          {socials.length > 0 && (
            <>
              <p className="mt-6 text-sm font-semibold text-white">Join us on social media</p>
              <ul className="mt-3 flex flex-wrap gap-3 text-sm">
                {socials.map((s) => (
                  <li key={s.name}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-slate-500">
        © 2026 ResumeCraft
      </div>
    </footer>
  );
}