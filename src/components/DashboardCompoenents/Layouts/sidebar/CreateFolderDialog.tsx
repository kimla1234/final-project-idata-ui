"use client";

import React, { useState } from "react";
import { useCreateFolderMutation } from "@/redux/service/folder";
import { Loader2, FolderPlus, AlignLeft, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: number;
}

export function CreateFolderDialog({
  isOpen,
  onClose,
  workspaceId,
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const [createFolder, { isLoading }] = useCreateFolderMutation();

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!folderName.trim()) {
      toast({
        title: "Input Required",
        description: "សូមបញ្ចូលឈ្មោះ Folder",
        variant: "destructive",
      });
      return;
    }

    try {
      // បោះតែ workspaceId និង name ឱ្យដូច Postman ដែលអ្នកបានតេស្ត
      await createFolder({
        workspaceId: workspaceId,
        body: { name: folderName.trim() }, // ផ្ញើតែ name ប៉ុណ្ណោះ
      }).unwrap();

      toast({
        title: "Folder Created 🎉",
        description: `Folder "${folderName}" បង្កើតជោគជ័យ។`,
      });

      setFolderName("");
      setDescription(""); // សម្អាត state description ដែរ
      onClose();
    } catch (error: any) {
      toast({
        title: "Error 500",
        description: error?.data?.message || "Server មិនទទួលយកទិន្នន័យនេះទេ",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-[2px] duration-100 animate-in fade-in">
      <div className="w-full max-w-md scale-95 transform rounded-2xl border border-gray-100 bg-white p-7 shadow-2xl transition-all animate-in zoom-in-95 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
              <FolderPlus className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">New Folder</h2>
              <p className="text-sm text-gray-500">
                បន្ថែម Folder ថ្មីទៅកាន់ Workspace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="size-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">
              Folder Name *
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="ឧទាហរណ៍៖ Customer Data"
              className="w-full rounded-xl border bg-gray-50/30 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold dark:text-gray-300">
              <AlignLeft className="size-3.5" /> Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ព័ត៌មានបន្ថែម..."
              rows={3}
              className="w-full resize-none rounded-xl border bg-gray-50/30 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FolderPlus className="size-4" />
            )}
            {isLoading ? "Creating..." : "Create Folder"}
          </button>
        </div>
      </div>
    </div>
  );
}
