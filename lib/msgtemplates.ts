import { Lang } from "./labels";

export type VarKey =
  | "first_name"
  | "full_name"
  | "job_title"
  | "client"
  | "my_name"
  | "agency";

export const VAR_KEYS: VarKey[] = [
  "first_name",
  "full_name",
  "job_title",
  "client",
  "my_name",
  "agency",
];

const LABELS: Record<Lang, Record<VarKey, string>> = {
  en: {
    first_name: "First name",
    full_name: "Full name",
    job_title: "Job title",
    client: "Client",
    my_name: "Your name",
    agency: "Agency",
  },
  fr: {
    first_name: "Prénom",
    full_name: "Nom complet",
    job_title: "Poste",
    client: "Client",
    my_name: "Votre nom",
    agency: "Cabinet",
  },
};

export const varLabel = (key: VarKey, lang: Lang) => LABELS[lang][key];

export type VarValues = Partial<Record<VarKey, string>>;

const TOKEN = /\{\{\s*([a-z_]+)\s*\}\}/g;

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

// Replaces {{variables}}. Missing or unknown ones become a visible [bracket],
// so nothing is ever sent with a blank or a raw {{token}} in it.
export function renderTemplate(
  text: string,
  values: VarValues,
  lang: Lang
): string {
  return text.replace(TOKEN, (_match, key: string) => {
    if (!(VAR_KEYS as string[]).includes(key)) return `[${key}]`;
    const value = oneLine(values[key as VarKey] ?? "");
    return value || `[${LABELS[lang][key as VarKey]}]`;
  });
}

export function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] ?? "";
}

export type Starter = { name: string; subject: string; body: string };

export const STARTERS: Record<Lang, Starter[]> = {
  en: [
    {
      name: "First contact",
      subject: "Opportunity: {{job_title}}",
      body: "Hello {{first_name}},\n\nThis is {{my_name}} from {{agency}}. Your profile caught my attention for a {{job_title}} role with {{client}}.\n\nWould you be open to a short call this week to tell you more?\n\nThank you,\n{{my_name}}",
    },
    {
      name: "Interview invitation",
      subject: "Interview: {{job_title}}",
      body: "Hello {{first_name}},\n\nWe would like to invite you to an interview for the {{job_title}} position.\n\nDate and time: [date and time]\nPlace or video link: [place or link]\n\nPlease confirm that this works for you.\n\nThank you,\n{{my_name}}, {{agency}}",
    },
    {
      name: "Request for documents",
      subject: "Documents for your application: {{job_title}}",
      body: "Hello {{first_name}},\n\nTo continue with your application for the {{job_title}} position, could you send me your updated CV and [any other document]?\n\nThank you,\n{{my_name}}, {{agency}}",
    },
    {
      name: "Follow-up",
      subject: "Following up: {{job_title}}",
      body: "Hello {{first_name}},\n\nI am following up about the {{job_title}} position. Are you still interested? A short reply is enough.\n\nThank you,\n{{my_name}}, {{agency}}",
    },
    {
      name: "Interview reminder",
      subject: "Reminder: your interview for {{job_title}}",
      body: "Hello {{first_name}},\n\nA reminder of your interview for the {{job_title}} position on [date and time].\n\nPlease let me know if anything changes.\n\n{{my_name}}, {{agency}}",
    },
    {
      name: "Polite decline",
      subject: "Your application: {{job_title}}",
      body: "Hello {{first_name}},\n\nThank you for your time and your interest in the {{job_title}} position. After careful consideration, we will not move forward with your application for this role.\n\nWe wish you every success in your search.\n\n{{my_name}}, {{agency}}",
    },
  ],
  fr: [
    {
      name: "Premier contact",
      subject: "Opportunité : {{job_title}}",
      body: "Bonjour {{first_name}},\n\nJe suis {{my_name}} de {{agency}}. Votre profil a retenu mon attention pour un poste de {{job_title}} chez {{client}}.\n\nSeriez-vous disponible pour un court échange téléphonique cette semaine ?\n\nMerci,\n{{my_name}}",
    },
    {
      name: "Invitation à un entretien",
      subject: "Entretien : {{job_title}}",
      body: "Bonjour {{first_name}},\n\nNous souhaitons vous inviter à un entretien pour le poste de {{job_title}}.\n\nDate et heure : [date et heure]\nLieu ou lien visio : [lieu ou lien]\n\nMerci de me confirmer que cela vous convient.\n\nCordialement,\n{{my_name}}, {{agency}}",
    },
    {
      name: "Demande de documents",
      subject: "Documents pour votre candidature : {{job_title}}",
      body: "Bonjour {{first_name}},\n\nPour poursuivre votre candidature au poste de {{job_title}}, pourriez-vous m'envoyer votre CV à jour et [autre document] ?\n\nMerci,\n{{my_name}}, {{agency}}",
    },
    {
      name: "Relance",
      subject: "Relance : {{job_title}}",
      body: "Bonjour {{first_name}},\n\nJe reviens vers vous au sujet du poste de {{job_title}}. Êtes-vous toujours intéressé(e) ? Une courte réponse suffit.\n\nMerci,\n{{my_name}}, {{agency}}",
    },
    {
      name: "Rappel d'entretien",
      subject: "Rappel : votre entretien pour {{job_title}}",
      body: "Bonjour {{first_name}},\n\nUn rappel de votre entretien pour le poste de {{job_title}} le [date et heure].\n\nPrévenez-moi si quelque chose change.\n\n{{my_name}}, {{agency}}",
    },
    {
      name: "Réponse négative courtoise",
      subject: "Votre candidature : {{job_title}}",
      body: "Bonjour {{first_name}},\n\nMerci pour le temps que vous nous avez consacré et pour votre intérêt pour le poste de {{job_title}}. Après réflexion, nous ne donnerons pas suite à votre candidature pour ce poste.\n\nNous vous souhaitons une pleine réussite dans vos recherches.\n\n{{my_name}}, {{agency}}",
    },
  ],
};