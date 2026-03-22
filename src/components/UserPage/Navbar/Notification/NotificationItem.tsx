import React from 'react';
import { Bell, Trash2, ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  title: string;
  desc: string;
  time: string;
  isNew?: boolean;
}

export default function NotificationItem({
  title,
  desc,
  time,
  isNew = false,
}: NotificationItemProps) {
  return (
    <div className="group relative perspective-1000">

      {isNew && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[28px] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
      )}
      
      <div className={cn(
        "relative flex items-center gap-5 p-5 rounded-[26px] transition-all duration-500",
        "bg-white/80 backdrop-blur-xl border border-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]",
        "hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-1",
        !isNew && "grayscale-[0.5] opacity-90"
      )}>
        

        <div className="relative shrink-0">
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-[20px] shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-[10deg]",
            isNew 
              ? "bg-gradient-to-tr from-slate-900 to-slate-800 text-white shadow-slate-200" 
              : "bg-slate-50 text-slate-400 border border-slate-100"
          )}>
            {isNew ? <Sparkles size={22} /> : <Bell size={22} />}
          </div>
          

          {isNew && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-600 border-2 border-white"></span>
            </span>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h4 className={cn(
              "text-[16px] tracking-tight truncate",
              isNew ? "font-black text-slate-900" : "font-bold text-slate-600"
            )}>
              {title}
            </h4>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              {time}
            </span>
          </div>
          
          <p className={cn(
            "text-[13.5px] leading-[1.6] line-clamp-1 font-medium",
            isNew ? "text-slate-500" : "text-slate-400"
          )}>
            {desc}
          </p>
        </div>


        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button className="h-9 w-9 flex items-center justify-center bg-slate-900 text-white rounded-xl shadow-lg hover:bg-purple-600 transition-colors">
            <ArrowUpRight size={18} />
          </button>
          <button className="h-9 w-9 flex items-center justify-center bg-white text-slate-300 rounded-xl border border-slate-100 hover:text-red-500 hover:border-red-100 transition-all">
            <Trash2 size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
