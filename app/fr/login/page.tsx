import type { Metadata } from "next";
import AuthForm from "@/components/crm/AuthForm";

export const metadata: Metadata = {
  title: "Connexion | ResumeCraft",
  robots: { index: false },
};

export default function Page() {
  return <AuthForm lang="fr" mode="login" />;
}