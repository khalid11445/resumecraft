import { ComponentType } from "react";
import { ResumeData } from "./resume-schema";
import { Lang } from "./labels";
import ElegantTemplate from "@/components/templates/ElegantTemplate";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import CompactTemplate from "@/components/templates/CompactTemplate";
import BoldTemplate from "@/components/templates/BoldTemplate";
import TimelineTemplate from "@/components/templates/TimelineTemplate";

export type TemplateProps = { data: ResumeData; accent?: string; lang?: Lang };

export type TemplateInfo = {
  id: string;
  name: string;
  component: ComponentType<TemplateProps>;
  // How many text columns the layout uses (used by the readability check)
  columns: 1 | 2;
};

export const templates: TemplateInfo[] = [
  { id: "elegant", name: "Elegant", component: ElegantTemplate, columns: 1 },
  { id: "bold", name: "Bold", component: BoldTemplate, columns: 1 },
  { id: "timeline", name: "Timeline", component: TimelineTemplate, columns: 1 },
  { id: "modern", name: "Modern", component: ModernTemplate, columns: 2 },
  { id: "classic", name: "Classic", component: ClassicTemplate, columns: 1 },
  { id: "compact", name: "Compact", component: CompactTemplate, columns: 1 },
];

export function getTemplate(id: string): TemplateInfo {
  return templates.find((t) => t.id === id) ?? templates[0];
}