import { ResumeData } from "./resume-schema";
import type { Category } from "./categories";
import { categories as categoriesEn } from "./categories";
import type { Ideas } from "./suggestions-fr";
import { Lang } from "./labels";

// Reuse the color value of the "student" category, whatever its format is
const studentColor = (categoriesEn.find((c) => c.id === "student") ?? categoriesEn[0])
  .color;

const starterFr: ResumeData = {
  personal: {
    fullName: "Imane Tazi",
    jobTitle: "Étudiante ingénieure — recherche de stage PFE",
    email: "imane.tazi@email.com",
    phone: "+212 600 00 00 00",
    location: "Rabat, Maroc",
    website: "",
    linkedin: "linkedin.com/in/imanetazi",
  },
  summary:
    "Étudiante en dernière année du cycle ingénieur en génie informatique, à la recherche d'un stage de fin d'études (PFE) de 6 mois à partir de février. Solides bases en développement web et en bases de données acquises à travers plusieurs projets d'équipe, avec un goût marqué pour la conception d'applications utiles.",
  experience: [
    {
      id: "1",
      role: "Stagiaire développeuse web",
      company: "Atlas Digital",
      location: "Casablanca, Maroc",
      startDate: "Juil. 2026",
      endDate: "Août 2026",
      bullets: [
        "Développement de 4 pages de l'application interne de suivi des commandes avec React",
        "Correction de 15 anomalies signalées par l'équipe et rédaction de la documentation associée",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "École nationale d'ingénieurs",
      degree: "Cycle ingénieur en génie informatique",
      startDate: "2022",
      endDate: "Present",
      details: "Diplôme prévu en juin 2027",
    },
  ],
  skills: ["React", "Node.js", "SQL", "Python", "Git", "Travail d'équipe"],
  customSections: [
    {
      id: "1",
      title: "Projets académiques",
      items: [
        "Application web de gestion de stock (projet de 2e année, équipe de 3)",
        "Système de réservation de salles avec Node.js et PostgreSQL",
      ],
    },
    {
      id: "2",
      title: "Langues",
      items: ["Arabe (langue maternelle)", "Français (courant)", "Anglais (B2)"],
    },
    {
      id: "3",
      title: "Vie associative",
      items: ["Responsable logistique du club d'informatique de l'école"],
    },
  ],
};

const starterEn: ResumeData = {
  personal: {
    fullName: "Imane Tazi",
    jobTitle: "Engineering student — seeking a final-year internship",
    email: "imane.tazi@email.com",
    phone: "+212 600 00 00 00",
    location: "Rabat, Morocco",
    website: "",
    linkedin: "linkedin.com/in/imanetazi",
  },
  summary:
    "Final-year computer engineering student looking for a 6-month final-year internship starting in February. Solid foundations in web development and databases built through several team projects, with a strong interest in designing useful applications.",
  experience: [
    {
      id: "1",
      role: "Web Developer Intern",
      company: "Atlas Digital",
      location: "Casablanca, Morocco",
      startDate: "Jul 2026",
      endDate: "Aug 2026",
      bullets: [
        "Built 4 pages of the internal order-tracking application with React",
        "Fixed 15 issues reported by the team and wrote the related documentation",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "National School of Engineers",
      degree: "Engineering degree in Computer Engineering",
      startDate: "2022",
      endDate: "Present",
      details: "Expected graduation: June 2027",
    },
  ],
  skills: ["React", "Node.js", "SQL", "Python", "Git", "Teamwork"],
  customSections: [
    {
      id: "1",
      title: "Academic projects",
      items: [
        "Stock management web app (2nd-year project, team of 3)",
        "Room booking system built with Node.js and PostgreSQL",
      ],
    },
    {
      id: "2",
      title: "Languages",
      items: ["Arabic (native)", "French (fluent)", "English (B2)"],
    },
    {
      id: "3",
      title: "Student activities",
      items: ["Logistics lead of the school's computer science club"],
    },
  ],
};

export function stageCategory(lang: Lang = "en"): Category {
  if (lang === "fr") {
    return {
      id: "stage",
      name: "Stage / PFE",
      description:
        "Un CV d'une page pour décrocher un stage, avec projets, langues et vie associative.",
      recommendedSections: ["Projets académiques", "Langues", "Vie associative"],
      color: studentColor,
      starter: starterFr,
    };
  }
  return {
    id: "stage",
    name: "Internship / Final-year project",
    description:
      "A one-page resume for internship applications, with projects, languages and activities.",
    recommendedSections: ["Academic projects", "Languages", "Student activities"],
    color: studentColor,
    starter: starterEn,
  };
}

const ideasFr: Ideas = {
  titles: [
    "Stagiaire ingénieur logiciel — PFE",
    "Stagiaire en marketing digital",
    "Stagiaire en finance",
    "Étudiant ingénieur — recherche de stage PFE",
    "Étudiant en master — recherche de stage de fin d'études",
    "Jeune diplômé — recherche d'un stage post-diplôme",
  ],
  skills: [
    "Travail d'équipe",
    "Gestion de projet",
    "Rédaction de rapports",
    "Prise de parole en public",
    "Excel",
    "Python",
    "Esprit d'analyse",
    "Gestion du temps",
  ],
  general: [
    "Conception et réalisation de [projet] en équipe de [X], de l'analyse des besoins à la présentation finale",
    "Rédaction du rapport et soutenance devant un jury de [X] enseignants",
    "Développement de [fonctionnalité] avec [technologies], utilisée par [X] personnes",
    "Analyse de [données ou processus] et proposition de [amélioration], avec [résultat]",
    "Coordination d'une équipe de [X] étudiants pour [événement ou projet]",
  ],
  roles: [
    {
      keywords: ["développ", "informatique", "logiciel", "web", "data", "ingénieur"],
      bullets: [
        "Développement de [fonctionnalité] avec [technologies], testée et documentée",
        "Participation à la conception de la base de données de [projet] ([X] tables)",
        "Utilisation de Git pour travailler en équipe de [X] développeurs",
        "Résolution de [X] anomalies et amélioration des performances de [X] %",
      ],
    },
    {
      keywords: ["marketing", "commerce", "communication", "digital"],
      bullets: [
        "Création de [X] publications pour [réseau social], avec [X] interactions",
        "Étude de marché auprès de [X] personnes pour [projet] et synthèse des résultats",
        "Appui à l'organisation de [événement] pour [X] participants",
        "Suivi des indicateurs de [campagne] et présentation à l'équipe",
      ],
    },
    {
      keywords: ["finance", "gestion", "comptab", "audit", "banque"],
      bullets: [
        "Saisie et rapprochement de [X] écritures comptables par mois",
        "Construction d'un tableau de suivi Excel utilisé par [équipe]",
        "Analyse des états financiers de [entreprise] dans le cadre de [projet]",
        "Appui à la préparation du reporting mensuel de [service]",
      ],
    },
  ],
};

const ideasEn: Ideas = {
  titles: [
    "Software Engineering Intern",
    "Digital Marketing Intern",
    "Finance Intern",
    "Engineering Student — seeking a final-year internship",
    "Master's Student — seeking an internship",
    "Recent Graduate — seeking an internship",
  ],
  skills: [
    "Teamwork",
    "Project Management",
    "Report Writing",
    "Public Speaking",
    "Excel",
    "Python",
    "Analytical Thinking",
    "Time Management",
  ],
  general: [
    "Designed and delivered [project] in a team of [X], from requirements to final presentation",
    "Wrote the project report and defended it in front of a panel of [X] teachers",
    "Built [feature] with [technologies], used by [X] people",
    "Analyzed [data or process] and proposed [improvement], resulting in [result]",
    "Coordinated a team of [X] students for [event or project]",
  ],
  roles: [
    {
      keywords: ["develop", "software", "web", "data", "engineer"],
      bullets: [
        "Built [feature] with [technologies], tested and documented",
        "Helped design the database for [project] ([X] tables)",
        "Used Git to work in a team of [X] developers",
        "Fixed [X] issues and improved performance by [X]%",
      ],
    },
    {
      keywords: ["marketing", "communication", "digital"],
      bullets: [
        "Created [X] posts for [social network], reaching [X] interactions",
        "Surveyed [X] people for [project] and summarized the results",
        "Helped organize [event] for [X] participants",
        "Tracked the results of [campaign] and presented them to the team",
      ],
    },
    {
      keywords: ["finance", "accounting", "audit", "bank"],
      bullets: [
        "Entered and reconciled [X] accounting entries per month",
        "Built an Excel tracking sheet used by [team]",
        "Analyzed the financial statements of [company] for [project]",
        "Helped prepare the monthly report for [department]",
      ],
    },
  ],
};

export function stageIdeas(lang: Lang = "en"): Ideas {
  return lang === "fr" ? ideasFr : ideasEn;
}

export function stageBullets(lang: Lang, text: string): string[] {
  const s = stageIdeas(lang);
  const t = text.toLowerCase().trim();
  const match = t
    ? s.roles.find((r) => r.keywords.some((k) => t.includes(k)))
    : undefined;
  return match ? [...match.bullets, ...s.general] : s.general;
}

// Summaries mention the internship type, duration and period, as recruiters expect
export function stageSummaries(lang: Lang = "en", _title = ""): string[] {
  void _title;
  return lang === "fr"
    ? [
        "Étudiant en dernière année du cycle [filière], à la recherche d'un stage de fin d'études (PFE) de [4 à 6] mois à partir de [mois]. Solides bases en [compétences] acquises à travers des projets d'équipe, avec un goût marqué pour [domaine].",
        "Étudiant en [filière] motivé, à la recherche d'un stage de [durée] en [domaine] à partir de [mois]. Rigoureux, curieux et capable de livrer dans les délais, avec une expérience de projets en [domaine].",
        "Jeune diplômé en [diplôme] à la recherche d'un stage post-diplôme en [domaine]. Capable de travailler en équipe, d'apprendre vite et de mener un projet de la conception à la présentation.",
      ]
    : [
        "Final-year [field] student looking for a [4 to 6]-month final-year internship (PFE) starting in [month]. Solid foundations in [skills] built through team projects, with a strong interest in [area].",
        "Motivated [field] student seeking a [duration] internship in [area] starting in [month]. Rigorous, curious and able to deliver on time, with project experience in [area].",
        "Recent [degree] graduate seeking an internship in [area]. Able to work in a team, learn quickly and carry a project from design to presentation.",
      ];
}