import { Lang } from "@/lib/labels";

// The database refuses an action beyond the plan with a message that
// contains "plan limit". This turns it into a sentence for the user.
export function planLimitText(
  error: { message?: string } | null | undefined,
  lang: Lang
): string | null {
  const msg = error?.message ?? "";
  if (!msg.includes("plan limit")) return null;

  if (msg.includes("candidates")) {
    return lang === "fr"
      ? "Votre formule gratuite a atteint sa limite de candidats. Ouvrez l'onglet Formule pour voir comment passer à Pro."
      : "Your free plan has reached its candidate limit. Open the Plan tab to see how to upgrade to Pro.";
  }
  if (msg.includes("members")) {
    return lang === "fr"
      ? "Votre formule a atteint sa limite de membres. Ouvrez l'onglet Formule pour voir comment passer à Pro."
      : "Your plan has reached its member limit. Open the Plan tab to see how to upgrade to Pro.";
  }
  return lang === "fr"
    ? "Cette action dépasse les limites de votre formule."
    : "This action goes beyond the limits of your plan.";
}