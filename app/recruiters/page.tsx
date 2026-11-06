import type { Metadata } from "next";
import RecruitersView from "@/components/site/RecruitersView";

export const metadata: Metadata = {
  title: "Recruiting CRM for small agencies and HR teams | ResumeCraft",
  description:
    "Keep your jobs, candidates, pipeline, notes and follow-ups in one place. A simple recruiting CRM in French and English.",
};

export default function Page() {
  return <RecruitersView lang="en" />;
}