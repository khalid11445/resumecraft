import { Lang } from "./labels";

export type QA = { q: string; tip: string; example: string };
export type Group = { id: string; title: string; items: QA[] };

const en: Group[] = [
  {
    id: "general",
    title: "Questions for every job",
    items: [
      {
        q: "Tell me about yourself",
        tip: "Keep it to about one minute: present, past, future. Choose only what fits the job.",
        example:
          "I'm a [title] with [X] years of experience in [field]. Most recently I [main responsibility or result]. Before that I [earlier step]. I'm applying here because [reason linked to the company] and I'd like to [goal].",
      },
      {
        q: "Why do you want to work here?",
        tip: "Show that you looked at the company: its clients, products, values or recent news. Avoid answers that are only about salary or location.",
        example:
          "I've followed [company] because of [specific reason]. What attracts me is [market, product or value]. My experience in [skill] would help me contribute to [team objective] quickly.",
      },
      {
        q: "What are your strengths?",
        tip: "Pick two strengths that matter for this job and back each with a short example.",
        example:
          "My main strength is [strength]. For example, when [situation] I [action], which led to [result]. I'm also [second strength], which helped me [result].",
      },
      {
        q: "What is your biggest weakness?",
        tip: "Name a real weakness that is not essential to the job, and say what you do about it. Avoid “perfectionism” and avoid saying you have none.",
        example:
          "I tend to [weakness]. I noticed it when [situation], so now I [concrete habit]. It is getting better: [small proof].",
      },
      {
        q: "Do you have any questions for us?",
        tip: "Always prepare two or three. Ask about the role, the team and the first months. Leave salary for later unless they raise it.",
        example:
          "What would success look like in this role after six months? How is the team organized? What are the next steps in the process?",
      },
    ],
  },
  {
    id: "banking",
    title: "Banking and finance",
    items: [
      {
        q: "Why banking, and why our bank?",
        tip: "Connect your answer to the client relationship, trust and responsibility. Mention something specific about the bank.",
        example:
          "I like banking because it combines [client relationship] and [numbers or analysis]. I chose [bank] because of [segment, network or values]. My experience in [area] prepared me for this.",
      },
      {
        q: "How do you reach a monthly sales target?",
        tip: "Describe a method, not a number you can't prove: portfolio review, prospecting plan, regular follow-up, indicators.",
        example:
          "I start by reviewing my portfolio to find clients with unmet needs. Then I plan my prospecting and calls for the week, and I track my results every [week] to correct quickly if I'm behind.",
      },
      {
        q: "How would you sell a product to a client who does not seem to need it?",
        tip: "Show needs-based selling and honesty. The recruiter wants to see ethics as well as results.",
        example:
          "I first listen to the client's situation and goals. I only offer a product if it answers a real need. If it doesn't, I note the need and follow up later, because trust matters more than one sale.",
      },
      {
        q: "How do you handle an unhappy client?",
        tip: "Listen, rephrase, act, follow up. Mention respecting bank procedures.",
        example:
          "I let the client explain, I rephrase to show I understood, and I look for a solution within our rules. I follow up afterwards to check that the problem is really solved.",
      },
      {
        q: "How would you support professional and small-business clients?",
        tip: "Talk about understanding their activity, cash flow, financing needs and the flows they could bring to the bank.",
        example:
          "I would first understand the client's activity and seasonality. Then I'd review financing and daily banking needs together, and follow the file until the loan is released and the flows are domiciled with us.",
      },
    ],
  },
  {
    id: "tech",
    title: "Tech and engineering",
    items: [
      {
        q: "Describe a project you built",
        tip: "Use context, your role, your technical choices, one problem and the result. Be clear about what you did yourself.",
        example:
          "I built [project] to [goal]. I was responsible for [part]. I chose [technology] because [reason]. The hardest part was [problem], which I solved by [solution]. The result: [outcome].",
      },
      {
        q: "How do you debug a problem you cannot reproduce?",
        tip: "Describe your method: logs, narrowing down, hypotheses, a minimal test case, asking for help.",
        example:
          "I start with the logs and the exact conditions of the failure. I narrow it down by testing one hypothesis at a time and build a minimal case. If I'm stuck, I explain the problem to a colleague.",
      },
      {
        q: "How do you keep your skills up to date?",
        tip: "Give concrete habits: a side project, documentation, courses, communities.",
        example:
          "I learn by building: my last side project was [project] using [technology]. I also read [source] and follow [community or course].",
      },
      {
        q: "Tell me about a technical disagreement with a teammate",
        tip: "Show that you argue with facts, listen, and accept a compromise.",
        example:
          "We disagreed on [choice]. I listed the pros and cons with data from [source], and we tested both on a small case. We chose [decision], and I supported it fully.",
      },
    ],
  },
  {
    id: "nurse",
    title: "Nursing and healthcare",
    items: [
      {
        q: "Why did you choose nursing?",
        tip: "Be sincere and specific. A real moment or experience is stronger than general words about helping people.",
        example:
          "I chose nursing after [experience]. I realized I like [aspect of care] and I want to be useful in [type of ward]. My training in [place] confirmed it.",
      },
      {
        q: "How do you prioritize when several patients need you at once?",
        tip: "Talk about urgency, safety, clear communication and asking for help, following the ward's protocols.",
        example:
          "I assess urgency first, then I handle the most critical need while informing the others. I ask a colleague to help when needed and I follow the ward's protocol.",
      },
      {
        q: "How do you cope with stress and emotionally hard situations?",
        tip: "Show self-awareness and healthy habits, not that you feel nothing.",
        example:
          "Hard situations affect me, so I take a moment to breathe, rely on my team and talk about the case with my supervisor if needed. Outside work I [habit] to recover.",
      },
      {
        q: "What would you do if you noticed an error or a safety risk?",
        tip: "The expected answer is to act and report quickly, with honesty and respect for procedure.",
        example:
          "I secure the patient first, then I report it to my supervisor and fill in the required report. I see errors as something to learn from and to prevent.",
      },
    ],
  },
  {
    id: "teacher",
    title: "Teaching",
    items: [
      {
        q: "How would you describe your teaching approach?",
        tip: "Give two or three principles and one classroom example.",
        example:
          "I believe students learn best when they [principle]. For example, in [subject] I [activity], and I check understanding with [method].",
      },
      {
        q: "How do you handle a disruptive student?",
        tip: "Stay calm, address the behavior privately, find the cause, involve parents or staff if needed.",
        example:
          "I stay calm and speak to the student privately to understand the cause. I set clear expectations and follow up. If it continues, I involve the school team and the parents.",
      },
      {
        q: "How do you teach a class with different levels?",
        tip: "Mention varied activities, support for those who struggle and challenges for the others.",
        example:
          "I start from a short diagnostic, then I vary exercises by level and group students so they help each other. I check progress regularly and adjust.",
      },
      {
        q: "How do you evaluate learning?",
        tip: "Talk about different types of evaluation and how you use results to improve teaching.",
        example:
          "I combine quick checks during lessons, short quizzes and larger assessments. I use the results to re-explain what was not understood.",
      },
    ],
  },
  {
    id: "student",
    title: "Students and first job",
    items: [
      {
        q: "Why should we hire you without experience?",
        tip: "Turn your projects, internships, associations and learning speed into proof.",
        example:
          "I'm new to [field], but I've shown [skill] through [project or activity]. I learn quickly, as when I [example], and I'm motivated to grow with your team.",
      },
      {
        q: "What did your studies teach you that applies here?",
        tip: "Name two or three subjects or projects directly linked to the job.",
        example:
          "In [course or project] I learned [skill], which I used to [result]. This applies directly to [task in the job].",
      },
      {
        q: "Where do you see yourself in five years?",
        tip: "Be realistic and connect your goals to the company, not only to your own career.",
        example:
          "In five years I'd like to have grown in [field], taken on more responsibility and become a reliable contributor to [team or area].",
      },
      {
        q: "Tell me about a time you worked in a team",
        tip: "Use the STAR method and be clear about your own role.",
        example:
          "[Situation]: in [context]. [Task]: I had to [objective]. [Action]: I [what you did]. [Result]: we [outcome], and I learned [lesson].",
      },
    ],
  },
];

const fr: Group[] = [
  {
    id: "general",
    title: "Questions pour tous les métiers",
    items: [
      {
        q: "Parlez-moi de vous",
        tip: "Restez à environ une minute : présent, passé, avenir. Ne gardez que ce qui correspond au poste.",
        example:
          "Je suis [intitulé] avec [X] ans d'expérience dans [domaine]. Récemment, j'ai [responsabilité ou résultat principal]. Auparavant, j'ai [étape précédente]. Je postule chez vous car [raison liée à l'entreprise] et je souhaite [objectif].",
      },
      {
        q: "Pourquoi voulez-vous travailler chez nous ?",
        tip: "Montrez que vous vous êtes renseigné : clients, produits, valeurs, actualité. Évitez les réponses basées uniquement sur le salaire ou la localisation.",
        example:
          "Je m'intéresse à [entreprise] depuis longtemps à cause de [raison précise]. Ce qui m'attire, c'est [marché, produit ou valeur]. Mon expérience en [compétence] me permettrait de contribuer rapidement à [objectif de l'équipe].",
      },
      {
        q: "Quels sont vos points forts ?",
        tip: "Choisissez deux qualités utiles pour le poste et appuyez chacune d'un court exemple.",
        example:
          "Mon principal point fort est [qualité]. Par exemple, lors de [situation], j'ai [action], ce qui a permis [résultat]. Je suis aussi [seconde qualité], ce qui m'a aidé à [résultat].",
      },
      {
        q: "Quel est votre principal défaut ?",
        tip: "Citez un vrai défaut qui n'est pas essentiel pour le poste, et dites ce que vous faites pour l'améliorer. Évitez « perfectionniste » et ne dites pas que vous n'en avez pas.",
        example:
          "J'ai tendance à [défaut]. Je l'ai remarqué lorsque [situation], donc maintenant je [habitude concrète]. Cela s'améliore : [petite preuve].",
      },
      {
        q: "Avez-vous des questions pour nous ?",
        tip: "Préparez-en toujours deux ou trois : le poste, l'équipe, les premiers mois. Gardez le salaire pour plus tard, sauf si le recruteur en parle.",
        example:
          "À quoi ressemblerait une réussite dans ce poste après six mois ? Comment l'équipe est-elle organisée ? Quelles sont les prochaines étapes du processus ?",
      },
    ],
  },
  {
    id: "banking",
    title: "Banque et finance",
    items: [
      {
        q: "Pourquoi la banque, et pourquoi notre banque ?",
        tip: "Reliez votre réponse à la relation client, à la confiance et à la responsabilité. Citez un élément précis sur la banque.",
        example:
          "J'aime le métier de banquier car il combine [relation client] et [chiffres ou analyse]. J'ai choisi [banque] pour [segment, réseau ou valeurs]. Mon expérience en [domaine] m'y a préparé.",
      },
      {
        q: "Comment atteignez-vous un objectif commercial mensuel ?",
        tip: "Décrivez une méthode, pas un chiffre que vous ne pouvez pas prouver : revue du portefeuille, plan de prospection, suivi régulier, indicateurs.",
        example:
          "Je commence par analyser mon portefeuille pour repérer les clients dont les besoins ne sont pas couverts. Ensuite, je planifie ma prospection et mes appels de la semaine et je suis mes résultats chaque [semaine] pour corriger vite si je suis en retard.",
      },
      {
        q: "Comment vendriez-vous un produit à un client qui n'en a pas besoin ?",
        tip: "Montrez une vente basée sur les besoins et l'honnêteté. Le recruteur évalue l'éthique autant que les résultats.",
        example:
          "J'écoute d'abord la situation et les objectifs du client. Je ne propose un produit que s'il répond à un vrai besoin. Sinon, je note ce besoin et je reviens plus tard, car la confiance compte plus qu'une vente.",
      },
      {
        q: "Comment gérez-vous un client mécontent ?",
        tip: "Écouter, reformuler, agir, assurer le suivi. Mentionnez le respect des procédures de la banque.",
        example:
          "Je laisse le client s'exprimer, je reformule pour montrer que j'ai compris, puis je cherche une solution dans le respect de nos règles. Je fais un suivi ensuite pour vérifier que le problème est vraiment réglé.",
      },
      {
        q: "Comment accompagneriez-vous des clients professionnels et TPE ?",
        tip: "Parlez de comprendre leur activité, leur trésorerie, leurs besoins de financement et les flux qu'ils pourraient domicilier.",
        example:
          "Je commencerais par comprendre l'activité du client et sa saisonnalité. Ensuite, nous ferions le point sur ses besoins de financement et de gestion au quotidien, et je suivrais le dossier jusqu'au déblocage du crédit et à la domiciliation des flux chez nous.",
      },
    ],
  },
  {
    id: "tech",
    title: "Informatique et ingénierie",
    items: [
      {
        q: "Décrivez un projet que vous avez réalisé",
        tip: "Donnez le contexte, votre rôle, vos choix techniques, un problème rencontré et le résultat. Précisez clairement ce que vous avez fait vous-même.",
        example:
          "J'ai réalisé [projet] pour [objectif]. J'étais responsable de [partie]. J'ai choisi [technologie] car [raison]. Le plus difficile était [problème], que j'ai résolu en [solution]. Résultat : [résultat].",
      },
      {
        q: "Comment déboguez-vous un problème que vous n'arrivez pas à reproduire ?",
        tip: "Décrivez votre méthode : journaux, isolement du problème, hypothèses, cas de test minimal, demande d'aide.",
        example:
          "Je commence par les journaux et les conditions exactes de l'échec. Je réduis le champ en testant une hypothèse à la fois et je construis un cas minimal. Si je bloque, j'explique le problème à un collègue.",
      },
      {
        q: "Comment maintenez-vous vos compétences à jour ?",
        tip: "Donnez des habitudes concrètes : projet personnel, documentation, formations, communautés.",
        example:
          "J'apprends en construisant : mon dernier projet personnel est [projet] avec [technologie]. Je lis aussi [source] et je suis [communauté ou formation].",
      },
      {
        q: "Parlez d'un désaccord technique avec un collègue",
        tip: "Montrez que vous argumentez avec des faits, que vous écoutez et que vous acceptez un compromis.",
        example:
          "Nous n'étions pas d'accord sur [choix]. J'ai listé les avantages et les inconvénients avec des données de [source], et nous avons testé les deux sur un petit cas. Nous avons choisi [décision] et je l'ai pleinement soutenue.",
      },
    ],
  },
  {
    id: "nurse",
    title: "Soins infirmiers et santé",
    items: [
      {
        q: "Pourquoi avez-vous choisi le métier d'infirmier(ère) ?",
        tip: "Soyez sincère et précis. Un moment ou une expérience réels sont plus forts que des phrases générales sur l'envie d'aider.",
        example:
          "J'ai choisi ce métier après [expérience]. J'ai compris que j'aime [aspect des soins] et je veux être utile dans [type de service]. Ma formation à [lieu] l'a confirmé.",
      },
      {
        q: "Comment priorisez-vous quand plusieurs patients ont besoin de vous en même temps ?",
        tip: "Parlez d'urgence, de sécurité, de communication claire et de demande d'aide, dans le respect des protocoles du service.",
        example:
          "J'évalue d'abord l'urgence, puis je traite le besoin le plus critique tout en prévenant les autres patients. Je demande de l'aide à un collègue si nécessaire et je suis le protocole du service.",
      },
      {
        q: "Comment gérez-vous le stress et les situations émotionnellement difficiles ?",
        tip: "Montrez de la conscience de soi et de bonnes habitudes, plutôt que de dire que vous ne ressentez rien.",
        example:
          "Les situations difficiles me touchent, donc je prends un moment pour respirer, je m'appuie sur mon équipe et j'en parle à mon responsable si besoin. En dehors du travail, je [habitude] pour récupérer.",
      },
      {
        q: "Que feriez-vous si vous constatiez une erreur ou un risque pour la sécurité ?",
        tip: "La réponse attendue est d'agir et de signaler rapidement, avec honnêteté et respect des procédures.",
        example:
          "Je sécurise d'abord le patient, puis je préviens mon responsable et je remplis le signalement requis. Je vois les erreurs comme quelque chose dont on apprend et qu'il faut prévenir.",
      },
    ],
  },
  {
    id: "teacher",
    title: "Enseignement",
    items: [
      {
        q: "Comment décririez-vous votre approche pédagogique ?",
        tip: "Donnez deux ou trois principes et un exemple en classe.",
        example:
          "Je crois que les élèves apprennent mieux lorsqu'ils [principe]. Par exemple, en [matière], je [activité], et je vérifie la compréhension avec [méthode].",
      },
      {
        q: "Comment gérez-vous un élève perturbateur ?",
        tip: "Restez calme, parlez en privé, cherchez la cause, impliquez les parents ou l'équipe si nécessaire.",
        example:
          "Je reste calme et je parle à l'élève en privé pour comprendre la cause. Je fixe des attentes claires et j'assure un suivi. Si cela continue, j'implique l'équipe de l'établissement et les parents.",
      },
      {
        q: "Comment enseignez-vous à une classe de niveaux différents ?",
        tip: "Parlez d'activités variées, d'un soutien pour ceux qui ont des difficultés et de défis pour les autres.",
        example:
          "Je commence par un court diagnostic, puis je varie les exercices selon le niveau et je forme des groupes où les élèves s'entraident. Je vérifie les progrès régulièrement et j'ajuste.",
      },
      {
        q: "Comment évaluez-vous les apprentissages ?",
        tip: "Parlez de différents types d'évaluation et de la façon dont vous utilisez les résultats pour améliorer votre enseignement.",
        example:
          "Je combine des vérifications rapides pendant les cours, de courts quiz et des évaluations plus importantes. J'utilise les résultats pour réexpliquer ce qui n'a pas été compris.",
      },
    ],
  },
  {
    id: "student",
    title: "Étudiants et premier emploi",
    items: [
      {
        q: "Pourquoi vous recruter sans expérience ?",
        tip: "Transformez vos projets, stages, activités associatives et votre rapidité d'apprentissage en preuves.",
        example:
          "Je débute dans [domaine], mais j'ai montré [compétence] à travers [projet ou activité]. J'apprends vite, comme lorsque [exemple], et je suis motivé pour progresser avec votre équipe.",
      },
      {
        q: "Qu'ont appris vos études qui s'applique ici ?",
        tip: "Citez deux ou trois matières ou projets directement liés au poste.",
        example:
          "Dans [cours ou projet], j'ai appris [compétence], que j'ai utilisée pour [résultat]. Cela s'applique directement à [tâche du poste].",
      },
      {
        q: "Où vous voyez-vous dans cinq ans ?",
        tip: "Soyez réaliste et reliez vos objectifs à l'entreprise, pas seulement à votre carrière.",
        example:
          "Dans cinq ans, je souhaite avoir progressé en [domaine], pris plus de responsabilités et être devenu un collaborateur fiable de [équipe ou secteur].",
      },
      {
        q: "Parlez-moi d'une fois où vous avez travaillé en équipe",
        tip: "Utilisez la méthode STAR et précisez bien votre propre rôle.",
        example:
          "[Situation] : dans [contexte]. [Tâche] : je devais [objectif]. [Action] : j'ai [ce que vous avez fait]. [Résultat] : nous avons [résultat] et j'ai appris [leçon].",
      },
    ],
  },
];

export const interview: Record<Lang, Group[]> = { en, fr };