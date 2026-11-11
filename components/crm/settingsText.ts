import { Lang } from "@/lib/labels";

const en = {
  title: "Settings",
  intro: "Your workspace name, your data, and what you can delete.",

  nameTitle: "Workspace name",
  nameLabel: "Name",
  save: "Save",
  renamed: "Saved.",
  nameShort: "Use a name of at least 2 characters.",
  readOnly: "Only the owner and admins can rename the workspace.",

  dataTitle: "Your data",
  dataText: "Download a copy of your data, or bring in new candidates.",
  exportLink: "Export your data",
  importLink: "Import candidates",

  dangerTitle: "Delete this workspace",
  dangerText:
    "This permanently deletes the workspace and everything in it: jobs, candidates, notes, tasks and invitations. It cannot be undone. Download a backup first.",
  typeToConfirm: (n: string) => `Type the workspace name (${n}) to confirm.`,
  deleteBtn: "Delete workspace permanently",
  deleting: "Deleting...",
  ownerOnly:
    "Only the owner can delete the workspace. To leave it instead, use the Team tab.",

  accountTitle: "Your account",
  accountText:
    "To delete your whole account, write to the contact address on our Privacy policy page. Delete or leave your workspaces first.",
  privacyLink: "Privacy policy",

  failed: "That did not work or is not allowed. Please try again.",
};

export type SeTx = typeof en;

const fr: SeTx = {
  title: "Réglages",
  intro: "Le nom de votre espace, vos données et ce que vous pouvez supprimer.",

  nameTitle: "Nom de l'espace",
  nameLabel: "Nom",
  save: "Enregistrer",
  renamed: "Enregistré.",
  nameShort: "Utilisez un nom d'au moins 2 caractères.",
  readOnly: "Seuls le propriétaire et les admins peuvent renommer l'espace.",

  dataTitle: "Vos données",
  dataText:
    "Téléchargez une copie de vos données, ou importez de nouveaux candidats.",
  exportLink: "Exporter vos données",
  importLink: "Importer des candidats",

  dangerTitle: "Supprimer cet espace",
  dangerText:
    "Cela supprime définitivement l'espace et tout ce qu'il contient : offres, candidats, notes, tâches et invitations. Cette action est irréversible. Téléchargez d'abord une sauvegarde.",
  typeToConfirm: (n: string) => `Saisissez le nom de l'espace (${n}) pour confirmer.`,
  deleteBtn: "Supprimer définitivement l'espace",
  deleting: "Suppression...",
  ownerOnly:
    "Seul le propriétaire peut supprimer l'espace. Pour le quitter, utilisez l'onglet Équipe.",

  accountTitle: "Votre compte",
  accountText:
    "Pour supprimer l'ensemble de votre compte, écrivez à l'adresse de contact indiquée dans notre Politique de confidentialité. Supprimez ou quittez d'abord vos espaces.",
  privacyLink: "Politique de confidentialité",

  failed: "Cela n'a pas fonctionné ou n'est pas autorisé. Réessayez.",
};

export const SET: Record<Lang, SeTx> = { en, fr };