import Link from "next/link";
import { Lang } from "@/lib/labels";

const freeMode = process.env.NEXT_PUBLIC_FREE_DOWNLOAD === "true";

const T = {
  en: {
    title: "Simple pricing",
    text: "Build and preview for free. Pay once only when you download.",
    banner: "Launch offer: downloads are free for now.",
    freeName: "Free",
    freePrice: "$0",
    free: [
      "Pick your profession",
      "Live preview as you type",
      "All templates and colors",
    ],
    freeCta: "Start building",
    paidName: "Download",
    paidPrice: "$4.99",
    paidUnit: " per resume",
    paid: ["Everything in Free", "Download as PDF", "Download as image"],
    paidCta: "Build my resume",
  },
  fr: {
    title: "Des tarifs simples",
    text: "Créez et prévisualisez gratuitement. Payez une seule fois, uniquement au téléchargement.",
    banner: "Offre de lancement : les téléchargements sont gratuits pour le moment.",
    freeName: "Gratuit",
    freePrice: "0 $",
    free: [
      "Choisissez votre métier",
      "Aperçu en direct pendant que vous écrivez",
      "Tous les modèles et toutes les couleurs",
    ],
    freeCta: "Commencer",
    paidName: "Téléchargement",
    paidPrice: "4,99 $",
    paidUnit: " par CV",
    paid: ["Tout ce qui est gratuit", "Téléchargement en PDF", "Téléchargement en image"],
    paidCta: "Créer mon CV",
  },
};

export default function PricingView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const base = lang === "fr" ? "/fr" : "";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-center text-3xl font-semibold text-slate-900">
        {t.title}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-slate-600">{t.text}</p>

      {freeMode && (
        <p className="mx-auto mt-6 max-w-md rounded-md bg-amber-50 p-3 text-center text-sm text-amber-800">
          {t.banner}
        </p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900">{t.freeName}</h2>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{t.freePrice}</p>
          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            {t.free.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          <Link
            href={`${base}/templates`}
            className="mt-6 block rounded-md border border-slate-300 py-2 text-center text-sm font-semibold hover:bg-slate-50"
          >
            {t.freeCta}
          </Link>
        </div>

        <div className="rounded-lg border-2 border-slate-900 p-6">
          <h2 className="font-semibold text-slate-900">{t.paidName}</h2>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {t.paidPrice}
            <span className="text-sm font-normal text-slate-500">{t.paidUnit}</span>
          </p>
          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            {t.paid.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          <Link
            href={`${base}/templates`}
            className="mt-6 block rounded-md bg-slate-900 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800"
          >
            {t.paidCta}
          </Link>
        </div>
      </div>
    </main>
  );
}