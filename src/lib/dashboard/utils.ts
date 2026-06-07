import { assessmentProfileSchema } from "@/lib/assessment/schema";

export type DashboardAssessment = {
  id: string;
  status: "pending" | "analyzing" | "completed" | "failed";
  readiness_score: number | null;
  profile: unknown;
  roadmap_progress: unknown;
  created_at: string;
  updated_at: string;
};

const experienceLabels: Record<string, string> = {
  student: "Student",
  entry: "Entry level",
  junior: "Junior",
  mid: "Mid level",
  senior: "Senior",
};

export function parseAssessmentProfile(profile: unknown) {
  const parsed = assessmentProfileSchema.safeParse(profile);
  if (!parsed.success) return null;
  return {
    ...parsed.data,
    experienceLabel: experienceLabels[parsed.data.experienceLevel] ?? parsed.data.experienceLevel,
  };
}

export function getActiveAssessment(assessments: DashboardAssessment[]) {
  const inProgress = assessments.find(
    (a) => a.status === "analyzing" || a.status === "pending",
  );
  if (inProgress) return { assessment: inProgress, kind: "in_progress" as const };

  const latestCompleted = assessments.find((a) => a.status === "completed");
  if (latestCompleted) return { assessment: latestCompleted, kind: "active_plan" as const };

  return null;
}

export function getCompletedWithScores(assessments: DashboardAssessment[]) {
  return assessments
    .filter((a) => a.status === "completed" && a.readiness_score != null)
    .slice()
    .reverse();
}

export function getScoreDelta(completedDesc: DashboardAssessment[]) {
  const scored = completedDesc.filter((a) => a.readiness_score != null);
  if (scored.length < 2) return null;
  return (scored[0]!.readiness_score ?? 0) - (scored[1]!.readiness_score ?? 0);
}

export function scoreColorClass(score: number | null) {
  if (score == null) return "text-muted-foreground";
  if (score >= 75) return "text-primary";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}
