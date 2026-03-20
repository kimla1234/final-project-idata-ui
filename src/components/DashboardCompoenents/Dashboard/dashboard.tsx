"use client";

import React from "react";
import { useRouter } from "next/navigation"; // 🎯 សម្រាប់ Next.js
import CreateSchema from "./CreateSchema"; // 🎯 Import Component Sheet របស់បង
import {
  Database,
  FileText,
  Sparkles,
  Layout,
  BrainCircuit,
  ArrowRight,
  Zap,
  Plus,
  Upload,
  BarChart3,
  Settings,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectActiveWorkspaceId } from "@/redux/feature/workspace/workspaceSlice";
import AIGenerateSchema from "./AIGenerateSchema";

export default function Dashboard() {
  const router = useRouter();
  // 🎯 ទាញ Workspace ID ពិតប្រាកដពី Redux
  const activeWorkspaceId = useSelector(selectActiveWorkspaceId);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen space-y-10 bg-white rounded-lg p-8 font-sans dark:bg-[#0B0F1A]">
      {/* --- Header Section --- */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-700 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-md text-slate-500">
            Welcome back, Kimla. Here’s what’s happening with your APIs.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleNavigation("/settings")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <Settings size={16} /> Settings
          </button>

        </div>
      </div>

      {/* --- Stats Overview --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Schema"
          value="168"
          icon={<Database size={18} />}
          color="orange"
        />
        <StatCard
          label="Uploaded Files"
          value="0"
          icon={<FileText size={18} />}
          color="blue"
        />
        <StatCard
          label="AI Generations"
          value="24"
          icon={<Sparkles size={18} />}
          color="purple"
        />
        <StatCard
          label="Total Resources"
          value="192"
          icon={<BarChart3 size={18} />}
          color="green"
        />
      </div>

      {/* --- Main Action Cards --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <CreateSchema folderId={null} workspaceId={activeWorkspaceId || 0}>
          {" "}
          {/* 🎯 ដាក់ Workspace ID ពិតប្រាកដនៅទីនេះ */}
          <div className="cursor-pointer outline-none">
            <ActionCard
              title="New Schema"
              description="Build your API structure from scratch using our visual builder."
              icon={<Plus className="text-orange-600" />}
              iconBg="bg-orange-50"
              btnText="Build Manually"
              borderColor="hover:border-orange-200"
            />
          </div>
        </CreateSchema>

        {/* Card 2: Upload Files */}
        <ActionCard
          title="Upload Files"
          description="Import JSON, SQL, or Excel to auto-generate your endpoints."
          icon={<Upload className="text-blue-600" />}
          iconBg="bg-blue-50"
          btnText="Import Data"
          borderColor="hover:border-blue-200"
          onClick={() => handleNavigation("/dashboard/upload-file")}
        />

        {/* Card 3: AI Generate (ប្តូរមកប្រើ AIGenerateSchema Sheet វិញ) */}
        <AIGenerateSchema workspaceId={activeWorkspaceId || 0} folderId={0}>
          <div className="group flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-purple-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 shadow-lg shadow-purple-100 dark:shadow-none">
              <BrainCircuit className="size-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  AI Generate
                </h3>
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                  AI POWERED
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Transform your ideas into a complete API schema using natural
                language.
              </p>
            </div>
            <div className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-100 transition-all group-hover:bg-purple-700">
              Generate with AI <ArrowRight size={16} />
            </div>
          </div>
        </AIGenerateSchema>
      </div>
    </div>
  );
}

// --- កែសម្រួល ActionCard ឱ្យទទួល onClick ---
function ActionCard({
  title,
  description,
  icon,
  iconBg,
  btnText,
  borderColor,
  onClick,
}: any) {
  return (
    <div
      className={`group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all  dark:bg-slate-900 ${borderColor}`}
    >
      <div
        className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <button
        onClick={onClick}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
      >
        {btnText} <ArrowRight size={16} />
      </button>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
  const colorMap: any = {
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    green: "text-green-600 bg-green-50",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center gap-3">
        <div className={`rounded-lg p-2 ${colorMap[color]}`}>{icon}</div>
        <p className="text-xs font-bold uppercase tracking-tight text-slate-500">
          {label}
        </p>
      </div>
      <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </h4>
    </div>
  );
}
