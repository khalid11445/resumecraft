import type { Metadata } from "next";
import PfeView from "@/components/site/pfeView";

export const metadata: Metadata = {
  title: "Guide PFE : sujet, planning, rapport et soutenance | ResumeCraft",
};

export default function Page() {
  return <PfeView lang="fr" />;
}