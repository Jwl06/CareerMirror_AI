import { CheckCircle2 } from "lucide-react";

import type { RoadmapProgress, RoadmapWeek } from "@/lib/assessment/schema";
import {
  getPhaseProgress,
  getWeekProgress,
  ROADMAP_PHASES,
} from "@/lib/roadmap/utils";
import { cn } from "@/lib/utils";

type RoadmapTimelineProps = {
  roadmap: RoadmapWeek[];
  progress: RoadmapProgress;
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
  compact?: boolean;
};

export function RoadmapTimeline({
  roadmap,
  progress,
  selectedWeek,
  onSelectWeek,
  compact = false,
}: RoadmapTimelineProps) {
  return (
    <div className={cn("glass rounded-2xl p-5", compact && "p-4")}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          4-month timeline
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary ring-2 ring-primary/30" />
            Viewing
          </span>
          <span className="mx-2 text-border">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border-2 border-primary bg-transparent" />
            Current focus
          </span>
        </p>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className={cn("grid min-w-[640px] gap-4", compact ? "sm:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4")}>
          {ROADMAP_PHASES.map((phase) => {
            const phaseProgress = getPhaseProgress(roadmap, progress, phase);

            return (
              <div key={phase.label} className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{phase.label}</p>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {phaseProgress.percent}%
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${phaseProgress.percent}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {phaseProgress.weeksComplete}/{phaseProgress.weekCount} weeks done
                  </p>
                </div>

                <div className="relative flex items-center gap-1">
                  <div className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-border/80" />
                  <div className="relative flex flex-wrap gap-1.5">
                    {phase.weeks.map((weekNum) => {
                      const week = roadmap.find((entry) => entry.week === weekNum);
                      if (!week) return null;

                      const { percent } = getWeekProgress(week, progress);
                      const isSelected = selectedWeek === weekNum;
                      const isCurrentFocus = progress.currentWeek === weekNum;
                      const isComplete = percent === 100;

                      return (
                        <button
                          key={weekNum}
                          type="button"
                          onClick={() => onSelectWeek(weekNum)}
                          title={`Week ${weekNum}: ${week.title}`}
                          aria-label={`Week ${weekNum}: ${week.title}`}
                          aria-current={isSelected ? "step" : undefined}
                          className={cn(
                            "relative z-10 flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold tabular-nums transition",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/40"
                              : isComplete
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
                            isCurrentFocus &&
                              !isSelected &&
                              "ring-2 ring-primary/25 ring-offset-2 ring-offset-background",
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
