import { Suspense } from "react";
import type { Metadata } from "next";
import CrmApp from "@/components/crm/CrmApp";

export const metadata: Metadata = {
  title: "Team | ResumeCraft",
  robots: { index: false },
};

export default function Page() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-gray-500">...</p>}>
      <CrmApp lang="en" view="team" />
    </Suspense>
  );
}