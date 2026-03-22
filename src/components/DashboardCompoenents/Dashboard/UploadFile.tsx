"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import dynamic from "next/dynamic";

import {
  FileJson,
  Type,
  X,
  FolderPlus,
  Loader2,
  Sparkles,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  useCreateSchemaFromFileMutation,
  usePreviewSchemaFromFileMutation,
} from "@/redux/service/apiScheme";
import {
  useGetFoldersByWorkspaceQuery,
  useCreateFolderMutation,
} from "@/redux/service/folder";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { selectActiveWorkspaceId } from "@/redux/feature/workspace/workspaceSlice";

const ReactJson = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse p-4 text-gray-400">Loading JSON Tree...</div>
  ),
});

export default function UploadFile() {
  const router = useRouter();
  const { toast } = useToast();


  const activeWorkspaceId = useSelector(selectActiveWorkspaceId);
  const workspaceId = activeWorkspaceId ? Number(activeWorkspaceId) : 0;

  // --- States ---
  const [file, setFile] = useState<File | null>(null);
  const [schemaName, setSchemaName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [targetFolderId, setTargetFolderId] = useState(0);
  const [isNewFolderMode, setIsNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // --- RTK Query Hooks ---
  const [previewSchema, { isLoading: isPreviewing }] =
    usePreviewSchemaFromFileMutation();
  const [createSchema, { isLoading: isCreating }] =
    useCreateSchemaFromFileMutation();
  const [createFolder, { isLoading: isCreatingFolder }] =
    useCreateFolderMutation();


  const {
    data: folders,
    isLoading: isFetchingFolders,
    isError: isFolderError,
  } = useGetFoldersByWorkspaceQuery(workspaceId, {
    skip: !workspaceId || workspaceId === 0,
  });

  // ៣. Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setShowPreview(false);
    }
  };

  // ៤. Handle Preview (AI Analysis)
  const handlePreviewClick = async () => {

    if (!file) {
      return toast({
        variant: "destructive",
        title: "Missing File",
        description: "Please select a JSON, CSV, or XLSX file first.",
      });
    }


    if (!schemaName.trim()) {
      return toast({
        variant: "destructive",
        title: "Missing Name",
        description:
          "Please enter a name for your Schema to help AI analyze context.",
      });
    }

    try {

      const formData = new FormData();
      formData.append("file", file);



      const result = await previewSchema(formData).unwrap();


      setPreviewData(result);
      setShowPreview(true);

      toast({
        title: "AI Analysis Complete ✨",
        description: "Successfully inferred schema structure from your file.",
      });
    } catch (error: any) {
      console.error("Preview Error details:", error);



      const serverError =
        error?.data?.error ||
        "AI Model is currently unavailable or URL is incorrect.";

      toast({
        variant: "destructive",
        title: "Analysis Failed (500)",
        description:
          typeof serverError === "string"
            ? serverError
            : "Check Backend IntelliJ Console for Gemini API logs.",
      });


      setShowPreview(false);
    }
  };

  // ៥. Handle Create Folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !workspaceId) return;
    try {
      const res = await createFolder({
        workspaceId,
        body: { name: newFolderName },
      }).unwrap();
      setTargetFolderId(res.id);
      setIsNewFolderMode(false);
      setNewFolderName("");
      toast({ title: "Success", description: "New folder created." });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create folder.",
      });
    }
  };

  // ៦. Final Save to Database
  const handleFinalCreate = async () => {
    if (targetFolderId === 0) {
      return toast({
        variant: "destructive",
        title: "Folder Required",
        description: "Please select a folder to save this schema.",
      });
    }

    try {
      const payload = {
        name: schemaName,
        endpointUrl: schemaName.toLowerCase().replace(/\s+/g, "-"),
        description: previewData?.description || "Generated from file",
        

        properties: Array.isArray(previewData?.properties) ? previewData.properties : [],


        keys: Array.isArray(previewData?.keys)
          ? previewData.keys.map((k: any) =>
              typeof k === "string" 
                ? { columnName: k, primaryKey: k.toLowerCase() === 'id', foreignKey: false, referenceTable: "" } 
                : k
            )
          : [],

        folderId: targetFolderId,
        isPublic: false,
      };

      console.log("Saving Payload:", payload); 

      const res = await createSchema(payload).unwrap();
      toast({ title: "Success!", description: "Schema generated successfully." });
      router.push(`/schema/${res.id}?tab=Overview`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error?.data?.message || "Could not save the schema structure.",
      });
    }
  };


  if (!workspaceId) {
    return (
      <div className="flex h-screen items-center justify-center italic text-gray-500">
        <Loader2 className="mr-2 animate-spin" /> Loading active workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 dark:bg-gray-950">
      <div className="mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/20">
            <FileJson className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Generate API with Files
            </h1>
            
          </div>
        </div>

        {/* Input Form Card */}
        <div className="space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Schema Name Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
              <Type size={16} className="text-orange-500" /> Schema Name
            </label>
            <input
              type="text"
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value)}
              placeholder="e.g. Products API"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none transition-all focus:border-orange-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* File Upload Area */}
          <div className="group relative">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileChange}
              accept=".json,.csv,.xlsx"
            />
            <label
              htmlFor="fileInput"
              className="flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/30 transition-all hover:border-orange-400 hover:bg-orange-50/50 dark:border-gray-700 dark:bg-gray-800/50"
            >
              {!file ? (
                <div className="text-center">
                  <div className="mx-auto mb-3 w-14 rounded-2xl bg-white p-3 shadow-sm dark:bg-gray-700">
                    <FileJson className="h-8 w-8 text-orange-500" />
                  </div>
                  <p className="text-sm font-medium">
                    Click to upload JSON, CSV or Excel
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border bg-white p-4 dark:bg-gray-800">
                  <FileJson className="h-8 w-8 text-orange-500" />
                  <div className="text-left">
                    <p className="max-w-[200px] truncate text-sm font-bold">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <X
                    className="h-5 w-5 text-gray-400 hover:text-red-500"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                    }}
                  />
                </div>
              )}
            </label>
          </div>

          {/* Target Folder Selection */}
          <div className="space-y-3 rounded-2xl border border-orange-100 bg-orange-50/30 p-5 dark:border-orange-900/10">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold italic">
                <FolderPlus size={16} className="text-orange-500" /> Save to
                Folder
              </label>
              <button
                onClick={() => setIsNewFolderMode(!isNewFolderMode)}
                className="text-xs font-bold text-orange-600 underline"
              >
                {isNewFolderMode ? "Select Existing" : "+ New Folder"}
              </button>
            </div>

            {isNewFolderMode ? (
              <div className="flex gap-2 animate-in fade-in zoom-in-95">
                <input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name..."
                  className="flex-1 rounded-xl border p-3 text-sm dark:bg-gray-800"
                />
                <button
                  onClick={handleCreateFolder}
                  disabled={isCreatingFolder}
                  className="rounded-xl bg-orange-500 px-5 text-xs font-bold text-white"
                >
                  {isCreatingFolder ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={targetFolderId}
                  onChange={(e) => setTargetFolderId(Number(e.target.value))}
                  className="w-full appearance-none rounded-xl border p-3 text-sm outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-800"
                >
                  <option value={0}>-- Select Folder --</option>
                  {folders?.map((f: any) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-3">
                  {isFetchingFolders ? (
                    <Loader2 className="animate-spin text-gray-400" size={16} />
                  ) : (
                    "▼"
                  )}
                </div>
              </div>
            )}
            {isFolderError && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={12} /> Failed to load folders.
              </p>
            )}
          </div>

          {/* Preview Button */}
          <button
            onClick={handlePreviewClick}
            disabled={isPreviewing || !file || !schemaName}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 font-bold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 dark:bg-orange-600 dark:hover:bg-orange-700"
          >
            {isPreviewing ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Eye size={18} />
            )}
            Analyze & Preview Schema
          </button>
        </div>

        {/* AI Preview Table Section */}
        {showPreview && previewData && (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 animate-in fade-in slide-in-from-bottom-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Sparkles size={20} className="text-orange-500" /> Generated
                Schema Structure
              </h3>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600 dark:bg-orange-900/30">
                AI Inferred
              </span>
            </div>

            {/* JSON Tree View Card */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-950/50">
              <div className="font-mono text-sm">
                <ReactJson
                  src={{
                    root: {
                      name: schemaName,
                      description: previewData.description,
                      properties: previewData.properties,
                      keys: previewData.keys,
                    },
                  }}
                  theme="monokai"
                  displayDataTypes={false}
                />
              </div>
            </div>


            <button
              onClick={handleFinalCreate}
              disabled={isCreating}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition-all active:scale-[0.99]"
            >
              {isCreating ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={18} />
                  Confirm & Finalize Schema
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
