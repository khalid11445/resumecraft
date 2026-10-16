"use client";

import { useEffect, useState } from "react";
import { Lang } from "@/lib/labels";
import { PASS } from "@/lib/pass";
import { redeemCode, Reason } from "@/lib/license-client";

const T = {
  en: {
    title: "Unlock your downloads",
    intro: `One code gives you unlimited PDF and image downloads for ${PASS.days} days, on up to ${PASS.devices} devices. One payment, no subscription.`,
    buy: `Buy a code — ${PASS.price}`,
    buyNote:
      "The payment page opens in a new tab, so your resume stays here. After paying, your code appears on the confirmation page and is emailed to you. Check your spam folder if you do not see it.",
    notReady: "Payments are not set up yet.",
    haveCode: "Already have a code?",
    placeholder: "Paste your code here",
    unlock: "Unlock",
    checking: "Checking...",
    close: "Close",
    empty: "Please paste your code.",
    errors: {
      invalid: "This code was not recognised. Check that you copied all of it.",
      expired: "This code has expired.",
      disabled:
        "This code has been disabled. Contact us if you think this is a mistake.",
      limit: "This code has already been used on the maximum number of devices.",
      wrong_product: "This code is not valid for ResumeCraft.",
      test: "This is a test code and cannot be used on the live site.",
      config: "Payments are not set up yet. Please try again later.",
      server: "We could not check the code. Please try again in a moment.",
      network: "No connection. Check your internet and try again.",
    } as Record<Reason, string>,
  },
  fr: {
    title: "Débloquez vos téléchargements",
    intro: `Un code vous donne des téléchargements PDF et image illimités pendant ${PASS.days} jours, sur ${PASS.devices} appareils au maximum. Un seul paiement, sans abonnement.`,
    buy: `Acheter un code — ${PASS.price}`,
    buyNote:
      "La page de paiement s'ouvre dans un nouvel onglet : votre CV reste ici. Après le paiement, votre code s'affiche sur la page de confirmation et vous est envoyé par email. Vérifiez vos courriers indésirables si vous ne le voyez pas.",
    notReady: "Le paiement n'est pas encore configuré.",
    haveCode: "Vous avez déjà un code ?",
    placeholder: "Collez votre code ici",
    unlock: "Débloquer",
    checking: "Vérification...",
    close: "Fermer",
    empty: "Veuillez coller votre code.",
    errors: {
      invalid: "Ce code n'est pas reconnu. Vérifiez que vous l'avez copié en entier.",
      expired: "Ce code a expiré.",
      disabled:
        "Ce code a été désactivé. Contactez-nous si vous pensez que c'est une erreur.",
      limit: "Ce code a déjà été utilisé sur le nombre maximum d'appareils.",
      wrong_product: "Ce code n'est pas valable pour ResumeCraft.",
      test: "C'est un code de test, il ne peut pas être utilisé sur le site en ligne.",
      config: "Le paiement n'est pas encore configuré. Réessayez plus tard.",
      server: "Impossible de vérifier le code. Réessayez dans un instant.",
      network: "Pas de connexion. Vérifiez votre internet et réessayez.",
    } as Record<Reason, string>,
  },
};

export default function PaywallModal({
  ui,
  onClose,
  onUnlocked,
}: {
  ui: Lang;
  onClose: () => void;
  onUnlocked: (expiresAt: string | null) => void | Promise<void>;
}) {
  const t = T[ui];
  const buyUrl = process.env.NEXT_PUBLIC_BUY_URL;

  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function unlock() {
    if (!code.trim()) {
      setError(t.empty);
      return;
    }
    setBusy(true);
    setError("");
    const result = await redeemCode(code);
    setBusy(false);
    if (result.ok) {
      await onUnlocked(result.license.expiresAt);
    } else {
      setError(t.errors[result.reason] ?? t.errors.invalid);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-black">{t.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t.close}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">{t.intro}</p>

        {buyUrl ? (
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
          >
            {t.buy}
          </a>
        ) : (
          <p className="mt-4 rounded bg-amber-50 p-3 text-sm text-amber-800">
            {t.notReady}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">{t.buyNote}</p>

        <div className="mt-5 border-t border-gray-200 pt-4">
          <label className="block text-sm font-semibold text-gray-800">
            {t.haveCode}
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") unlock();
            }}
            placeholder={t.placeholder}
            autoComplete="off"
            spellCheck={false}
            className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-black"
          />
          <button
            type="button"
            onClick={unlock}
            disabled={busy}
            className="mt-2 w-full rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {busy ? t.checking : t.unlock}
          </button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}