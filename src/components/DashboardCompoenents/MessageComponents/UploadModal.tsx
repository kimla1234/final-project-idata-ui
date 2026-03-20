"use client";
import React from "react";
import { X, Upload, FileIcon, Pause, AlertCircle } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Media Upload
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Add your documents here, and you can upload up to 5 files max
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Dropzone */}
        <div className="mt-6 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50/40 px-6 py-10 flex flex-col items-center text-center hover:bg-purple-50 transition">
          <div className="bg-purple-600 text-white p-3 rounded-lg shadow mb-4">
            <Upload size={22} />
          </div>

          <p className="text-sm font-medium text-slate-700">
            Drag your file(s) to start uploading
          </p>

          <div className="flex items-center gap-3 w-full my-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 uppercase">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button className="px-5 py-2 text-sm font-semibold border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-100 transition">
            Browse files
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Only support .jpg, .png, .svg and .zip files
        </p>

        {/* File List */}
        <div className="mt-6 space-y-3">

          {/* Uploaded file */}
          <div className="flex items-center justify-between border rounded-xl px-3 py-3 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                <FileIcon size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  assets.zip
                </p>
                <p className="text-xs text-slate-400">5.3MB</p>
              </div>
            </div>

            <button className="p-1 rounded hover:bg-slate-100">
              <X size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Uploading */}
          <div className="border rounded-xl px-4 py-3 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-slate-800">
                Uploading…
              </span>

              <div className="flex gap-2">
                <Pause
                  size={18}
                  className="text-slate-400 cursor-pointer hover:text-slate-600"
                />
                <AlertCircle
                  size={18}
                  className="text-red-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="text-xs text-slate-500 mb-2">
              <span className="font-semibold">65%</span>
              <span className="ml-2">• 30 seconds remaining</span>
            </div>

            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-purple-600 rounded-full transition-all" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled
            className="px-6 py-2 text-sm font-semibold rounded-lg bg-slate-200 text-slate-400 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
