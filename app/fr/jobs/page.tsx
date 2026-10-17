import type { Metadata } from "next";
import JobsView from "@/components/site/JobsView";

export const metadata: Metadata = {
  title: "Où trouver des offres d'emploi au Maroc | ResumeCraft",
};

export default function Page() {
  return <JobsView lang="fr" />;
}