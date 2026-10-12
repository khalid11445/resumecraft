import { ResumeData } from "./resume-schema";
import type { Category } from "./categories";
import { categories as categoriesEn } from "./categories";

const nurse: ResumeData = {
  personal: {
    fullName: "Salma Benali",
    jobTitle: "Infirmière diplômée d'État",
    email: "salma.benali@email.com",
    phone: "+212 600 00 00 00",
    location: "Casablanca, Maroc",
    website: "",
    linkedin: "linkedin.com/in/salmabenali",
  },
  summary:
    "Infirmière dévouée avec 5 ans d'expérience aux urgences et en soins critiques. Compétente en évaluation clinique, prise de décision rapide et travail en équipe sous pression.",
  experience: [
    {
      id: "1",
      role: "Infirmière aux urgences",
      company: "Clinique Atlas",
      location: "Casablanca, Maroc",
      startDate: "2021",
      endDate: "",
      bullets: [
        "Tri et prise en charge de plus de 25 patients par garde dans un service d'urgences très actif",
        "Encadrement de 6 jeunes infirmiers lors de leur intégration",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "Institut de formation en soins infirmiers",
      degree: "Diplôme d'État d'infirmier",
      startDate: "2016",
      endDate: "2019",
      details: "",
    },
  ],
  skills: [
    "Évaluation clinique",
    "Perfusions",
    "Administration des médicaments",
    "Triage",
  ],
  customSections: [
    {
      id: "1",
      title: "Diplômes et certifications",
      items: ["Diplôme d'État d'infirmier", "BLS", "ACLS"],
    },
  ],
};

const student: ResumeData = {
  personal: {
    fullName: "Yassine El Amrani",
    jobTitle: "Étudiant en gestion",
    email: "yassine.elamrani@email.com",
    phone: "+212 600 00 00 00",
    location: "Rabat, Maroc",
    website: "",
    linkedin: "linkedin.com/in/yassineelamrani",
  },
  summary:
    "Étudiant en gestion motivé, à la recherche d'un stage. Esprit d'équipe, sens de l'analyse et expérience de responsabilités dans la vie associative.",
  experience: [
    {
      id: "1",
      role: "Vendeur (temps partiel)",
      company: "Librairie du Campus",
      location: "Rabat, Maroc",
      startDate: "2024",
      endDate: "",
      bullets: [
        "Accueil et conseil de plus de 80 clients par jour, gestion rigoureuse de la caisse",
        "Réorganisation du stock, réduisant le temps de réapprovisionnement de 20 %",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "École supérieure de commerce",
      degree: "Licence en gestion",
      startDate: "2023",
      endDate: "Present",
      details: "Moyenne : 15/20",
    },
  ],
  skills: [
    "Excel",
    "Prise de parole en public",
    "Travail d'équipe",
    "Recherche documentaire",
  ],
  customSections: [
    {
      id: "1",
      title: "Projets et bénévolat",
      items: [
        "Étude de marché pour un café local (projet de classe, équipe de 4)",
        "Soutien scolaire bénévole, 2 heures par semaine",
      ],
    },
  ],
};

const banking: ResumeData = {
  personal: {
    fullName: "Karim Alaoui",
    jobTitle: "Analyste financier",
    email: "karim.alaoui@email.com",
    phone: "+212 600 00 00 00",
    location: "Casablanca, Maroc",
    website: "",
    linkedin: "linkedin.com/in/karimalaoui",
  },
  summary:
    "Analyste financier avec 4 ans d'expérience en banque d'entreprise, analyse de crédit et modélisation financière.",
  experience: [
    {
      id: "1",
      role: "Analyste crédit",
      company: "Banque Atlas",
      location: "Casablanca, Maroc",
      startDate: "2022",
      endDate: "",
      bullets: [
        "Analyse d'un portefeuille de crédits de 120 M MAD et identification de risques ayant réduit les impayés de 12 %",
        "Construction de modèles financiers utilisés dans plus de 40 décisions de comités de crédit",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "École de commerce et de finance",
      degree: "Master en finance",
      startDate: "2017",
      endDate: "2021",
      details: "",
    },
  ],
  skills: ["Modélisation financière", "Excel", "Analyse de crédit", "Bloomberg"],
  customSections: [
    {
      id: "1",
      title: "Certifications",
      items: ["CFA niveau II (candidat)", "FRM partie I"],
    },
  ],
};

const tech: ResumeData = {
  personal: {
    fullName: "Omar Haddad",
    jobTitle: "Développeur Frontend",
    email: "omar.haddad@email.com",
    phone: "+212 600 00 00 00",
    location: "Casablanca, Maroc",
    website: "omarhaddad.dev",
    linkedin: "linkedin.com/in/omarhaddad",
  },
  summary:
    "Développeur frontend avec 3 ans d'expérience dans la création d'applications web rapides et accessibles avec React et TypeScript.",
  experience: [
    {
      id: "1",
      role: "Développeur Frontend",
      company: "Atlas Digital",
      location: "Casablanca, Maroc",
      startDate: "2023",
      endDate: "",
      bullets: [
        "Refonte du tunnel de paiement en React, avec une hausse de 15 % de la conversion",
        "Réduction du temps de chargement de 4 s à 1,5 s grâce au découpage du code et à l'optimisation des images",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "École nationale d'ingénieurs",
      degree: "Diplôme d'ingénieur en génie logiciel",
      startDate: "2018",
      endDate: "2023",
      details: "",
    },
  ],
  skills: ["React", "TypeScript", "Next.js", "Node.js", "Git"],
  customSections: [
    {
      id: "1",
      title: "Projets",
      items: [
        "Bibliothèque d'interface open source, plus de 300 étoiles sur GitHub",
        "Application de suivi de budget personnel avec Next.js et Supabase",
      ],
    },
  ],
};

const teacher: ResumeData = {
  personal: {
    fullName: "Laila Benali",
    jobTitle: "Professeure des écoles",
    email: "laila.benali@email.com",
    phone: "+212 600 00 00 00",
    location: "Rabat, Maroc",
    website: "",
    linkedin: "",
  },
  summary:
    "Enseignante dévouée avec 6 ans d'expérience, qui crée des classes motivantes et inclusives et améliore les résultats des élèves.",
  experience: [
    {
      id: "1",
      role: "Enseignante, 4e année primaire",
      company: "École Al Amal",
      location: "Rabat, Maroc",
      startDate: "2020",
      endDate: "",
      bullets: [
        "Hausse de 18 % du score moyen en lecture en une année scolaire",
        "Conception de séquences par projets réutilisées par 5 autres enseignants",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "Université",
      degree: "Licence en sciences de l'éducation",
      startDate: "2015",
      endDate: "2019",
      details: "",
    },
  ],
  skills: [
    "Gestion de classe",
    "Préparation des cours",
    "Pédagogie différenciée",
    "Communication avec les parents",
  ],
  customSections: [
    {
      id: "1",
      title: "Certifications et formations",
      items: [
        "Certificat d'aptitude pédagogique",
        "Formation aux premiers secours",
        "Atelier sur l'éducation inclusive",
      ],
    },
  ],
};

// Reuse the color of the English category with the same id
const colorFor = (id: string) =>
  (categoriesEn.find((c) => c.id === id) ?? categoriesEn[0]).color;

export const categoriesFr: Category[] = [
  {
    id: "nurse",
    name: "Infirmier / Santé",
    description: "Mettez en avant diplômes, certifications et expérience clinique.",
    recommendedSections: ["Diplômes", "Certifications", "Stages cliniques"],
    color: colorFor("nurse"),
    starter: nurse,
  },
  {
    id: "student",
    name: "Étudiant / Premier emploi",
    description: "La formation d'abord, puis projets et bénévolat.",
    recommendedSections: ["Projets", "Bénévolat", "Activités"],
    color: colorFor("student"),
    starter: student,
  },
  {
    id: "banking",
    name: "Banque / Finance",
    description: "Axé sur les résultats, une page, avec certifications.",
    recommendedSections: ["Certifications", "Réalisations chiffrées"],
    color: colorFor("banking"),
    starter: banking,
  },
  {
    id: "tech",
    name: "Tech / Développeur",
    description: "Compétences, projets et liens vers votre GitHub ou portfolio.",
    recommendedSections: ["Projets", "Open source", "Certifications"],
    color: colorFor("tech"),
    starter: tech,
  },
  {
    id: "teacher",
    name: "Enseignant / Éducation",
    description: "Résultats en classe, formations et certifications.",
    recommendedSections: ["Certifications", "Formations", "Activités"],
    color: colorFor("teacher"),
    starter: teacher,
  },
];