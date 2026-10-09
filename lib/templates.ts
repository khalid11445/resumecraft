import { ComponentType } from "react";
import { ResumeData } from "./resume-schema";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import CompactTemplate from "@/components/templates/CompactTemplate";
import ElegantTemplate from "@/components/templates/ElegantTemplate";

export const templates: TemplateInfo[] = [
  { id: "elegant", name: "Elegant", component: ElegantTemplate },
  { id: "classic", name: "Classic", component: ClassicTemplate },
  { id: "modern", name: "Modern", component: ModernTemplate },
  { id: "compact", name: "Compact", component: CompactTemplate },
];
export type TemplateInfo = {
  id: string;
  name: string;
  component: ComponentType<{ data: ResumeData }>;
};


export function getTemplate(id: string): TemplateInfo {
  return templates.find((t) => t.id === id) ?? templates[0];
}