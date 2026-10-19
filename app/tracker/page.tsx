import type { Metadata } from "next";
import TrackerClient from "@/components/site/TrackerClient";

export const metadata: Metadata = {
  title: "Job application tracker | ResumeCraft",
};

export default function Page() {
  return <TrackerClient lang="en" />;
}