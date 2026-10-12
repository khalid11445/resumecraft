import { Suspense } from "react";
import type { Metadata } from "next";
import BuilderClient from "@/components/builder/BuilderClient";

export const metadata: Metadata = {
  title: "Créer mon CV | ResumeCraft",
  description:
    "Créez un CV professionnel en français, avec aperçu en direct, suggestions et rédacteur IA.",
};

export default function Page() {
  return (
    <Suspense fallback={<p className="p-8">Chargement...</p>}>
      <BuilderClient uiLang="fr" />
    </Suspense>
  );
}