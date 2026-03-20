"use client";

import React, { useMemo, useState } from "react";
import {
  Play,
  Share2,
  MoreHorizontal,
  FileText,
  Sparkles,
  ChevronDown,
  Code2,
  Clock,
  Send,
  X,
  MessageSquare,
  Layout,
  Edit3,
  Globe,
  Zap,
  Send as PublishIcon,
  Database,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CreateSchema from "./CreateSchema";
import CreateTempate from "../MessageComponents/CreateTempate";
import { useParams } from "next/navigation";
import { useGetFoldersByWorkspaceQuery } from "@/redux/service/folder";
import {
  useDeleteApiSchemeMutation,
  useGetApiSchemesByFolderQuery,
} from "@/redux/service/apiScheme";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ConfirmModalDelete } from "./ConfirmModalDelete";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function SchemaComponent() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // ចំនួន Schema ដែលត្រូវបង្ហាញក្នុង ១ ទំព័រ
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ១. ចាប់យក IDs ពី URL និងបំប្លែងជា Number
  const params = useParams();
  const workspaceId = params?.workspaceId ? Number(params.workspaceId) : null;
  const folderId = params.id ? Number(params.id) : 0;

  // ២. ទាញយក Folders (ប្រើ workspaceId)
  const { data: folders, isSuccess: isFolderLoaded } =
    useGetFoldersByWorkspaceQuery(workspaceId as number, {
      skip: !workspaceId,
    });

  const currentFolder = useMemo(() => {
    if (!folders || !folderId) return null;
    return folders.find((f: any) => Number(f.id) === folderId);
  }, [folders, folderId]);

  // ៤. ទាញយក Schemas តាម folderId
  const { data: schemes, isLoading: isSchemesLoading } =
    useGetApiSchemesByFolderQuery(folderId as number, {
      skip: !folderId,
    });

  const [deleteApiScheme, { isLoading: isDeleting }] =
    useDeleteApiSchemeMutation();

  const openDeleteModal = (e: React.MouseEvent, id: number, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSchema({ id, name });
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!selectedSchema) return;

    try {
      await deleteApiScheme(selectedSchema.id).unwrap();
      toast({
        title: "ជោគជ័យ",
        description: `បានលុប Schema "${selectedSchema.name}" រួចរាល់`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "បរាជ័យ",
        description: "មិនអាចលុបទិន្នន័យបានឡើយ",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedSchema(null);
    }
  };
  const tabs = [
    {
      id: "Overview",
      label: "Overview",
      icon: <Layout className="size-3.5" />,
    },
    {
      id: "Editor",
      label: "Schema Editor",
      icon: <Edit3 className="size-3.5" />,
    },
    {
      id: "Docs",
      label: "Documentation",
      icon: <FileText className="size-3.5" />,
    },
    {
      id: "Swagger",
      label: "Swagger UI",
      icon: <Globe className="size-3.5" />,
    },
    {
      id: "Publish",
      label: "Publish",
      icon: <PublishIcon className="size-3.5" />,
    },
  ];

  // គណនាទិន្នន័យសម្រាប់ទំព័របច្ចុប្បន្ន
  const paginatedSchemes = useMemo(() => {
    if (!schemes) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return schemes.slice(startIndex, startIndex + itemsPerPage);
  }, [schemes, currentPage]);

  const totalPages = Math.ceil((schemes?.length || 0) / itemsPerPage);
  return (
    <div className="h-full w-full overflow-hidden rounded-md border bg-white font-sans dark:bg-[#0f172a]">
      <ResizablePanelGroup className="h-full w-full">
        {/* --- Main Content Panel --- */}
        <ResizablePanel defaultSize={isAiOpen ? 70 : 100} minSize={20}>
          <div className="flex h-screen flex-col border-r dark:border-gray-800">
            {/* Header Section */}
            <div className="border-b px-6 pt-4 dark:border-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded bg-orange-100 p-1 dark:bg-orange-900/30">
                      <Code2 className="size-4 text-orange-600" />
                    </div>
                    <h1 className="text-[15px] font-bold text-gray-800 dark:text-white">
                      {currentFolder ? currentFolder.name : "Loading..."}
                    </h1>
                  </div>
                  <CreateSchema folderId={folderId} />
                </div>

                <div className="flex items-center gap-2">
                  {!isAiOpen && (
                    <button
                      onClick={() => setIsAiOpen(true)}
                      className="flex items-center gap-1.5 rounded-md border border-orange-200 px-3 py-1.5 text-[11px] font-bold text-orange-600 transition hover:bg-orange-50"
                    >
                      <Sparkles className="size-3.5" /> Ask AI
                    </button>
                  )}
                  <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <MoreHorizontal className="size-4" />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex h-9 items-center gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative flex h-full items-center gap-1.5 px-1 text-[12px] transition-all",
                      activeTab === tab.id
                        ? "border-b-2 border-orange-500 font-semibold text-orange-500"
                        : "font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-300",
                    )}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto bg-[#fafafa] p-10 dark:bg-[#0f172a]">
              <div className="mx-auto max-w-4xl">
                {activeTab === "Overview" && (
                  <div className="duration-500 animate-in fade-in">
                    <h2 className="mb-5 text-[32px] font-extrabold dark:text-white">
                      API Overview
                    </h2>

                    {/* Meta Info Bar */}
                    <div className="mb-10 flex items-center gap-6 border-b pb-6 text-[13px] text-gray-500 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-600">
                          Y
                        </div>
                        <span>You</span>
                      </div>
                      <span>{schemes?.length || 0} Schemas</span>
                      <div className="flex items-center gap-1.5 opacity-80">
                        <Clock className="size-3.5" />
                        <span>March 09, 2026</span>
                      </div>
                    </div>

                    {paginatedSchemes.map((schema) => (
                      <div
                        key={schema.id}
                        className="group mb-3 flex items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-orange-200 dark:border-gray-800 dark:bg-gray-900"
                      >
                        {/* ផ្នែកខាងឆ្វេង៖ ព័ត៌មាន Schema */}
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                            <Database className="size-4 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                              {schema.name}
                            </h3>
                            <p className="line-clamp-1 max-w-[200px] font-mono text-[11px] text-gray-400">
                              {schema.endpointUrl}
                            </p>
                          </div>
                        </div>

                        {/* ផ្នែកខាងស្តាំ៖ Tabs Quick Actions & Delete */}
                        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                          {tabs.map((tab) => (
                            <Link
                              key={tab.id}
                              href={`/schema/${schema.id}?tab=${tab.id}`}
                              className="flex items-center gap-1 rounded-md border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-[10px] font-bold text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-orange-400"
                            >
                              {tab.icon}
                              <span className="hidden lg:inline">
                                {tab.label}
                              </span>
                            </Link>
                          ))}

                          {/* ប៊ូតុងលុប */}
                          <button
                            onClick={(e) =>
                              openDeleteModal(e, schema.id, schema.name)
                            }
                            className="ml-2 flex items-center justify-center rounded-md border border-red-50 p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:border-red-900/20 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* 🎯 បន្ថែមផ្នែក Pagination នៅទីនេះ */}
                    {schemes && schemes.length > itemsPerPage && (
                      <div className="mt-8 flex justify-center border-t pt-6 dark:border-gray-800">
                        <Pagination>
                          <PaginationContent>
                            {/* ប៊ូតុង Previous */}
                            <PaginationItem>
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(prev - 1, 1),
                                  )
                                }
                                disabled={currentPage === 1}
                                className={cn(
                                  "flex items-center gap-1 px-3 py-2 text-sm font-medium transition hover:text-orange-600 disabled:opacity-50 disabled:hover:text-current",
                                )}
                              >
                                <PaginationPrevious />
                              </button>
                            </PaginationItem>

                            {/* លេខទំព័រ */}
                            {[...Array(totalPages)].map((_, index) => {
                              const pageNum = index + 1;
                              return (
                                <PaginationItem key={pageNum}>
                                  <button
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={cn(
                                      "flex size-9 items-center justify-center rounded-md text-sm font-bold transition-all",
                                      currentPage === pageNum
                                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
                                    )}
                                  >
                                    {pageNum}
                                  </button>
                                </PaginationItem>
                              );
                            })}

                            {/* ប៊ូតុង Next */}
                            <PaginationItem>
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages),
                                  )
                                }
                                disabled={currentPage === totalPages}
                                className={cn(
                                  "flex items-center gap-1 px-3 py-2 text-sm font-medium transition hover:text-orange-600 disabled:opacity-50 disabled:hover:text-current",
                                )}
                              >
                                <PaginationNext />
                              </button>
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}

                    {/* AI Suggestion Box 
                    <div
                      onClick={() => setIsAiOpen(true)}
                      className="group cursor-pointer rounded-xl border-2 border-dashed border-orange-100 bg-white p-6 shadow-sm transition-all hover:border-orange-400 dark:border-orange-900/30 dark:bg-gray-900"
                    >
                      <div className="flex gap-4">
                        <div className="rounded-lg bg-orange-50 p-3 transition-transform group-hover:scale-110 dark:bg-orange-900/20">
                          <Sparkles className="size-5 text-orange-500" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-gray-800 dark:text-white">
                            Generate Schema with AI
                          </h4>
                          <p className="text-[13px] text-gray-500">
                            Use AI to automatically build your MySQL schema or
                            documentation.
                          </p>
                        </div>
                      </div>
                    </div>
*/}
                  </div>
                )}

                {activeTab !== "Overview" && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Zap className="mb-2 size-10 opacity-10" />
                    <p className="text-sm italic">
                      {activeTab} content view...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResizablePanel>

        {/* --- Resizable AI Chat Panel --- */}
        {isAiOpen && (
          <>
            {/* handle សម្រាប់ទាញ */}

            <ResizablePanel
              defaultSize={100}
              minSize={300} // អាចបង្រួមបានតូចដល់ ១៥%
              maxSize={500} // អាចពង្រីកបានធំដល់ ៨០% (បងអាចដូរលេខនេះតាមចិត្ត)
              className="w-fit"
            >
              <div className="flex h-full w-[200px] flex-col border-l bg-white dark:border-gray-800 dark:bg-[#1e293b]">
                {/* --- Chat Header --- */}
                <div className="flex items-center justify-between border-b bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-orange-500" />
                    <span className="truncate text-[13px] font-bold text-orange-600 dark:text-white">
                      Gemini AI Assistant
                    </span>
                  </div>
                  <button
                    onClick={() => setIsAiOpen(false)}
                    className="rounded p-1 transition hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <X className="size-4 text-gray-400" />
                  </button>
                </div>

                {/* --- Chat Area --- */}
                <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto bg-white p-5 dark:bg-gray-900/20">
                  <div className="flex gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-[10px] font-bold text-orange-600">
                      AI
                    </div>
                    <div className="flex-1 rounded-2xl rounded-tl-none bg-orange-50 p-3 text-[12px] leading-relaxed shadow-sm dark:bg-gray-800">
                      បាទសួស្តីបង Kimla! តើបងចង់ឱ្យខ្ញុំជួយ Update **Schema**
                      របស់ Node_mysql នេះបែបណាដែរ?
                    </div>
                  </div>
                </div>

                {/* --- Input Area --- */}
                <div className="w-full border-t bg-white p-4 dark:border-gray-800 dark:bg-gray-900/30">
                  <div className="group relative">
                    <textarea
                      placeholder="Type a message..."
                      className="min-h-[80px] w-full resize-none rounded-xl border bg-gray-50 p-3 pr-10 text-[12px] outline-none focus:ring-1 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800"
                    />
                    <button className="absolute bottom-2 right-2 rounded-lg bg-orange-500 p-1.5 text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600">
                      <Send className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
      <ConfirmModalDelete
        open={isDeleteModalOpen}
        isLoading={isDeleting}
        title={`លុប Schema "${selectedSchema?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
