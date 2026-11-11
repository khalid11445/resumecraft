import { Lang } from "@/lib/labels";

const en = {
  title: "Export your data",
  intro: "Download a copy of your workspace data whenever you need it.",
  back: "← Candidates",
  warning:
    "These files contain personal data. Keep them somewhere safe, do not share them, and delete them when you no longer need them.",

  csvTitle: "Candidates (CSV)",
  csvText:
    "One row per candidate, with their jobs and stages, consent status and date added. It opens in Excel or Google Sheets, and you can import it again later.",
  sepLabel: "Column separator",
  sepSemicolon: "Semicolon (Excel with French or Arabic regional settings)",
  sepComma: "Comma (Excel with English settings, Google Sheets)",
  sepHint:
    "If all the data appears in a single column, download again with the other separator.",
  csvBtn: "Download candidates",
  csvFile: "candidates",
  csvHeader: [
    "Full name",
    "Email",
    "Phone",
    "City",
    "Headline",
    "Source",
    "Jobs",
    "Consent recorded",
    "Consent note",
    "Added on",
  ],
  yes: "Yes",
  no: "No",
  formulaNote:
    "Text that starts with = + - or @ gets a leading apostrophe, so a spreadsheet cannot run it as a formula.",

  backupTitle: "Full backup (JSON)",
  backupText:
    "Jobs, candidates, pipeline, notes, tasks and members in one file, for safekeeping. It cannot be restored into a workspace yet.",
  backupBtn: "Download full backup",
  backupFile: "workspace-backup",
  adminOnly: "Only the owner and admins can download a full backup.",

  working: "Preparing the file...",
  doneCsv: (n: number) => `Done: ${n} candidate${n === 1 ? "" : "s"} exported.`,
  doneBackup: "Done: the backup was downloaded.",
  truncated:
    "The workspace is very large, so only the first 20,000 rows of each list were exported.",
  failed: "The export did not work. Please try again.",
};

export type ETx = typeof en;

const fr: ETx = {
  title: "Exporter vos données",
  intro:
    "Téléchargez une copie des données de votre espace chaque fois que vous en avez besoin.",
  back: "← Candidats",
  warning:
    "Ces fichiers contiennent des données personnelles. Gardez-les en lieu sûr, ne les partagez pas et supprimez-les quand vous n'en avez plus besoin.",

  csvTitle: "Candidats (CSV)",
  csvText:
    "Une ligne par candidat, avec ses offres et ses étapes, son statut de consentement et sa date d'ajout. Le fichier s'ouvre dans Excel ou Google Sheets, et vous pourrez le réimporter plus tard.",
  sepLabel: "Séparateur de colonnes",
  sepSemicolon: "Point-virgule (Excel avec les réglages régionaux français ou arabes)",
  sepComma: "Virgule (Excel avec les réglages anglais, Google Sheets)",
  sepHint:
    "Si toutes les données apparaissent dans une seule colonne, téléchargez à nouveau avec l'autre séparateur.",
  csvBtn: "Télécharger les candidats",
  csvFile: "candidats",
  csvHeader: [
    "Nom complet",
    "Email",
    "Téléphone",
    "Ville",
    "Titre",
    "Source",
    "Offres",
    "Consentement enregistré",
    "Note de consentement",
    "Ajouté le",
  ],
  yes: "Oui",
  no: "Non",
  formulaNote:
    "Un texte qui commence par = + - ou @ reçoit une apostrophe au début, pour qu'un tableur ne puisse pas l'exécuter comme une formule.",

  backupTitle: "Sauvegarde complète (JSON)",
  backupText:
    "Offres, candidats, pipeline, notes, tâches et membres dans un seul fichier, pour conservation. Elle ne peut pas encore être restaurée dans un espace.",
  backupBtn: "Télécharger la sauvegarde complète",
  backupFile: "sauvegarde-espace",
  adminOnly:
    "Seuls le propriétaire et les admins peuvent télécharger une sauvegarde complète.",

  working: "Préparation du fichier...",
  doneCsv: (n: number) =>
    `Terminé : ${n} candidat${n > 1 ? "s" : ""} exporté${n > 1 ? "s" : ""}.`,
  doneBackup: "Terminé : la sauvegarde a été téléchargée.",
  truncated:
    "L'espace est très volumineux : seules les 20 000 premières lignes de chaque liste ont été exportées.",
  failed: "L'export n'a pas fonctionné. Réessayez.",
};

export const ET: Record<Lang, ETx> = { en, fr };