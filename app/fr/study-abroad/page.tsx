import type { Metadata } from "next";
import StudyAbroadView from "@/components/site/StudyAbroadView";

export const metadata: Metadata = {
  title: "Guides pour étudier à l'étranger : France et Canada | ResumeCraft",
};

export default function Page() {
  return <StudyAbroadView lang="fr" />;
}