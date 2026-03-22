"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sparkles,
  Loader2,
  SendHorizontal,
  Database,
  Save,
  Trash2,
  MessageSquarePlus,
  FolderOpen,
  ArrowRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  useCreateApiSchemeMutation,
  useGenerateSchemaFromPromptMutation,
} from "@/redux/service/apiScheme";
import { useGetFoldersByWorkspaceQuery } from "@/redux/service/folder";


const ReactJson = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse p-4 text-gray-400">Loading Preview...</div>
  ),
});

interface AIGenerateSchemaProps {
  workspaceId: number;
  folderId: number;
  children?: React.ReactNode;
}

export default function AIGenerateSchema({
  workspaceId,
  folderId,
  children,
}: AIGenerateSchemaProps) {
  const { toast } = useToast();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- States ---
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [historyPrompt, setHistoryPrompt] = useState("");
  const [isAskingForFolder, setIsAskingForFolder] = useState(false);

  // --- API Hooks ---
  const { data: folders } = useGetFoldersByWorkspaceQuery(workspaceId);
  const [createApiScheme, { isLoading: isSaving }] = useCreateApiSchemeMutation();
  const [generateFromPrompt, { isLoading: isGenerating }] = useGenerateSchemaFromPromptMutation();


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiResponse, isGenerating, isAskingForFolder]);


  const handleAskAI = async () => {
    if (!prompt.trim() || isGenerating) return;

    const currentPrompt = prompt;
    setHistoryPrompt(currentPrompt);
    setPrompt("");
    setAiResponse(null);
    setIsAskingForFolder(false); 

    try {
      const result = await generateFromPrompt({ prompt: currentPrompt }).unwrap();
      setAiResponse(result);
      toast({
        title: "AI Generated! ✨",
        description: "Please review the structure below.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "AI Failed",
        description: error?.data?.message || "Failed to connect to AI Service.",
      });
    }
  };


  const handleSaveSchema = async (selectedFolderId?: number) => {
    if (!aiResponse) return;


    const finalFolderId = selectedFolderId || folderId;


    if (!finalFolderId || finalFolderId === 0) {
      setIsAskingForFolder(true);
      return;
    }

    try {
      const payload = {
        name: aiResponse.name || "New AI API",
        endpointUrl: aiResponse.endpointUrl || "new-api",
        description: aiResponse.description || historyPrompt,
        properties: aiResponse.properties || [],
        // Map Keysformat DTO
        keys: Array.isArray(aiResponse.keys)
          ? aiResponse.keys.map((k: any) => ({
              columnName: k.columnName || k.fieldName,
              primaryKey: !!k.primaryKey,
              foreignKey: !!k.foreignKey,
              referenceTable: k.referenceTable || "",
            }))
          : [],
        folderId: finalFolderId,
        isPublic: true,
      };

      const res = await createApiScheme(payload).unwrap();
      toast({ title: "Success", description: "API Scheme saved successfully!" });
      router.push(`/schema/${res.id}?tab=Overview`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error?.data?.message || "Internal Server Error",
      });
    }
  };

  return (
    <Sheet onOpenChange={(open) => !open && (setAiResponse(null), setIsAskingForFolder(false))}>
      <SheetTrigger asChild>
        <div className="inline-block cursor-pointer">
          {children ? (
            children
          ) : (
            <button className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105">
              <Sparkles className="size-4" /> Ask AI to Generate
            </button>
          )}
        </div>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-screen w-full flex-col bg-slate-50 p-0 sm:max-w-[600px]"
      >
        {/* Header */}
        <SheetHeader className="border-b bg-white p-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
              <Sparkles className="size-5 text-orange-600" />
            </div>
            AI Schema Designer
          </SheetTitle>
        </SheetHeader>

        {/* Chat / Result Area */}
        <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto p-4">
          {!aiResponse && !isGenerating && (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-slate-400">
              <div className="rounded-full bg-white p-6 shadow-sm">
                <MessageSquarePlus size={48} className="opacity-20" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">No schema generated yet</p>
                <p className="text-xs">Describe your API idea and let AI build the structure.</p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="flex items-start gap-3 animate-in fade-in">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm text-sm text-slate-500">
                AI is designing your schema structure...
              </div>
            </div>
          )}

          {aiResponse && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              {/* User Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl bg-slate-800 p-3 text-sm text-white shadow-sm">
                  {historyPrompt}
                </div>
              </div>

              {/* AI Response Bubble */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg">
                  <Database size={14} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-bold text-slate-700">
                      I've designed the "{aiResponse.name}" structure:
                    </p>
                    <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50 font-mono text-xs">
                      <ReactJson
                        src={aiResponse}
                        displayDataTypes={false}
                        collapsed={2}
                        style={{ padding: "16px", backgroundColor: "transparent" }}
                      />
                    </div>
                  </div>

                  {!isAskingForFolder && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveSchema()}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-orange-700"
                      >
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Confirm & Save
                      </button>
                      <button
                        onClick={() => setAiResponse(null)}
                        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                        Discard
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Asking for Folder Bubble */}
              {isAskingForFolder && (
                <div className="flex items-start gap-3 animate-in slide-in-from-left-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg">
                    <Sparkles size={14} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm border-l-4 border-l-orange-500">
                      <p className="text-sm font-bold text-slate-700">
                        តើបងចង់រក្សាទុក API នេះក្នុង Folder មួយណា?
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {folders?.map((f: any) => (
                          <button
                            key={f.id}
                            onClick={() => handleSaveSchema(f.id)}
                            className="group flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-left text-xs font-medium text-slate-600 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                          >
                            <span className="flex items-center gap-2">
                              <FolderOpen size={14} className="text-slate-400 group-hover:text-orange-500" />
                              {f.name}
                            </span>
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100" />
                          </button>
                        ))}
                        {(!folders || folders.length === 0) && (
                          <p className="text-[10px] italic text-red-400">រកមិនឃើញ Folder ក្នុង Workspace នេះទេ។</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAskingForFolder(false)}
                      className="text-[11px] font-medium text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <div className="relative flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition-all focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
            <textarea
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAskAI();
                }
              }}
              placeholder="Describe your API idea..."
              className="max-h-32 flex-1 resize-none bg-transparent p-2 text-sm outline-none"
            />
            <button
              onClick={handleAskAI}
              disabled={isGenerating || !prompt.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md transition-all hover:bg-orange-600 disabled:bg-slate-300"
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <SendHorizontal size={18} />}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}