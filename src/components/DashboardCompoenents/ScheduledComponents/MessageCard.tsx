import React from "react";
import { Users, Tag, Send } from "lucide-react"; // Optional: using lucide-react for cleaner icons
import { LuSendHorizontal } from "react-icons/lu";
interface MessageCardProps {
  title: string;
  content: string; // បន្ថែមបន្ទាត់នេះ
  date: string;
  time: string;
  recipientsCount: number;
  tagsCount: number;
  active?: boolean;
  statusColor: string;
}

export default function MessageCard({
  title,
  content,
  date,
  time,
  recipientsCount,
  tagsCount,
  active,
  statusColor,
}: MessageCardProps) {
  return (
    <div
      className={`max-w-md rounded-md border transition-all ${
        active
          ? "border-purple-500 bg-white shadow-lg ring-1 ring-purple-500"
          : "border-gray-200 bg-gray-50/30 hover:border-gray-200"
      }`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between rounded-t-md bg-gray-2 p-2.5">
        <h3 className="text-[18px] font-semibold tracking-tight text-[#374177]">
          {title}
        </h3>
        <span className="${color} rounded-sm bg-[#C6F6D5] px-3 py-1 text-sm font-medium text-[#2F855A]">
          {date}
        </span>
      </div>

      {/* Body Text */}
      <div className="px-2.5 py-1">
        <p className="line-clamp-2 text-[14px] leading-snug text-slate-500">
          {content}dd
        </p>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between border-t border-gray-50 px-2.5 py-1 text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Users size={18} className="text-[#6B7280]" />
            <span className="text-lg">{recipientsCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag size={18} className="rotate-90 text-[#6B7280]" />
            <span className="text-lg">{tagsCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <LuSendHorizontal size={16} className="-rotate-10" />
          <span className="text-base uppercase tracking-wide">{time}</span>
        </div>
      </div>
    </div>
  );
}
