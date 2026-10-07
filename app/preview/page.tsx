"use client";

import dynamic from "next/dynamic";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import { sampleResume } from "@/lib/sample-data";

// PDFViewer only works in the browser, so we disable server rendering for it
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <p className="p-8">Loading preview...</p> }
);

export default function PreviewPage() {
  return (
    <div className="h-screen w-full">
      <PDFViewer width="100%" height="100%" showToolbar>
        <ClassicTemplate data={sampleResume} />
      </PDFViewer>
    </div>
  );
}