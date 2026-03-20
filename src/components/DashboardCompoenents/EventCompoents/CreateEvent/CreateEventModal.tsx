"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../../../ui/dialog";

import { BasicInfoStep } from "./BasicInfoStep";
import { TicketStep } from "./TicketStep";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCreateEventMutation } from "@/redux/service/organizer";
import EventTypeStep from "./EventTypeStep";
interface Props {
  isOpen: boolean;

  onClose: () => void;
}
export default function CreateEventModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [createEvent, { isLoading }] = useCreateEventMutation();

  // ... ក្នុង Component ...
useEffect(() => {
  if (!isOpen) {
    // នៅពេល Modal ត្រូវបានបិទ Reset គ្រប់យ៉ាងទាំងអស់
    setStep(1);
  }
}, [isOpen]);

  // Inside CreateEventModal component
  const [createdEventSlug, setCreatedEventSlug] = useState<string>("");

  // Centralized State to hold all form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    image: "tech_event.png", // Placeholders for now
    imagesEvent: [] as string[],
    location_name: "",
    latitude: "11.5683",
    longitude: "104.8907",
    category_id: 3,
    ticketTypes: [] as any[],
  });

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...newData };
      console.log("Current Form Data State:", updated); // មើលក្នុង console ថា imagesEvent មាន data ឬអត់
      return updated;
    });
  };

  const handleFinalSubmit = async () => {
    // 1. Validation
    if (formData.ticketTypes.length === 0) {
      alert("Please add at least one ticket type before creating the event.");
      return;
    }

    try {
      // 2. Trigger the RTK Query Mutation
      // We wrap formData in an object with a 'body' key to match your builder.mutation
      await createEvent({ body: formData }).unwrap();
      // Capture the result from the mutation
    const result = await createEvent({ body: formData }).unwrap();
    
    // Assuming your API returns { slug: "..." } or { id: "..." }
    // Adjust 'result.slug' based on your actual API response structure
    setCreatedEventSlug(result.slug || result.uuid);

      // 3. If successful, move to the Success Step
      setStep(4);
    } catch (err: any) {
      console.error("Mutation failed:", err);
      // Greet the user with a helpful error message from the server if available
      const errorMsg =
        err?.data?.message ||
        "Failed to create event. Please check your connection.";
      alert(errorMsg);
    }
  };

  const steps = [
    { id: 1, name: "Event Type" },
    { id: 2, name: "Basic Info" },
    { id: 3, name: "Tickets" },
    { id: 4, name: "Review" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-hidden rounded-lg border-none bg-slate-50 px-8">
        <DialogHeader className="max-w-4xl py-4">
          <div className="text-xl text-gray-7">Create Event</div>
          <p>Fill out event detail for create processing</p>
        </DialogHeader>

        {/* Stepper Navigation */}
        <div className="flex h-fit w-full items-center justify-between rounded-lg border bg-gray-1 p-4 px-8 py-3">
          <div className="flex w-full items-center justify-between space-x-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center justify-between space-x-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                      step >= s.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-400",
                    )}
                  >
                    {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      step >= s.id ? "text-blue-600" : "text-gray-400",
                    )}
                  >
                    {s.name}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="h-[1px] w-8 bg-gray-200" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="max-h-[75vh] overflow-y-auto py-4">
          {step === 1 && (
            <EventTypeStep
              onNext={() => setStep(2)}
              setFormData={updateFormData} // This passes the helper function we created
            />
          )}
          {step === 2 && (
            <BasicInfoStep
              formData={formData}
              setFormData={updateFormData}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <TicketStep
              tickets={formData.ticketTypes}
              setTickets={(t) => updateFormData({ ticketTypes: t })}
              onNext={handleFinalSubmit}
              onBack={() => setStep(2)}
              isSubmitting={isLoading}
            />
          )}
          {step === 4 && <SuccessStep onClose={onClose} slug={createdEventSlug} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- STEP 4: SUCCESS ---
function SuccessStep({ onClose, slug }: { onClose: () => void; slug: string }) {
  // Use window.location.origin to get your current domain (e.g., https://yourdomain.com)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const eventUrl = `${baseUrl}/event/${slug}`;
  
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="space-y-6 py-10 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
        <Check className="h-10 w-10" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Your event is live!</h2>
        <p className="mt-2 text-slate-500">Share your event with the world:</p>
      </div>

      <div className="mx-auto flex max-w-md items-center justify-between rounded-lg border border-slate-200 bg-slate-100 p-4">
        <span className="mr-4 truncate text-xs font-mono text-blue-600 underline">
          {eventUrl}
        </span>
        <Button 
          size="sm" 
          variant={copied ? "default" : "outline"} 
          onClick={handleCopy}
          className={cn(copied && "bg-green-600 hover:bg-green-600 text-white")}
        >
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>

      <Button onClick={onClose} className="bg-blue-600 px-12">
        Close & Finish
      </Button>
    </div>
  );
}