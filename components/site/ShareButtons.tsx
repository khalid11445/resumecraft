"use client";

import { useEffect, useState } from "react";
import { Lang } from "@/lib/labels";

const T = {
  en: {
    label: "Share this page",
    native: "Share",
    copy: "Copy link",
    copied: "Link copied",
    manual: "Select the link and press Ctrl + C:",
  },
  fr: {
    label: "Partager cette page",
    native: "Partager",
    copy: "Copier le lien",
    copied: "Lien copié",
    manual: "Sélectionnez le lien et appuyez sur Ctrl + C :",
  },
};

const btn =
  "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50";

export default function ShareButtons({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [manualUrl, setManualUrl] = useState("");

  // Checked after the page loads, so the server and the browser render the same HTML
  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const pageUrl = () => window.location.origin + window.location.pathname;

  function open(link: string) {
    window.open(link, "_blank", "noopener,noreferrer");
  }

  function whatsapp() {
    open(`https://wa.me/?text=${encodeURIComponent(`${document.title} ${pageUrl()}`)}`);
  }

  function linkedin() {
    open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl())}`
    );
  }

  function facebook() {
    open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl())}`
    );
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: document.title, url: pageUrl() });
    } catch {
      // the visitor closed the share window: nothing to do
    }
  }

  async function copy() {
    const url = pageUrl();
    try {
      await navigator.clipboard.writeText(url);
      setManualUrl("");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: show the link so it can be copied by hand
      setCopied(false);
      setManualUrl(url);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">{t.label}</span>
        {canShare ? (
          <button type="button" onClick={nativeShare} className={btn}>
            {t.native}
          </button>
        ) : null}
        <button type="button" onClick={whatsapp} className={btn}>
          WhatsApp
        </button>
        <button type="button" onClick={linkedin} className={btn}>
          LinkedIn
        </button>
        <button type="button" onClick={facebook} className={btn}>
          Facebook
        </button>
        <button type="button" onClick={copy} className={btn}>
          {copied ? `✓ ${t.copied}` : t.copy}
        </button>
      </div>
      {manualUrl ? (
        <div className="mt-2">
          <p className="text-xs text-slate-500">{t.manual}</p>
          <input
            readOnly
            value={manualUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-1 w-full max-w-md rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
          />
        </div>
      ) : null}
    </div>
  );
}