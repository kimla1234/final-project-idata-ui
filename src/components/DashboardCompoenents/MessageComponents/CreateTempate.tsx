import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HighlightWithinTextarea } from "react-highlight-within-textarea";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { selectActiveWorkspaceId } from "@/redux/feature/workspace/workspaceSlice";
import {
  useCreateTemplateMutation,
  useGetTemplatesByWorkspaceQuery,
} from "@/redux/service/tempate";
import { Loader2, Plus, Info } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

// កំណត់ Variable ដែលយើងអនុញ្ញាតឱ្យប្រើ
const PLACEHOLDERS = [
  { label: "Tenant Name", value: "{{name}}" },
  { label: "Email", value: "{{email}}" },
  { label: "Amount", value: "{{amount}}" },
  { label: "Due Date", value: "{{due_date}}" },
];

export default function CreateTempate() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const activeWorkspaceId = useSelector(selectActiveWorkspaceId);

  const [createTemplate, { isLoading: isCreating }] =
    useCreateTemplateMutation();

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
  });

  // Function សម្រាប់ Insert Variable ចូលទៅក្នុង Textarea
  const handleInsertVariable = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + variable,
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTemplate({
        workspaceId: activeWorkspaceId as number,
        body: {
          name: formData.name,
          subject: formData.subject || formData.name,
          content: formData.content,
        },
      }).unwrap();

      toast({
        title: "Success",
        description: "Template created successfully!",
      });
      setIsOpen(false);
      setFormData({ name: "", subject: "", content: "" });
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error?.data?.message || "Error creating template",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="rounded-md bg-purple-600 text-white transition-all hover:bg-purple-700 active:scale-95">
            <Plus className="mr-2 h-4 w-4" /> Add Template
          </Button>
        </SheetTrigger>
        <SheetContent className="mt-2 h-[98vh] overflow-y-auto rounded-lg border-l-0 bg-white p-6 sm:max-w-[850px]">
          <SheetHeader className="space-y-4 pr-6">
            <div>
              <SheetTitle className="text-2xl font-bold">
                New Template
              </SheetTitle>
              <SheetDescription>
                Draft a new message template for your tenants. Use variables to
                personalize your messages.
              </SheetDescription>
            </div>
          </SheetHeader>

          <div className="grid gap-6 py-10">
            {/* Template Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Template Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., Monthly Rent Reminder"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-md border-slate-200 focus-visible:ring-purple-500"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Subject
              </label>
              <Input
                placeholder="Enter message subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="rounded-md border-slate-200 focus-visible:ring-purple-500"
              />
            </div>

            {/* Content with Variable Chips */}
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  Content <span className="text-red-500">*</span>
                  <div className="group relative">
                    <Info className="h-3.5 w-3.5 cursor-help text-slate-400" />
                    <span className="absolute bottom-full left-1/2 mb-2 hidden w-48 -translate-x-1/2 rounded bg-slate-800 p-2 text-[10px] text-white group-hover:block">
                      Variables will be replaced with real tenant data when
                      sending.
                    </span>
                  </div>
                </label>

                {/* Variable Chips Row */}
                <div className="flex flex-wrap gap-2">
                  {PLACEHOLDERS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleInsertVariable(item.value)}
                      className="inline-flex items-center rounded-md border border-purple-100 bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-600 transition-colors hover:bg-purple-100"
                    >
                      + {item.label}
                    </button>
                  ))}
                </div>

                {/* កន្លែងប្រើ Component Highlight ថ្មី */}
                <ContentWithHighlight
                  value={formData.content}
                  onChange={(
                    val: string, // Library បោះ value ជា string មកឱ្យផ្ទាល់
                  ) => setFormData({ ...formData, content: val })}
                />

                <p className="text-[11px] italic text-slate-400">
                  Variables in{" "}
                  <span className="font-bold text-purple-600 underline">
                    purple
                  </span>{" "}
                  will be replaced with real data.
                </p>
                <p className="-mt-1 text-[11px] italic text-slate-400">
                  Tip: You can also manually type the variables using double
                  curly braces.
                </p>
              </div>
            </div>
          </div>

          <SheetFooter className="flex-row gap-3 sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="rounded-md font-semibold text-slate-500"
            >
              Discard
            </Button>
            <Button
              onClick={handleSave}
              disabled={isCreating}
              className="rounded-md bg-purple-600 px-8 font-semibold text-white shadow-lg shadow-purple-100 hover:bg-purple-700"
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Template
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function ContentWithHighlight({ value, onChange }: any) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ឆែកមើលអត្ថបទដើម្បីបង្ហាញ Suggestions
  useEffect(() => {
    // បើអត្ថបទបញ្ចប់ដោយ {{ វានឹងបង្ហាញបញ្ជី
    if (value.endsWith("{{")) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [value]);

  const highlightItems = [
    {
      highlight: /\{\{[^{}]*\}\}/g,
      className: "bg-[#F5F3FF] text-[#7C3AED] font-bold rounded-md px-1 py-0.5 ring-1 ring-purple-100",
    },
  ];

  const handleSelect = (variable: string) => {
    // លុប {{ ដែលទើបតែវាយ រួចជំនួសដោយ variable ពេញ
    const newValue = value.slice(0, -2) + variable;
    onChange(newValue);
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative custom-highlight-container min-h-[250px] w-full rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm leading-relaxed transition-all focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-50">
      
      <HighlightWithinTextarea
        value={value}
        highlight={highlightItems}
        onChange={onChange}
        placeholder="Hi {{tenant_name}}, your rent is due..."
      />

      {/* --- Suggestion Popover --- */}
      {showSuggestions && (
        <div className="absolute z-50 bottom-full left-4 mb-2 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-slate-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-bottom">
            Select Variable
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {PLACEHOLDERS.map((item) => (
              <button
                key={item.value}
                onClick={() => handleSelect(item.value)}
                className="flex w-full items-center px-3 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors"
              >
                <span className="mr-2 font-mono text-xs text-purple-400">{"{{"}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-highlight-container .rhta-textarea,
        .custom-highlight-container .rhta-highlighter {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
          font-size: 14px !important;
          line-height: 1.625 !important;
          padding: 0 !important;
          margin: 0 !important;
          min-height: 250px !important;
        }
        .custom-highlight-container .rhta-textarea {
          outline: none !important;
          border: none !important;
          background: transparent !important;
          color: #475569 !important;
          caret-color: #7c3aed !important;
        }
      `}</style>
    </div>
  );
}
