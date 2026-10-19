import type { Metadata } from "next";
import CheckerClient from "@/components/site/CheckerClient";

export const metadata: Metadata = {
  title: "Free resume checker: upload your PDF and get tips | ResumeCraft",
};

export default function Page() {
  return <CheckerClient lang="en" />;
}