export type Lang = "en" | "fr";

const dict = {
  en: {
    summary: "Profile",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    contact: "Contact",
    present: "Present",
  },
  fr: {
    summary: "Profil",
    experience: "Expérience professionnelle",
    education: "Formation",
    skills: "Compétences",
    contact: "Contact",
    present: "Présent",
  },
} as const;

export function getLabels(lang: Lang = "en") {
  return dict[lang] ?? dict.en;
}

const isNow = (s?: string) =>
  !s || !s.trim() || /^(present|présent)$/i.test(s.trim());

// Jobs: an empty end date means "Present"
export function jobRange(
  start: string | undefined,
  end: string | undefined,
  lang: Lang = "en"
) {
  const endText = isNow(end) ? getLabels(lang).present : (end as string).trim();
  return [start?.trim(), endText].filter(Boolean).join(" - ");
}

// Studies: an empty end date stays empty, "Present" is translated
export function eduRange(
  start: string | undefined,
  end: string | undefined,
  lang: Lang = "en"
) {
  const endText =
    end && /^(present|présent)$/i.test(end.trim())
      ? getLabels(lang).present
      : end?.trim();
  return [start?.trim(), endText].filter(Boolean).join(" - ");
}