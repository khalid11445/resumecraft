import type { Metadata } from "next";
import InterviewView from "@/components/site/InterviewView";

export const metadata: Metadata = {
  title: "Questions d'entretien d'embauche et exemples de réponses | ResumeCraft",
};

export default function Page() {
  return <InterviewView lang="fr" />;
}