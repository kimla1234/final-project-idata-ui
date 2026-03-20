import React, { useState } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import { X, Save, Settings2 } from "lucide-react";
import TemplateManager from "./TemplateManager";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { selectActiveWorkspaceId } from "@/redux/feature/workspace/workspaceSlice";
import { useGetTemplatesByWorkspaceQuery } from "@/redux/service/tempate";

export default function SuggestedTemplates({ onSelect }: { onSelect: (template: any) => void }) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<number | null>(null);

  // ១. ទាញយក Workspace ID ពី Redux
  const activeWorkspaceId = useSelector(selectActiveWorkspaceId);

  // ២. Fetch ទិន្នន័យតាមរយៈ Hook (វានឹង Fetch ស្វ័យប្រវត្តិពេលមាន WorkspaceId)
  const { data, isLoading } = useGetTemplatesByWorkspaceQuery(
    activeWorkspaceId as number,
    { skip: !activeWorkspaceId }, // កុំឱ្យវា Fetch បើមិនទាន់មាន ID
  );

  // ទាញយក array នៃ templates ពី response (ឧទាហរណ៍ data?.data ឬ data ផ្ទាល់)
  const templates = data || [];

  return (
    <div className="">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {isLoading ? (
        <p>Loading...</p>
      ) : (
        templates.map((template: any) => (
          <button
            key={template.id}
            onClick={() => {
              setActiveTemplateId(template.id);
              onSelect(template); // ហៅ function ពេល user ចុច
            }}
            className={`rounded-md border px-4 py-1.5 text-sm transition-all ${
              template.id === activeTemplateId
                ? "border-purple-200 bg-purple-50 font-semibold text-purple-600"
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            {template.name}
          </button>
        ))
      )}
        </div>

        {/* Configure Button Trigger */}

        {/* --- Configure Trigger ប្រើជាមួយ Sheet --- */}
        <Sheet open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="flex shrink-0 items-center gap-2 rounded-md text-blue-900 border-purple-400 bg-purple-200 px-6 py-4.5 text-sm font-bold  transition-all hover:bg-purple-100 active:scale-95"
            >
              <Settings2 className="h-4 w-4  text-blue-900" />
              Configure
            </Button>
          </SheetTrigger>

          {/* កំណត់ទំហំ Side Panel ឱ្យធំសមល្មមសម្រាប់ TemplateManager (max-w-4xl) */}
          <SheetContent className="mt-2 h-[98vh] rounded-lg border-l-0 bg-white p-2 shadow-2xl sm:max-w-[850px]">
            <SheetHeader className="p-6">
              <SheetTitle>Template Configuration</SheetTitle>
              <SheetDescription>
                Manage and customize your message templates here.
              </SheetDescription>
            </SheetHeader>
            <div className="h-full w-full p-1">
              {/* ហៅ TemplateManager មកបង្ហាញក្នុង Sheet */}
              <TemplateManager />
            </div>

            {/* Google-Style Accent Bar នៅផ្នែកខាងក្រោមនៃ Sheet */}
            <div className="sticky bottom-0 flex h-1.5 w-full">
              <div className="h-full flex-1 bg-purple-500"></div>
              <div className="h-full flex-1 bg-red-500"></div>
              <div className="h-full flex-1 bg-yellow-400"></div>
              <div className="h-full flex-1 bg-green-500"></div>
            </div>
          </SheetContent>
        </Sheet>

        <div
          className="absolute inset-0 -z-10"
          onClick={() => setIsConfigOpen(false)}
        />
      </div>
    </div>
  );
}
