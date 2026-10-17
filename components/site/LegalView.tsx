import { Lang } from "@/lib/labels";
import { PASS } from "@/lib/pass";

// Change these three values: they appear on all three pages
const CONTACT_EMAIL = "your-email@example.com";
const OPERATOR = "the ResumeCraft team";
const UPDATED = { en: "October 2026", fr: "octobre 2026" };

type Page = "privacy" | "terms" | "refund";
type Section = { title: string; paras: string[] };
type Content = { title: string; sections: Section[] };

const T: Record<Lang, Record<Page, Content>> = {
  en: {
    privacy: {
      title: "Privacy policy",
      sections: [
        {
          title: "Who we are",
          paras: [
            `ResumeCraft is operated by ${OPERATOR}. You can reach us at ${CONTACT_EMAIL}.`,
          ],
        },
        {
          title: "What stays on your device",
          paras: [
            "Your resume, the template, color and language you chose, and your download code are saved in your browser's local storage, on your device. They are not sent to our servers.",
            "On a shared computer, click “Start over” when you finish, or clear your browser data.",
          ],
        },
        {
          title: "What is sent elsewhere",
          paras: [
            "AI Writer: if you use it and confirm that you agree, the text you type (and your current resume if you ask us to improve it) is sent through our server to an AI provider so that it can write a draft. It may be processed outside Morocco. We do not intentionally keep this text. Do not include ID numbers or other sensitive details.",
            "Payments: payments are handled by Lemon Squeezy, which acts as the seller. We never see your card details. In our Lemon Squeezy account we can see your name, email and order so that we can help you.",
            "Download codes: when you enter a code, our server sends it to Lemon Squeezy to check that it is valid.",
            "Technical logs: our hosting provider may keep technical logs, such as your IP address and the time of a request, to keep the service secure.",
          ],
        },
        {
          title: "What we do not do",
          paras: [
            "We do not sell your personal data. We do not use advertising cookies. At the time of writing we do not use analytics or tracking tools.",
          ],
        },
        {
          title: "Your rights",
          paras: [
            `You can ask us what data we hold about you, ask us to correct or delete it, or object to its use. Write to ${CONTACT_EMAIL}. Where it applies, this includes your rights under Moroccan Law 09-08.`,
          ],
        },
        {
          title: "Changes",
          paras: [
            "If we change how we handle data, we will update this page.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of service",
      sections: [
        {
          title: "Using ResumeCraft",
          paras: [
            "You may use ResumeCraft to create your own resume and letters. You agree to give accurate information and to use the service lawfully.",
          ],
        },
        {
          title: "The download pass",
          paras: [
            `A download code lets you download resumes as PDF or image for ${PASS.days} days, on up to ${PASS.devices} devices. It is for your personal use: do not share or resell it. We may disable codes that are shared or abused.`,
            "Templates and the files you create are for your personal use. You may not resell or redistribute our templates.",
          ],
        },
        {
          title: "AI drafts",
          paras: [
            "Text written by the AI Writer is a draft and can contain mistakes. You are responsible for checking that your resume is accurate and true before you send it.",
          ],
        },
        {
          title: "No guarantee",
          paras: [
            "We cannot promise that a resume will get you an interview or a job, or that every employer's software will read it the same way. The readability check and the job-posting match are simple guides, not predictions.",
          ],
        },
        {
          title: "Liability",
          paras: [
            "The service is provided as it is. As far as the law allows, we are not responsible for losses that result from using it, including a draft lost from your browser.",
          ],
        },
        {
          title: "Changes and contact",
          paras: [
            `We may update these terms. Questions: ${CONTACT_EMAIL}.`,
          ],
        },
      ],
    },
    refund: {
      title: "Refund policy",
      sections: [
        {
          title: "Your download pass",
          paras: [
            "A download pass is a digital product, so we generally do not refund it once you have downloaded files with it.",
          ],
        },
        {
          title: "When we do refund",
          paras: [
            "If you have not downloaded anything with your code, you can ask for a refund within 14 days of your purchase.",
            "If you had a technical problem, were charged twice, or the files did not work, write to us within 14 days and we will fix the problem or refund you.",
          ],
        },
        {
          title: "How to ask",
          paras: [
            `Write to ${CONTACT_EMAIL} from the email you used to pay. A refunded code is disabled. The refund normally goes back to the payment method you used.`,
          ],
        },
      ],
    },
  },
  fr: {
    privacy: {
      title: "Politique de confidentialité",
      sections: [
        {
          title: "Qui nous sommes",
          paras: [
            `ResumeCraft est exploité par ${OPERATOR}. Vous pouvez nous écrire à ${CONTACT_EMAIL}.`,
          ],
        },
        {
          title: "Ce qui reste sur votre appareil",
          paras: [
            "Votre CV, le modèle, la couleur et la langue choisis, ainsi que votre code de téléchargement sont enregistrés dans le stockage local de votre navigateur, sur votre appareil. Ils ne sont pas envoyés à nos serveurs.",
            "Sur un ordinateur partagé, cliquez sur « Recommencer » quand vous avez terminé, ou effacez les données de votre navigateur.",
          ],
        },
        {
          title: "Ce qui est envoyé ailleurs",
          paras: [
            "Rédacteur IA : si vous l'utilisez et confirmez votre accord, le texte que vous saisissez (et votre CV actuel si vous demandez de l'améliorer) est transmis, via notre serveur, à un prestataire d'IA afin qu'il rédige un brouillon. Il peut être traité hors du Maroc. Nous ne conservons pas ce texte volontairement. N'y mettez pas de numéro de pièce d'identité ni d'autres informations sensibles.",
            "Paiements : les paiements sont gérés par Lemon Squeezy, qui agit comme vendeur. Nous ne voyons jamais vos données de carte. Dans notre compte Lemon Squeezy, nous voyons votre nom, votre email et votre commande afin de pouvoir vous aider.",
            "Codes de téléchargement : quand vous saisissez un code, notre serveur l'envoie à Lemon Squeezy pour vérifier qu'il est valide.",
            "Journaux techniques : notre hébergeur peut conserver des journaux techniques, comme votre adresse IP et l'heure d'une requête, pour assurer la sécurité du service.",
          ],
        },
        {
          title: "Ce que nous ne faisons pas",
          paras: [
            "Nous ne vendons pas vos données personnelles. Nous n'utilisons pas de cookies publicitaires. À la date de rédaction, nous n'utilisons pas d'outils de mesure d'audience ni de suivi.",
          ],
        },
        {
          title: "Vos droits",
          paras: [
            `Vous pouvez nous demander quelles données nous détenons sur vous, demander leur correction ou leur suppression, ou vous opposer à leur utilisation. Écrivez à ${CONTACT_EMAIL}. Lorsqu'elle s'applique, cela inclut vos droits au titre de la loi marocaine 09-08.`,
          ],
        },
        {
          title: "Modifications",
          paras: [
            "Si nous changeons la façon dont nous traitons les données, nous mettrons cette page à jour.",
          ],
        },
      ],
    },
    terms: {
      title: "Conditions d'utilisation",
      sections: [
        {
          title: "Utiliser ResumeCraft",
          paras: [
            "Vous pouvez utiliser ResumeCraft pour créer votre propre CV et vos lettres. Vous vous engagez à fournir des informations exactes et à utiliser le service de manière légale.",
          ],
        },
        {
          title: "L'accès au téléchargement",
          paras: [
            `Un code de téléchargement vous permet de télécharger des CV en PDF ou en image pendant ${PASS.days} jours, sur ${PASS.devices} appareils au maximum. Il est réservé à votre usage personnel : ne le partagez pas et ne le revendez pas. Nous pouvons désactiver les codes partagés ou utilisés abusivement.`,
            "Les modèles et les fichiers que vous créez sont destinés à votre usage personnel. Vous ne pouvez pas revendre ni redistribuer nos modèles.",
          ],
        },
        {
          title: "Brouillons de l'IA",
          paras: [
            "Le texte écrit par le Rédacteur IA est un brouillon et peut contenir des erreurs. Il vous appartient de vérifier que votre CV est exact et sincère avant de l'envoyer.",
          ],
        },
        {
          title: "Aucune garantie",
          paras: [
            "Nous ne pouvons pas promettre qu'un CV vous vaudra un entretien ou un emploi, ni que le logiciel de chaque employeur le lira de la même façon. Le contrôle de lisibilité et la comparaison à une offre sont de simples repères, pas des prédictions.",
          ],
        },
        {
          title: "Responsabilité",
          paras: [
            "Le service est fourni tel quel. Dans la mesure permise par la loi, nous ne sommes pas responsables des pertes liées à son utilisation, y compris un brouillon perdu de votre navigateur.",
          ],
        },
        {
          title: "Modifications et contact",
          paras: [
            `Nous pouvons mettre à jour ces conditions. Questions : ${CONTACT_EMAIL}.`,
          ],
        },
      ],
    },
    refund: {
      title: "Politique de remboursement",
      sections: [
        {
          title: "Votre accès au téléchargement",
          paras: [
            "L'accès au téléchargement est un produit numérique : nous ne le remboursons en général pas une fois que vous avez téléchargé des fichiers avec votre code.",
          ],
        },
        {
          title: "Quand nous remboursons",
          paras: [
            "Si vous n'avez rien téléchargé avec votre code, vous pouvez demander un remboursement dans les 14 jours suivant votre achat.",
            "Si vous avez rencontré un problème technique, avez été débité deux fois ou si les fichiers ne fonctionnent pas, écrivez-nous dans les 14 jours : nous corrigerons le problème ou nous vous rembourserons.",
          ],
        },
        {
          title: "Comment demander",
          paras: [
            `Écrivez à ${CONTACT_EMAIL} depuis l'email utilisé pour payer. Un code remboursé est désactivé. Le remboursement est normalement effectué sur le moyen de paiement utilisé.`,
          ],
        },
      ],
    },
  },
};

export default function LegalView({ lang, page }: { lang: Lang; page: Page }) {
  const c = T[lang][page];

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold">{c.title}</h1>
      <p className="mt-2 text-sm text-gray-500">
        {lang === "fr" ? "Dernière mise à jour : " : "Last updated: "}
        {UPDATED[lang]}
      </p>

      <div className="mt-8 space-y-8">
        {c.sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <div className="mt-2 space-y-3 text-gray-700">
              {s.paras.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}