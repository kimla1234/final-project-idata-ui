import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { LiaUsersCogSolid } from "react-icons/lia";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import CollaboratorsView from "./CollaboratorsView";
interface SidebarItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: IconType;
}
export function General({ schema }: { schema: any }) {
  const [activeTab, setActiveTab] = useState("collaborators");

  return (
    // ប្រើ flex flex-col និង h-screen នៅខាងក្រៅបង្អស់
    <div className="flex h-fit w-full flex-col bg-slate-50">
      

      {/* MAIN CONTENT */}

      <div className="h-full overflow-y-auto p-8">
        {activeTab === "collaborators" ? (
          <CollaboratorsView schema={schema} />
        ) : (
          <GeneralView />
        )}
      </div>
    </div>
  );
}

// Helper components for styling
function SidebarItem({ label, active, onClick, icon: Icon }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${
        active ? "bg-slate-100" : "hover:bg-slate-100"
      }`}
    >
      {/* បង្ហាញ Icon ប្រសិនបើមានការបញ្ជូនមក */}
      {Icon && <Icon className="text-lg" />}
      {label}
    </button>
  );
}
function GeneralView() {
  return <div className="text-2xl font-semibold">General Settings</div>;
}
