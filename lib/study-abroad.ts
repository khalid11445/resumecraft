import { Lang } from "./labels";

export type OfficialLink = { label: string; url: string };
// href has no language prefix: the page adds /fr when needed
export type ToolLink = { label: string; href: string };

export type Country = {
  id: string;
  name: string;
  summary: string;
  steps: string[];
  documents: string[];
  timeline: string;
  extra?: string;
  links: OfficialLink[];
  tools: ToolLink[];
};

// Last reviewed: October 2026. Rules and dates change every year, so
// check the official links before you rely on anything written here.
const en: Country[] = [
  {
    id: "france",
    name: "Studying in France",
    summary:
      "Students who live in Morocco and are not citizens of the European Union usually apply through Campus France Morocco and its “Études en France” platform. The procedure does not guarantee an admission or a visa.",
    steps: [
      "Check that you are concerned. The procedure is for non-EU students living in Morocco. Some programs and schools have their own procedure or ask for a double application (for example Polytech).",
      "Create your account on the “Études en France” platform and build your study project by choosing the programs you want.",
      "Complete your online file with your documents, submit it, and pay the application fee. Both the submission and the payment must be done before the deadline.",
      "Campus France checks your file and invites you to an interview.",
      "The institutions reply on the platform. When you receive an offer, confirm your final choice there.",
      "Complete the pre-consular procedure, then apply for your student visa.",
    ],
    documents: [
      "A CV and a motivation or application letter. Campus France files usually include both.",
      "Copies of your diplomas and transcripts.",
      "A language certificate if your program asks for one.",
      "Anything else listed in the official Campus France guide for your level of study.",
    ],
    timeline:
      "The application campaign usually opens in early autumn and closes within a few weeks. Interviews follow, and institutions reply in the spring. The exact dates change every year, so check the official calendar as soon as possible.",
    extra:
      "Internships are not part of the Campus France procedure, so a PFE or an internship abroad follows a different path.",
    links: [
      {
        label: "Campus France Morocco: application procedure",
        url: "https://www.maroc.campusfrance.org/la-procedure-de-candidature-sur-etudes-en-france-de-campus-france",
      },
      {
        label: "Campus France Morocco: home page",
        url: "https://www.maroc.campusfrance.org",
      },
    ],
    tools: [
      { label: "Build my academic CV", href: "/builder/student?format=morocco" },
      { label: "Write my motivation letter", href: "/letter" },
    ],
  },
  {
    id: "canada",
    name: "Studying in Canada",
    summary:
      "Most students need an acceptance letter from a designated learning institution, and then a study permit from the Government of Canada. Studying in Quebec also requires a Quebec Acceptance Certificate (CAQ). Approval is never guaranteed.",
    steps: [
      "Choose a designated learning institution and apply for admission. Only these schools can host international students on a study permit.",
      "Get your letter of acceptance (the official offer of admission).",
      "Check whether you need a provincial or territorial attestation letter (PAL or TAL). Most students do. Master's and PhD students are exempt for applications made from January 1, 2026, but check that your case qualifies.",
      "If you will study in Quebec for more than six months, apply for the Quebec Acceptance Certificate (CAQ) with the Quebec government.",
      "Prepare your proof of funds, your identity documents and a letter of explanation with your study plan. Check the required amounts on the official website, because they change.",
      "Apply online for your study permit through an IRCC account, then give your biometrics and, if asked, a medical exam.",
    ],
    documents: [
      "The letter of acceptance from your institution.",
      "The attestation letter (PAL or TAL), or the CAQ for Quebec, unless you are exempt.",
      "Your passport and other identity documents.",
      "Proof of funds.",
      "A letter of explanation with your study plan.",
      "Documents asked by the university: transcripts, an academic CV or a statement of purpose, depending on the program.",
    ],
    timeline:
      "Apply for admission well before your start date. Apply for the study permit as soon as you have your acceptance letter and the other documents, because processing takes time.",
    extra:
      "In recent years Canada has limited the number of study permit applications, which is why attestation letters exist. Rules change often, so rely on the official pages below.",
    links: [
      {
        label: "EduCanada: how to apply for a study permit in 2026",
        url: "https://www.educanada.ca/blog-blogue/2026/study-permit-2026-demande-permis-etudes.aspx?lang=eng",
      },
      {
        label: "Government of Canada: study in Canada",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
      },
      {
        label: "Quebec government: study in Quebec",
        url: "https://www.quebec.ca/en/education/study-quebec",
      },
      {
        label: "Immigration Quebec",
        url: "https://www.immigration-quebec.gouv.qc.ca/en/home.html",
      },
    ],
    tools: [
      { label: "Build my academic CV (Canada format)", href: "/builder/student?format=canada" },
      { label: "Write my motivation letter", href: "/letter" },
    ],
  },
];

const fr: Country[] = [
  {
    id: "france",
    name: "Étudier en France",
    summary:
      "Les étudiants qui résident au Maroc et ne sont pas citoyens de l'Union européenne candidatent en général via Campus France Maroc et sa plateforme « Études en France ». La procédure ne garantit ni une admission ni un visa.",
    steps: [
      "Vérifiez que vous êtes concerné. La procédure s'adresse aux étudiants non européens résidant au Maroc. Certaines formations et écoles ont leur propre procédure ou demandent une double candidature (par exemple Polytech).",
      "Créez votre compte sur la plateforme « Études en France » et construisez votre projet d'études en choisissant les formations qui vous intéressent.",
      "Complétez votre dossier en ligne avec vos documents, soumettez-le et payez les frais de dossier. La soumission et le paiement doivent tous deux être effectués avant la date limite.",
      "Campus France vérifie votre dossier et vous convoque à un entretien.",
      "Les établissements répondent sur la plateforme. Quand vous recevez une proposition, confirmez votre choix définitif sur la plateforme.",
      "Effectuez la procédure pré-consulaire, puis faites votre demande de visa étudiant.",
    ],
    documents: [
      "Un CV et une lettre de motivation ou de candidature. Les dossiers Campus France comprennent en général les deux.",
      "Des copies de vos diplômes et de vos relevés de notes.",
      "Un certificat de langue si votre formation en demande un.",
      "Tout autre document indiqué dans le guide officiel de Campus France pour votre niveau d'études.",
    ],
    timeline:
      "La campagne de candidature ouvre en général au début de l'automne et ferme au bout de quelques semaines. Les entretiens suivent, et les établissements répondent au printemps. Les dates exactes changent chaque année : consultez le calendrier officiel dès que possible.",
    extra:
      "Les stages ne relèvent pas de la procédure Campus France : un PFE ou un stage à l'étranger suit donc un autre parcours.",
    links: [
      {
        label: "Campus France Maroc : procédure de candidature",
        url: "https://www.maroc.campusfrance.org/la-procedure-de-candidature-sur-etudes-en-france-de-campus-france",
      },
      {
        label: "Campus France Maroc : page d'accueil",
        url: "https://www.maroc.campusfrance.org",
      },
    ],
    tools: [
      { label: "Créer mon CV académique", href: "/builder/student?format=morocco" },
      { label: "Rédiger ma lettre de motivation", href: "/letter" },
    ],
  },
  {
    id: "canada",
    name: "Étudier au Canada",
    summary:
      "La plupart des étudiants ont besoin d'une lettre d'acceptation d'un établissement d'enseignement désigné, puis d'un permis d'études du gouvernement du Canada. Étudier au Québec demande aussi un Certificat d'acceptation du Québec (CAQ). L'approbation n'est jamais garantie.",
    steps: [
      "Choisissez un établissement d'enseignement désigné et déposez votre demande d'admission. Seuls ces établissements peuvent accueillir des étudiants internationaux avec un permis d'études.",
      "Obtenez votre lettre d'acceptation (l'offre d'admission officielle).",
      "Vérifiez si vous avez besoin d'une lettre d'attestation provinciale ou territoriale (LAP ou LAT). La plupart des étudiants en ont besoin. Les étudiants de master et de doctorat en sont dispensés pour les demandes faites à partir du 1er janvier 2026, mais vérifiez que votre cas est concerné.",
      "Si vous étudiez au Québec pendant plus de six mois, demandez le Certificat d'acceptation du Québec (CAQ) auprès du gouvernement du Québec.",
      "Préparez vos preuves de fonds, vos pièces d'identité et une lettre d'explication avec votre plan d'études. Vérifiez les montants exigés sur le site officiel, car ils changent.",
      "Faites votre demande de permis d'études en ligne avec un compte IRCC, puis fournissez vos données biométriques et, si on vous le demande, un examen médical.",
    ],
    documents: [
      "La lettre d'acceptation de votre établissement.",
      "La lettre d'attestation (LAP ou LAT), ou le CAQ pour le Québec, sauf si vous en êtes dispensé.",
      "Votre passeport et vos autres pièces d'identité.",
      "Les preuves de fonds.",
      "Une lettre d'explication avec votre plan d'études.",
      "Les documents demandés par l'université : relevés de notes, CV académique ou lettre d'intention, selon le programme.",
    ],
    timeline:
      "Déposez votre demande d'admission bien avant la date de rentrée. Faites votre demande de permis d'études dès que vous avez votre lettre d'acceptation et les autres documents, car le traitement prend du temps.",
    extra:
      "Ces dernières années, le Canada a limité le nombre de demandes de permis d'études, ce qui explique l'existence des lettres d'attestation. Les règles changent souvent : fiez-vous aux pages officielles ci-dessous.",
    links: [
      {
        label: "EduCanada : comment demander un permis d'études en 2026",
        url: "https://www.educanada.ca/blog-blogue/2026/study-permit-2026-demande-permis-etudes.aspx?lang=eng",
      },
      {
        label: "Gouvernement du Canada : étudier au Canada",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
      },
      {
        label: "Gouvernement du Québec : étudier au Québec",
        url: "https://www.quebec.ca/en/education/study-quebec",
      },
      {
        label: "Immigration Québec",
        url: "https://www.immigration-quebec.gouv.qc.ca/en/home.html",
      },
    ],
    tools: [
      { label: "Créer mon CV académique (format Canada)", href: "/builder/student?format=canada" },
      { label: "Rédiger ma lettre de motivation", href: "/letter" },
    ],
  },
];

export const countries: Record<Lang, Country[]> = { en, fr };