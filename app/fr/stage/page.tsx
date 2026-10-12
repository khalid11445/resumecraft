import type { Metadata } from "next";
import StageView from "@/components/site/StageView";

export const metadata: Metadata = {
  title: "CV de stage et guide de candidature | ResumeCraft",
};

export default function Page() {
  return <StageView lang="fr" />;
}