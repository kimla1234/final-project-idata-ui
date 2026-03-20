"use client";

import React, { useState, useMemo, useEffect } from "react";
import { X, Loader2, Mail, User, Tag, CheckCircle2, Plus, Trash2, Layout ,Grid, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateTenantMutation, useGetTenantsByFolderQuery } from "@/redux/service/tenant";
import { TenantRequest } from "@/types/tenant";
import { cn } from "@/lib/utils";

interface AddTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  folderId: number;
}

export function AddTenantDialog({ isOpen, onClose, folderId }: AddTenantDialogProps) {
  const { toast } = useToast();
  const [createTenant, { isLoading }] = useCreateTenantMutation();

  // --- ១. Fetch ទិន្នន័យចាស់ៗក្នុង Folder ដើម្បីដឹងពី Dynamic Labels ---
  const { data: existingTenants = [] } = useGetTenantsByFolderQuery(folderId, {
    skip: !isOpen || !folderId,
  });

  // រកមើល Unique Labels ដែលធ្លាប់មានក្នុង Folder នេះ
  const folderSpecificLabels = useMemo(() => {
    const labels = new Set<string>();
    existingTenants.forEach((t: any) => {
      t.additionalInfo?.forEach((info: any) => {
        if (info.label) labels.add(info.label);
      });
    });
    return Array.from(labels);
  }, [existingTenants]);

  // --- ២. State Management ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tags: "",
    status: true,
  });

  // State សម្រាប់កាន់តម្លៃនៃ Auto-labels (Fields ដែលលោតតាម Folder)
  const [dynamicData, setDynamicData] = useState<Record<string, string>>({});

  // State សម្រាប់ Manual Dynamic Fields (User ចុចថែមខ្លួនឯង)
  const [customFields, setCustomFields] = useState([{ label: "", value: "" }]);

  // Update dynamicData នៅពេល Folder Labels ប្រែប្រួល
  useEffect(() => {
    if (isOpen) {
      const initialData: Record<string, string> = {};
      folderSpecificLabels.forEach((label) => {
        initialData[label] = "";
      });
      setDynamicData(initialData);
    }
  }, [folderSpecificLabels, isOpen]);

  if (!isOpen) return null;

  // --- Logic សម្រាប់ Manual Fields ---
  const addField = () => setCustomFields([...customFields, { label: "", value: "" }]);
  const removeField = (index: number) => {
    if (customFields.length > 1) setCustomFields(customFields.filter((_, i) => i !== index));
  };
  const handleCustomFieldChange = (index: number, key: "label" | "value", val: string) => {
    const newFields = [...customFields];
    newFields[index][key] = val;
    setCustomFields(newFields);
  };

  // --- Logic សម្រាប់ Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ប្រមូលពី Auto-fields (លោតតាម Folder)
      const autoFields = Object.entries(dynamicData)
        .filter(([_, value]) => value.trim() !== "")
        .map(([label, value]) => ({ label, value }));

      // ប្រមូលពី Manual-fields (ថែមដោយដៃ)
      const manualFields = customFields
        .filter((f) => f.label.trim() !== "" && f.value.trim() !== "")
        .map((f) => ({ label: f.label.trim(), value: f.value.trim() }));

      const requestBody: TenantRequest = {
        name: formData.name,
        email: formData.email,
        status: formData.status,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter((t) => t !== "") : [],
        additionalInfo: [...autoFields, ...manualFields],
      };

      await createTenant({ folderId, body: requestBody }).unwrap();
      
      toast({ title: "ជោគជ័យ 🎉", description: "បង្កើតអតិថិជនបានជោគជ័យ!" });
      onClose();
      
      // Reset States
      setFormData({ name: "", email: "", tags: "", status: true });
      setDynamicData({});
      setCustomFields([{ label: "", value: "" }]);
    } catch (error: any) {
      toast({ title: "Error", description: error?.data?.message || "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-[550px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white/95 px-8 py-6 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Add New Tenant</h2>
            <p className="text-sm text-slate-500">បន្ថែមអតិថិជនថ្មីទៅក្នុង Folder របស់អ្នក</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <X className="size-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
          
          {/* Section 1: Main Information */}
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600" />
                <input
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600" />
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Folder Specific Fields (ស្វ័យប្រវត្តិ) */}
          {folderSpecificLabels.length > 0 && (
            <div className="space-y-4 rounded-2xl bg-purple-50/50 p-5 border border-purple-100/50">
              <div className="flex items-center gap-2 text-purple-700">
                <LayoutGrid className="size-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">Folder Specific Fields</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {folderSpecificLabels.map((label) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 capitalize">{label}</label>
                    <input
                      placeholder={`Enter ${label}...`}
                      value={dynamicData[label] || ""}
                      onChange={(e) => setDynamicData({ ...dynamicData, [label]: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags & Status */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tags</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600" />
                <input
                  placeholder="VIP, Member..."
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-purple-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={cn("rounded-full p-2", formData.status ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-400")}>
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Account Status</p>
                  <p className="text-[11px] text-slate-500">Activate this member immediately</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" checked={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.checked })} />
                <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-purple-600 peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>

          {/* Section 3: Manual Additional Fields */}
          <div className="space-y-4 border-t border-dashed pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Other Information</h3>
              <button type="button" onClick={addField} className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                <Plus className="size-3" /> Add Custom Field
              </button>
            </div>

            <div className="space-y-3">
              {customFields.map((field, index) => (
                <div key={index} className="flex gap-2 group relative">
                  <input
                    placeholder="Label (e.g. Website)"
                    value={field.label}
                    onChange={(e) => handleCustomFieldChange(index, "label", e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-purple-500"
                  />
                  <input
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => handleCustomFieldChange(index, "value", e.target.value)}
                    className="flex-[1.5] rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-purple-500"
                  />
                  {customFields.length > 1 && (
                    <button type="button" onClick={() => removeField(index)} className="text-red-400 hover:text-red-600 px-1">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-slate-200 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] rounded-2xl bg-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : "Create Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}