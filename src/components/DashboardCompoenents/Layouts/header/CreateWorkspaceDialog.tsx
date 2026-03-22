"use client";

import React, { useState } from "react";
import { useCreateWorkspaceMutation } from "@/redux/service/workspace";
import { Loader2, LayoutGrid, AlignLeft, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { setActiveWorkspace } from "@/redux/feature/workspace/workspaceSlice";

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWorkspaceDialog({
  isOpen,
  onClose,
}: CreateWorkspaceDialogProps) {
  const dispatch = useDispatch();
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  if (!isOpen) return null;

  const handleCreate = async () => {

    if (!workspaceName.trim()) {
      toast({
        title: "Input Required",
        description: "សូមបញ្ចូលឈ្មោះ Workspace របស់អ្នក",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      const response = await createWorkspace({
        body: {
          name: workspaceName.trim(),
          description: description.trim(),
        },
      }).unwrap();
      const wsData = (response as any).data;

      if (wsData) {
        dispatch(
          setActiveWorkspace({
            id: wsData.id,
            name: wsData.name,
          }),
        );
      } else if (response?.id) {

        dispatch(
          setActiveWorkspace({
            id: response.id,
            name: response.name,
          }),
        );
      }

      toast({
        title: "Workspace Created Successfully 🎉",
        description: `Workspace "${workspaceName}" ត្រូវបានកំណត់ជា Active រួចរាល់។`,
        duration: 3000,
      });


      setWorkspaceName("");
      setDescription("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description:
          error?.data?.message || "មានបញ្ហាកើតឡើង ពេលបង្កើត Workspace",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-[2px] duration-300 animate-in fade-in">
      <div className="w-full max-w-md scale-95 transform rounded-2xl border border-gray-100 bg-white p-7 shadow-2xl transition-all animate-in zoom-in-95 dark:border-gray-800 dark:bg-gray-900">
        {/* Header Section */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10">
            <LayoutGrid className="size-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight dark:text-white">
              Create workspace
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              រៀបចំគម្រោង និងសហការជាមួយក្រុមរបស់អ្នក។
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Workspace Name Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Plus className="size-3.5" />
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="ឧទាហរណ៍៖ Mobile App Project"
              disabled={isLoading}
              autoFocus
              className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <AlignLeft className="size-3.5" />
              Description{" "}
              <span className="text-xs font-normal text-gray-400">
                (Optional)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="រៀបរាប់បន្តិចបន្តួចអំពី Workspace នេះ..."
              disabled={isLoading}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md px-5 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-purple-600 px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 active:scale-95 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4 stroke-[3px]" />
            )}
            {isLoading ? "Creating..." : "Create Workspace"}
          </button>
        </div>
      </div>
    </div>
  );
}
