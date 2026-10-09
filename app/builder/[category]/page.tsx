import { Suspense } from "react";
import BuilderClient from "./BuilderClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-8">Loading builder...</p>}>
      <BuilderClient />
    </Suspense>
  );
}