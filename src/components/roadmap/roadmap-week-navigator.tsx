import { ChevronLeft, ChevronRight, Crosshair } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { RoadmapProgress, RoadmapWeek } from "@/lib/assessment/schema";
import {
  clampWeek,
  getPhaseForWeek,
  getWeekProgress,
} from "@/lib/roadmap/utils";
import { cn } from "@/lib/utils";

type RoadmapWeekNavigatorProps = {
  roadmap: RoadmapWeek[];
  progress: RoadmapProgress;
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
  onSetCurrentWeek: (week: number) => void;
  saving?: boolean;
  compact?: boolean;
};

export function RoadmapWeekNavigator({
  roadmap,
  progress,
  selectedWeek,
  onSelectWeek,
  onSetCurrentWeek,
  saving = false,
  compact = false,
}: RoadmapWeekNavigatorProps) {
  const totalWeeks = roadmap.length;
  const weekData = roadmap.find((week) => week.week === selectedWeek);
  const phase = getPhaseForWeek(selectedWeek);
  const weekProgress = weekData ? getWeekProgress(weekData, progress) : null;
  const isCurrentFocus = progress.currentWeek === selectedWeek;

  const goToWeek = (week: number) => {
    onSelectWeek(clampWeek(week, totalWeeks));
  };

  if (!weekData) return null;

  return (
    <div className={cn("glass rounded-2xl p-5", compact && "p-4")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">
              {phase.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Week {selectedWeek} of {totalWeeks}
            </span>
            {isCurrentFocus && (
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                <Crosshair className="mr-1 h-3 w-3" />
                Current focus
              </Badge>
            )}
          </div>

          <div>
            <h3 className={cn("font-semibold", compact ? "text-base" : "text-lg")}>
              {weekData.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{weekData.focusArea}</p>
          </div>

          {weekProgress && (
            <div className="max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Week progress</span>
                <span className="tabular-nums">
                  {weekProgress.completed}/{weekProgress.total} tasks
                </span>
              </div>
              <Progress value={weekProgress.percent} className="h-1.5" />
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={selectedWeek <= 1 || saving}
            onClick={() => goToWeek(selectedWeek - 1)}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={selectedWeek >= totalWeeks || saving}
            onClick={() => goToWeek(selectedWeek + 1)}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isCurrentFocus && (
        <button
          type="button"
          onClick={() => onSetCurrentWeek(selectedWeek)}
          disabled={saving}
          className="mt-4 text-xs text-primary hover:underline disabled:opacity-50"
        >
          Set week {selectedWeek} as current focus
        </button>
      )}
    </div>
  );
}
