import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <div className="space-y-2">
        <Skeleton className="h-12 w-64" /> {/* Title */}
        <Skeleton className="h-4 w-full max-w-xl" /> {/* Description */}
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md bg-white">
        <div className="flex w-max space-x-5">
          {/* Render 4 skeletons: 3 full ones, the 4th will be partially cut off */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[350px] overflow-hidden rounded-xl border border-gray-100 bg-white ">
              <div className="relative h-64 w-full">
                {/* Main Image Skeleton */}
                <Skeleton className="h-full w-full" />

                {/* Date Badge Skeleton */}
                <div className="absolute left-2 top-2 flex flex-col items-center rounded-lg bg-white/90 px-3 py-2">
                  <Skeleton className="mb-1 h-5 w-6" />
                  <Skeleton className="h-3 w-8" />
                </div>

                {/* Floating Info Box Skeleton */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-lg border border-white/20 bg-gray-200/50 p-3 backdrop-blur-sm">
                    <Skeleton className="mb-2 h-5 w-3/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
