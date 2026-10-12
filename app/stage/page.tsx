import type { Metadata } from "next";
import StageView from "@/components/site/StageView";

export const metadata: Metadata = {
  title: "Internship resume and application guide | ResumeCraft",
};

export default function Page() {
  return <StageView lang="en" />;
}