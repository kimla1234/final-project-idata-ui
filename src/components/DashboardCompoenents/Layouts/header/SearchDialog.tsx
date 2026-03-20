"use client";

import { useEffect, useRef } from "react";
import { ImSearch } from "react-icons/im";
import { LuLayoutGrid, LuHistory } from "react-icons/lu";
import { IoFilterOutline } from "react-icons/io5";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key and Focus input on open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center bg-black/40 backdrop-blur-sm pt-20 px-4">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-gray-dark border dark:border-stroke-dark">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b px-4 py-3 dark:border-stroke-dark">
          <ImSearch className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Postman"
            className="flex-1 bg-transparent text-[15px] outline-none dark:text-white"
          />
          <IoFilterOutline className="text-gray-400 cursor-pointer hover:text-primary" />
        </div>

        {/* Filters Row */}
        <div className="flex gap-2 p-3 border-b bg-gray-50/50 dark:bg-white/5 dark:border-stroke-dark">
          {["Workspace type", "Element type", "In", "By"].map((filter) => (
            <button key={filter} className="rounded border bg-white px-2 py-1 text-xs font-medium dark:bg-gray-800 dark:border-stroke-dark">
              {filter} ▾
            </button>
          ))}
        </div>

        {/* Search Results / Content */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Recently viewed
          </div>
          
          {/* Mock Result Items */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="group flex items-center justify-between rounded-md px-3 py-2 hover:bg-purple-50 dark:hover:bg-white/5 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="rounded bg-gray-100 p-2 dark:bg-gray-800">
                  <LuLayoutGrid size={16} className="text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-medium dark:text-white">dev-mvtdl62tpj4nneqr</div>
                  <div className="text-[11px] text-gray-500">Kimla Chhoeurn</div>
                </div>
              </div>
              <span className="text-[11px] text-gray-400">Last viewed 3 hours ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}