import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Map } from "lucide-react";

import { RoadmapTracker } from "@/components/roadmap/roadmap-tracker";
import { getRoadmapSummary } from "@/lib/api/roadmap.functions";
import { Skeleton } from "@/components/ui/skeleton";

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
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  );
}

function RoadmapPage() {
  const { summary } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to="/dashboard"
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Dashboard
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Map className="h-5 w-5" />
              <span className="text-xs font-medium uppercase tracking-wide">
                4-month learning plan
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Your <span className="gradient-text">Roadmap</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {summary.targetRole} · Track tasks week by week to close your skill gaps
            </p>
          </div>
          {summary.readinessScore != null && (
            <div className="glass rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-muted-foreground">Readiness</p>
              <p className="text-3xl font-bold text-primary tabular-nums">
                {summary.readinessScore}
              </p>
            </div>
          )}
        </div>
      </div>

      <RoadmapTracker
        assessmentId={summary.assessmentId}
        roadmap={summary.roadmap}
        initialProgress={summary.progress}
      />

      <div className="flex justify-center pb-4">
        <Link
          to="/analysis/$id"
          params={{ id: summary.assessmentId }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          View full career analysis
          <ArrowLeft className="h-3 w-3 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
