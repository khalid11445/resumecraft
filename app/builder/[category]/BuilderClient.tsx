"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, ResumeData } from "@/lib/resume-schema";
import { getCategory } from "@/lib/categories";
import BuilderForm from "@/components/builder/BuilderForm";
import PdfPreview from "@/components/builder/PdfPreview";
import { templates, getTemplate } from "@/lib/templates";

export default function BuilderPage() {
  const params = useParams<{ category: string }>();
  const category = getCategory(String(params.category));
  const [templateId, setTemplateId] = useState("elegant");
  const Template = getTemplate(templateId).component;

  const [resumeId] = useState(() => crypto.randomUUID());
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: category.starter,
    mode: "onChange",
  });

  const liveData = form.watch() as ResumeData;

  const [previewData, setPreviewData] = useState<ResumeData>(category.starter);
  useEffect(() => {
    const t = setTimeout(() => setPreviewData(structuredClone(liveData)), 500);
    return () => clearTimeout(t);
  }, [JSON.stringify(liveData)]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDownload() {
    setError("");

    // Temporary: free download while payments are being set up
    if (process.env.NEXT_PUBLIC_FREE_DOWNLOAD === "true") {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(<Template data={previewData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${previewData.personal.fullName || "resume"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    setPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          category: category.id,
          template: templateId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPaying(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      <div className="w-1/2 overflow-y-auto border-r border-gray-300 bg-white">
        <div className="border-b border-gray-200 p-4">
          <p className="text-xs text-gray-500">Category</p>
          <p className="font-semibold text-black">{category.name}</p>
          <p className="mt-1 text-xs text-gray-500">
            Suggested sections: {category.recommendedSections.join(", ")}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`rounded border px-3 py-1 text-sm ${
                  templateId === t.id
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                {t.name}
              </button>
            ))}

            <button
              type="button"
              onClick={handleDownload}
              disabled={paying}
              className="ml-auto rounded bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {paying ? "Opening checkout..." : "Download PDF"}
            </button>
          </div>
          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
        </div>
        <BuilderForm form={form} />
      </div>
      <div className="w-1/2">
        <PdfPreview Template={Template} data={previewData} />
      </div>
    </div>
  );
}