import { ComponentType } from "react";
import { ResumeData } from "./resume-schema";
import ElegantTemplate from "@/components/templates/ElegantTemplate";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import CompactTemplate from "@/components/templates/CompactTemplate";
import BoldTemplate from "@/components/templates/BoldTemplate";
import TimelineTemplate from "@/components/templates/TimelineTemplate";

export type TemplateProps = { data: ResumeData; accent?: string };

export type TemplateInfo = {
  id: string;
  name: string;
  component: ComponentType<TemplateProps>;
};

export const templates: TemplateInfo[] = [
  { id: "elegant", name: "Elegant", component: ElegantTemplate },
  { id: "bold", name: "Bold", component: BoldTemplate },
  { id: "timeline", name: "Timeline", component: TimelineTemplate },
  { id: "modern", name: "Modern", component: ModernTemplate },
  { id: "classic", name: "Classic", component: ClassicTemplate },
  { id: "compact", name: "Compact", component: CompactTemplate },
];

export function getTemplate(id: string): TemplateInfo {
  return templates.find((t) => t.id === id) ?? templates[0];
}