import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

import { AnalysisResults } from "@/components/analysis/analysis-results";
import { StatusPanel } from "@/components/ui/status-panel";
import { AnalysisPageSkeleton } from "@/components/ui/page-skeletons";
import { assessmentProfileSchema } from "@/lib/assessment/schema";
import { parseRoadmapProgress } from "@/lib/roadmap/utils";
import { getAssessment } from "@/lib/api/assessment.functions";
import { Button } from "@/components/ui/button";

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
  return <AnalysisPageSkeleton />;
}

function AnalysisPage() {
  const { assessment } = Route.useLoaderData();
  const profile = assessmentProfileSchema.parse(assessment.profile);

  if (assessment.status === "analyzing" || assessment.status === "pending") {
    return (
      <StatusPanel
        variant="loading"
        icon={<Loader2 className="h-7 w-7 animate-spin" />}
        title="AI analysis in progress"
        description="We're comparing your profile against an ideal industry candidate and building your personalized roadmap. This usually takes under 30 seconds."
        actions={
          <Link to="/dashboard">
            <Button variant="secondary" size="sm">
              Back to dashboard
            </Button>
          </Link>
        }
      />
    );
  }

  if (assessment.status === "failed") {
    return (
      <StatusPanel
        variant="error"
        icon={<AlertTriangle className="h-7 w-7 text-destructive" />}
        title="Analysis failed"
        description="Something went wrong while generating your career mirror. You can retry with a new assessment or check back later from the dashboard."
        actions={
          <>
            <Link to="/start">
              <Button size="sm" className="glow">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="sm">
                Dashboard
              </Button>
            </Link>
          </>
        }
      />
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
