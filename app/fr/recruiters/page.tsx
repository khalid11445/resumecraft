import type { Metadata } from "next";
import RecruitersView from "@/components/site/RecruitersView";

export const metadata: Metadata = {
  title: "CRM de recrutement pour petits cabinets et équipes RH | ResumeCraft",
  description:
    "Gardez vos offres, vos candidats, votre pipeline, vos notes et vos relances au même endroit. Un CRM de recrutement simple, en français et en anglais.",
};

export default function Page() {
  return <RecruitersView lang="fr" />;
}