import type { Metadata } from "next";
import TrackerClient from "@/components/site/TrackerClient";

export const metadata: Metadata = {
  title: "Application tracker | ResumeCraft",
};

export default function Page() {
  return <TrackerClient lang="en" />;
}