import type { Metadata } from "next";
import MyResumesClient from "@/components/site/MyResumesClient";

export const metadata: Metadata = {
  title: "My resumes | ResumeCraft",
};

export default function Page() {
  return <MyResumesClient lang="en" />;
}