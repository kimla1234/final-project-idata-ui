"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageSquareText, X, Send, Mic } from "lucide-react";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog"; // ប្រាកដថាបាន install @radix-ui/react-dialog
import { cn } from "@/lib/utils";
import Image from "next/image";

const AiKimla = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end space-y-4">
      
      {/* 1. ប៊ូតុង Back to Top */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-xl border border-gray-100 transition hover:bg-gray-50"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      {/* 2. Dialog Chat Widget */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition hover:scale-110 active:scale-95"
            title="Chat with AI"
          >
            <div>
              <Image src="/ai.png" alt="" width={1000} height={1000} className=" w-full h-full  rounded-full" />
            </div>
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          {/* Overlay បាំងពីក្រោយ (Optional) */}
          <Dialog.Overlay className="fixed inset-0 bg-black/5 z-50" />
          
          <Dialog.Content 
            className={cn(
              "fixed bottom-24 right-4 z-50 w-[90vw] max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-2xl animate-in slide-in-from-bottom-5 duration-300 border border-gray-100"
            )}
          >
            {/* Header ពណ៌ខៀវ ដូចរូបទី ៤ */}
            <div className="bg-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-white p-1 flex items-center justify-center">
                    {/* ដាក់រូប Bot របស់អ្នកនៅទីនេះ */}
                    <div className="bg-purple-100 rounded-full w-full h-full flex items-center justify-center text-purple-600 font-bold">SAN</div>
                  </div>
                  <div>
                    <Dialog.Title className="text-lg font-bold">ASK SAN</Dialog.Title>
                    <p className="text-[10px] opacity-90">Personal Assistant</p>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="rounded-full p-1 hover:bg-white/20 transition">
                    <X className="h-6 w-6" />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            {/* Content ផ្នែកខាងក្នុង Chat */}
            <div className="h-[450px] flex flex-col bg-gray-50/50">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* មេសារស្វាគមន៍ */}
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium text-gray-700">Hi !</p>
                  <p className="text-xs text-gray-500 max-w-[80%] bg-white p-3 rounded-2xl rounded-tl-none border">
                    I am SAN, your personal assistant to help you with Smart Note Approval related queries.
                  </p>
                </div>

                {/* ប៊ូតុងជម្រើស (Quick Actions) */}
                <div className="flex flex-wrap gap-2">
                  {["Create New NFA", "Need assistance", "Account Services", "View Reports"].map((item) => (
                    <button key={item} className="bg-purple-600 text-white text-[11px] px-3 py-2 rounded-lg hover:bg-purple-700 transition">
                      {item}
                    </button>
                  ))}
                </div>

                {/* មេសាររបស់ Bot */}
                <div className="flex items-start space-x-2">
                   <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] text-white">S</div>
                   <div className="bg-white p-3 rounded-2xl rounded-tl-none border text-xs text-gray-600">
                      How can I assist you?
                   </div>
                </div>
              </div>

              {/* ផ្នែកបញ្ចូលសារ (Input) */}
              <div className="p-4 bg-white border-t flex items-center space-x-2">
                <input 
                  placeholder="Write a message..." 
                  className="flex-1 text-sm outline-none focus:ring-0 placeholder:text-gray-400"
                />
                <button className="text-purple-600 hover:scale-110 transition">
                  <Send className="h-5 w-5" />
                </button>
                <div className="h-6 w-[1px] bg-gray-200" />
                <button className="text-purple-600 hover:scale-110 transition">
                  <Mic className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AiKimla;