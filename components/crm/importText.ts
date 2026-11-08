import { Lang } from "@/lib/labels";
import type { FieldKey, RowStatus } from "@/lib/csvimport";

const en = {
  title: "Import candidates from a spreadsheet",
  intro:
    "Move your existing list into your workspace. Save your spreadsheet as a CSV file, choose it below, check the preview, then confirm.",
  back: "← Candidates",
  chooseFile: "Choose a CSV file",
  fileHint:
    "CSV only, up to 2 MB and 1,000 rows. In Excel: File → Save as → CSV. The first row must contain the column names.",
  template: "Download an empty template",
  tooBig: "This file is larger than 2 MB.",
  tooMany: (n: number) =>
    `This file has more than ${n.toLocaleString("en-US")} rows. Split it into smaller files.`,
  badFile: "This file could not be read. Save it as a CSV file and try again.",
  noRows: "The file needs a row of column names and at least one row of data.",
  readFile: (name: string, n: number) => `${name}: ${n} rows found`,
  checking: "Checking your existing candidates...",
  capNote:
    "You have more than 5,000 candidates. The duplicate check covers the 5,000 most recent ones.",

  mapTitle: "1. Match the columns",
  mapHelp:
    "We matched what we could. Check each line. Columns you leave unmatched are not imported, so sensitive information in your spreadsheet stays out.",
  fields: {
    fullName: "Full name",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    city: "City",
    headline: "Headline or job title",
    source: "Source",
  } as Record<FieldKey, string>,
  none: "— Do not import —",
  column: (n: number) => `Column ${n}`,
  nameNeeded: "Match at least the full name, or the first and last name.",

  previewTitle: "2. Check the preview",
  summaryNew: (n: number) => `${n} will be added`,
  summaryDupFile: (n: number) => `${n} duplicate${n === 1 ? "" : "s"} inside the file`,
  summaryDupExisting: (n: number) =>
    `${n} already in your database`,
  summaryInvalid: (n: number) => `${n} without a usable name`,
  emailsDropped: (n: number) =>
    `${n} email${n === 1 ? "" : "s"} did not look valid and will be left empty.`,
  skippedNote: "Duplicates and rows without a name are skipped, never overwritten.",
  th: { line: "Line", name: "Name", email: "Email", phone: "Phone", status: "Result" },
  statuses: {
    ok: "New",
    invalid: "No name",
    dupFile: "Duplicate in file",
    dupExisting: "Already in database",
  } as Record<RowStatus, string>,
  showing: (n: number, total: number) => `Showing ${n} of ${total} rows.`,

  consentTitle: "3. Confirm and import",
  consent:
    "I confirm that I have a lawful basis to keep these people's data (for example, their consent) and that I may contact them for recruiting. Each imported person will be marked as having a recorded basis.",
  noteText: "CSV import on",
  importBtn: (n: number) => `Import ${n} candidate${n === 1 ? "" : "s"}`,
  importing: (a: number, b: number) => `Importing... ${a} of ${b}`,
  nothingToImport: "There is nothing new to import in this file.",

  doneTitle: "Import finished",
  doneText: (n: number, skipped: number) =>
    `${n} candidate${n === 1 ? "" : "s"} added. ${skipped} row${skipped === 1 ? "" : "s"} skipped.`,
  partial: (n: number) =>
    `The import stopped after ${n} candidates because of an error. Those ${n} are saved. Importing the same file again skips them as duplicates.`,
  viewCandidates: "See the candidates",
  importAnother: "Import another file",
  reset: "Choose another file",
  tip: "Tip: after importing, open a few profiles to check the data came in the right columns.",
};

export type ITx = typeof en;

const fr: ITx = {
  title: "Importer des candidats depuis un tableur",
  intro:
    "Reprenez votre liste existante dans votre espace. Enregistrez votre tableur au format CSV, choisissez le fichier ci-dessous, vérifiez l'aperçu, puis confirmez.",
  back: "← Candidats",
  chooseFile: "Choisir un fichier CSV",
  fileHint:
    "CSV uniquement, jusqu'à 2 Mo et 1 000 lignes. Dans Excel : Fichier → Enregistrer sous → CSV. La première ligne doit contenir les noms des colonnes.",
  template: "Télécharger un modèle vide",
  tooBig: "Ce fichier dépasse 2 Mo.",
  tooMany: (n: number) =>
    `Ce fichier contient plus de ${n.toLocaleString("fr-FR")} lignes. Découpez-le en fichiers plus petits.`,
  badFile:
    "Ce fichier n'a pas pu être lu. Enregistrez-le au format CSV et réessayez.",
  noRows:
    "Le fichier doit contenir une ligne de noms de colonnes et au moins une ligne de données.",
  readFile: (name: string, n: number) => `${name} : ${n} lignes trouvées`,
  checking: "Vérification de vos candidats existants...",
  capNote:
    "Vous avez plus de 5 000 candidats. La détection des doublons porte sur les 5 000 plus récents.",

  mapTitle: "1. Associez les colonnes",
  mapHelp:
    "Nous avons associé ce que nous avons pu. Vérifiez chaque ligne. Les colonnes que vous laissez sans correspondance ne sont pas importées : les informations sensibles de votre tableur restent donc de côté.",
  fields: {
    fullName: "Nom complet",
    firstName: "Prénom",
    lastName: "Nom de famille",
    email: "Email",
    phone: "Téléphone",
    city: "Ville",
    headline: "Titre ou poste",
    source: "Source",
  },
  none: "— Ne pas importer —",
  column: (n: number) => `Colonne ${n}`,
  nameNeeded: "Associez au moins le nom complet, ou le prénom et le nom.",

  previewTitle: "2. Vérifiez l'aperçu",
  summaryNew: (n: number) => `${n} seront ajouté${n > 1 ? "s" : ""}`,
  summaryDupFile: (n: number) =>
    `${n} doublon${n > 1 ? "s" : ""} dans le fichier`,
  summaryDupExisting: (n: number) => `${n} déjà dans votre base`,
  summaryInvalid: (n: number) => `${n} sans nom utilisable`,
  emailsDropped: (n: number) =>
    `${n} email${n > 1 ? "s" : ""} ne semblai${n > 1 ? "ent" : "t"} pas valide${n > 1 ? "s" : ""} et ser${n > 1 ? "ont" : "a"} laissé${n > 1 ? "s" : ""} vide${n > 1 ? "s" : ""}.`,
  skippedNote:
    "Les doublons et les lignes sans nom sont ignorés, jamais écrasés.",
  th: { line: "Ligne", name: "Nom", email: "Email", phone: "Téléphone", status: "Résultat" },
  statuses: {
    ok: "Nouveau",
    invalid: "Sans nom",
    dupFile: "Doublon dans le fichier",
    dupExisting: "Déjà dans la base",
  },
  showing: (n: number, total: number) => `${n} lignes affichées sur ${total}.`,

  consentTitle: "3. Confirmez et importez",
  consent:
    "Je confirme avoir une base légale pour conserver les données de ces personnes (par exemple, leur consentement) et pouvoir les contacter pour du recrutement. Chaque personne importée sera marquée comme ayant une base enregistrée.",
  noteText: "Import CSV du",
  importBtn: (n: number) => `Importer ${n} candidat${n > 1 ? "s" : ""}`,
  importing: (a: number, b: number) => `Import en cours... ${a} sur ${b}`,
  nothingToImport: "Il n'y a rien de nouveau à importer dans ce fichier.",

  doneTitle: "Import terminé",
  doneText: (n: number, skipped: number) =>
    `${n} candidat${n > 1 ? "s" : ""} ajouté${n > 1 ? "s" : ""}. ${skipped} ligne${skipped > 1 ? "s" : ""} ignorée${skipped > 1 ? "s" : ""}.`,
  partial: (n: number) =>
    `L'import s'est arrêté après ${n} candidats à cause d'une erreur. Ces ${n} sont enregistrés. Réimporter le même fichier les ignorera comme doublons.`,
  viewCandidates: "Voir les candidats",
  importAnother: "Importer un autre fichier",
  reset: "Choisir un autre fichier",
  tip: "Astuce : après l'import, ouvrez quelques fiches pour vérifier que les données sont dans les bonnes colonnes.",
};

export const IT: Record<Lang, ITx> = { en, fr };