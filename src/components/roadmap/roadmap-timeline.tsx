import { CheckCircle2 } from "lucide-react";

import type { RoadmapProgress, RoadmapWeek } from "@/lib/assessment/schema";
import { getWeekProgress, ROADMAP_PHASES } from "@/lib/roadmap/utils";
import { cn } from "@/lib/utils";

type RoadmapTimelineProps = {
  roadmap: RoadmapWeek[];
  progress: RoadmapProgress;
  onSelectWeek: (week: number) => void;
};

export function RoadmapTimeline({ roadmap, progress, onSelectWeek }: RoadmapTimelineProps) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        16-week timeline
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROADMAP_PHASES.map((phase) => (
          <div key={phase.label} className="space-y-2">
            <p className="text-sm font-semibold">{phase.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {phase.weeks.map((weekNum) => {
                const week = roadmap.find((w) => w.week === weekNum);
                if (!week) return null;

                const { percent } = getWeekProgress(week, progress);
                const isCurrent = progress.currentWeek === weekNum;
                const isComplete = percent === 100;

                return (
                  <button
                    key={weekNum}
                    type="button"
                    onClick={() => onSelectWeek(weekNum)}
                    title={`Week ${weekNum}: ${week.title}`}
                    className={cn(
                      "relative flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold tabular-nums transition",
                      isCurrent
                        ? "border-primary bg-primary/15 text-primary ring-2 ring-primary/30"
                        : isComplete
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      weekNum
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
