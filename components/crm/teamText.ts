import { Lang } from "@/lib/labels";

const en = {
  navTeam: "Team",

  teamTitle: "Team",
  teamIntro: "The people in this workspace and the invitations you have sent.",
  members: "Members",
  you: "you",
  roles: { owner: "Owner", admin: "Admin", member: "Member" } as Record<
    "owner" | "admin" | "member",
    string
  >,
  roleHelp:
    "Owner: manages everything. Admin: invites and removes members. Member: works on jobs and candidates.",
  makeAdmin: "Make admin",
  makeMember: "Make member",
  remove: "Remove",
  leave: "Leave workspace",
  removeConfirm: "Remove this person from the workspace?",
  leaveConfirm: "Leave this workspace? You will lose access to its data.",
  myName: "Your name",
  myNameHint: "Teammates see this name on your notes.",
  saveName: "Save name",
  nameSaved: "Saved.",
  needName: "Enter a name.",

  inviteTitle: "Invite someone",
  inviteText:
    "Create a link and send it yourself, for example on WhatsApp. We do not send emails. Anyone with the link can join until it is used or expires, so restrict it to one email when you can.",
  roleLabel: "Role",
  emailLabel: "Only this email can use it (optional)",
  createLink: "Create invitation link",
  pending: "Pending invitations",
  noPending: "No pending invitations.",
  expires: (d: string) => `Expires ${d}`,
  forEmail: (e: string) => `For ${e}`,
  anyEmail: "Any email",
  copy: "Copy link",
  copied: "Copied",
  copyFailed: "Could not copy. Select the link and copy it yourself.",
  share: "Share on WhatsApp",
  revoke: "Revoke",
  noAccess: "Only the owner and admins can invite people.",
  badEmail: "This email does not look valid.",
  failed: "That action was not allowed or did not work. Please try again.",

  joinWorking: "Joining the workspace...",
  joinDone: "You joined the workspace. Opening it...",
  joinInvalid:
    "This invitation is invalid, has expired, was already used, or was made for another email address.",
  joinConfig: "The service is not configured yet.",
  joinGo: "Go to the CRM",
  switchWorkspace: "Workspace",
};

export type TMTx = typeof en;

const fr: TMTx = {
  navTeam: "Équipe",

  teamTitle: "Équipe",
  teamIntro: "Les personnes de cet espace et les invitations que vous avez envoyées.",
  members: "Membres",
  you: "vous",
  roles: { owner: "Propriétaire", admin: "Admin", member: "Membre" },
  roleHelp:
    "Propriétaire : gère tout. Admin : invite et retire des membres. Membre : travaille sur les offres et les candidats.",
  makeAdmin: "Passer admin",
  makeMember: "Passer membre",
  remove: "Retirer",
  leave: "Quitter l'espace",
  removeConfirm: "Retirer cette personne de l'espace ?",
  leaveConfirm: "Quitter cet espace ? Vous perdrez l'accès à ses données.",
  myName: "Votre nom",
  myNameHint: "Vos collègues voient ce nom sur vos notes.",
  saveName: "Enregistrer le nom",
  nameSaved: "Enregistré.",
  needName: "Saisissez un nom.",

  inviteTitle: "Inviter quelqu'un",
  inviteText:
    "Créez un lien et envoyez-le vous-même, par exemple sur WhatsApp. Nous n'envoyons aucun email. Toute personne qui a le lien peut rejoindre l'espace jusqu'à ce qu'il soit utilisé ou expire : limitez-le à un email quand vous le pouvez.",
  roleLabel: "Rôle",
  emailLabel: "Seul cet email peut l'utiliser (facultatif)",
  createLink: "Créer un lien d'invitation",
  pending: "Invitations en attente",
  noPending: "Aucune invitation en attente.",
  expires: (d: string) => `Expire le ${d}`,
  forEmail: (e: string) => `Pour ${e}`,
  anyEmail: "N'importe quel email",
  copy: "Copier le lien",
  copied: "Copié",
  copyFailed: "Copie impossible. Sélectionnez le lien et copiez-le vous-même.",
  share: "Partager sur WhatsApp",
  revoke: "Révoquer",
  noAccess: "Seuls le propriétaire et les admins peuvent inviter des personnes.",
  badEmail: "Cet email ne semble pas valide.",
  failed: "Cette action n'est pas autorisée ou n'a pas fonctionné. Réessayez.",

  joinWorking: "Connexion à l'espace...",
  joinDone: "Vous avez rejoint l'espace. Ouverture...",
  joinInvalid:
    "Cette invitation est invalide, a expiré, a déjà été utilisée ou a été créée pour une autre adresse email.",
  joinConfig: "Le service n'est pas encore configuré.",
  joinGo: "Aller au CRM",
  switchWorkspace: "Espace",
};

export const TMT: Record<Lang, TMTx> = { en, fr };