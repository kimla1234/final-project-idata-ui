import { cn } from "@/lib/utils";
import { FileText, Eye, Download, CheckCircle2, Clock, X } from "lucide-react";

interface DocumentProps {
  title: string;
  fileName: string;
  size: string;
  date: string;
  status: "Approved" | "Pending Review";
}

export const DocumentCard = ({ title, fileName, size, date, status }: DocumentProps) => {
  const isApproved = status === "Approved";

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-gray-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Smaller File Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FileText size={20} />
          </div>
          
          <div className="overflow-hidden">
            <h4 className="truncate text-sm font-bold text-slate-800">{title}</h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="truncate max-w-[150px]">{fileName}</span>
              <span>•</span>
              <span className="shrink-0">{size}</span>
            </div>
          </div>
        </div>

        {/* Status Badge - Smaller padding */}
        <div className={cn(
          "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
          isApproved ? "bg-emerald-50 text-emerald-600" : "bg-blue-50/50 text-blue-600"
        )}>
          {isApproved ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          <span className="whitespace-nowrap">{status}</span>
        </div>
      </div>

      {/* Action Buttons - Compact height */}
      <div className="mt-0 flex items-center justify-between border-t border-gray-50 pt-3">
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-gray-50">
            <Eye size={14} /> Preview
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-gray-50">
            <Download size={14} /> Download
          </button>
        </div>

        {!isApproved && (
          <div className="flex gap-1.5">
            <button className="rounded-md bg-emerald-600 p-1 text-white hover:bg-emerald-700">
              <CheckCircle2 size={14} />
            </button>
            <button className="rounded-md bg-rose-600 p-1 text-white hover:bg-rose-700">
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};