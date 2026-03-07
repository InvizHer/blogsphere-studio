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
            {/* Metadata skeleton — unified */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg" />
                <div>
                  <Skeleton className="h-2.5 w-14 mb-1" />
                  <Skeleton className="h-3.5 w-20 sm:w-24" />
                </div>
              </div>
              <Skeleton className="h-7 sm:h-8 w-px" />
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg" />
                <div>
                  <Skeleton className="h-2.5 w-10 mb-1" />
                  <Skeleton className="h-3.5 w-12 sm:w-16" />
                </div>
              </div>
              <Skeleton className="h-7 sm:h-8 w-px" />
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg" />
                <div>
                  <Skeleton className="h-2.5 w-14 mb-1" />
                  <Skeleton className="h-3.5 w-10" />
                </div>
              </div>
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
