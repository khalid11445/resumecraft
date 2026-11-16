"use client";

import { Lang } from "@/lib/labels";
import CrmShell from "@/components/crm/CrmShell";
import DashboardView from "@/components/crm/DashboardView";
import JobsView from "@/components/crm/JobsView";
import PipelineView from "@/components/crm/PipelineView";
import CandidatesView from "@/components/crm/CandidatesView";
import CandidateProfile from "@/components/crm/CandidateProfile";
import TasksView from "@/components/crm/TasksView";
import TeamView from "@/components/crm/TeamView";
import ImportView from "@/components/crm/ImportView";
import ExportView from "@/components/crm/ExportView";
import SettingsView from "@/components/crm/SettingsView";
import PlanView from "@/components/crm/PlanView";

export type CrmViewName =
  | "dashboard"
  | "jobs"
  | "job"
  | "candidates"
  | "candidate"
  | "tasks"
  | "team"
  | "import"
  | "export"
  | "settings"
  | "plan";

export default function CrmApp({
  lang,
  view,
}: {
  lang: Lang;
  view: CrmViewName;
}) {
  return (
    <CrmShell lang={lang}>
      {view === "dashboard" ? (
        <DashboardView />
      ) : view === "jobs" ? (
        <JobsView />
      ) : view === "job" ? (
        <PipelineView />
      ) : view === "candidate" ? (
        <CandidateProfile />
      ) : view === "tasks" ? (
        <TasksView />
      ) : view === "team" ? (
        <TeamView />
      ) : view === "import" ? (
        <ImportView />
      ) : view === "export" ? (
        <ExportView />
      ) : view === "settings" ? (
        <SettingsView />
      ) : view === "plan" ? (
        <PlanView />
      ) : (
        <CandidatesView />
      )}
    </CrmShell>
  );
}