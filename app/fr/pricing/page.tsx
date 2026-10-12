import type { Metadata } from "next";
import PricingView from "@/components/site/PricingView";

export const metadata: Metadata = {
  title: "Tarifs | ResumeCraft",
};

export default function Page() {
  return <PricingView lang="fr" />;
}