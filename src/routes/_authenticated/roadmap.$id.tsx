import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Map } from "lucide-react";

import { RoadmapTracker } from "@/components/roadmap/roadmap-tracker";
import { PageHeader } from "@/components/ui/page-header";
import { RoadmapPageSkeleton } from "@/components/ui/page-skeletons";
import { getRoadmapSummary } from "@/lib/api/roadmap.functions";
import { scoreColorClass } from "@/lib/dashboard/utils";

export const Route = createFileRoute("/_authenticated/roadmap/$id")({
  head: () => ({
    meta: [{ title: "Roadmap — CareerMirror AI" }],
  }),
  loader: async ({ params }) => {
    const summary = await getRoadmapSummary({ data: { id: params.id } });
    return { summary };
  },
  component: RoadmapPage,
  pendingComponent: RoadmapPending,
});

function RoadmapPending() {
  return <RoadmapPageSkeleton />;
}

function RoadmapPage() {
  const { summary } = Route.useLoaderData();

  return (
    <div className="page-enter mx-auto max-w-4xl space-y-6">
      <PageHeader
        back={{ to: "/dashboard", label: "Dashboard" }}
        eyebrow={
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Map className="h-5 w-5" />
            <span className="text-xs font-medium uppercase tracking-wide">
              4-month learning plan
            </span>
          </div>
        }
        title={
          <>
            Your <span className="gradient-text">Roadmap</span>
          </>
        }
        subtitle={`${summary.targetRole} · Track tasks week by week to close your skill gaps`}
        action={
          summary.readinessScore != null ? (
            <div className="glass rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-muted-foreground">Readiness</p>
              <p
                className={`text-3xl font-bold tabular-nums ${scoreColorClass(summary.readinessScore)}`}
              >
                {summary.readinessScore}
              </p>
            </div>
          ) : undefined
        }
      />

      <RoadmapTracker
        assessmentId={summary.assessmentId}
        roadmap={summary.roadmap}
        initialProgress={summary.progress}
      />

      <div className="flex justify-center pb-4">
        <Link
          to="/analysis/$id"
          params={{ id: summary.assessmentId }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary"
        >
          View full career analysis
          <ArrowLeft className="h-3 w-3 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
