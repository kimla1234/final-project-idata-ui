"use client";

import React from "react";
import { EventCard } from "./EventCard";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetEventsQuery } from "@/redux/service/events";
import { EventSkeleton } from "../Skeleton/EventSkeleton";

export default function SportEvents() {
  const {
    data: events = [],
    isLoading,
    isError,
    error,
  } = useGetEventsQuery({ category: "SPORT" });

if (isLoading) {
    return <EventSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-4 text-center text-red-500">
        {error && "status" in error
          ? `Error ${error.status}`
          : "Error loading events"}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Sport Events
          </h2>
          <span className="flex items-center gap-1 rounded bg-[#f3e8ff] px-2 py-1 text-[10px] font-bold uppercase text-[#9333ea]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#9333ea]"></span>{" "}
            Upcoming
          </span>
        </div>
        <p className="text-md max-w-3xl leading-relaxed text-gray-500">
          The Sport Events feature is designed to provide users with a
          curated list of sports events.
        </p>
      </div>
        <Link
          href="/event"
          className="font-bold text-gray-500 hover:text-purple-600"
        >
          VIEW MORE
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
       {events.slice(0, 6).map((event) => (
          <Link href={`/event/${event.uuid}`} key={event.uuid}>
            <EventCard
              title={event.title}
              location={event.location_name}
              image={event.image || "/placeholder.png"} // Fallback for the image error we saw earlier
              month={new Date(event.start_date).toLocaleString("en-US", {
                month: "short",
              })}
              day={new Date(event.start_date).getDate().toString()}
              price={event.ticketTypes?.[0]?.price.toString() || "0"}
              isFree={event.ticketTypes?.[0]?.price === 0}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
