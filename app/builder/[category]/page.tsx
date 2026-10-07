"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, ResumeData } from "@/lib/resume-schema";
import { getCategory } from "@/lib/categories";
import BuilderForm from "@/components/builder/BuilderForm";
import { templates, getTemplate } from "@/lib/templates";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <p className="p-8">Loading preview...</p> }
);

export default function BuilderPage() {
  const params = useParams<{ category: string }>();
  const category = getCategory(String(params.category));
  const [templateId, setTemplateId] = useState("classic");
  const Template = getTemplate(templateId).component;

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

  return (
    <div className="flex h-screen w-full">
      <div className="w-1/2 overflow-y-auto border-r border-gray-300 bg-white">
        <div className="border-b border-gray-200 p-4">
          <p className="text-xs text-gray-500">Category</p>
          <p className="font-semibold text-black">{category.name}</p>
          <p className="mt-1 text-xs text-gray-500">
            Suggested sections: {category.recommendedSections.join(", ")}
          </p>

          <div className="mt-3 flex gap-2">
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
          </div>
        </div>
        <BuilderForm form={form} />
      </div>
      <div className="w-1/2">
        <PDFViewer
          key={templateId}
          width="100%"
          height="100%"
          showToolbar
        >
          <Template data={previewData} />
        </PDFViewer>
      </div>
    </div>
  );
}