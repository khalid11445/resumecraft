import { Lang } from "./labels";
import { formatDate } from "./tracker";

export type MessageKind = "followup" | "thanks" | "spontaneous" | "feedback";

export const MESSAGE_KINDS: MessageKind[] = [
  "followup",
  "thanks",
  "spontaneous",
  "feedback",
];

export type MessageContext = {
  name: string;
  company: string;
  role: string;
  contact: string;
  appliedOn: string;
};

// Missing information becomes a visible [placeholder]
const ph = (value: string, label: string) => value.trim() || `[${label}]`;

export function buildMessage(
  kind: MessageKind,
  lang: Lang,
  c: MessageContext
): { subject: string; body: string } {
  const role = c.role.trim();
  const contact = c.contact.trim();
  const date = formatDate(c.appliedOn, lang === "fr" ? "fr-FR" : "en-US");

  if (lang === "fr") {
    const company = ph(c.company, "Entreprise");
    const name = ph(c.name, "Votre nom");
    const greet = contact ? `Bonjour ${contact},` : "Madame, Monsieur,";
    const close = contact
      ? "Cordialement,"
      : "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.";
    const forRole = role ? ` au poste de ${role}` : "";
    const suffix = role ? ` — ${role}` : "";
    const sign = `${close}\n${name}`;

    if (kind === "followup") {
      return {
        subject: `Suivi de ma candidature${suffix}`,
        body: [
          greet,
          `Je me permets de revenir vers vous au sujet de ma candidature${forRole} chez ${company}${
            date ? `, envoyée le ${date}` : ""
          }.`,
          "Ce poste continue de m'intéresser vivement. [Une phrase : un élément nouveau ou une raison précise de votre intérêt.] Je reste à votre disposition pour tout complément d'information ou pour un entretien.",
          sign,
        ].join("\n\n"),
      };
    }
    if (kind === "thanks") {
      return {
        subject: `Merci pour notre entretien${suffix}`,
        body: [
          greet,
          `Je vous remercie d'avoir pris le temps d'échanger avec moi au sujet du poste${
            role ? ` de ${role}` : ""
          } chez ${company}.`,
          "[Un point précis abordé pendant l'entretien et ce que vous en retenez.] Cet échange a renforcé mon intérêt pour ce poste, et je suis convaincu(e) de pouvoir [une contribution concrète et vraie].",
          "Je reste disponible pour toute information complémentaire.",
          sign,
        ].join("\n\n"),
      };
    }
    if (kind === "spontaneous") {
      return {
        subject: `Candidature spontanée${suffix}`,
        body: [
          greet,
          `Je me permets de vous adresser ma candidature spontanée${
            role ? ` pour un poste de ${role}` : ""
          } au sein de ${company}.`,
          "[Une phrase : votre formation ou votre expérience la plus pertinente.] [Une phrase : pourquoi cette entreprise vous intéresse, avec un élément précis.]",
          "Vous trouverez mon CV en pièce jointe. Je serais heureux(se) de vous rencontrer pour échanger sur les besoins de vos équipes.",
          sign,
        ].join("\n\n"),
      };
    }
    return {
      subject: `Votre retour sur ma candidature${suffix}`,
      body: [
        greet,
        `Je vous remercie pour votre réponse concernant ma candidature${forRole} chez ${company}.`,
        `Si vous en avez la possibilité, je vous serais reconnaissant(e) de me faire part, en quelques lignes, de ce qui pourrait améliorer ma candidature. Je reste intéressé(e) par de futures opportunités chez ${company} et vous remercie d'avance.`,
        sign,
      ].join("\n\n"),
    };
  }

  const company = ph(c.company, "Company");
  const name = ph(c.name, "Your name");
  const greet = contact ? `Hello ${contact},` : "Dear Sir or Madam,";
  const close = contact ? "Kind regards," : "Yours sincerely,";
  const forRole = role ? ` for the ${role} position` : "";
  const suffix = role ? ` — ${role}` : "";
  const sign = `${close}\n${name}`;

  if (kind === "followup") {
    return {
      subject: `Following up on my application${suffix}`,
      body: [
        greet,
        `I am writing to follow up on my application${forRole} at ${company}${
          date ? `, sent on ${date}` : ""
        }.`,
        "I remain very interested in this role. [One sentence: something new, or a specific reason for your interest.] I would be glad to provide any further information or to meet for an interview.",
        sign,
      ].join("\n\n"),
    };
  }
  if (kind === "thanks") {
    return {
      subject: `Thank you for our conversation${suffix}`,
      body: [
        greet,
        `Thank you for taking the time to speak with me about ${
          role ? `the ${role} position` : "the position"
        } at ${company}.`,
        "[One specific point from the interview, and what you took from it.] Our conversation strengthened my interest in the role, and I am confident I can [one concrete, true contribution].",
        "Please let me know if I can provide anything else.",
        sign,
      ].join("\n\n"),
    };
  }
  if (kind === "spontaneous") {
    return {
      subject: `Spontaneous application${suffix}`,
      body: [
        greet,
        `I am writing to submit a spontaneous application${
          role ? ` for a ${role} position` : ""
        } at ${company}.`,
        "[One sentence: your most relevant studies or experience.] [One sentence: why this company interests you, with something specific.]",
        "Please find my resume attached. I would be glad to meet and discuss how I could help your team.",
        sign,
      ].join("\n\n"),
    };
  }
  return {
    subject: `Feedback on my application${suffix}`,
    body: [
      greet,
      `Thank you for your reply regarding my application${forRole} at ${company}.`,
      `If you have a moment, I would be grateful for a few lines on how I could strengthen my application. I remain interested in future opportunities at ${company}, and I thank you in advance.`,
      sign,
    ].join("\n\n"),
  };
}