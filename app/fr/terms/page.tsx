import type { Metadata } from "next";
import LegalView from "@/components/site/LegalView";

export const metadata: Metadata = {
  title: "Conditions d'utilisation | ResumeCraft",
};

export default function Page() {
  return <LegalView lang="fr" page="terms" />;
}