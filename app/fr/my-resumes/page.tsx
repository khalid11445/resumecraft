import type { Metadata } from "next";
import MyResumesClient from "@/components/site/MyResumesClient";

export const metadata: Metadata = {
  title: "Mes CV | ResumeCraft",
};

export default function Page() {
  return <MyResumesClient lang="fr" />;
}