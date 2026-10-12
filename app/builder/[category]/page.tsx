import { Suspense } from "react";
import BuilderClient from "@/components/builder/BuilderClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-8">Loading builder...</p>}>
      <BuilderClient uiLang="en" />
    </Suspense>
  );
}