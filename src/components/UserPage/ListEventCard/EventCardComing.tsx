import React from "react";
import Image from "next/image";

import { FiMapPin } from "react-icons/fi";

interface EventCardModernProps {
  image: string;
  date: string; // format: "23 AUG"
  title: string;
  time: string;
  location: string;
  distance: string;
  attendees: string[];
}

export function EventCardComing({
  image,
  date,
  title,
  time,
  distance,
  attendees,
  location
}: EventCardModernProps) {
  const [day, month] = date.split(" ");

  return (
    <div className="w-full cursor-pointer max-w-[360px] overflow-hidden rounded-xl border border-gray-100 bg-white font-sans shadow-xl">
      {/* Image Section */}
      <div className="relative h-64 w-full">
        <Image unoptimized src={image} alt={title} fill className="object-cover" />

        {/* Date Badge */}
        <div className="absolute left-2 top-2 flex min-w-[50px] flex-col items-center rounded-lg bg-white/90 px-3 py-2 shadow-sm backdrop-blur-md">
          <span className="text-lg font-bold leading-none text-primary">
            {day}
          </span>
          <span className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-gray-500">
            {month}
          </span>
        </div>

        {/* Floating Blur Info Box (The "Pic Blur" Style) */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-lg border border-white/20 bg-[#2D3E5E]/50 p-2 shadow-2xl backdrop-blur-sm">
            {/* Top Label Text */}
            <div className="text-md line-clamp-1
              font-medium text-white/90">
              {title}
            </div>
            <div className="flex space-x-2 items-center ">
                <FiMapPin className="text-gray-5"/>
                <div className="flex text-gray-5 line-clamp-1">{location}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
