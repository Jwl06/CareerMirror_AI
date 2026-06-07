import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  BarChart3,
  ClipboardList,
  Loader2,
  Minus,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { ActiveAssessmentCard } from "@/components/dashboard/active-assessment-card";
import { RoadmapProgressCard } from "@/components/dashboard/roadmap-progress-card";
import { ScoreTrendChart } from "@/components/dashboard/score-trend-chart";
import { DashboardPageSkeleton } from "@/components/ui/page-skeletons";
import { listAssessments } from "@/lib/api/assessment.functions";
import { getRoadmapSummary } from "@/lib/api/roadmap.functions";
import { assessmentProfileSchema } from "@/lib/assessment/schema";
import {
  getActiveAssessment,
  getScoreDelta,
  scoreColorClass,
  type DashboardAssessment,
} from "@/lib/dashboard/utils";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — CareerMirror AI" }],
  }),
  loader: async () => {
    const assessments = (await listAssessments()) as DashboardAssessment[];
    const active = getActiveAssessment(assessments);
    const roadmapSummary =
      active?.kind === "active_plan"
        ? await getRoadmapSummary({ data: { id: active.assessment.id } })
        : null;
    return { assessments, roadmapSummary };
  },
  component: DashboardPage,
  pendingComponent: DashboardPending,
});

function DashboardPending() {
  return <DashboardPageSkeleton />;
}

function DashboardPage() {
  const { assessments, roadmapSummary } = Route.useLoaderData();
  const active = getActiveAssessment(assessments);
  const completed = assessments.filter((a) => a.status === "completed");
  const latestScore = completed[0]?.readiness_score ?? null;
  const scoreDelta = getScoreDelta(completed);
  const averageScore =
    completed.length > 0
      ? Math.round(
          completed.reduce((sum, a) => sum + (a.readiness_score ?? 0), 0) / completed.length,
        )
      : null;

  return (
    <div className="page-enter mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Your career hub — active plan, score trends, and assessment history.
        </p>
      </div>

      {assessments.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
            <BarChart3 className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-semibold">No assessments yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Complete your first career mirror assessment to unlock your active plan summary, score
            trends, and personalized roadmap.
          </p>
          <Link
            to="/start"
            className="glow mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            Start your first assessment
          </Link>
        </div>
      ) : (
        <>
          {active && (
            <ActiveAssessmentCard assessment={active.assessment} kind={active.kind} />
          )}

          {roadmapSummary && <RoadmapProgressCard summary={roadmapSummary} />}

          <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={BarChart3}
              label="Latest score"
              value={latestScore ?? "—"}
              valueClassName={scoreColorClass(latestScore)}
              hint={
                scoreDelta != null ? (
                  <DeltaHint delta={scoreDelta} />
                ) : completed.length === 1 ? (
                  "First assessment"
                ) : undefined
              }
            />
            <StatCard
              icon={ClipboardList}
              label="Assessments"
              value={`${completed.length}/${assessments.length}`}
              hint="Completed / total"
            />
            <StatCard
              icon={Sparkles}
              label="Average score"
              value={averageScore ?? "—"}
              valueClassName={averageScore != null ? scoreColorClass(averageScore) : undefined}
              hint={completed.length > 0 ? "Across completed runs" : undefined}
            />
            <StatCard
              icon={BarChart3}
              label="Roadmap progress"
              value={
                roadmapSummary
                  ? `${roadmapSummary.stats.percentComplete}%`
                  : completed.length > 0
                    ? "0%"
                    : "—"
              }
              valueClassName={
                roadmapSummary && roadmapSummary.stats.percentComplete > 0
                  ? "text-primary"
                  : undefined
              }
              hint={
                roadmapSummary
                  ? `${roadmapSummary.stats.completedTasks}/${roadmapSummary.stats.totalTasks} tasks · Week ${roadmapSummary.progress.currentWeek}`
                  : completed.length > 0
                    ? "Open roadmap to start tracking"
                    : undefined
              }
            />
          </div>

          <ScoreTrendChart assessments={assessments} />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Assessment history</h2>
              <Link to="/start" className="text-sm text-primary hover:underline">
                New assessment
              </Link>
            </div>
            {assessments.map((assessment) => (
              <AssessmentHistoryRow
                key={assessment.id}
                assessment={assessment}
                isActive={active?.assessment.id === assessment.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  valueClassName,
  hint,
}: {
  icon: typeof BarChart3;
  label: string;
  value: string | number;
  valueClassName?: string;
  hint?: ReactNode;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={`text-2xl font-bold tabular-nums ${valueClassName ?? ""}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function DeltaHint({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1">
        <Minus className="h-3 w-3" />
        Unchanged vs previous
      </span>
    );
  }

  const positive = delta > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 ${positive ? "text-primary" : "text-destructive"}`}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? "+" : ""}
      {delta} vs previous
    </span>
  );
}

function AssessmentHistoryRow({
  assessment,
  isActive,
}: {
  assessment: DashboardAssessment;
  isActive: boolean;
}) {
  const profile = assessmentProfileSchema.safeParse(assessment.profile);
  const role = profile.success ? profile.data.targetRole : "Career assessment";
  const statusLabel =
    assessment.status === "completed"
      ? "Completed"
      : assessment.status === "analyzing"
        ? "Analyzing"
        : assessment.status === "failed"
          ? "Failed"
          : "Pending";

  return (
    <Link
      to="/analysis/$id"
      params={{ id: assessment.id }}
      className={`glass block rounded-xl p-5 transition hover:border-primary/30 hover:translate-y-[-1px] ${
        isActive ? "border border-primary/20" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{role}</p>
            {isActive && (
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                Active
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(assessment.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={
              assessment.status === "completed"
                ? "border-primary/30 bg-primary/10 text-primary"
                : assessment.status === "failed"
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : assessment.status === "analyzing"
                    ? "border-warning/30 bg-warning/10 text-warning"
                    : ""
            }
          >
            {assessment.status === "analyzing" && (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            )}
            {statusLabel}
          </Badge>
          {assessment.readiness_score != null && (
            <span
              className={`text-2xl font-bold tabular-nums ${scoreColorClass(assessment.readiness_score)}`}
            >
              {assessment.readiness_score}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
