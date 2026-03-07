import { Skeleton } from "@/components/ui/skeleton";
import { PublicHeader } from "@/components/PublicHeader";

export function PostDetailSkeleton() {
  return (
    <>
      <PublicHeader />
      <div className="pt-20 md:pt-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="py-10 md:py-14">
            <div className="flex gap-2 mb-5">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
            <Skeleton className="h-12 w-4/5 mb-3" />
            <Skeleton className="h-10 w-3/5 mb-8" />
            {/* Desktop metadata skeleton */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-px" />
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div>
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
            {/* Mobile metadata skeleton */}
            <div className="flex sm:hidden items-center gap-4">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-20" />
              <span className="ml-auto" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
          <div className="h-px w-full bg-border/60" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14">
        <div className="lg:flex lg:gap-10 xl:gap-14">
          <div className="min-w-0 flex-1 lg:max-w-3xl space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-48 w-full rounded-xl mt-4" />
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <aside className="hidden lg:block lg:w-80 xl:w-96">
            <div className="sticky top-24 space-y-6">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
