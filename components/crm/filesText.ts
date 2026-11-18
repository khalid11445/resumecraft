import { Lang } from "@/lib/labels";

const en = {
  title: "Documents",
  intro:
    "Attach a CV or other documents. Only members of this workspace can open them.",
  upload: "Upload a file",
  uploading: "Uploading...",
  hint: "PDF, Word (.doc, .docx), PNG or JPG. Up to 5 MB each and 10 per candidate.",
  scanNote:
    "Files are not scanned for viruses. Open an attachment with the same care as any email attachment.",
  empty: "No documents yet.",
  open: "Open",
  del: "Delete",
  deleteConfirm: "Delete this file? This cannot be undone.",
  uploadedOn: (name: string, date: string) =>
    name ? `${name} · ${date}` : date,
  tooBig: "This file is empty or larger than 5 MB.",
  badType:
    "This file type is not allowed, or the file does not match its type. Use PDF, Word, PNG or JPG.",
  uploaded: "File uploaded.",
  failed: "The upload did not work. Please try again.",
  openFailed: "We could not open this file. Please try again.",
  deleteFailed: "The file could not be deleted. Please try again.",
};

export type FTx = typeof en;

const fr: FTx = {
  title: "Documents",
  intro:
    "Joignez un CV ou d'autres documents. Seuls les membres de cet espace peuvent les ouvrir.",
  upload: "Téléverser un fichier",
  uploading: "Téléversement...",
  hint: "PDF, Word (.doc, .docx), PNG ou JPG. 5 Mo maximum par fichier et 10 par candidat.",
  scanNote:
    "Les fichiers ne sont pas analysés contre les virus. Ouvrez une pièce jointe avec la même prudence que n'importe quelle pièce jointe d'email.",
  empty: "Aucun document pour le moment.",
  open: "Ouvrir",
  del: "Supprimer",
  deleteConfirm: "Supprimer ce fichier ? Cette action est irréversible.",
  uploadedOn: (name: string, date: string) =>
    name ? `${name} · ${date}` : date,
  tooBig: "Ce fichier est vide ou dépasse 5 Mo.",
  badType:
    "Ce type de fichier n'est pas autorisé, ou le fichier ne correspond pas à son type. Utilisez PDF, Word, PNG ou JPG.",
  uploaded: "Fichier téléversé.",
  failed: "Le téléversement n'a pas fonctionné. Réessayez.",
  openFailed: "Impossible d'ouvrir ce fichier. Réessayez.",
  deleteFailed: "Le fichier n'a pas pu être supprimé. Réessayez.",
};

export const FIL: Record<Lang, FTx> = { en, fr };