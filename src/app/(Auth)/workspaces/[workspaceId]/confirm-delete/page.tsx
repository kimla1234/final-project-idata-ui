"use client";

import { useState, use } from "react"; 
import { useRouter } from "next/navigation";
import { useDeleteWorkspaceMutation } from "@/redux/service/workspace";
import { Loader2, ShieldAlert, ArrowLeft, TriangleAlert, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function ConfirmDeletePage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const router = useRouter();
  

  const { workspaceId } = use(params); 
  
  const [password, setPassword] = useState("");
  const [deleteWorkspace, { isLoading }] = useDeleteWorkspaceMutation();

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspaceId) {
      alert("រកមិនឃើញ Workspace ID ឡើយ!");
      return;
    }

    try {

      await deleteWorkspace({ id: Number(workspaceId), password }).unwrap();
      router.push("/dashboard");
    } catch (err: any) {
      alert(err?.data?.message || "Password មិនត្រឹមត្រូវ!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 pb-0 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
            <ShieldAlert className="h-7 w-7 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">បញ្ជាក់ការលុប</h1>
          <p className="mt-2 text-[15px] text-gray-500">
            អ្នកកំពុងស្នើសុំលុប Workspace <span className="font-semibold text-gray-900">#{workspaceId}</span>
          </p>
        </div>

        <div className="p-8">
          {/* Danger Zone Warning */}
          <div className="mb-6 flex gap-3 rounded-lg bg-amber-50 p-4 border border-amber-100">
            <TriangleAlert className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <span className="font-bold">ប្រយ័ត្ន៖</span> រាល់ទិន្នន័យទាំងអស់ក្នុង Workspace នេះនឹងត្រូវលុបជាស្ថាពរ និងមិនអាចទាញយកមកវិញបានទេ។
            </p>
          </div>

          <form onSubmit={handleConfirm} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Password សម្រាប់ផ្ទៀងផ្ទាត់
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  placeholder="បញ្ចូលលេខសម្ងាត់របស់អ្នក"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 placeholder:text-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button 
                disabled={isLoading}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-sm shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> កំពុងលុប...
                  </span>
                ) : (
                  "លុប Workspace ជាស្ថាពរ"
                )}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => router.back()}
              className="group flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
              បោះបង់ និងត្រឡប់ក្រោយ
            </button>
          </form>
        </div>


        <div className="h-1.5 w-full bg-red-600" />
      </div>
    </div>
  );
}