import { Skeleton } from "@/components/ui/skeleton";

export function TopicCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="h-1 w-full bg-muted" />
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-7 w-8" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center justify-between border-t border-border/50 pt-3">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}
