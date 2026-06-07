import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { AnalysisResults } from "@/components/analysis/analysis-results";
import { assessmentProfileSchema } from "@/lib/assessment/schema";
import { parseRoadmapProgress } from "@/lib/roadmap/utils";
import { getAssessment } from "@/lib/api/assessment.functions";

export const Route = createFileRoute("/_authenticated/analysis/$id")({
  head: () => ({
    meta: [{ title: "Analysis — CareerMirror AI" }],
  }),
  loader: async ({ params }) => {
    const assessment = await getAssessment({ data: { id: params.id } });
    return { assessment };
  },
  component: AnalysisPage,
  pendingComponent: AnalysisPending,
});

function AnalysisPending() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading your analysis…</p>
    </div>
  );
}

function AnalysisPage() {
  const { assessment } = Route.useLoaderData();
  const profile = assessmentProfileSchema.parse(assessment.profile);

  if (assessment.status === "analyzing") {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">AI analysis in progress…</p>
      </div>
    );
  }

  return (
    <AnalysisResults
      assessmentId={assessment.id}
      profile={profile}
      analysis={assessment.analysis}
      readinessScore={assessment.readiness_score}
      createdAt={assessment.created_at}
      roadmapProgress={parseRoadmapProgress(assessment.roadmap_progress)}
    />
  );
}
