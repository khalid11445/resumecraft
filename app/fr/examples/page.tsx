import type { Metadata } from "next";
import ExamplesView from "@/components/site/ExamplesView";

export const metadata: Metadata = {
  title: "Exemples de CV | ResumeCraft",
};

export default function Page() {
  return <ExamplesView lang="fr" />;
}