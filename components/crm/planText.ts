import { Lang } from "@/lib/labels";

const en = {
  title: "Plan and usage",
  intro: "What your workspace includes, and how much of it you are using.",
  planNames: { free: "Free", team: "Pro" } as Record<"free" | "team", string>,
  current: "Current plan",
  activeUntil: (d: string) => `Active until ${d}`,
  noEnd: "No end date",
  expiredOn: (d: string) =>
    `Your Pro plan ended on ${d}. The workspace is back on the free limits. Nothing was deleted.`,
  endsSoon: (d: string, days: number) =>
    `Your Pro plan ends on ${d} (in ${days} day${days === 1 ? "" : "s"}). Write to us to renew it.`,

  usage: "Usage",
  candidates: "Candidates",
  members: "Members",
  pending: (n: number) => `${n} pending invitation${n === 1 ? "" : "s"}`,
  unlimited: "Unlimited",
  of: (a: number, b: number) => `${a} of ${b}`,
  over:
    "You are over the limit. Your existing data is kept, but you cannot add more until you upgrade.",
  near: "You are close to the limit.",

  compareTitle: "What each plan includes",
  colPlan: "Plan",
  you: "your plan",

  upgradeTitle: "Upgrade to Pro",
  upgradeText:
    "Pro removes the candidate limit and allows more teammates. Paid plans are set up by hand for now: write to us, we send you an invoice, and we activate your workspace once the payment is received.",
  upgradeNote: "Prices are agreed with each customer during this early phase.",
  wsId: "Workspace ID",
  copy: "Copy",
  copied: "Copied",
  emailBtn: "Write to us",
  whatsappBtn: "WhatsApp",
  notReady: "Contact details are not set up yet.",
  ownerOnly:
    "Ask the owner or an admin of this workspace to upgrade the plan.",
  mailSubject: (ws: string) => `Pro plan for the workspace "${ws}"`,
  mailBody: (ws: string, id: string) =>
    `Hello,\n\nI would like to upgrade my workspace to Pro.\n\nWorkspace: ${ws}\nWorkspace ID: ${id}\n\nPlease send me the details.\n`,
  waText: (ws: string) => `Hello, I would like to upgrade my workspace "${ws}" to Pro.`,
  loadError: "We could not load your plan. Please refresh the page.",
};

export type PLTx = typeof en;

const fr: PLTx = {
  title: "Formule et utilisation",
  intro:
    "Ce que comprend votre espace, et la part que vous en utilisez.",
  planNames: { free: "Gratuite", team: "Pro" },
  current: "Formule actuelle",
  activeUntil: (d: string) => `Active jusqu'au ${d}`,
  noEnd: "Sans date de fin",
  expiredOn: (d: string) =>
    `Votre formule Pro s'est terminée le ${d}. L'espace est revenu aux limites gratuites. Rien n'a été supprimé.`,
  endsSoon: (d: string, days: number) =>
    `Votre formule Pro se termine le ${d} (dans ${days} jour${days > 1 ? "s" : ""}). Écrivez-nous pour la renouveler.`,

  usage: "Utilisation",
  candidates: "Candidats",
  members: "Membres",
  pending: (n: number) => `${n} invitation${n > 1 ? "s" : ""} en attente`,
  unlimited: "Illimité",
  of: (a: number, b: number) => `${a} sur ${b}`,
  over:
    "Vous dépassez la limite. Vos données existantes sont conservées, mais vous ne pouvez plus en ajouter avant de passer à Pro.",
  near: "Vous approchez de la limite.",

  compareTitle: "Ce que comprend chaque formule",
  colPlan: "Formule",
  you: "votre formule",

  upgradeTitle: "Passer à Pro",
  upgradeText:
    "Pro supprime la limite de candidats et autorise plus de collègues. Pour l'instant, les formules payantes sont activées à la main : écrivez-nous, nous vous envoyons une facture, puis nous activons votre espace dès réception du paiement.",
  upgradeNote:
    "Les tarifs sont convenus avec chaque client pendant cette première phase.",
  wsId: "Identifiant de l'espace",
  copy: "Copier",
  copied: "Copié",
  emailBtn: "Nous écrire",
  whatsappBtn: "WhatsApp",
  notReady: "Les coordonnées de contact ne sont pas encore configurées.",
  ownerOnly:
    "Demandez au propriétaire ou à un admin de cet espace de passer à une formule supérieure.",
  mailSubject: (ws: string) => `Formule Pro pour l'espace « ${ws} »`,
  mailBody: (ws: string, id: string) =>
    `Bonjour,\n\nJe souhaite passer mon espace à la formule Pro.\n\nEspace : ${ws}\nIdentifiant de l'espace : ${id}\n\nMerci de m'envoyer les détails.\n`,
  waText: (ws: string) =>
    `Bonjour, je souhaite passer mon espace « ${ws} » à la formule Pro.`,
  loadError: "Impossible de charger votre formule. Rechargez la page.",
};

export const PLT: Record<Lang, PLTx> = { en, fr };