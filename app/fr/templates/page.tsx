import type { Metadata } from "next";
import TemplatesView from "@/components/site/TemplatesView";

export const metadata: Metadata = {
  title: "Choisissez votre métier | ResumeCraft",
};

export default function Page() {
  return <TemplatesView lang="fr" />;
}