import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function SkeletonBlock({ className }: { className?: string }) {
  return <Skeleton className={cn("rounded-2xl", className)} />;
}

export function DashboardPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>
      <SkeletonBlock className="h-48 w-full" />
      <SkeletonBlock className="h-36 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
      <SkeletonBlock className="h-64 w-full" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function AnalysisPageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-28 w-36 rounded-2xl" />
      </div>
      <SkeletonBlock className="h-28 w-full" />
      <Skeleton className="h-10 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function RoadmapPageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-56" />
      </div>
      <SkeletonBlock className="h-28 w-full" />
      <SkeletonBlock className="h-44 w-full" />
      <SkeletonBlock className="h-36 w-full" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
