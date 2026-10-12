import type { Metadata } from "next";
import HomeView from "@/components/site/HomeView";

export const metadata: Metadata = {
  title: "ResumeCraft | Des CV conçus pour votre métier",
  description:
    "Choisissez votre métier, modifiez avec un aperçu en direct et téléchargez un CV professionnel et soigné.",
};

export default function Page() {
  return <HomeView lang="fr" />;
}