"use client";
import React, { useState } from "react";
import { 
  Search, Settings, CheckCircle2, Paperclip, Smile, 
  Image as ImageIcon, BookMarked, Bookmark, SendHorizontal,
  Mail, Trash2, ChevronUp, MoreVertical, Reply, RotateCcw,
  Wand2, Bold, Italic, Underline, List, ListOrdered, Link2, Calendar, X, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const chats = [
  {
    id: 0,
    name: "Sophie Tran",
    email: "sophie-tran@brightwave.co",
    subject: "Candidate shortlist for Computer Science role",
    time: "12:01 AM",
    online: true,
    preview: "Starting with Linh, I think she's probably the strongest...",
  },
  { id: 1, name: "Daisy Migelia", email: "daisy@comp.com", subject: "UI Design", time: "16m ago", online: true, preview: "Hey, check this..." },
];

export default function SharedInbox() {
  const [active, setActive] = useState(0);
  const [isReplying, setIsReplying] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false); // State សម្រាប់គ្រប់គ្រង Modal Summarize

  return (
    <div className="flex h-[90vh] bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm relative">
      
      {/* 1. Left Sidebar */}
      <div className="w-[380px] border-r flex flex-col bg-white shrink-0">
        <div className="p-5 space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">Inbox</h1>
          <div className="flex gap-4 text-sm font-medium border-b border-gray-100">
            {["Primary", "Other", "Snoozed"].map((t) => (
              <button key={t} className={cn("pb-2 px-1", t === "Primary" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500")}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.map((c) => (
            <div
              key={c.id}
              onClick={() => { setActive(c.id); setIsReplying(false); setIsSummarizing(false); }}
              className={cn(
                "flex gap-3 p-4 cursor-pointer transition-colors rounded-md",
                active === c.id ? "bg-purple-50/50" : "hover:bg-purple-50"
              )}
            >
              <div className="relative shrink-0">
                <img src={`https://i.pravatar.cc/150?u=${c.id}`} className="w-12 h-12 rounded-full border border-gray-100" />
                {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold truncate text-slate-900">{c.name}</span>
                  <span className="text-[10px] text-gray-400 uppercase">{c.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">{c.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-slate-800">{chats[active].subject}</h2>
          <div className="flex items-center gap-3">
            <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"><Mail size={18} /></button>
            <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
          {/* Email Body */}
          <div className="flex items-start justify-between">
            <div className="flex gap-4">

              <img src={`https://i.pravatar.cc/150?u=${active}`} className="w-12 h-12 rounded-full object-cover" />
              <div className="space-y-1">
                <span className="font-bold text-gray-900 text-lg leading-none">{chats[active].name}</span>
                <p className="text-sm text-gray-500">{chats[active].email}</p>
                <p className="text-[13px] text-gray-400">
                  To: <span className="text-gray-800 font-medium">James</span> | CC: <span className="text-gray-800 font-medium">Andu Nguyen</span>
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-400 font-medium">Sept 24, 12:01 AM</span>
          </div>

          <div className="pl-16 pr-8 text-[15px] text-gray-700 leading-relaxed space-y-5">
            <p>Hi James, thanks for sharing these profiles.</p>
            <p>I had a look through them last night and wanted to share some quick thoughts. Starting with <strong>Linh</strong>, I think she's probably the strongest one here...</p>
            <p>Thanks again for pulling this together so quickly. <br/><strong>Sophie Tran</strong><br/><span className="text-gray-400 text-sm">Head of Product Brightwave Analytics</span></p>
            
            {!isReplying && (
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsReplying(true)} 
                  className="flex items-center gap-2 border border-indigo-600 text-indigo-600 px-5 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-all shadow-sm"
                >
                  <Reply size={18} /> Reply
                </button>
                <button 
                  onClick={() => setIsSummarizing(true)}
                  className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2 rounded-lg font-bold hover:bg-gray-50 transition-all shadow-sm"
                >
                  <BookMarked size={18} /> Summarize this
                </button>
              </div>
            )}
          </div>

          {/* Dynamic Reply UI */}
          {isReplying && (
            <div className="ml-16 mr-8 border border-gray-200 rounded-lg bg-white overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 font-medium">Replied to</span>
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2.5 py-1 rounded-md text-sm text-indigo-600 font-medium">
                    {chats[active].email} <X size={14} className="cursor-pointer text-gray-400 hover:text-red-400" onClick={() => setIsReplying(false)}/>
                  </div>
                </div>
                <div className="flex gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <button className="hover:text-indigo-600">CC</button>
                  <button className="hover:text-indigo-600">BCC</button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Message</span>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-indigo-600 transition-colors"><RotateCcw size={14}/> Reset to template</button>
                    <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-indigo-600 transition-colors"><Wand2 size={14}/> Load params</button>
                  </div>
                </div>
                <textarea 
                  autoFocus
                  className="w-full text-[15px] outline-none resize-none min-h-[180px] leading-relaxed text-gray-700 placeholder:text-gray-300"
                  defaultValue={`Hi Sophie\n\nThanks a lot for the detailed thoughts, really helpful. I'll move Linh and John ahead to the next round. I'll also fine-tune the search...`}
                />
                <div className="flex gap-2.5 mt-4">
                  <button className="flex items-center gap-2 bg-gray-50 text-gray-600 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 hover:bg-white transition-all">••• Try another version</button>
                  <button className="flex items-center gap-2 bg-gray-50 text-gray-600 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 hover:bg-white transition-all">🦁 Professional tone</button>
                  <button className="flex items-center gap-2 bg-gray-50 text-gray-600 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 hover:bg-white transition-all">🧭 Guide me</button>
                </div>
              </div>

              <div className="flex items-center justify-between px-5 py-4 bg-gray-50/30 border-t border-gray-100">
                <div className="flex items-center gap-5 text-gray-400">
                  <div className="flex items-center border-r border-gray-200 pr-5 gap-4">
                    <Bold size={19} className="cursor-pointer hover:text-gray-900" /><Italic size={19} className="cursor-pointer hover:text-gray-900" /><Underline size={19} className="cursor-pointer hover:text-gray-900" /><List size={19} className="cursor-pointer hover:text-gray-900" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Paperclip size={19} className="cursor-pointer hover:text-indigo-600" /><Calendar size={19} className="cursor-pointer hover:text-indigo-600" /><Link2 size={19} className="cursor-pointer hover:text-indigo-600" />
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-bold bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg text-gray-700 shadow-sm">
                    <Wand2 size={14} className="text-indigo-500" /> AI assist ON
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsReplying(false)} className="text-sm rounded-md bg-red-50 px-4 py-2 text-red-600 font-bold hover:bg-red-100 transition-colors">Cancel</button>
                  <button className="bg-purple-600 rounded-md flex gap-2 items-center text-white px-5 py-2 font-bold hover:bg-purple-700 transition-all shadow-md"><SendHorizontal size={18}/> Send</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Summarize Modal (រូបទី៣) */}
      {isSummarizing && (
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h3 className="text-lg font-bold text-slate-800">Summarize email</h3>
              <button onClick={() => setIsSummarizing(false)} className="text-gray-400 hover:text-slate-800 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Dropdown 選項 */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 truncate max-w-[380px]">
                    {chats[active].subject}
                  </span>
                </div>
                <ChevronDown size={18} className="text-slate-400" />
              </div>

              {/* Summarized Points */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Candidates feedback:</h4>
                  <ul className="space-y-2 text-[15px] text-slate-600 leading-relaxed">
                    <li className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">David</span> → Strong SaaS + UX/UI, good fit → <span className="text-green-600 font-bold ml-1">✅ Move forward</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">Berry</span> → Too visual, lacks product/research depth → <span className="text-red-500 font-bold ml-1">❌ Not moving forward</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">Travis</span> → Good stakeholder/process skills, but not right for small team → <span className="text-red-500 font-bold ml-1">❌ Not moving forward</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">Johnny</span> → Relevant fintech + data viz + mentoring, strong match → <span className="text-green-600 font-bold ml-1">✅ Move forward</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Next steps:</h4>
                  <p className="text-[15px] text-slate-600">Proceed with David and Johnny to</p>
                </div>
              </div>
            </div>
            
            {/* Modal Footer (Optional - can be empty for pure info) */}
            <div className="px-6 pb-6 pt-2">
              <div className="w-4 h-1 bg-slate-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}