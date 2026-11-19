import { Lang } from "./labels";

export type Group = "seekers" | "recruiters" | "company";

export type SiteLink = {
  id: string;
  group: Group;
  // Without the /fr prefix. A #section after the path jumps inside the page.
  href: string;
  title: Record<Lang, string>;
  desc: Record<Lang, string>;
};

export const SITE_LINKS: SiteLink[] = [
  {
    id: "builder",
    group: "seekers",
    href: "/templates",
    title: { en: "Resume builder", fr: "Créateur de CV" },
    desc: {
      en: "Pick your profession and build a clean resume",
      fr: "Choisissez votre métier et créez un CV soigné",
    },
  },
  {
    id: "examples",
    group: "seekers",
    href: "/examples",
    title: { en: "Resume examples", fr: "Exemples de CV" },
    desc: {
      en: "Designs for every field, ready to open",
      fr: "Des modèles pour chaque métier, prêts à ouvrir",
    },
  },
  {
    id: "stage",
    group: "seekers",
    href: "/stage",
    title: { en: "Internships & PFE", fr: "Stage et PFE" },
    desc: {
      en: "A resume and an application guide for students",
      fr: "Un CV et un guide de candidature pour les étudiants",
    },
  },
  {
    id: "letter",
    group: "seekers",
    href: "/letter",
    title: { en: "Internship request letter", fr: "Demande de stage" },
    desc: {
      en: "A one-page letter, built from a short form",
      fr: "Une lettre d'une page, à partir d'un court formulaire",
    },
  },
  {
    id: "tracker",
    group: "seekers",
    href: "/tracker",
    title: { en: "Application tracker", fr: "Suivi des candidatures" },
    desc: {
      en: "Keep every application and follow-up in one place",
      fr: "Gardez chaque candidature et chaque relance au même endroit",
    },
  },
  {
    id: "interview",
    group: "seekers",
    href: "/interview",
    title: { en: "Interview preparation", fr: "Préparation à l'entretien" },
    desc: {
      en: "Practice the questions you will be asked",
      fr: "Entraînez-vous aux questions qu'on vous posera",
    },
  },

  {
    id: "crm",
    group: "recruiters",
    href: "/recruiters",
    title: { en: "CRM overview", fr: "Présentation du CRM" },
    desc: {
      en: "A simple recruiting CRM for small agencies and HR teams",
      fr: "Un CRM de recrutement simple pour petits cabinets et équipes RH",
    },
  },
  {
    id: "pipeline",
    group: "recruiters",
    href: "/recruiters#pipeline",
    title: { en: "Jobs and pipeline", fr: "Offres et pipeline" },
    desc: {
      en: "Move candidates stage by stage",
      fr: "Faites avancer les candidats étape par étape",
    },
  },
  {
    id: "candidates",
    group: "recruiters",
    href: "/recruiters#candidates",
    title: { en: "Candidates and CVs", fr: "Candidats et CV" },
    desc: {
      en: "One page per person: details, CV, notes, tasks",
      fr: "Une page par personne : infos, CV, notes, tâches",
    },
  },
  {
    id: "messages",
    group: "recruiters",
    href: "/recruiters#messages",
    title: { en: "Message templates", fr: "Modèles de messages" },
    desc: {
      en: "WhatsApp and email messages, filled in for you",
      fr: "Messages WhatsApp et email, remplis pour vous",
    },
  },
  {
    id: "team",
    group: "recruiters",
    href: "/recruiters#team",
    title: { en: "Teams and roles", fr: "Équipes et rôles" },
    desc: {
      en: "Invite colleagues and assign tasks",
      fr: "Invitez vos collègues et assignez des tâches",
    },
  },
  {
    id: "teamplans",
    group: "recruiters",
    href: "/pricing#teams",
    title: { en: "Plans for teams", fr: "Formules pour les équipes" },
    desc: {
      en: "Start free, upgrade when you need more",
      fr: "Démarrez gratuitement, passez à Pro au besoin",
    },
  },

  {
    id: "pricing",
    group: "company",
    href: "/pricing",
    title: { en: "Pricing", fr: "Tarifs" },
    desc: {
      en: "Free to start, pay only to download",
      fr: "Gratuit pour commencer, payez seulement pour télécharger",
    },
  },
  {
    id: "privacy",
    group: "company",
    href: "/privacy",
    title: { en: "Privacy policy", fr: "Confidentialité" },
    desc: { en: "How we handle data", fr: "Comment nous traitons les données" },
  },
  {
    id: "terms",
    group: "company",
    href: "/terms",
    title: { en: "Terms", fr: "Conditions" },
    desc: { en: "The rules of the service", fr: "Les règles du service" },
  },
  {
    id: "refund",
    group: "company",
    href: "/refund",
    title: { en: "Refunds", fr: "Remboursements" },
    desc: { en: "When we refund", fr: "Quand nous remboursons" },
  },
];

export const linksOf = (group: Group) =>
  SITE_LINKS.filter((l) => l.group === group);

export const linkById = (id: string) => SITE_LINKS.find((l) => l.id === id);

export const hrefFor = (href: string, lang: Lang) =>
  `${lang === "fr" ? "/fr" : ""}${href}`;