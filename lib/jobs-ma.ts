import { Lang } from "./labels";

export type JobLink = {
  name: string;
  url: string;
  text: string;
};

export type JobGroup = {
  id: string;
  title: string;
  intro: string;
  links: JobLink[];
};

// To add a link later, copy one { name, url, text } block inside a group.
// Last reviewed: October 2026. Websites can change, so check the links now and then.
const en: JobGroup[] = [
  {
    id: "boards",
    title: "Job websites",
    intro: "Large sites where many Moroccan employers publish their offers.",
    links: [
      {
        name: "ReKrute",
        url: "https://www.rekrute.com",
        text: "A large Moroccan job board with company pages and offers across many sectors, including banking.",
      },
      {
        name: "Dreamjob",
        url: "https://www.dreamjob.ma",
        text: "Job offers and recruitment campaigns in Morocco, with categories by sector and by city.",
      },
      {
        name: "ANAPEC",
        url: "https://www.anapec.org",
        text: "The national public agency for employment and skills. You create a candidate account to apply to offers.",
      },
      {
        name: "Indeed Morocco",
        url: "https://ma.indeed.com",
        text: "Search offers in Morocco by job title and city.",
      },
      {
        name: "LinkedIn Jobs",
        url: "https://www.linkedin.com/jobs/",
        text: "Useful for company and managerial roles. Keep your profile in line with your resume.",
      },
    ],
  },
  {
    id: "companies",
    title: "Company recruitment pages",
    intro: "Applying directly on the company's own site is often the best way to be seen.",
    links: [
      {
        name: "CIH Bank recruitment",
        url: "https://recrutement.cihbank.ma/front-offres.html?direct",
        text: "Job offers published by CIH Bank, with a candidate area and a spontaneous application option.",
      },
      {
        name: "Attijariwafa bank",
        url: "https://www.attijariwafabank.com",
        text: "Official website of the group. Look for the careers or recruitment section.",
      },
    ],
  },
];

const fr: JobGroup[] = [
  {
    id: "boards",
    title: "Sites d'emploi",
    intro:
      "De grands sites où de nombreux employeurs marocains publient leurs offres.",
    links: [
      {
        name: "ReKrute",
        url: "https://www.rekrute.com",
        text: "Un grand site d'emploi marocain avec des pages d'entreprises et des offres dans de nombreux secteurs, dont la banque.",
      },
      {
        name: "Dreamjob",
        url: "https://www.dreamjob.ma",
        text: "Offres d'emploi et campagnes de recrutement au Maroc, classées par secteur et par ville.",
      },
      {
        name: "ANAPEC",
        url: "https://www.anapec.org",
        text: "L'agence publique nationale pour l'emploi et les compétences. Vous créez un espace candidat pour postuler aux offres.",
      },
      {
        name: "Indeed Maroc",
        url: "https://ma.indeed.com",
        text: "Recherchez des offres au Maroc par intitulé de poste et par ville.",
      },
      {
        name: "LinkedIn Jobs",
        url: "https://www.linkedin.com/jobs/",
        text: "Utile pour les postes en entreprise et d'encadrement. Gardez votre profil cohérent avec votre CV.",
      },
    ],
  },
  {
    id: "companies",
    title: "Pages de recrutement des entreprises",
    intro:
      "Postuler directement sur le site de l'entreprise est souvent le meilleur moyen d'être remarqué.",
    links: [
      {
        name: "Recrutement CIH Bank",
        url: "https://recrutement.cihbank.ma/front-offres.html?direct",
        text: "Les offres publiées par CIH Bank, avec un espace candidat et la possibilité d'une candidature spontanée.",
      },
      {
        name: "Attijariwafa bank",
        url: "https://www.attijariwafabank.com",
        text: "Site officiel du groupe. Cherchez la rubrique carrières ou recrutement.",
      },
    ],
  },
];

export const jobGroups: Record<Lang, JobGroup[]> = { en, fr };