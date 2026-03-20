"use client";

import React from "react";

import { MapPin } from "lucide-react";
import { EventCardComing } from "./EventCardComing";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EventCardSkeleton } from "../Skeleton/EventCardSkeleton";
import { useFetchEventComingQuery } from "@/redux/service/events";
import Link from "next/link";

export default function EventComing() {
  const { data: events, isLoading, error } = useFetchEventComingQuery();

  if (isLoading) return <EventCardSkeleton />;
  if (error) return <div>Error loading events</div>;
  if (!events || events.length === 0) return <div>No events coming</div>;

  // Map backend event to EventCardModern props
  const mapEventToCardProps = (event: any) => {
    const startDate = new Date(event.start_date);
    const day = startDate.getDate();
    const month = startDate
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    const time = `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(event.end_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    // Get attendees images if available, else empty
    const attendees = event.attendees || []; // adapt if your backend returns attendee URLs

    return {
      image: `${event.image}`, // adapt based on your storage
      date: `${day} ${month}`,
      title: event.title,
      time,
      location: event.location_name,
      distance: "1 km", // optional: calculate if you have location data
      attendees,
    };
  };

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Upcoming Events
          </h2>
          <span className="flex items-center gap-1 rounded bg-[#f3e8ff] px-2 py-1 text-[10px] font-bold uppercase text-[#9333ea]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#9333ea]"></span>{" "}
            Upcoming
          </span>
        </div>
        <p className="text-md max-w-3xl leading-relaxed text-gray-500">
          The Upcoming Events feature is designed to provide users with a
          curated list of sports events.
        </p>
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md bg-white">
        <div className="flex w-max space-x-5">
          {events.map((event) => (
            <div key={event.uuid} className="w-[350px]">
              {" "}
              {/* កំណត់ទំហំ Card នីមួយៗឱ្យថេរ */}
              <Link href={`/event/${event.uuid}`} key={event.uuid}>
              <EventCardComing {...mapEventToCardProps(event)} />
              </Link>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
