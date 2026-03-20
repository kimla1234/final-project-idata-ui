import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { FollowerPointerCard } from "@/components/DashboardCompoenents/ui/following-pointer";

// 1. Add a helper to check if the URL is valid
const isValidUrl = (url: string) => {
  try {
    return url.startsWith("/") || url.startsWith("http");
  } catch {
    return false;
  }
};

interface EventCardProps {
  image: string;
  month: string;
  day: string;
  title: string;
  location: string;
  price: string;
  isFree?: boolean;
}

export function EventCard({
  image,
  month,
  day,
  title,
  location,
  price,
  isFree,
}: EventCardProps) {
  const safeImage = image && isValidUrl(image) ? image : "/placeholder.png";
  return (
    <div className="group flex min-h-[340px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 transition-all">
      {/* ផ្នែកខាងលើ (រូបភាព និងព័ត៌មាន) */}
      <div className="flex-grow">
        <div className="relative h-52 w-full">
          <Image
            unoptimized
            src={safeImage} // Use the safe version here
            alt={title}
            fill
            className="rounded-t-xl object-cover"
            // When using 'fill', remember the parent container needs 'relative'
          />
        </div>

        <div className="flex gap-4 p-4">
          <div className="min-w-[50px] text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-gray-800">
              {month}
            </p>
            <p className="text-3xl font-black text-gray-800">{day}</p>
          </div>

          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <h3 className="line-clamp-2 text-[17px] font-bold leading-tight text-gray-800">
                {title}
              </h3>
              <div className="flex items-start gap-1 text-gray-400">
                <MapPin size={14} className="mt-1 flex-shrink-0" />
                <p className="line-clamp-1 text-[14px] leading-relaxed">
                  {location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ២. ប្រើ mt-auto ដើម្បីរុញវាទៅបាតក្រោមបង្អស់ */}
      <div className="mt-auto flex justify-end">
        <span
          className={`rounded-br-lg rounded-tl-lg px-6 py-1 text-sm font-bold text-white ${
            isFree ? "bg-[#76c769]" : "bg-[#b03a2e]"
          }`}
        >
          {isFree ? "FREE" : `${price}$`}
        </span>
      </div>
    </div>
  );
}
