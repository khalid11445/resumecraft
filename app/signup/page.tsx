import type { Metadata } from "next";
import AuthForm from "@/components/crm/AuthForm";

export const metadata: Metadata = {
  title: "Create account | ResumeCraft",
  robots: { index: false },
};

export default function Page() {
  return <AuthForm lang="en" mode="signup" />;
}