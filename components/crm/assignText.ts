import { Lang } from "@/lib/labels";

const en = {
  filterAll: "All",
  filterMine: "Mine",
  filterUnassigned: "Unassigned",
  assignLabel: "Assign to",
  unassigned: "— Unassigned —",
  assignedTo: "Assigned to",
  mineSummary: (late: number, today: number) =>
    `For you: ${late} overdue, ${today} due today.`,
  mineClear: "Nothing overdue or due today for you.",
  nothingHere: "No tasks in this view.",
};

export type ATx = typeof en;

const fr: ATx = {
  filterAll: "Toutes",
  filterMine: "Les miennes",
  filterUnassigned: "Non assignées",
  assignLabel: "Assigner à",
  unassigned: "— Non assignée —",
  assignedTo: "Assignée à",
  mineSummary: (late: number, today: number) =>
    `Pour vous : ${late} en retard, ${today} à faire aujourd'hui.`,
  mineClear: "Rien en retard ni à faire aujourd'hui pour vous.",
  nothingHere: "Aucune tâche dans cette vue.",
};

export const AT: Record<Lang, ATx> = { en, fr };