import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ClipboardList, Loader2, Sparkles } from "lucide-react";

import { listAssessments } from "@/lib/api/assessment.functions";
import { assessmentProfileSchema } from "@/lib/assessment/schema";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — CareerMirror AI" }],
  }),
  loader: async () => {
    const assessments = await listAssessments();
    return { assessments };
  },
  component: DashboardPage,
  pendingComponent: DashboardPending,
});

function DashboardPending() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function scoreColor(score: number | null) {
  if (score == null) return "text-muted-foreground";
  if (score >= 75) return "text-primary";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

function DashboardPage() {
  const { assessments } = Route.useLoaderData();
  const completed = assessments.filter((a) => a.status === "completed");
  const latestScore = completed[0]?.readiness_score ?? null;
  const roadmapWeeks = completed.length > 0 ? 16 : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Track your assessments, scores, and roadmap progress over time.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: BarChart3, label: "Readiness score", value: latestScore ?? "—" },
          { icon: ClipboardList, label: "Assessments", value: String(assessments.length) },
          {
            icon: Sparkles,
            label: "Roadmap weeks",
            value: roadmapWeeks ?? "—",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <stat.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <p
              className={`text-2xl font-bold ${
                stat.label === "Readiness score" && typeof stat.value === "number"
                  ? scoreColor(stat.value)
                  : ""
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {assessments.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
            <BarChart3 className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-semibold">No assessments yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Complete your first career mirror assessment to see your readiness score, gap analysis,
            and personalized roadmap here.
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent assessments</h2>
            <Link to="/start" className="text-sm text-primary hover:underline">
              New assessment
            </Link>
          </div>
          {assessments.map((assessment) => {
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
                key={assessment.id}
                to="/analysis/$id"
                params={{ id: assessment.id }}
                className="glass block rounded-xl p-5 transition hover:border-primary/30 hover:translate-y-[-1px]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{role}</p>
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
                            : ""
                      }
                    >
                      {statusLabel}
                    </Badge>
                    {assessment.readiness_score != null && (
                      <span
                        className={`text-2xl font-bold ${scoreColor(assessment.readiness_score)}`}
                      >
                        {assessment.readiness_score}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
