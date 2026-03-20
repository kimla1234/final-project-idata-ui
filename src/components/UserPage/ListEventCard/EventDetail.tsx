"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  Minus,
  Plus,
  ArrowRight,
  Share2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { BookingModal } from "../Bookings/BookingModal";
import { useGetEventsByUuidQuery } from "@/redux/service/events";
import LoginSkeleton from "../Skeleton/LoginSkeletonEventDetail";
import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/feature/auth/authSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // Assuming Shadcn UI
import { useGetOrganizerByIdQuery } from "@/redux/service/organizer";

// --- Types ---
interface TicketSelection {
  [key: string]: number;
}

interface TicketProps {
  title: string;
  price: string;
  name: string;
  isSoldOut?: boolean;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
}

interface TicketType {
  id: number;
  name: string;
  price: number;
  total_quantity: number;
  sold_quantity: number;
}

interface EventData {
  id: number;
  uuid: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  image: string;
  latitude: string;
  longitude: string;
  imagesEvent: string[];
  location_name: string;
  categoryName: string;
  ticketTypes: TicketType[];
}

export default function EventDetail({ uuid }: { uuid: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: event, isLoading, error } = useGetEventsByUuidQuery(uuid);
  // Fetch organizer dynamically based on event.organizer.id
  const organizerId = event?.organizerId.toString();
  const { data: organizer } = useGetOrganizerByIdQuery(organizerId ?? "", {
    skip: !organizerId, // skip API call if no organizerId
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [ticketSelection, setTicketSelection] = useState<TicketSelection>({});

  if (isLoading) return <LoginSkeleton />;
  if (error || !event) return <div className="p-10">Event not found</div>;

  const date = new Date(event.start_date)
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");
  //const time = new Date(event.time).toLocaleTimeString();

  const handleUpdateQuantity = (type: string, delta: number) => {
    const ticket = event.ticketTypes.find((t) => t.name.toLowerCase() === type);

    const maxQty = ticket?.total_quantity ?? 0;
    const current = ticketSelection[type] ?? 0;

    setTicketSelection((prev) => ({
      ...prev,
      [type]: Math.max(0, Math.min(current + delta, maxQty)),
    }));
  };

  const subTotal = event.ticketTypes.reduce((sum, t) => {
    const qty = ticketSelection[t.name.toLowerCase()] || 0;
    return sum + qty * t.price;
  }, 0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % event.imagesEvent.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + event.imagesEvent.length) % event.imagesEvent.length,
    );
  };

  const formatTime = (time: string) => {
    if (!time) return "";

    const date = new Date(`1970-01-01T${time}`);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Link
          href="/"
          className="mb-6 flex w-fit items-center gap-2 font-medium text-purple-700 hover:underline"
        >
          <ChevronLeft size={20} /> Back to all events
        </Link>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* LEFT */}
          <div className="w-full space-y-8 lg:w-[60%]">
            <div className="space-y-3">
              <div className="relative">
                {/* Event Image */}
                <Image
                  unoptimized
                  width={2000}
                  height={2000}
                  src={event.image || "/events/01.png"}
                  alt={event.title}
                  className="h-[375px] w-full rounded-2xl object-cover"
                />

                {/* Organizer Profile */}
                {/* Organizer Profile */}
                <div className="absolute left-4 top-4 flex items-center  rounded-full bg-white/90 px-1 py-1 shadow backdrop-blur">
                  <Image
                    unoptimized
                    src={organizer?.logoImage || "/avatar/default.png"} // use fetched organizer
                    alt={organizer?.name || "Organizer"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm px-3 font-medium text-gray-800">
                    {organizer?.name || "Organizer"}
                  </span>
                </div>

                {/* Share Button */}
                <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                  <Share2 size={20} />
                </button>
              </div>

              <div className="w-full">
                {event.imagesEvent && event.imagesEvent.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {event.imagesEvent.slice(0, 3).map((img, index) => {
                      const isThirdImage = index === 2;
                      const remainingCount = event.imagesEvent.length - 3;

                      return (
                        <div
                          key={index}
                          onClick={() => openModal(index)}
                          className="group relative h-[120px] cursor-pointer overflow-hidden rounded-2xl border bg-gray-100"
                        >
                          <Image
                            unoptimized
                            fill
                            src={img}
                            alt={`${event.title}-${index}`}
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {isThirdImage && remainingCount > 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 transition-colors group-hover:bg-black/60">
                              <span className="text-2xl font-bold text-white">
                                +{remainingCount}
                              </span>
                              <span className="text-xs font-medium text-white/90">
                                more photos
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}

                {/* --- Image Viewer Dialog --- */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogContent className="max-w-5xl border-none bg-transparent p-4 shadow-none outline-none">
                    <DialogTitle className="sr-only">View Image</DialogTitle>

                    <div className="relative flex h-[70vh] w-full items-center justify-center rounded-lg">
                      {/* Main Image */}
                      <div className="relative h-[60vh] w-full rounded-2xl bg-red-50">
                        <Image
                          unoptimized
                          src={event.imagesEvent[currentIndex]}
                          alt="Full size"
                          fill
                          className="h-full w-full rounded-2xl object-cover"
                        />
                      </div>

                      {/* Navigation Buttons */}
                      {event.imagesEvent.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-white/40"
                          >
                            <ChevronLeft size={32} />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-white/40"
                          >
                            <ChevronRight size={32} />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      <div className="absolute bottom-[-30px] font-medium text-white">
                        {currentIndex + 1} / {event.imagesEvent.length}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="space-y-6 rounded-xl border bg-gray-50 p-6">
              <h2 className="text-2xl font-semibold text-gray-600">
                {event.title}
              </h2>

              <div className="flex gap-3 text-gray-600">
                <div className="flex items-center gap-1 rounded-sm bg-purple-100/80 px-2 py-0.5">
                  <Calendar size={18} /> {date}
                </div>
                <div className="flex items-center gap-2 rounded-sm bg-green-100/80 px-2 py-0.5">
                  <Clock size={18} />
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </div>
                <div className="flex items-center gap-2 rounded-sm bg-red-100/80 px-2 py-0.5">
                  {event.categoryName}
                </div>
              </div>

              <p
                className="prose prose-[16px] w-full max-w-none rounded-lg bg-gray-50 text-gray-700 [&_ol]:my-1 [&_p]:my-0.5 [&_ul]:my-0.5"
                dangerouslySetInnerHTML={{
                  __html: event.description || "No description provided.",
                }}
              />

              {/* បន្ថែមផ្នែកនេះនៅខាងក្រោម <p className="text-gray-600">{event.description}</p> */}
              <div className="mt-8 space-y-3">
                <h3 className="text-xl font-semibold text-gray-600">
                  ទីតាំងព្រឹត្តិការណ៍
                </h3>
                <div className="prose-lg flex items-center gap-3 text-gray-600">
                  <MapPin size={18} className="text-red-600" />
                  {event.location_name}
                </div>
                <div className="h-[300px] w-full overflow-hidden rounded-2xl border">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${event.latitude},${event.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="h-fit w-full rounded-xl border bg-purple-50 p-4 lg:sticky lg:top-24 lg:w-[40%]">
            <div className="space-y-4">
              {event.ticketTypes.map((t) => {
                const key = t.name.toLowerCase();
                return (
                  <TicketRow
                    key={t.id}
                    title={`${t.name} - Ticket`}
                    name={event.title}
                    price={`$${t.price}`}
                    quantity={ticketSelection[key] || 0}
                    isSoldOut={t.sold_quantity === t.total_quantity}
                    onIncrease={() => handleUpdateQuantity(key, 1)}
                    onDecrease={() => handleUpdateQuantity(key, -1)}
                  />
                );
              })}

              <div className="mt-8 border-t pt-6">
                <div className="mb-4 flex justify-between">
                  <span>Sub Total</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ${subTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  disabled={subTotal === 0}
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full rounded-xl bg-[#3d021e] py-4 font-bold text-white"
                >
                  Place Order <ArrowRight className="ml-2 inline" />
                </button>

                <BookingModal
                  isOpen={isBookingModalOpen}
                  onClose={() => setIsBookingModalOpen(false)}
                  ticketSelection={ticketSelection}
                  subTotal={subTotal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TicketRow ---
function TicketRow({
  title,
  price,
  name,
  isSoldOut,
  quantity = 0,
  onIncrease,
  onDecrease,
}: TicketProps) {
  return (
    <div className="flex justify-between rounded-xl border bg-white p-3">
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="mb-1 text-sm text-gray-500">{name}</p>
        <div className="flex gap-2">
          <span className="rounded bg-purple-100/70 px-2 font-bold text-purple-700">
            {price}
          </span>
          {isSoldOut && (
            <span className="flex items-center rounded bg-red-100/70 px-2 text-sm font-medium text-red-600">
              SOLD OUT
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-3 rounded-md bg-purple-50 p-1">
          <button onClick={onDecrease} disabled={quantity === 0}>
            <Minus />
          </button>
          <span className="rounded-md border bg-white px-2 py-0.5 font-bold">
            {quantity}
          </span>
          <button onClick={onIncrease} disabled={isSoldOut}>
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}
