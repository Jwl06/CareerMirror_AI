import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, Sparkles, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DashboardAssessment } from "@/lib/dashboard/utils";
import { parseAssessmentProfile, scoreColorClass } from "@/lib/dashboard/utils";

type ActiveAssessmentCardProps = {
  assessment: DashboardAssessment;
  kind: "in_progress" | "active_plan";
};

export function ActiveAssessmentCard({ assessment, kind }: ActiveAssessmentCardProps) {
  const profile = parseAssessmentProfile(assessment.profile);
  const role = profile?.targetRole ?? "Career assessment";
  const isInProgress = kind === "in_progress";

  return (
    <div className="glass-strong relative overflow-hidden rounded-2xl border border-primary/20 p-6 md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={
                isInProgress
                  ? "border-warning/30 bg-warning/10 text-warning"
                  : "border-primary/30 bg-primary/10 text-primary"
              }
            >
              {isInProgress ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Analysis in progress
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 h-3 w-3" />
                  Active career plan
                </>
              )}
            </Badge>
            {profile && (
              <span className="text-xs text-muted-foreground">
                {profile.experienceLabel} · {profile.yearsOfExperience} yr
                {profile.yearsOfExperience === 1 ? "" : "s"}
              </span>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wide">Current focus</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{role}</h2>
            {profile?.careerGoals && (
              <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-muted-foreground">
                {profile.careerGoals}
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            {isInProgress ? "Started" : "Completed"}{" "}
            {new Date(assessment.created_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-4 md:items-end">
          {!isInProgress && assessment.readiness_score != null && (
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">Readiness score</p>
              <p
                className={`text-5xl font-bold tabular-nums ${scoreColorClass(assessment.readiness_score)}`}
              >
                {assessment.readiness_score}
              </p>
            </div>
          )}

          {isInProgress ? (
            <Button variant="secondary" disabled className="w-full md:w-auto">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing profile…
            </Button>
          ) : (
            <Link to="/analysis/$id" params={{ id: assessment.id }}>
              <Button className="glow w-full md:w-auto">
                View full analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
