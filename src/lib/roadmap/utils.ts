import {
  createDefaultRoadmapProgress,
  roadmapProgressSchema,
  type RoadmapProgress,
  type RoadmapWeek,
} from "@/lib/assessment/schema";

export function taskKey(week: number, taskIndex: number) {
  return `${week}:${taskIndex}`;
}

export function parseRoadmapProgress(raw: unknown): RoadmapProgress {
  const parsed = roadmapProgressSchema.safeParse(raw);
  return parsed.success ? parsed.data : createDefaultRoadmapProgress();
}

export function isTaskComplete(progress: RoadmapProgress, week: number, taskIndex: number) {
  return progress.completedTasks.includes(taskKey(week, taskIndex));
}

export function toggleTaskInProgress(
  progress: RoadmapProgress,
  week: number,
  taskIndex: number,
  completed: boolean,
): RoadmapProgress {
  const key = taskKey(week, taskIndex);
  const completedTasks = completed
    ? progress.completedTasks.includes(key)
      ? progress.completedTasks
      : [...progress.completedTasks, key]
    : progress.completedTasks.filter((k) => k !== key);

  return { ...progress, completedTasks };
}

export function setCurrentWeekInProgress(
  progress: RoadmapProgress,
  currentWeek: number,
): RoadmapProgress {
  return { ...progress, currentWeek };
}

export type RoadmapStats = {
  totalTasks: number;
  completedTasks: number;
  percentComplete: number;
  currentWeek: number;
  weeksComplete: number;
};

export function getRoadmapStats(roadmap: RoadmapWeek[], progress: RoadmapProgress | null) {
  const totalTasks = roadmap.reduce((sum, week) => sum + week.tasks.length, 0);
  const parsed = progress ? parseRoadmapProgress(progress) : createDefaultRoadmapProgress();
  const completedTasks = parsed.completedTasks.filter((key) => {
    const [weekStr, indexStr] = key.split(":");
    const week = Number(weekStr);
    const index = Number(indexStr);
    const weekData = roadmap.find((w) => w.week === week);
    return weekData != null && index >= 0 && index < weekData.tasks.length;
  }).length;

  const weeksComplete = roadmap.filter((week) => {
    if (week.tasks.length === 0) return false;
    return week.tasks.every((_, index) => isTaskComplete(parsed, week.week, index));
  }).length;

  const percentComplete =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    percentComplete,
    currentWeek: parsed.currentWeek,
    weeksComplete,
  } satisfies RoadmapStats;
}

export function getWeekProgress(week: RoadmapWeek, progress: RoadmapProgress) {
  const completed = week.tasks.filter((_, index) =>
    isTaskComplete(progress, week.week, index),
  ).length;
  return {
    completed,
    total: week.tasks.length,
    percent: week.tasks.length > 0 ? Math.round((completed / week.tasks.length) * 100) : 0,
  };
}

export const ROADMAP_PHASES = [
  { label: "Foundation", weeks: [1, 2, 3, 4] },
  { label: "Build", weeks: [5, 6, 7, 8] },
  { label: "Apply", weeks: [9, 10, 11, 12] },
  { label: "Launch", weeks: [13, 14, 15, 16] },
] as const;
