import { UseFormReturn } from "react-hook-form";
import { ResumeData } from "./resume-schema";

export type EditField = {
  id: string;
  label: string;
  value: string;
  multiline: boolean;
  set: (value: string) => void;
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

type PKey =
  | "fullName"
  | "jobTitle"
  | "email"
  | "phone"
  | "location"
  | "linkedin"
  | "website";

const personalKeys: [PKey, string][] = [
  ["fullName", "Name"],
  ["jobTitle", "Job title"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["location", "Location"],
  ["linkedin", "LinkedIn"],
  ["website", "Website"],
];

// Finds which fields of the resume contain the text the user clicked on
export function findEditFields(
  form: UseFormReturn<ResumeData>,
  clicked: string
): EditField[] {
  const frag = norm(clicked);
  if (frag.length < 2) return [];

  const data = form.getValues();
  const all: EditField[] = [];

  const add = (
    id: string,
    label: string,
    value: string | undefined,
    multiline: boolean,
    set: (v: string) => void
  ) => {
    if (value && value.trim()) all.push({ id, label, value, multiline, set });
  };

  for (const [k, label] of personalKeys) {
    add(`personal.${k}`, label, data.personal?.[k], false, (v) =>
      form.setValue(`personal.${k}`, v, { shouldDirty: true })
    );
  }

  add("summary", "Summary", data.summary, true, (v) =>
    form.setValue("summary", v, { shouldDirty: true })
  );

  (data.experience ?? []).forEach((job, i) => {
    add(`exp.${i}.role`, "Role", job.role, false, (v) =>
      form.setValue(`experience.${i}.role`, v, { shouldDirty: true })
    );
    add(`exp.${i}.company`, "Company", job.company, false, (v) =>
      form.setValue(`experience.${i}.company`, v, { shouldDirty: true })
    );
    add(`exp.${i}.location`, "Location", job.location, false, (v) =>
      form.setValue(`experience.${i}.location`, v, { shouldDirty: true })
    );
    add(`exp.${i}.start`, "Start date", job.startDate, false, (v) =>
      form.setValue(`experience.${i}.startDate`, v, { shouldDirty: true })
    );
    add(`exp.${i}.end`, "End date", job.endDate, false, (v) =>
      form.setValue(`experience.${i}.endDate`, v, { shouldDirty: true })
    );
    (job.bullets ?? []).forEach((b, j) => {
      add(`exp.${i}.bullet.${j}`, "Bullet point", b, true, (v) => {
        const cur = [...(form.getValues(`experience.${i}.bullets`) ?? [])];
        cur[j] = v.replace(/\n/g, " ");
        form.setValue(`experience.${i}.bullets`, cur, { shouldDirty: true });
      });
    });
  });

  (data.education ?? []).forEach((ed, i) => {
    add(`edu.${i}.school`, "School", ed.school, false, (v) =>
      form.setValue(`education.${i}.school`, v, { shouldDirty: true })
    );
    add(`edu.${i}.degree`, "Degree", ed.degree, false, (v) =>
      form.setValue(`education.${i}.degree`, v, { shouldDirty: true })
    );
    add(`edu.${i}.details`, "Details", ed.details, false, (v) =>
      form.setValue(`education.${i}.details`, v, { shouldDirty: true })
    );
    add(`edu.${i}.start`, "Start date", ed.startDate, false, (v) =>
      form.setValue(`education.${i}.startDate`, v, { shouldDirty: true })
    );
    add(`edu.${i}.end`, "End date", ed.endDate, false, (v) =>
      form.setValue(`education.${i}.endDate`, v, { shouldDirty: true })
    );
  });

  (data.skills ?? []).forEach((s, k) => {
    add(`skill.${k}`, "Skill", s.trim(), false, (v) => {
      const cur = [...(form.getValues("skills") ?? [])];
      cur[k] = v;
      form.setValue("skills", cur, { shouldDirty: true });
    });
  });

  (data.customSections ?? []).forEach((sec, s) => {
    add(`sec.${s}.title`, "Section title", sec.title, false, (v) =>
      form.setValue(`customSections.${s}.title`, v, { shouldDirty: true })
    );
    (sec.items ?? []).forEach((item, k) => {
      add(`sec.${s}.item.${k}`, "Item", item, true, (v) => {
        const cur = [...(form.getValues(`customSections.${s}.items`) ?? [])];
        cur[k] = v.replace(/\n/g, " ");
        form.setValue(`customSections.${s}.items`, cur, { shouldDirty: true });
      });
    });
  });

  // Best match first: exact text, then a line containing the clicked piece,
  // then lines that sit inside a clicked group (e.g. "email | phone | city")
  const exact = all.filter((f) => norm(f.value) === frag);
  if (exact.length) return exact.slice(0, 3);

  const contains = all.filter((f) => norm(f.value).includes(frag));
  if (contains.length) return contains.slice(0, 3);

  const inside = all.filter(
    (f) => norm(f.value).length >= 2 && frag.includes(norm(f.value))
  );
  return inside.slice(0, 5);
}