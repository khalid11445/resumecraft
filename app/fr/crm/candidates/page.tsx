import { Suspense } from "react";
import type { Metadata } from "next";
import CrmApp from "@/components/crm/CrmApp";

export const metadata: Metadata = {
  title: "Candidats | ResumeCraft",
  robots: { index: false },
};

export default function Page() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-gray-500">...</p>}>
      <CrmApp lang="fr" view="candidates" />
    </Suspense>
  );
}