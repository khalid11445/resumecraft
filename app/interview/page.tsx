import type { Metadata } from "next";
import InterviewView from "@/components/site/InterviewView";

export const metadata: Metadata = {
  title: "Job interview questions and sample answers | ResumeCraft",
};

export default function Page() {
  return <InterviewView lang="en" />;
}