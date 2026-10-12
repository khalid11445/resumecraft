type Pack = {
  general: string[];
  roles: { keywords: string[]; texts: string[] }[];
};

const packs: Record<string, Pack> = {
  nurse: {
    general: [
      "Infirmière dévouée avec [X] ans d'expérience en [service]. Compétente en évaluation clinique, administration des médicaments et communication claire avec les familles et les équipes de soins.",
      "Infirmier engagé pour des soins sûrs et centrés sur le patient. Expérience en [spécialité], avec une grande rigueur dans la documentation et un grand calme sous pression.",
      "Jeune diplômé en soins infirmiers ayant effectué des stages en [services], avec de solides bases en soins, prévention des infections et travail d'équipe. Désireux de progresser en [domaine].",
    ],
    roles: [
      {
        keywords: ["urgence", "trauma", "emergency", "er nurse"],
        texts: [
          "Infirmier aux urgences avec [X] ans d'expérience dans des services très actifs. Compétent en tri, évaluation rapide et organisation au calme lors des cas critiques.",
        ],
      },
      {
        keywords: ["réanimation", "reanimation", "intensif", "icu", "critical"],
        texts: [
          "Infirmier en soins critiques avec [X] ans d'expérience dans la surveillance et le traitement de patients en état grave. Solide en ventilation, surveillance hémodynamique et collaboration avec les médecins.",
        ],
      },
    ],
  },

  student: {
    general: [
      "Étudiant motivé en [filière], à la recherche d'un stage en [domaine]. Esprit d'équipe, communication et sens de l'analyse, avec une expérience en [projet ou activité].",
      "Jeune diplômé en [diplôme] avec une expérience concrète de projets et une grande capacité d'apprentissage. À la recherche d'un poste débutant en [secteur] pour mettre en pratique mes compétences en [compétences].",
      "Étudiant organisé et fiable, qui concilie études et [emploi ou activité]. Désireux d'acquérir de l'expérience, de prendre des initiatives et de contribuer à une équipe.",
    ],
    roles: [
      {
        keywords: ["stage", "stagiaire", "intern", "pfe"],
        texts: [
          "Étudiant en [filière] à la recherche d'un stage de [durée] en [domaine]. Rigoureux, curieux et capable de livrer dans les délais, avec des bases solides en [compétences].",
        ],
      },
      {
        keywords: ["vente", "vendeur", "vendeuse", "caissi", "client", "magasin", "sales", "retail"],
        texts: [
          "Vendeur attentif aux clients, qui accueille plus de [X] personnes par garde. Aimable, précis dans la gestion de la caisse et à l'aise dans un environnement très actif.",
        ],
      },
    ],
  },

  banking: {
    general: [
      "Professionnel de la finance avec [X] ans d'expérience en [domaine]. Solide en analyse financière, modélisation Excel et présentation de recommandations claires à la direction.",
      "Analyste rigoureux, expérimenté en [reporting, crédit ou risque]. Reconnu pour la précision de son travail, sa communication claire et le respect des délais serrés.",
      "Diplômé en finance avec une expérience de stage en [domaine] et de solides compétences quantitatives. À la recherche d'un premier poste en [banque, audit ou analyse].",
    ],
    roles: [
      {
        keywords: ["crédit", "credit", "prêt", "loan"],
        texts: [
          "Analyste crédit avec [X] ans d'expérience dans l'évaluation d'emprunteurs et le suivi d'un portefeuille de [X MAD]. Compétent en analyse des états financiers et en rédaction de notes de crédit.",
        ],
      },
      {
        keywords: ["investissement", "m&a", "banquier", "investment"],
        texts: [
          "Analyste en banque d'investissement avec une expérience en valorisation, modélisation financière et supports commerciaux sur [X] opérations. À l'aise sous des délais serrés.",
        ],
      },
    ],
  },

  tech: {
    general: [
      "Développeur avec [X] ans d'expérience dans la création d'applications [web ou mobiles] avec [technologies]. Attaché à un code propre, aux performances et à une bonne expérience utilisateur.",
      "Passionné par la transformation d'idées en produits fonctionnels. Expérience de [stack], du travail en équipe agile et de la livraison de fonctionnalités utilisées par plus de [X] personnes.",
      "Développeur junior avec de solides bases en [langages] et des projets comme [projet]. Apprend vite et souhaite progresser dans une équipe d'ingénierie collaborative.",
    ],
    roles: [
      {
        keywords: ["frontend", "front-end", "front end", "react"],
        texts: [
          "Développeur frontend avec [X] ans d'expérience dans la création d'interfaces rapides et accessibles avec React et TypeScript. Passionné par les systèmes de design et les performances.",
        ],
      },
      {
        keywords: ["backend", "back-end", "back end", "api"],
        texts: [
          "Développeur backend avec [X] ans d'expérience dans la conception d'API fiables et de bases de données. Attentif aux performances, aux tests et à la sécurité.",
        ],
      },
      {
        keywords: ["data", "donnée", "analytique"],
        texts: [
          "Analyste de données avec [X] ans d'expérience pour transformer les données en informations claires avec SQL, Python et des tableaux de bord. À l'aise pour présenter à des équipes non techniques.",
        ],
      },
    ],
  },

  teacher: {
    general: [
      "Enseignant dévoué avec [X] ans d'expérience dans la création de classes motivantes et inclusives. Compétent en préparation des cours, évaluation et communication avec les parents.",
      "Pédagogue centré sur l'élève, qui adapte ses cours aux différents styles d'apprentissage. Expérience en [matière ou niveau], avec des résultats d'élèves en progression.",
      "Enseignant récemment diplômé, avec des stages en classe au niveau [niveau] et une passion pour [matière]. Désireux de construire un environnement d'apprentissage positif et structuré.",
    ],
    roles: [
      {
        keywords: ["primaire", "école", "ecole", "instituteur", "class teacher"],
        texts: [
          "Enseignant du primaire avec [X] ans d'expérience auprès d'élèves de [X à X] ans. Utilise des activités concrètes et des routines claires pour garder l'attention des jeunes élèves.",
        ],
      },
      {
        keywords: ["français", "francais", "anglais", "arabe", "langue", "english", "french"],
        texts: [
          "Enseignant de langues avec [X] ans d'expérience dans l'enseignement du [langue] au niveau [niveau]. Met l'accent sur la confiance à l'oral et la réussite aux examens.",
        ],
      },
    ],
  },
};

export function summariesForFr(categoryId: string, jobTitle: string): string[] {
  const pack = packs[categoryId] ?? packs.student;
  const t = jobTitle.toLowerCase().trim();
  const match = t
    ? pack.roles.find((r) => r.keywords.some((k) => t.includes(k)))
    : undefined;
  return match ? [...match.texts, ...pack.general].slice(0, 3) : pack.general;
}