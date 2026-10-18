import { Lang } from "./labels";

export type PfeSection = {
  id: string;
  title: string;
  intro?: string;
  items?: string[];
  numbered?: boolean;
  table?: { headers: [string, string]; rows: [string, string][] };
  note?: string;
};

const en: PfeSection[] = [
  {
    id: "what",
    title: "What a PFE usually involves",
    items: [
      "A final-year project, usually done in a company or a lab at the end of your studies.",
      "You have a company supervisor and an academic supervisor from your school.",
      "It ends with a written report and an oral defense in front of a jury.",
      "Duration, report format and grading depend on your school. Ask your PFE coordinator for the official guide.",
    ],
  },
  {
    id: "topic",
    title: "Choosing a good topic",
    intro:
      "A good topic is useful to the company, realistic for your duration, and connected to the job you want afterwards.",
    items: [
      "Clear problem: you can state it in one or two sentences.",
      "Realistic scope: it can be finished during your internship, with the tools and data you will have access to.",
      "A result you can show: an application, an analysis, a study with figures, a prototype.",
      "It fits your skills and career goals, so it helps your resume and your interviews.",
      "Your own contribution is clear. The jury will ask what you personally did.",
    ],
    note: "Example only. Too vague: “Improve the company's information system.” Clearer: “Design and build a web application to track customer orders and reduce manual data entry.”",
  },
  {
    id: "plan",
    title: "Plan your months",
    intro: "A rough plan for an internship of about six months. Adjust it to your own duration.",
    table: {
      headers: ["When", "What to do"],
      rows: [
        [
          "Before the start",
          "Choose the topic and the company, and sign the internship agreement (convention de stage) with your school and the company.",
        ],
        [
          "Weeks 1 and 2",
          "Meet your supervisors, understand the context, write the problem statement and agree on what you must deliver.",
        ],
        [
          "Months 1 and 2",
          "Study the existing situation and tools, define the needs, and build a simple schedule.",
        ],
        [
          "Months 2 to 4",
          "Do the main work. Meet your supervisors regularly and keep notes, screenshots and sources for your report.",
        ],
        [
          "Month 5",
          "Finish the work, test it and collect results. Start writing the report now, not at the end.",
        ],
        [
          "Last month",
          "Finalize the report, have both supervisors review it, prepare your slides and practice the defense.",
        ],
      ],
    },
  },
  {
    id: "report",
    title: "Typical report structure",
    intro:
      "Most schools expect a structure like this. Check your school's template, which may differ.",
    numbered: true,
    items: [
      "Cover page, acknowledgments and abstract (sometimes in two languages).",
      "Table of contents, list of figures and list of tables.",
      "General introduction: context, problem, objectives and plan of the report.",
      "Chapter 1: context and presentation of the host company.",
      "Chapter 2: analysis of the existing situation and of the needs.",
      "Chapter 3: design and choice of solutions.",
      "Chapter 4: implementation or realization.",
      "Chapter 5: results, tests and discussion.",
      "Conclusion and perspectives.",
      "Bibliography and appendices.",
    ],
  },
  {
    id: "writing",
    title: "Writing tips",
    items: [
      "Write as you go. A page of notes every week saves you weeks at the end.",
      "Give every figure and table a number and a caption, and refer to them in the text.",
      "Cite your sources. Schools often check for plagiarism.",
      "Ask the company before including confidential data, figures or screenshots.",
      "Follow your school's rules on AI tools. The work and the analysis must be yours.",
      "Ask both supervisors to read an early draft, not only the final version.",
      "Proofread, and keep the formatting consistent: fonts, numbering and margins.",
    ],
  },
  {
    id: "defense",
    title: "Preparing the defense (soutenance)",
    intro:
      "The format depends on your school. In general it is a presentation followed by questions from the jury, so ask for the exact duration and rules.",
    items: [
      "Structure your slides: context, problem, solution, results, demo, conclusion and next steps.",
      "Use few words per slide. Prefer diagrams, figures and screenshots.",
      "Practice out loud with a timer, and in front of someone.",
      "Prepare for typical questions: why this choice, what are the limits, what would you improve, what did you do yourself.",
      "Keep a backup of your demo (screenshots or a video) in case the technology fails.",
      "Bring a copy of your report and your slides on a USB drive, and arrive early.",
    ],
  },
  {
    id: "after",
    title: "After the PFE",
    items: [
      "Ask for a detailed internship certificate and, if possible, a recommendation letter.",
      "Add the PFE to your resume: project title, tools used and the result. Use numbers only if they are real.",
      "Stay in touch with your supervisors and colleagues on LinkedIn. Companies often recruit from their interns.",
      "Prepare for interviews: your PFE will be the main topic of conversation.",
    ],
  },
];

const fr: PfeSection[] = [
  {
    id: "what",
    title: "Ce que comprend généralement un PFE",
    items: [
      "Un projet de fin d'études, le plus souvent réalisé en entreprise ou en laboratoire à la fin de votre cursus.",
      "Vous avez un encadrant en entreprise et un encadrant académique de votre école.",
      "Il se termine par un rapport écrit et une soutenance orale devant un jury.",
      "La durée, le format du rapport et la notation dépendent de votre école. Demandez le guide officiel à votre coordinateur de PFE.",
    ],
  },
  {
    id: "topic",
    title: "Bien choisir son sujet",
    intro:
      "Un bon sujet est utile à l'entreprise, réaliste pour votre durée de stage et lié au métier que vous visez ensuite.",
    items: [
      "Une problématique claire : vous pouvez l'énoncer en une ou deux phrases.",
      "Un périmètre réaliste : il peut être terminé pendant votre stage, avec les outils et les données auxquels vous aurez accès.",
      "Un résultat que vous pouvez montrer : une application, une analyse, une étude chiffrée, un prototype.",
      "Il correspond à vos compétences et à vos objectifs, donc il valorise votre CV et vos entretiens.",
      "Votre contribution personnelle est claire. Le jury vous demandera ce que vous avez fait vous-même.",
    ],
    note: "Exemple uniquement. Trop vague : « Améliorer le système d'information de l'entreprise. » Plus clair : « Concevoir et développer une application web de suivi des commandes clients pour réduire la saisie manuelle. »",
  },
  {
    id: "plan",
    title: "Planifier vos mois",
    intro:
      "Un planning indicatif pour un stage d'environ six mois. Adaptez-le à votre propre durée.",
    table: {
      headers: ["Quand", "Quoi faire"],
      rows: [
        [
          "Avant le début",
          "Choisissez le sujet et l'entreprise, puis signez la convention de stage avec votre école et l'entreprise.",
        ],
        [
          "Semaines 1 et 2",
          "Rencontrez vos encadrants, comprenez le contexte, rédigez la problématique et convenez de ce que vous devez livrer.",
        ],
        [
          "Mois 1 et 2",
          "Étudiez l'existant et les outils, définissez les besoins et construisez un planning simple.",
        ],
        [
          "Mois 2 à 4",
          "Réalisez le travail principal. Voyez régulièrement vos encadrants et gardez des notes, captures d'écran et sources pour votre rapport.",
        ],
        [
          "Mois 5",
          "Terminez le travail, testez-le et rassemblez les résultats. Commencez à rédiger le rapport maintenant, pas à la fin.",
        ],
        [
          "Dernier mois",
          "Finalisez le rapport, faites-le relire par vos deux encadrants, préparez vos diapositives et entraînez-vous à la soutenance.",
        ],
      ],
    },
  },
  {
    id: "report",
    title: "Structure type du rapport",
    intro:
      "La plupart des écoles attendent une structure de ce type. Vérifiez le modèle de votre école, qui peut être différent.",
    numbered: true,
    items: [
      "Page de garde, remerciements et résumé (parfois en deux langues).",
      "Table des matières, liste des figures et liste des tableaux.",
      "Introduction générale : contexte, problématique, objectifs et plan du rapport.",
      "Chapitre 1 : contexte et présentation de l'entreprise d'accueil.",
      "Chapitre 2 : analyse de l'existant et des besoins.",
      "Chapitre 3 : conception et choix des solutions.",
      "Chapitre 4 : mise en œuvre ou réalisation.",
      "Chapitre 5 : résultats, tests et discussion.",
      "Conclusion et perspectives.",
      "Bibliographie et annexes.",
    ],
  },
  {
    id: "writing",
    title: "Conseils de rédaction",
    items: [
      "Rédigez au fur et à mesure. Une page de notes par semaine vous fait gagner des semaines à la fin.",
      "Donnez à chaque figure et chaque tableau un numéro et une légende, et renvoyez-y dans le texte.",
      "Citez vos sources. Les écoles vérifient souvent le plagiat.",
      "Demandez à l'entreprise avant d'inclure des données, des chiffres ou des captures d'écran confidentiels.",
      "Respectez les règles de votre école sur les outils d'IA. Le travail et l'analyse doivent être les vôtres.",
      "Faites lire un premier brouillon par vos deux encadrants, pas seulement la version finale.",
      "Relisez, et gardez une mise en forme cohérente : polices, numérotation et marges.",
    ],
  },
  {
    id: "defense",
    title: "Préparer la soutenance",
    intro:
      "Le format dépend de votre école. En général, c'est une présentation suivie de questions du jury : demandez la durée exacte et les règles.",
    items: [
      "Structurez vos diapositives : contexte, problématique, solution, résultats, démonstration, conclusion et perspectives.",
      "Peu de mots par diapositive. Préférez les schémas, les figures et les captures d'écran.",
      "Entraînez-vous à voix haute avec un chronomètre, et devant quelqu'un.",
      "Préparez les questions classiques : pourquoi ce choix, quelles sont les limites, que feriez-vous pour l'améliorer, qu'avez-vous fait vous-même.",
      "Gardez une sauvegarde de votre démonstration (captures d'écran ou vidéo) au cas où la technique échoue.",
      "Apportez une copie de votre rapport et de vos diapositives sur une clé USB, et arrivez en avance.",
    ],
  },
  {
    id: "after",
    title: "Après le PFE",
    items: [
      "Demandez une attestation de stage détaillée et, si possible, une lettre de recommandation.",
      "Ajoutez le PFE à votre CV : titre du projet, outils utilisés et résultat. N'utilisez des chiffres que s'ils sont réels.",
      "Restez en contact avec vos encadrants et collègues sur LinkedIn. Les entreprises recrutent souvent parmi leurs stagiaires.",
      "Préparez vos entretiens : votre PFE sera le principal sujet de conversation.",
    ],
  },
];

export const pfeSections: Record<Lang, PfeSection[]> = { en, fr };