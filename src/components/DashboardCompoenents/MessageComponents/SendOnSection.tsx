import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, ChevronDownIcon, Smile } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { DatePickerInput } from "../ui/formatDate";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Dropdown,
  DropdownContent,
  DropdownMenuItem,
  DropdownTrigger,
} from "../ui/dropdown";


interface SendOnSectionProps {
  onModeChange: (mode: "IMMEDIATELY" | "SCHEDULED") => void;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

export default function SendOnSection({ 
  onModeChange, 
  onDateChange, 
  onTimeChange 
}: SendOnSectionProps) {
  const [sendMode, setSendMode] = useState("immediately");
  
  // មុខងារពេលប្តូរ Tab (Immediately / Scheduled)
  const handleModeChange = (mode: string) => {
    const formattedMode = mode.toLowerCase().replace(" ", "");
    setSendMode(formattedMode);
    
    // បញ្ជូនទៅ component មេ (បំប្លែងឱ្យត្រូវនឹង Type របស់ Backend)
    onModeChange(formattedMode === "immediately" ? "IMMEDIATELY" : "SCHEDULED");
  };

  return (
    <div>
      <section className="mt-8">
        <h3 className="mb-4 text-xl font-semibold text-slate-700">Send on</h3>
        <div className="space-y-6 rounded-sm border border-gray-100 bg-white p-5">
          
          {/* Tab Switcher */}
          <div className="flex w-fit rounded-lg bg-gray-100 p-1.5">
            {["Immediately", "Scheduled"].map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={cn(
                  "rounded-sm px-6 py-2 text-sm font-medium transition-all",
                  sendMode === mode.toLowerCase().replace(" ", "")
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          {sendMode !== "immediately" && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Starting Date */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-slate-600">Starting date</label>
                <div className="h-11">
                  {/* ប្រាកដថា DatePickerInput របស់អ្នកមាន props onChange */}
                  <DatePickerInput onChange={(date) => onDateChange(date)} />
                </div>
              </div>

              {/* Time Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-slate-600">Time</label>
                <div className="flex items-center rounded-md border border-gray-300 bg-slate-50/30 px-3">
                  <Input
                    type="time"
                    step="1"
                    defaultValue="10:30:00"
                    onChange={(e) => onTimeChange(e.target.value)}
                    className="w-full border-none bg-transparent outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
