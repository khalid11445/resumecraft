"use client";

import { Lang } from "@/lib/labels";
import CrmShell from "@/components/crm/CrmShell";
import JobsView from "@/components/crm/JobsView";
import PipelineView from "@/components/crm/PipelineView";
import CandidatesView from "@/components/crm/CandidatesView";
import CandidateProfile from "@/components/crm/CandidateProfile";

export default function CrmApp({
  lang,
  view,
}: {
  lang: Lang;
  view: "jobs" | "job" | "candidates" | "candidate";
}) {
  return (
    <CrmShell lang={lang}>
      {view === "jobs" ? (
        <JobsView />
      ) : view === "job" ? (
        <PipelineView />
      ) : view === "candidate" ? (
        <CandidateProfile />
      ) : (
        <CandidatesView />
      )}
    </CrmShell>
  );
}