import { Suspense } from "react";
import type { Metadata } from "next";
import JoinView from "@/components/crm/JoinView";

export const metadata: Metadata = {
  title: "Join a workspace | ResumeCraft",
  robots: { index: false },
  referrer: "no-referrer",
};

export default function Page() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-gray-500">...</p>}>
      <JoinView lang="en" />
    </Suspense>
  );
}