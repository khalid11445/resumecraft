import { ComponentType } from "react";
import { ResumeData } from "./resume-schema";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";

export type TemplateInfo = {
  id: string;
  name: string;
  component: ComponentType<{ data: ResumeData }>;
};

export const templates: TemplateInfo[] = [
  { id: "classic", name: "Classic", component: ClassicTemplate },
  { id: "modern", name: "Modern", component: ModernTemplate },
];

export function getTemplate(id: string): TemplateInfo {
  return templates.find((t) => t.id === id) ?? templates[0];
}