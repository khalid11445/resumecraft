import type { Metadata } from "next";
import LetterClient from "@/components/letter/LetterClient";

export const metadata: Metadata = {
  title: "Demande de stage | ResumeCraft",
};

export default function Page() {
  return <LetterClient uiLang="fr" />;
}