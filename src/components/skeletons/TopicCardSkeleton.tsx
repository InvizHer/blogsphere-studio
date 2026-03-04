import { Skeleton } from "@/components/ui/skeleton";

export function TopicCardSkeleton() {
  return (
    <div className="flex aspect-square flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="h-1.5 w-full bg-muted" />
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-7 w-8 rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-3 w-16" />
          <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
