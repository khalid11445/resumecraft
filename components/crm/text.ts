import { Lang } from "@/lib/labels";

export type Stage =
  | "sourced"
  | "contacted"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export const STAGES: Stage[] = [
  "sourced",
  "contacted",
  "interview",
  "offer",
  "hired",
  "rejected",
];

export type JobStatus = "open" | "on_hold" | "closed";
export const JOB_STATUSES: JobStatus[] = ["open", "on_hold", "closed"];

const en = {
  brand: "Recruiting CRM",
  navJobs: "Jobs",
  navCandidates: "Candidates",
  signOut: "Sign out",
  loading: "Loading...",
  configError:
    "The service is not configured yet. Add the Supabase variables and redeploy.",
  loadError: "We could not load your data. Please refresh the page.",
  saveError: "Could not save. Please try again.",

  orgTitle: "Create your workspace",
  orgText:
    "A workspace holds your jobs, candidates and pipelines. You can invite teammates later.",
  orgName: "Agency or team name",
  orgCreate: "Create workspace",
  orgError: "Could not create the workspace. Use a name of at least 2 characters.",

  loginTitle: "Log in",
  signupTitle: "Create your account",
  email: "Email",
  password: "Password",
  passwordHint: "At least 8 characters",
  loginBtn: "Log in",
  signupBtn: "Create account",
  working: "Please wait...",
  noAccount: "No account yet?",
  haveAccount: "Already have an account?",
  checkEmail: "Check your email: we sent you a link to confirm your account.",
  badLogin: "Wrong email or password.",
  notConfirmed: "Please confirm your email first. Look for the link in your inbox.",
  weak: "Use a password of at least 8 characters.",
  badEmail: "Enter a valid email address.",
  authError: "Something went wrong. Please try again.",
  confirmError:
    "That confirmation link is invalid or expired. Try logging in, or sign up again.",
  legalNote: "By creating an account you agree to the Terms and the Privacy policy.",
  terms: "Terms",
  privacy: "Privacy policy",

  jobsTitle: "Jobs",
  jobsIntro: "The positions you are filling. Open one to manage its pipeline.",
  addJob: "Add a job",
  jobTitle: "Job title",
  client: "Client (optional)",
  location: "Location (optional)",
  statusLabel: "Status",
  jobStatuses: {
    open: "Open",
    on_hold: "On hold",
    closed: "Closed",
  } as Record<JobStatus, string>,
  save: "Save",
  cancel: "Cancel",
  jobsEmpty: "No jobs yet. Add your first one.",
  openPipeline: "Open pipeline",
  del: "Delete",
  deleteJobConfirm: "Delete this job and its pipeline? The candidates are kept.",
  needTitle: "Enter a job title (at least 2 characters).",

  back: "← Jobs",
  jobNotFound: "This job was not found.",
  stages: {
    sourced: "Sourced",
    contacted: "Contacted",
    interview: "Interview",
    offer: "Offer",
    hired: "Hired",
    rejected: "Rejected",
  } as Record<Stage, string>,
  addCandidate: "Add a candidate",
  pickExisting: "Choose an existing candidate",
  orNew: "Or create a new one",
  fullName: "Full name",
  phone: "Phone",
  city: "City",
  headline: "Headline (for example: Nurse, 5 years)",
  source: "Source (optional)",
  consent:
    "I have a lawful basis to keep this person's data (for example, their consent).",
  consentNeeded: "Please confirm you have a lawful basis to keep this person's data.",
  addToPipeline: "Add to pipeline",
  emptyColumn: "Nothing here",
  move: "Move to",
  remove: "Remove",
  removeConfirm: "Remove this candidate from the job?",
  already: "This candidate is already on this job.",
  needName: "Enter the full name (at least 2 characters).",
  badEmailField: "This email does not look valid.",
  dragHint: "Drag cards between columns, or use the menu on each card.",

  candTitle: "Candidates",
  candIntro: "Everyone in your database, across all jobs.",
  search: "Search by name, city or headline",
  addCand: "Add a candidate",
  candEmpty: "No candidates yet.",
  deleteCandConfirm: "Delete this candidate? This cannot be undone.",
  consentYes: "Consent recorded",
  consentNo: "No consent recorded",
  candCount: (n: number) => `${n} candidate${n === 1 ? "" : "s"}`,
};

export type Tx = typeof en;

const fr: Tx = {
  brand: "CRM de recrutement",
  navJobs: "Offres",
  navCandidates: "Candidats",
  signOut: "Se déconnecter",
  loading: "Chargement...",
  configError:
    "Le service n'est pas encore configuré. Ajoutez les variables Supabase et redéployez.",
  loadError: "Impossible de charger vos données. Rechargez la page.",
  saveError: "Enregistrement impossible. Réessayez.",

  orgTitle: "Créez votre espace de travail",
  orgText:
    "Un espace de travail contient vos offres, vos candidats et vos pipelines. Vous pourrez inviter des collègues plus tard.",
  orgName: "Nom du cabinet ou de l'équipe",
  orgCreate: "Créer l'espace",
  orgError:
    "Impossible de créer l'espace. Utilisez un nom d'au moins 2 caractères.",

  loginTitle: "Connexion",
  signupTitle: "Créez votre compte",
  email: "Email",
  password: "Mot de passe",
  passwordHint: "Au moins 8 caractères",
  loginBtn: "Se connecter",
  signupBtn: "Créer le compte",
  working: "Patientez...",
  noAccount: "Pas encore de compte ?",
  haveAccount: "Vous avez déjà un compte ?",
  checkEmail:
    "Consultez votre email : nous vous avons envoyé un lien pour confirmer votre compte.",
  badLogin: "Email ou mot de passe incorrect.",
  notConfirmed:
    "Confirmez d'abord votre email. Cherchez le lien dans votre boîte de réception.",
  weak: "Utilisez un mot de passe d'au moins 8 caractères.",
  badEmail: "Saisissez une adresse email valide.",
  authError: "Une erreur est survenue. Réessayez.",
  confirmError:
    "Ce lien de confirmation est invalide ou a expiré. Essayez de vous connecter, ou créez à nouveau le compte.",
  legalNote:
    "En créant un compte, vous acceptez les Conditions et la Politique de confidentialité.",
  terms: "Conditions",
  privacy: "Politique de confidentialité",

  jobsTitle: "Offres",
  jobsIntro:
    "Les postes que vous pourvoyez. Ouvrez-en un pour gérer son pipeline.",
  addJob: "Ajouter une offre",
  jobTitle: "Intitulé du poste",
  client: "Client (facultatif)",
  location: "Lieu (facultatif)",
  statusLabel: "Statut",
  jobStatuses: {
    open: "Ouverte",
    on_hold: "En pause",
    closed: "Clôturée",
  },
  save: "Enregistrer",
  cancel: "Annuler",
  jobsEmpty: "Aucune offre pour le moment. Ajoutez la première.",
  openPipeline: "Ouvrir le pipeline",
  del: "Supprimer",
  deleteJobConfirm:
    "Supprimer cette offre et son pipeline ? Les candidats sont conservés.",
  needTitle: "Saisissez un intitulé de poste (2 caractères minimum).",

  back: "← Offres",
  jobNotFound: "Cette offre est introuvable.",
  stages: {
    sourced: "Sourcé",
    contacted: "Contacté",
    interview: "Entretien",
    offer: "Offre",
    hired: "Embauché",
    rejected: "Refusé",
  },
  addCandidate: "Ajouter un candidat",
  pickExisting: "Choisir un candidat existant",
  orNew: "Ou en créer un nouveau",
  fullName: "Nom complet",
  phone: "Téléphone",
  city: "Ville",
  headline: "Titre (par exemple : Infirmier, 5 ans)",
  source: "Source (facultatif)",
  consent:
    "J'ai une base légale pour conserver les données de cette personne (par exemple, son consentement).",
  consentNeeded:
    "Confirmez que vous avez une base légale pour conserver les données de cette personne.",
  addToPipeline: "Ajouter au pipeline",
  emptyColumn: "Rien ici",
  move: "Déplacer vers",
  remove: "Retirer",
  removeConfirm: "Retirer ce candidat de l'offre ?",
  already: "Ce candidat est déjà sur cette offre.",
  needName: "Saisissez le nom complet (2 caractères minimum).",
  badEmailField: "Cet email ne semble pas valide.",
  dragHint:
    "Faites glisser les cartes entre les colonnes, ou utilisez le menu de chaque carte.",

  candTitle: "Candidats",
  candIntro: "Toutes les personnes de votre base, toutes offres confondues.",
  search: "Rechercher par nom, ville ou titre",
  addCand: "Ajouter un candidat",
  candEmpty: "Aucun candidat pour le moment.",
  deleteCandConfirm: "Supprimer ce candidat ? Cette action est irréversible.",
  consentYes: "Consentement enregistré",
  consentNo: "Pas de consentement enregistré",
  candCount: (n: number) => `${n} candidat${n > 1 ? "s" : ""}`,
};

export const CT: Record<Lang, Tx> = { en, fr };