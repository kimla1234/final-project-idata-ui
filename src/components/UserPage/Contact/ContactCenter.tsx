"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/DashboardCompoenents/ui/tabs";
import {
  ChevronRight,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import Image from "next/image";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FAQ from "./faqBooking";
import FaqBooking from "./faqBooking";
import FaqOrganizer from "./faqOrganizer";

const ContactCenter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "comming";
  const [currentTab, setCurrentTab] = useState(tabParam);
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    // router.push(`/?tab=${value}`, { scroll: false });
  };
  return (
    <div>
      <div className="flex flex-col  items-start justify-start bg-white py-14 font-sans selection:bg-purple-100">
        <div className="mx-auto flex w-full max-w-7xl justify-between">
          <div className="">
            {/* --- Header Section --- */}
            <div className="relative mb-10 md:mb-16 lg:mb-20">
              {/* Title Row 1: "Initial Design" */}
              <h1 className="text-[50px] font-bold leading-[1] tracking-tight text-[#B4AEE8] sm:text-[72px] md:text-[90px] lg:text-[120px]">
                Infomation
              </h1>

              {/* Title Row 2: "Process" + Image Inline */}
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center md:gap-8">
                <span className="text-[50px] font-bold leading-[1] tracking-tight text-[#B4AEE8] sm:text-[72px] md:text-[90px] lg:text-[120px]">
                  Contact
                </span>

                {/* Scribble Image - Responsive Width */}
                <div className="mt-3 w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px]">
                  <Image
                    src="/contact-03.png"
                    width={1000}
                    height={200}
                    alt="Design Scribble"
                    className="h-auto w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* --- Content Section --- */}
            <div className="flex flex-col-reverse justify-between gap-10 lg:flex-row lg:items-end lg:gap-20">
              {/* Left: Text Description */}
              <div className="w-full text-start lg:max-w-[850px]">
                <p className="text-base leading-relaxed text-gray-500 sm:text-lg md:leading-loose lg:text-xl">
                  We’re here to help! Whether you have a question about your
                  booking, need assistance, or want to share feedback, the
                  KHOTIXS team is ready to assist you.
                </p>
              </div>
            </div>
            {/* QUICK INFO PILLS */}
            <div className="mt-10 flex w-fit flex-wrap items-end gap-4 rounded-lg bg-purple-50">
              <div className="flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-md">
                <div className="rounded-full bg-purple-400 p-3">
                  <Clock size={20} className="text-gray-2" />
                </div>
                <div>
                  <p className="text-[15px] font-bold">Working Hours:</p>
                  <p className="text-sm font-medium">
                    Mon - Sat: 8:00am-5:00pm
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-md">
                <div className="rounded-full bg-purple-400 p-3">
                  <MapPin size={20} className="text-gray-2" />
                </div>
                <div>
                  <p className="text-[15px] font-bold">HQ Address:</p>
                  <p className="text-sm font-medium">
                    Sector 47, Gurugram, Haryana
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Illustration */}
          <div className="mt-10 flex w-full items-center justify-center lg:w-auto lg:justify-end">
            {/* Illustration - Adjust position based on screen size */}
            <div className="w-[200px] sm:w-[260px] md:w-[300px] lg:w-[350px]">
              {/* CHAT SUPPORT CARD (FLOATING) */}
              <div className="z-20 w-full rounded-[20px] border border-dashed border-gray-300 bg-white p-8 text-slate-800 lg:right-20 lg:top-10 lg:w-full">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Chat Support</h3>
                </div>
                <p className="mb-6 text-sm text-gray-500">
                  Our intelligent chatbot handles 90% of common questions
                  instantly, available 24/7.
                </p>
                <button className="mb-8 w-full rounded-2xl bg-[#3D2C8D] py-4 font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-black">
                  Chat Now
                </button>

                <div className="space-y-6">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Still need help?
                  </p>
                  {[
                    {
                      icon: <Mail size={18} />,
                      label: "Email",
                      value: "support@helphub.com",
                    },
                    {
                      icon: <Phone size={18} />,
                      label: "Phone",
                      value: "+1 (800) 555-1234",
                    },
                    {
                      icon: <FileText size={18} />,
                      label: "Submit Request",
                      value: "For complex issues",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="group flex cursor-pointer items-center justify-between hover:opacity-70"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-gray-400 group-hover:text-indigo-600">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-gray-400">
                            {item.label}
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {item.value}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl">
          {/* MAP & LOCATIONS */}
          <div className="py-10 text-[10px] font-bold leading-[1] tracking-tight text-[#9a9a9d] sm:text-[72px] md:text-[20px] lg:text-[40px]">
            Our Location
          </div>
          <div className="grid w-full grid-cols-1">
            <div className="h-[400px] rounded-[20px] border border-gray-100 lg:col-span-2">
              <div className="relative h-full w-full overflow-hidden rounded-[20px] grayscale-[0.5]">
                {/* Standard Map Illustration Placeholder */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31270.038386954104!2d104.87694715921364!3d11.569427722414872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951725d8c4835%3A0x2047e2df9364f385!2sToul%20Kork%20District%2C%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1768285048585!5m2!1sen!2skh"
                  className="h-full w-full border-0"
                  allowFullScreen={true}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="flex  mx-auto w-full max-w-7xl justify-between  py-10">
          <div className="  w-fit content-start ">
            <div className="py-10 text-[10px] font-bold leading-[1] tracking-tight  sm:text-[72px] md:text-[20px] lg:text-[40px]">
              Frequently Asked <span className=" text-[#b2b2b4]"> Questions</span>
            </div>
            <div className="">
              <Tabs
                defaultValue="general"
                value={currentTab}
                onValueChange={handleTabChange}
                className="w-full space-y-4"
              >
                <TabsList className="w-full space-x-1 rounded-md bg-slate-200 py-2">
                  <TabsTrigger value="comming" className="w-full">
                    Booking
                  </TabsTrigger>
                  <TabsTrigger value="history" className="w-full">
                    Payment
                  </TabsTrigger>
                  <TabsTrigger value="organizer" className="w-full">
                    Organizer
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="comming"
                  className="duration-500 animate-in fade-in slide-in-from-bottom-4"
                >
                  <div className="h-auto w-full space-y-4 rounded-md bg-white text-slate-600">
                    <FAQ />
                  </div>
                </TabsContent>

                <TabsContent
                  value="history"
                  className="duration-500 animate-in fade-in slide-in-from-bottom-4"
                >
                  <div className="h-auto w-full rounded-md bg-white text-slate-600">
                    <FaqBooking/>
                  </div>
                </TabsContent>
                <TabsContent
                  value="organizer"
                  className="duration-500 animate-in fade-in slide-in-from-bottom-4"
                >
                  <div className="h-auto w-full rounded-md bg-white text-slate-600">
                    <FaqOrganizer/>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="w-[600px] flex items-end">
            <Image src="/contact-04.png" alt="" width={1000} height={1000} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCenter;
