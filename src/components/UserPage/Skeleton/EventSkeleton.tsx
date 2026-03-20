// components/events/EventSkeleton.tsx
import React from "react";

export const EventSkeleton = () => {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-12 w-64 animate-pulse rounded-md bg-gray-200" />
        <div className="h-6 w-full max-w-2xl animate-pulse rounded-md bg-gray-100" />
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse overflow-hidden rounded-2xl bg-[#f8f9fa]">
            {/* កន្លែងរូបភាព - Image Placeholder */}
            <div className="h-64 w-full bg-gray-200" />

            {/* កន្លែងព័ត៌មាន - Content Placeholder */}
            <div className="relative p-6">
              <div className="flex gap-4">
                {/* កន្លែងថ្ងៃខែ - Date Placeholder */}
                <div className="space-y-1 text-center">
                  <div className="mx-auto h-4 w-8 rounded bg-gray-200" />
                  <div className="h-8 w-10 rounded bg-gray-200" />
                </div>

                {/* កន្លែងចំណងជើង និងទីតាំង - Text Placeholder */}
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-5/6 rounded bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                  </div>
                </div>
              </div>

              {/* កន្លែងប៊ូតុងតម្លៃ - Price Badge Placeholder */}
              <div className="mt-4 flex justify-end">
                <div className="h-10 w-20 rounded-l-lg bg-gray-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
