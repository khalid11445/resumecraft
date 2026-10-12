export type Ideas = {
  titles: string[];
  skills: string[];
  general: string[];
  roles: { keywords: string[]; bullets: string[] }[];
};

export const suggestionsFr: Record<string, Ideas> = {
  nurse: {
    titles: [
      "Infirmier diplômé d'État",
      "Infirmier en réanimation",
      "Infirmier aux urgences",
      "Infirmier en pédiatrie",
      "Infirmier polyvalent",
      "Aide-soignant",
    ],
    skills: [
      "Évaluation clinique",
      "Perfusions",
      "Administration des médicaments",
      "Dossier patient informatisé",
      "Triage",
      "Hygiène et prévention des infections",
      "Soins de plaies",
      "BLS / ACLS",
    ],
    general: [
      "Prise en charge de [X] patients par garde dans le respect des protocoles de sécurité et d'hygiène",
      "Consignation précise des soins et des observations dans le dossier du patient",
      "Collaboration avec les médecins et l'équipe soignante pour ajuster les plans de soins",
      "Information des patients et des familles sur les traitements et les consignes de sortie",
      "Encadrement de [X] nouveaux infirmiers ou stagiaires",
    ],
    roles: [
      {
        keywords: ["urgence", "trauma", "emergency", "er nurse"],
        bullets: [
          "Tri et prise en charge de plus de [X] patients par garde dans un service d'urgences très actif",
          "Intervention sur des cas de traumatologie et stabilisation des patients avant transfert ou admission",
          "Pose de perfusions, administration des médicaments et soins de plaies sous pression",
          "Communication calme et claire avec les patients et les familles en situation d'urgence",
        ],
      },
      {
        keywords: ["réanimation", "reanimation", "soins intensifs", "intensif", "icu", "critical"],
        bullets: [
          "Surveillance de patients ventilés ou en état critique et réaction rapide à toute évolution",
          "Gestion des perfusions et du matériel de surveillance hémodynamique",
          "Coordination des soins avec les médecins, les kinésithérapeutes respiratoires et les pharmaciens",
          "Respect d'un ratio de [X] patients par infirmier tout en tenant la documentation à jour",
        ],
      },
      {
        keywords: ["pédiatr", "pediatr", "enfant", "child"],
        bullets: [
          "Prise en charge d'enfants de [X à X] ans avec une approche centrée sur le confort et la famille",
          "Calcul et administration de doses selon le poids, avec double vérification",
          "Éducation des parents sur les soins à domicile, la nutrition et le suivi",
          "Communication adaptée à l'âge pour réduire l'anxiété pendant les soins",
        ],
      },
    ],
  },

  student: {
    titles: [
      "Étudiant en gestion",
      "Étudiant en ingénierie",
      "Jeune diplômé",
      "Stagiaire",
      "Vendeur à temps partiel",
      "Bénévole",
    ],
    skills: [
      "Microsoft Excel",
      "Prise de parole en public",
      "Travail d'équipe",
      "Recherche documentaire",
      "Gestion du temps",
      "Résolution de problèmes",
      "Canva",
      "Communication",
    ],
    general: [
      "Conciliation des études et de [activité] avec une moyenne de [X]/20",
      "Travail en équipe de [X] personnes pour rendre des projets de cours dans les délais",
      "Présentation des résultats d'un projet devant la classe et les enseignants",
      "Utilisation d'Excel pour organiser et analyser des données pour [projet ou cours]",
      "Prise d'initiative pour [décrire l'action], avec pour résultat [résultat]",
    ],
    roles: [
      {
        keywords: ["stage", "stagiaire", "intern", "pfe"],
        bullets: [
          "Appui à l'équipe [service] sur [missions], avec [X] dossiers traités dans les délais",
          "Recherche sur [sujet] et présentation des conclusions à l'équipe",
          "Prise en main de [outil ou processus] et application pour améliorer [tâche]",
          "Communication avec [clients ou collègues] par email et en réunion",
        ],
      },
      {
        keywords: ["vente", "vendeur", "vendeuse", "caissi", "client", "magasin", "sales", "retail"],
        bullets: [
          "Accueil et conseil de plus de [X] clients par jour, gestion de la caisse avec précision",
          "Recommandation de produits adaptés aux besoins, avec une hausse des ventes de [X] %",
          "Mise en rayon et organisation du stock",
          "Traitement poli et rapide des questions et des réclamations",
        ],
      },
      {
        keywords: ["soutien", "tuteur", "cours particuliers", "tutor", "enseign"],
        bullets: [
          "Accompagnement de [X] élèves en [matière], avec une amélioration de leurs résultats",
          "Préparation de petites séquences de cours et d'exercices d'entraînement",
          "Adaptation des explications au niveau et au rythme de chaque élève",
          "Suivi des progrès et retours réguliers aux élèves et aux parents",
        ],
      },
      {
        keywords: ["bénévol", "benevol", "association", "volunteer"],
        bullets: [
          "[X] heures par semaine de bénévolat auprès de [association]",
          "Aide à l'organisation de [événement] pour plus de [X] participants",
          "Coordination d'une équipe de [X] bénévoles pour atteindre [objectif]",
          "Accueil et accompagnement des participants ou des bénéficiaires",
        ],
      },
    ],
  },

  banking: {
    titles: [
      "Analyste financier",
      "Analyste crédit",
      "Analyste en banque d'investissement",
      "Comptable",
      "Chargé de clientèle",
      "Auditeur",
    ],
    skills: [
      "Modélisation financière",
      "Excel",
      "Analyse de crédit",
      "Bloomberg",
      "Gestion des risques",
      "Reporting financier",
      "SQL",
      "Valorisation",
    ],
    general: [
      "Analyse de données financières pour appuyer les décisions sur [domaine], avec une amélioration de [indicateur] de [X] %",
      "Préparation de rapports mensuels et de présentations pour la direction",
      "Construction de modèles Excel pour prévoir [chiffre d'affaires, trésorerie ou risque] sur [X] scénarios",
      "Respect des politiques internes et des exigences réglementaires",
      "Collaboration avec [équipes] pour livrer [projet] dans les délais et le budget",
    ],
    roles: [
      {
        keywords: ["crédit", "credit", "prêt", "loan"],
        bullets: [
          "Évaluation de la solvabilité de plus de [X] emprunteurs à partir des états financiers et des ratios",
          "Suivi d'un portefeuille de crédits de [X MAD] et détection précoce des risques",
          "Rédaction de notes de crédit pour les comités d'engagement",
          "Recommandation d'accord ou de refus appuyée par l'analyse des flux de trésorerie",
        ],
      },
      {
        keywords: ["investissement", "m&a", "fusion", "banquier", "investment"],
        bullets: [
          "Construction de modèles de valorisation (DCF, multiples) pour [X] opérations",
          "Préparation de présentations commerciales et de dossiers clients",
          "Études de marché et sectorielles à l'appui des équipes transactionnelles",
          "Analyse des états financiers et des documents de due diligence",
        ],
      },
      {
        keywords: ["comptab", "audit", "account"],
        bullets: [
          "Rapprochements bancaires et appui à la clôture mensuelle pour [X] entités",
          "Contrôle de plus de [X] opérations pour détecter les erreurs et garantir l'exactitude",
          "Amélioration d'un processus de reporting, avec [X] heures gagnées par mois",
          "Préparation de la documentation pour les audits externes",
        ],
      },
      {
        keywords: ["clientèle", "clientele", "agence", "conseiller", "relationship", "advisor"],
        bullets: [
          "Gestion d'un portefeuille de [X] clients représentant [X MAD] d'encours",
          "Identification des besoins et proposition de produits adaptés, avec [X] % de l'objectif atteint",
          "Traitement des demandes et réclamations en moins de [X] heures",
          "Renforcement de la relation client et amélioration de la fidélisation de [X] %",
        ],
      },
    ],
  },

  tech: {
    titles: [
      "Développeur Frontend",
      "Développeur Backend",
      "Développeur Full-Stack",
      "Ingénieur logiciel",
      "Analyste de données",
      "Ingénieur DevOps",
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "SQL",
      "Git",
      "API REST",
      "Docker",
    ],
    general: [
      "Développement et mise en production de fonctionnalités utilisées par plus de [X] utilisateurs",
      "Écriture de code propre et testé, participation aux revues de code",
      "Collaboration avec les designers et les chefs de produit dans une équipe agile",
      "Correction de [X] bugs et amélioration des performances de [X] %",
      "Documentation du code et des processus pour faciliter l'intégration des nouveaux collègues",
    ],
    roles: [
      {
        keywords: ["frontend", "front-end", "front end", "react", "web"],
        bullets: [
          "Création d'interfaces responsives avec React et TypeScript, utilisées par plus de [X] utilisateurs",
          "Réduction du temps de chargement de [X] % grâce au découpage du code et à l'optimisation des images",
          "Développement de composants accessibles respectant les recommandations WCAG",
          "Transformation des maquettes des designers en composants réutilisables",
        ],
      },
      {
        keywords: ["backend", "back-end", "back end", "serveur", "api"],
        bullets: [
          "Conception et maintenance d'API REST traitant plus de [X] requêtes par jour",
          "Optimisation des requêtes de base de données, avec un temps de réponse réduit de [X] %",
          "Écriture de tests automatisés, avec une couverture portée à [X] %",
          "Mise en place de l'authentification et des autorisations pour protéger les données",
        ],
      },
      {
        keywords: ["data", "donnée", "analytique", "analytics"],
        bullets: [
          "Nettoyage et analyse de jeux de données de plus de [X] lignes avec SQL et Python",
          "Création de tableaux de bord dans [Power BI ou Tableau] utilisés par [équipe]",
          "Identification de tendances ayant conduit à [résultat]",
          "Présentation des analyses à des interlocuteurs non techniques",
        ],
      },
      {
        keywords: ["devops", "cloud", "infrastructure", "sre"],
        bullets: [
          "Automatisation des déploiements avec des pipelines CI/CD, réduisant le temps de livraison de [X] %",
          "Gestion de l'infrastructure cloud sur [AWS, Azure ou GCP]",
          "Mise en place de la supervision et des alertes, réduisant les interruptions de [X] %",
          "Conteneurisation des services avec Docker pour standardiser les environnements",
        ],
      },
    ],
  },

  teacher: {
    titles: [
      "Professeur des écoles",
      "Professeur de lycée",
      "Professeur de français",
      "Professeur de mathématiques",
      "Assistant d'enseignement",
      "Professeur particulier",
    ],
    skills: [
      "Préparation des cours",
      "Gestion de classe",
      "Pédagogie différenciée",
      "Évaluation des élèves",
      "Communication avec les parents",
      "Conception de programmes",
      "Google Classroom",
      "Motivation des élèves",
    ],
    general: [
      "Préparation et animation de cours motivants pour [X] élèves, conformes au programme",
      "Évaluation des progrès des élèves et retours réguliers et constructifs",
      "Maintien d'un climat de classe positif et inclusif",
      "Échanges réguliers avec les parents sur les progrès et le comportement",
      "Collaboration avec les collègues pour créer des supports pédagogiques communs",
    ],
    roles: [
      {
        keywords: ["primaire", "école", "ecole", "instituteur", "class teacher", "elementary"],
        bullets: [
          "Enseignement à [X] élèves âgés de [X à X] ans dans toutes les matières fondamentales",
          "Hausse de [X] % des résultats moyens en lecture ou en mathématiques sur une année scolaire",
          "Utilisation de jeux et d'activités concrètes pour maintenir l'attention des jeunes élèves",
          "Mise en place de routines de classe favorisant la concentration et le respect",
        ],
      },
      {
        keywords: ["français", "francais", "anglais", "arabe", "langue", "english", "french"],
        bullets: [
          "Enseignement du [langue] au niveau [niveau], avec un taux de réussite aux examens en hausse de [X] %",
          "Conception d'activités d'expression orale et écrite pour des groupes de niveaux différents",
          "Utilisation d'outils numériques et de documents authentiques pour motiver les élèves",
          "Préparation des élèves à l'examen [nom de l'examen]",
        ],
      },
      {
        keywords: ["math", "science", "physique", "chimie", "svt", "biologie"],
        bullets: [
          "Enseignement de [matière] à [X] élèves, avec une hausse de la moyenne de [X] %",
          "Conception d'exercices et d'expériences reliant les notions à la vie réelle",
          "Soutien des élèves en difficulté par des séances supplémentaires et des explications pas à pas",
          "Adaptation de la progression à partir des résultats des évaluations",
        ],
      },
    ],
  },
};

export function bulletsForFr(categoryId: string, text: string): string[] {
  const s = suggestionsFr[categoryId] ?? suggestionsFr.student;
  const t = text.toLowerCase().trim();
  const match = t
    ? s.roles.find((r) => r.keywords.some((k) => t.includes(k)))
    : undefined;
  return match ? [...match.bullets, ...s.general] : s.general;
}