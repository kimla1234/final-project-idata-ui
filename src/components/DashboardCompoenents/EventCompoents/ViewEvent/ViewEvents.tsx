"use client";
import React, { useEffect, useState } from "react";
import { Mail, Send, Copy, Pencil } from "lucide-react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import OverviewEvents from "./OverviewEvents";
import TicketEvents from "./TicketEvents";
import ReportEvents from "./ReportEvents";
import { useGetEventsByUuidQuery } from "@/redux/service/events";

// 1. Change this interface to expect the ID (string) from the URL/Parent
interface ViewEventsProps {
  eventsId: string;
}

export default function ViewEvents({ eventsId }: ViewEventsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "overview";

  // 2. Pass the eventsId (string) to the query hook
  const { data: event, isLoading, error } = useGetEventsByUuidQuery(eventsId);

  const [currentTab, setCurrentTab] = useState(tabParam);

  useEffect(() => {
    setCurrentTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    // Fixed: uses the eventsId variable
    router.push(`/events/${eventsId}?tab=${value}`, { scroll: false });
  };

  if (isLoading)
    return <div className="p-10 text-center">Loading event details...</div>;
  if (error || !event)
    return (
      <div className="p-10 text-center text-red-500">Event not found.</div>
    );

  return (
    <div className="grid grid-cols-3 items-start gap-4">
      <div className="col-span-2 flex w-full flex-col gap-6">
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full space-y-4"
        >
          <TabsList className="w-full space-x-1 overflow-x-auto rounded-md bg-slate-200 py-2">
            <TabsTrigger value="overview" className="w-full">
              Overview
            </TabsTrigger>
            <TabsTrigger value="ticket" className="w-full">
              Ticket
            </TabsTrigger>
            <TabsTrigger value="booking" className="w-full">
              Booking
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="duration-500 animate-in fade-in slide-in-from-bottom-4"
          >
            {/* Ensure OverviewEvents is updated to accept eventData prop */}
            <OverviewEvents eventData={event} />
          </TabsContent>

          <TabsContent
            value="ticket"
            className="duration-500 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="h-auto w-full rounded-md bg-white p-7 text-slate-600">
              <TicketEvents ticketTypes={event.ticketTypes} />
            </div>
          </TabsContent>

          <TabsContent
            value="booking"
            className="duration-500 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="h-auto w-full rounded-md bg-white p-7 text-slate-600">
              <ReportEvents eventData={event} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="sticky top-[80px] space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Share this Event
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <button className="hover:text-blue-600">
                <FaFacebook size={20} />
              </button>
              <button className="hover:text-blue-700">
                <FaLinkedin size={20} />
              </button>
              <button className="hover:text-red-500">
                <Mail size={20} />
              </button>
              <button className="hover:text-blue-400">
                <Send size={20} />
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-800">Event URL</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 overflow-hidden truncate rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600">
                  {typeof window !== "undefined" ? window.location.href : ""}
                </div>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Category</h2>
            <Pencil size={20} className="cursor-pointer text-blue-500" />
          </div>
          <div className="mt-4 font-medium text-gray-600">
            {event.categoryName}
          </div>
        </div>
      </div>
    </div>
  );
}
