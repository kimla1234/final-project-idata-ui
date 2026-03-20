"use client";

import * as React from "react";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";

// មុខងារជំនួយសម្រាប់បង្ហាញអក្សរ
function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

interface DatePickerInputProps {
  onChange?: (date: Date | undefined) => void;
  defaultValue?: Date; // ប្តូរពី value មក defaultValue ដើម្បីកុំឱ្យជាន់ជាមួយ state value
}

export function DatePickerInput({ onChange, defaultValue }: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  
  // កំណត់ថ្ងៃខែដំបូង
  const [date, setDate] = React.useState<Date | undefined>(defaultValue || new Date());
  const [month, setMonth] = React.useState<Date | undefined>(date);
  
  // State សម្រាប់បង្ហាញអក្សរក្នុង Input (ឧទាហរណ៍: June 01, 2025)
  const [inputValue, setInputValue] = React.useState(formatDate(date));

  // បង្កើត Function សម្រាប់ Handle ពេលរើសថ្ងៃ
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setInputValue(formatDate(selectedDate));
    setOpen(false);
    
    // បញ្ជូនតម្លៃទៅកាន់ Parent (SendOnSection)
    if (onChange) {
      onChange(selectedDate);
    }
  };

  return (
    <Field className="mx-auto w-full">
      <InputGroup className="border-gray-4">
        <InputGroupInput
          id="date-required"
          value={inputValue} // ប្រើឈ្មោះ inputValue ជៀសវាងជាន់ជាមួយ value prop
          placeholder="Select a date..."
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            setInputValue(e.target.value);
            if (isValidDate(newDate)) {
              setDate(newDate);
              setMonth(newDate);
              if (onChange) onChange(newDate);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id="date-picker"
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0 bg-white shadow-lg border border-gray-100"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}