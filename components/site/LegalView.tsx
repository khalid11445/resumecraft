import { Lang } from "@/lib/labels";

type Page = "privacy" | "terms" | "refund";

const T = {
  en: {
    privacy: {
      title: "Privacy policy",
      paras: [
        "The details you type into the resume builder are used only to generate your resume. Payments are handled by our payment provider, and we do not see or store your card details.",
        "If you use the AI Writer, the text you submit is sent to our AI provider so that it can write your draft. Do not include information you do not want to share, such as ID numbers.",
        "We do not sell your personal data. Contact us at your-email@example.com to ask about or delete your data.",
      ],
    },
    terms: {
      title: "Terms of service",
      paras: [
        "By using ResumeCraft you agree to use the service lawfully and to provide accurate information in your own resume.",
        "Templates and the generated files are for your personal use. You may not resell or redistribute our templates.",
        "Text produced by the AI Writer is a draft. You are responsible for checking that your resume is accurate before you use it.",
        "Contact: your-email@example.com",
      ],
    },
    refund: {
      title: "Refund policy",
      paras: [
        "Because our products are digital downloads, we generally do not offer refunds once a PDF has been downloaded.",
        "If you had a technical problem, were charged twice, or the file did not work, contact us within 14 days and we will fix it or refund you.",
        "Contact: your-email@example.com",
      ],
    },
  },
  fr: {
    privacy: {
      title: "Politique de confidentialité",
      paras: [
        "Les informations saisies dans le créateur de CV servent uniquement à générer votre CV. Les paiements sont gérés par notre prestataire de paiement, et nous ne voyons ni ne conservons vos données de carte.",
        "Si vous utilisez le Rédacteur IA, le texte que vous envoyez est transmis à notre prestataire d'IA afin qu'il rédige votre brouillon. N'y mettez pas d'informations que vous ne souhaitez pas partager, comme un numéro de pièce d'identité.",
        "Nous ne vendons pas vos données personnelles. Écrivez-nous à votre-email@example.com pour consulter ou supprimer vos données.",
      ],
    },
    terms: {
      title: "Conditions d'utilisation",
      paras: [
        "En utilisant ResumeCraft, vous vous engagez à utiliser le service de manière légale et à fournir des informations exactes dans votre CV.",
        "Les modèles et les fichiers générés sont destinés à votre usage personnel. Vous ne pouvez pas revendre ni redistribuer nos modèles.",
        "Le texte produit par le Rédacteur IA est un brouillon. Il vous appartient de vérifier l'exactitude de votre CV avant de l'utiliser.",
        "Contact : votre-email@example.com",
      ],
    },
    refund: {
      title: "Politique de remboursement",
      paras: [
        "Nos produits étant des téléchargements numériques, nous ne remboursons généralement pas une fois le PDF téléchargé.",
        "Si vous avez rencontré un problème technique, avez été débité deux fois ou si le fichier ne fonctionne pas, contactez-nous dans les 14 jours : nous le corrigerons ou nous vous rembourserons.",
        "Contact : votre-email@example.com",
      ],
    },
  },
};

export default function LegalView({ lang, page }: { lang: Lang; page: Page }) {
  const c = T[lang][page];

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold">{c.title}</h1>
      <div className="mt-6 space-y-4 text-gray-700">
        {c.paras.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </main>
  );
}