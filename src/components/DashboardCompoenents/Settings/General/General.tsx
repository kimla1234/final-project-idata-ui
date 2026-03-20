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
export function General() {
  const [activeTab, setActiveTab] = useState("collaborators");

  return (
    // ប្រើ flex flex-col និង h-screen នៅខាងក្រៅបង្អស់
    <div className="flex h-fit w-full flex-col bg-slate-50 ">
      <ResizablePanelGroup
        orientation="horizontal"
        className="flex-1 rounded-xl  bg-white md:block " // បន្ថែម flex-1 ដើម្បីឱ្យវាពង្រីកពេញផ្ទៃ
      >
        {/* SIDEBAR: ប្តូរ defaultSize ឱ្យធំជាងមុនបន្តិច និងដាក់ minSize កុំឱ្យវាបាត់ឈឹង */}
        <ResizablePanel
          defaultSize={40}
          minSize={50} /* អនុញ្ញាតឱ្យទាញរួមតូចបំផុតដល់ 5% */
          maxSize={300} /* អនុញ្ញាតឱ្យទាញពង្រីកដល់ 50% នៃអេក្រង់ */
        >
          <div className="flex flex-col gap-2 p-4">
            <h3 className="mb-2  text-md font-medium text-slate-700">
              General
            </h3>
            <SidebarItem
              label="Collaborators"
              icon={LiaUsersCogSolid}
              active={activeTab === "collaborators"}
              onClick={() => setActiveTab("collaborators")}
            />
            
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className=" cursor-col-resize bg-slate-200 transition-colors hover:bg-blue-400"
        />

        {/* MAIN CONTENT */}
        <ResizablePanel defaultSize={50}>
          <div className="h-full overflow-y-auto p-8">
            {activeTab === "collaborators" ? (
              <CollaboratorsView />
            ) : (
              <GeneralView />
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

// Helper components for styling
function SidebarItem({ label, active, onClick , icon: Icon }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center rounded-md px-3 py-2 gap-2 text-sm ${
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


