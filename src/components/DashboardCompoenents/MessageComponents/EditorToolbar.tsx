"use client";

import React, { useState } from "react";
import { 
  Smile, Image as ImageIcon, Bookmark, Paperclip, 
  Link2, Share2, Lock, Pencil, MoreVertical,
  Maximize2, Type, Printer, SpellCheck, Tag, CalendarDays, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditorToolbar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
      <div className="flex items-center gap-4 text-gray-400">
        <button title="Attach" className="hover:text-blue-500 transition-colors"><Paperclip size={20} /></button>
        <button title="Insert Link" className="hover:text-blue-500 transition-colors"><Link2 size={20} /></button>
        <button title="Emoji" className="hover:text-blue-500 transition-colors"><Smile size={20} /></button>
        <button title="Drive" className="hover:text-blue-500 transition-colors"><Share2 size={20} /></button>
        <button title="Insert Image" className="hover:text-blue-500 transition-colors"><ImageIcon size={20} /></button>
        <button title="Confidential" className="hover:text-blue-500 transition-colors"><Lock size={20} /></button>
        <button title="Signature" className="hover:text-blue-500 transition-colors"><Pencil size={20} /></button>
        
        {/* The More Button Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all",
              showMenu ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-400"
            )}
          >
            <MoreVertical size={20} />
            {/* Blue Notification Dot */}
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500 border-2 border-white" />
          </button>

          {/* Advanced Dropdown Menu */}
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute left-0 bottom-10 z-20 w-64 rounded-xl bg-white py-2 shadow-2xl ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-bottom-2">
                <MenuAction icon={<Maximize2 size={18} />} label="Default to full screen" />
                <MenuAction icon={<Type size={18} />} label="Plain text mode" />
                <hr className="my-2 border-gray-50" />
                <MenuAction icon={<Printer size={18} />} label="Print" />
                <MenuAction icon={<SpellCheck size={18} />} label="Spell check" />
                <hr className="my-2 border-gray-50" />
                <MenuAction icon={<Tag size={18} />} label="Label" hasSubmenu />
                <MenuAction 
                    icon={<CalendarDays size={18} />} 
                    label="Set up a time to meet" 
                    hasSubmenu 
                    hasDot 
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for menu items
export function MenuAction({ icon, label, hasSubmenu = false, hasDot = false }: { 
    icon: React.ReactNode, 
    label: string, 
    hasSubmenu?: boolean,
    hasDot?: boolean
}) {
  return (
    <button className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
      <div className="flex items-center gap-3">
        <span className="text-slate-500">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {hasDot && <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
        {hasSubmenu && <ChevronRight size={16} className="text-slate-300" />}
      </div>
    </button>
  );
}