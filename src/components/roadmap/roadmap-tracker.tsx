import { useState } from "react";
import { CalendarDays, CheckCircle2, Map } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { updateRoadmapProgress } from "@/lib/api/roadmap.functions";
import type { RoadmapProgress, RoadmapWeek } from "@/lib/assessment/schema";
import {
  getRoadmapStats,
  getWeekProgress,
  isTaskComplete,
  parseRoadmapProgress,
  setCurrentWeekInProgress,
  toggleTaskInProgress,
} from "@/lib/roadmap/utils";
import { cn } from "@/lib/utils";

import { RoadmapTimeline } from "./roadmap-timeline";

type RoadmapTrackerProps = {
  assessmentId: string;
  roadmap: RoadmapWeek[];
  initialProgress: RoadmapProgress | null;
  compact?: boolean;
};

export function RoadmapTracker({
  assessmentId,
  roadmap,
  initialProgress,
  compact = false,
}: RoadmapTrackerProps) {
  const [progress, setProgress] = useState(() => parseRoadmapProgress(initialProgress));
  const [saving, setSaving] = useState(false);
  const stats = getRoadmapStats(roadmap, progress);

  const persistProgress = async (next: RoadmapProgress) => {
    const previous = progress;
    setProgress(next);
    setSaving(true);
    try {
      await updateRoadmapProgress({
        data: { assessmentId, progress: next },
      });
    } catch {
      setProgress(previous);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTask = (week: number, taskIndex: number, checked: boolean) => {
    void persistProgress(toggleTaskInProgress(progress, week, taskIndex, checked));
  };

  const handleSelectWeek = (week: number) => {
    if (week === progress.currentWeek) return;
    void persistProgress(setCurrentWeekInProgress(progress, week));
  };

  const defaultOpenWeek = `week-${progress.currentWeek}`;

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Map className="h-4 w-4 text-primary" />
              Overall roadmap progress
              {saving && <span className="text-xs">· Saving…</span>}
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {stats.completedTasks}
              <span className="text-lg font-normal text-muted-foreground">
                {" "}
                / {stats.totalTasks} tasks
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary tabular-nums">
              {stats.percentComplete}%
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.weeksComplete} of {roadmap.length} weeks complete
            </p>
          </div>
        </div>
        <Progress value={stats.percentComplete} className="h-2" />
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          Started {new Date(progress.startedAt).toLocaleDateString()} · Current focus: Week{" "}
          {progress.currentWeek}
        </p>
      </div>

      {!compact && (
        <RoadmapTimeline
          roadmap={roadmap}
          progress={progress}
          onSelectWeek={handleSelectWeek}
        />
      )}

      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpenWeek}
        className="space-y-2"
      >
        {roadmap.map((week) => {
          const weekProgress = getWeekProgress(week, progress);
          const isCurrent = week.week === progress.currentWeek;
          const isComplete = weekProgress.percent === 100;

          return (
            <AccordionItem
              key={week.week}
              value={`week-${week.week}`}
              className={cn(
                "glass overflow-hidden rounded-xl border px-4",
                isCurrent && "border-primary/30",
                isComplete && "border-primary/20",
              )}
            >
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex flex-1 flex-wrap items-center gap-2 text-left">
                  <Badge
                    variant="outline"
                    className={cn(
                      isCurrent
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : isComplete
                          ? "border-primary/20 bg-primary/5 text-primary"
                          : "",
                    )}
                  >
                    Week {week.week}
                  </Badge>
                  <span className="font-semibold">{week.title}</span>
                  <span className="text-xs text-muted-foreground">· {week.focusArea}</span>
                  <span className="ml-auto mr-2 text-xs tabular-nums text-muted-foreground">
                    {weekProgress.completed}/{weekProgress.total}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Progress value={weekProgress.percent} className="mb-4 h-1" />
                <ul className="space-y-3">
                  {week.tasks.map((task, taskIndex) => {
                    const checked = isTaskComplete(progress, week.week, taskIndex);
                    const id = `task-${week.week}-${taskIndex}`;

                    return (
                      <li key={id} className="flex items-start gap-3">
                        <Checkbox
                          id={id}
                          checked={checked}
                          disabled={saving}
                          onCheckedChange={(value) =>
                            handleToggleTask(week.week, taskIndex, value === true)
                          }
                          className="mt-0.5"
                        />
                        <label
                          htmlFor={id}
                          className={cn(
                            "cursor-pointer text-sm leading-relaxed",
                            checked
                              ? "text-muted-foreground line-through"
                              : "text-foreground",
                          )}
                        >
                          {task}
                        </label>
                        {checked && (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        )}
                      </li>
                    );
                  })}
                </ul>
                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleSelectWeek(week.week)}
                    disabled={saving}
                    className="mt-4 text-xs text-primary hover:underline disabled:opacity-50"
                  >
                    Set as current week
                  </button>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
