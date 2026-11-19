import Link from "next/link";
import { Lang } from "@/lib/labels";
import { PASS } from "@/lib/pass";
import { CONTACT_EMAIL } from "@/lib/contact";
import RelatedLinks from "@/components/site/RelatedLinks";

const freeMode = process.env.NEXT_PUBLIC_FREE_DOWNLOAD === "true";
const contactReady = !/example\.com$/i.test(CONTACT_EMAIL.trim());

const T = {
  en: {
    title: "Simple pricing",
    text: "Build and preview for free. Pay only when you want to download.",
    banner: "Launch offer: downloads are free for now.",
    seekersTitle: "For job seekers",
    freeName: "Free",
    freePrice: "$0",
    free: [
      "Pick your profession",
      "Live preview as you type",
      "All templates and colors",
      "Readability check and job-posting match",
      "Internship request letter",
    ],
    freeCta: "Start building",
    paidName: "Download pass",
    paidUnit: ` for ${PASS.days} days`,
    paid: [
      "Everything in Free",
      "Unlimited PDF and image downloads",
      `Valid for ${PASS.days} days, on up to ${PASS.devices} devices`,
      "One payment, no subscription, no automatic renewal",
    ],
    paidCta: "Build my resume",
    note: "Your code arrives by email right after payment. Payments are handled by Lemon Squeezy.",

    teamsTitle: "For recruiting teams",
    teamsText:
      "Prices for teams are agreed with each customer in this early phase. You can start free and upgrade when you need more.",
    teamFreeName: "Free workspace",
    teamFree: [
      "The full CRM: jobs, pipeline, candidates, notes, tasks",
      "Message templates, import and export",
      "Limits on candidates, teammates and attached files, shown in the Plan tab",
    ],
    teamFreeCta: "Create your workspace",
    teamProName: "Pro workspace",
    teamPro: [
      "No candidate limit and more teammates",
      "Agreed with you, invoiced by us, activated by hand",
      "Your data and settings stay exactly as they are",
    ],
    teamProCta: "Write to us",
    teamsNote: "More about the CRM:",
    teamsLink: "CRM overview",
  },
  fr: {
    title: "Des tarifs simples",
    text: "Créez et prévisualisez gratuitement. Ne payez que lorsque vous voulez télécharger.",
    banner: "Offre de lancement : les téléchargements sont gratuits pour le moment.",
    seekersTitle: "Pour les candidats",
    freeName: "Gratuit",
    freePrice: "0 $",
    free: [
      "Choisissez votre métier",
      "Aperçu en direct pendant que vous écrivez",
      "Tous les modèles et toutes les couleurs",
      "Contrôle de lisibilité et comparaison à une offre",
      "Lettre de demande de stage",
    ],
    freeCta: "Commencer",
    paidName: "Accès au téléchargement",
    paidUnit: ` pour ${PASS.days} jours`,
    paid: [
      "Tout ce qui est gratuit",
      "Téléchargements PDF et image illimités",
      `Valable ${PASS.days} jours, sur ${PASS.devices} appareils au maximum`,
      "Un seul paiement, sans abonnement ni renouvellement automatique",
    ],
    paidCta: "Créer mon CV",
    note: "Votre code vous est envoyé par email juste après le paiement. Les paiements sont gérés par Lemon Squeezy.",

    teamsTitle: "Pour les équipes de recrutement",
    teamsText:
      "Les tarifs pour les équipes sont convenus avec chaque client pendant cette première phase. Vous pouvez démarrer gratuitement et passer à Pro quand il le faut.",
    teamFreeName: "Espace gratuit",
    teamFree: [
      "Le CRM complet : offres, pipeline, candidats, notes, tâches",
      "Modèles de messages, import et export",
      "Des limites de candidats, de collègues et de fichiers joints, indiquées dans l'onglet Formule",
    ],
    teamFreeCta: "Créer votre espace",
    teamProName: "Espace Pro",
    teamPro: [
      "Aucune limite de candidats et plus de collègues",
      "Convenu avec vous, facturé par nous, activé à la main",
      "Vos données et vos réglages restent exactement les mêmes",
    ],
    teamProCta: "Nous écrire",
    teamsNote: "En savoir plus sur le CRM :",
    teamsLink: "Présentation du CRM",
  },
};

export default function PricingView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const base = lang === "fr" ? "/fr" : "";

  const subject =
    lang === "fr" ? "Formule Pro pour mon équipe" : "Pro plan for my team";

  return (
    <main>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-center text-3xl font-semibold text-slate-900">
          {t.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-center text-slate-600">{t.text}</p>

        {freeMode && (
          <p className="mx-auto mt-6 max-w-md rounded-md bg-amber-50 p-3 text-center text-sm text-amber-800">
            {t.banner}
          </p>
        )}

        <h2 className="mt-12 text-sm font-bold uppercase tracking-wider text-slate-500">
          {t.seekersTitle}
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900">{t.freeName}</h3>
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
            <h3 className="font-semibold text-slate-900">{t.paidName}</h3>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {PASS.price}
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
        <p className="mt-6 text-center text-xs text-slate-500">{t.note}</p>

        <section id="teams" className="scroll-mt-24">
          <h2 className="mt-16 text-sm font-bold uppercase tracking-wider text-slate-500">
            {t.teamsTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">{t.teamsText}</p>

          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900">{t.teamFreeName}</h3>
              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {t.teamFree.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <Link
                href={`${base}/signup`}
                className="mt-6 block rounded-md border border-slate-300 py-2 text-center text-sm font-semibold hover:bg-slate-50"
              >
                {t.teamFreeCta}
              </Link>
            </div>

            <div className="rounded-lg border-2 border-slate-900 p-6">
              <h3 className="font-semibold text-slate-900">{t.teamProName}</h3>
              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {t.teamPro.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              {contactReady ? (
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`}
                  className="mt-6 block rounded-md bg-slate-900 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {t.teamProCta}
                </a>
              ) : null}
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            {t.teamsNote}{" "}
            <Link href={`${base}/recruiters`} className="font-semibold text-slate-900 underline">
              {t.teamsLink}
            </Link>
          </p>
        </section>
      </div>

      <RelatedLinks lang={lang} current="pricing" />
    </main>
  );
}