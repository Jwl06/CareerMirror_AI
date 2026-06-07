import { Link } from "@tanstack/react-router";
import { ArrowRight, Map, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { RoadmapSummary } from "@/lib/api/roadmap.functions";

type RoadmapProgressCardProps = {
  summary: RoadmapSummary;
};

export function RoadmapProgressCard({ summary }: RoadmapProgressCardProps) {
  const { stats, progress, targetRole, assessmentId } = summary;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Map className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Roadmap progress</h2>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Week {progress.currentWeek}
            </Badge>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Target className="h-3.5 w-3.5" />
            {targetRole}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary tabular-nums">{stats.percentComplete}%</p>
          <p className="text-xs text-muted-foreground">
            {stats.completedTasks}/{stats.totalTasks} tasks done
          </p>
        </div>
      </div>

      <Progress value={stats.percentComplete} className="mb-2 h-2" />
      <p className="mb-4 text-xs text-muted-foreground">
        {stats.weeksComplete} of 16 weeks fully completed
      </p>

      <Link to="/roadmap/$id" params={{ id: assessmentId }}>
        <Button variant="secondary" className="w-full sm:w-auto">
          Open full roadmap
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
