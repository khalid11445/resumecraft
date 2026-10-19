import type { Metadata } from "next";
import TrackerClient from "@/components/site/TrackerClient";

export const metadata: Metadata = {
  title: "Suivi de candidatures | ResumeCraft",
};

export default function Page() {
  return <TrackerClient lang="fr" />;
}