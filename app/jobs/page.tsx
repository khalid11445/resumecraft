import type { Metadata } from "next";
import JobsView from "@/components/site/JobsView";

export const metadata: Metadata = {
  title: "Where to find job offers in Morocco | ResumeCraft",
};

export default function Page() {
  return <JobsView lang="en" />;
}