import React from "react";
import Image from "next/image";
import { X, Copy, Link2 } from "lucide-react";

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

export default function ShareModal({ url, onClose }: ShareModalProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    // You could replace this alert with a toast notification
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 pt-12 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Floating Link Icon (The Paperclip/Link circle) */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex h-20 w-20 items-center justify-center rounded-full bg-white ">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gray-50 border border-gray-100">
             <Link2 size={32} className="text-gray-600 rotate-45" />
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Share with Friends</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
            Trading is more effective when <br /> you connect with friends!
          </p>
        </div>

        {/* Link Input Section */}
        <div className="mt-8">
          <label className="mb-2 block text-sm font-bold text-gray-800">Share you link</label>
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="truncate text-[15px] text-gray-600 font-medium">{url}</span>
            <button 
              onClick={copyToClipboard} 
              className="ml-3 text-gray-400 hover:text-purple-600 transition-colors"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>

        {/* Social Icons Section */}
        <div className="mt-8">
          <label className="mb-5 block text-sm font-bold text-gray-800">Share to</label>
          <div className="flex justify-between items-start">
            <SocialIcon label="Facebook" bgColor="bg-[#1877F2]" iconUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png" />
            <SocialIcon label="X" bgColor="bg-black" iconUrl="https://cdn.worldvectorlogo.com/logos/x-2.svg" />
            <SocialIcon label="Whatsapp" bgColor="bg-[#25D366]" iconUrl="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" />
            <SocialIcon label="Telegram" bgColor="bg-[#26A5E4]" iconUrl="https://www.vhv.rs/dpng/d/74-747658_telegram-icon-svg-hd-png-download.png" />
            <SocialIcon label="Linkedin" bgColor="bg-[#0077B5]" iconUrl="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ label, bgColor, iconUrl }: { label: string; bgColor: string; iconUrl: string }) {
  return (
    <button className="flex flex-col items-center gap-2 group w-16">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgColor} transition-transform group-hover:scale-110 shadow-sm overflow-hidden p-2.5`}>
         <img src={iconUrl} alt={label} className="w-full h-full object-contain brightness-0 invert" 
              style={label === "Whatsapp" || label === "Facebook" ? {filter: "none", padding: "0"} : {}} 
         />
      </div>
      <span className="text-[11px] font-semibold text-gray-500">{label}</span>
    </button>
  );
}