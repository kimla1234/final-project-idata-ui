"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmModalDelete({
  open,
  title = "តើអ្នកពិតជាចង់លុបមែនទេ?",
  description = "សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានឡើយ។",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm scale-100 rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 dark:bg-gray-900 border dark:border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        
        <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            បោះបង់
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "កំពុងលុប..." : "យល់ព្រមលុប"}
          </button>
        </div>
      </div>
    </div>
  );
}