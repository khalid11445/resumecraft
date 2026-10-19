import type { Metadata } from "next";
import CheckerClient from "@/components/site/CheckerClient";

export const metadata: Metadata = {
  title: "Vérificateur de CV gratuit : téléversez votre PDF | ResumeCraft",
};

export default function Page() {
  return <CheckerClient lang="fr" />;
}