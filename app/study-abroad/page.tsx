import type { Metadata } from "next";
import StudyAbroadView from "@/components/site/StudyAbroadView";

export const metadata: Metadata = {
  title: "Study abroad guides: France and Canada | ResumeCraft",
};

export default function Page() {
  return <StudyAbroadView lang="en" />;
}