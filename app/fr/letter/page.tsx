import type { Metadata } from "next";
import LetterClient from "@/components/letter/LetterClient";

export const metadata: Metadata = {
  title: "Internship request letter | ResumeCraft",
};

export default function Page() {
  return <LetterClient uiLang="en" />;
}