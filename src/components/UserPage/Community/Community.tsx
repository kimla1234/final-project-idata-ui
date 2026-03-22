"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Search,
  GitFork,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Loader2,
  FolderPlus,
  ArrowRight,
  LayoutGrid,
  ChevronDown,
  Check,
  X,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  useGetCommunityFeedQuery,
  useForkApiSchemeMutation,
} from "@/redux/service/community";
import { useGetMyWorkspacesQuery } from "@/redux/service/workspace";
import { useGetFoldersByWorkspaceQuery } from "@/redux/service/folder";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { UserProfilePreview } from "./UserProfilePreview";
import { LuFolderUp } from "react-icons/lu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { HoverCardPortal } from "@radix-ui/react-hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/DashboardCompoenents/ui/dropdown-menu";
import ApiDetailsSheet from "./ApiDetailsSheet";
import { RiDashboardLine } from "react-icons/ri";

export default function Community() {
  // --- 🎯 Refs ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPageLoading = useRef(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // --- 🎯 States ---
  const [inputValue, setInputValue] = useState("");
  const [queryTerm, setQueryTerm] = useState("");
  const [page, setPage] = useState(0); 
  const [allApis, setAllApis] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  // --- 🎯 API Queries ---
  const {
    data: newApis,
    isLoading: isLoadingFeed,
    isFetching,
  } = useGetCommunityFeedQuery({
    search: queryTerm,
    page: page,
    size: 10,
  });

  const { data: workspaces } = useGetMyWorkspacesQuery();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(
    null,
  );
  const [targetFolderId, setTargetFolderId] = useState<string>("");
  const { data: folders, isLoading: isLoadingFolders } =
    useGetFoldersByWorkspaceQuery(selectedWorkspaceId ?? 0, {
      skip: !selectedWorkspaceId,
    });

  const [isForkModalOpen, setIsForkModalOpen] = useState(false);
  const [selectedApi, setSelectedApi] = useState<any>(null);
  const [forkApi, { isLoading: isForking }] = useForkApiSchemeMutation();

  // --- 🎯 Infinite Scroll Logic ---

  useEffect(() => {
    if (newApis) {
      setAllApis((prev) => {
        const combined = page === 0 ? newApis : [...prev, ...newApis];
        const uniqueMap = new Map();
        combined.forEach((item) => uniqueMap.set(item.id, item));
        return Array.from(uniqueMap.values());
      });

      if (newApis.length < 10) setHasMore(false);
      else setHasMore(true);


      isPageLoading.current = false;
    }
  }, [newApis, page]);


  useEffect(() => {
    setPage(0);
    setHasMore(true);
    isPageLoading.current = false;
  }, [queryTerm]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];


      if (
        target.isIntersecting &&
        hasMore &&
        !isFetching &&
        !isLoadingFeed &&
        !isPageLoading.current
      ) {

        isPageLoading.current = true;

        setPage((prev) => {
          console.log("🚀 កំពុងទាញយក Page បន្ទាប់:", prev + 1);
          return prev + 1;
        });
      }
    },
    [hasMore, isFetching, isLoadingFeed],
  );

  useEffect(() => {

    if (!hasMore) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.5, 
      rootMargin: "0px", 
    });

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleObserver, hasMore]); 

  // --- 🎯 Filter & Sort Logic ---
  const filteredAndSortedApis = useMemo(() => {
    return [...allApis]
      .filter((api) => api.isPublished || api.isPublic)
      .sort((a, b) => (b.forkCount || 0) - (a.forkCount || 0));
  }, [allApis]);

  useEffect(() => {
    if (allApis.length > 0 && allCategories.length === 0 && queryTerm === "") {
      const uniqueCats = Array.from(
        new Set(allApis.map((api: any) => api.name)),
      ) as string[];
      setAllCategories(uniqueCats);
    }
  }, [allApis, allCategories.length, queryTerm]);

  // --- 🎯 Handlers ---
  const handleCategoryClick = (cat: string) => {
    if (queryTerm === cat) {
      setQueryTerm("");
      setInputValue("");
    } else {
      setInputValue(cat);
      setQueryTerm(cat);
    }
  };

  const handleTriggerSearch = () => setQueryTerm(inputValue);
  const handleClearSearch = () => {
    setInputValue("");
    setQueryTerm("");
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleTriggerSearch();
  };

  const handleForkClick = (api: any) => {
    setSelectedApi(api);
    if (workspaces && workspaces.length > 0)
      setSelectedWorkspaceId(workspaces[0].id);
    setIsForkModalOpen(true);
  };

  useEffect(() => {
    if (folders && folders.length > 0)
      setTargetFolderId(folders[0].id.toString());
    else setTargetFolderId("");
  }, [folders]);

const handleConfirmFork = async () => {
  if (!selectedApi || !targetFolderId) return;
  
  try {
    const response = await forkApi({
      originalId: selectedApi.id,
      targetFolderId: Number(targetFolderId),
    }).unwrap();

    // Success Toast
    toast({
      title: "API Forked Successfully!",
      description: response?.message || `The API has been copied to your target folder.`,
      variant: "success", // Ensure your shadcn/ui toaster has a success variant
      duration: 3000,
    });

    setIsForkModalOpen(false);
  } catch (error: any) {
    console.error(error);

    // Error Toast
    toast({
      title: "Fork Failed",
      description: error?.data?.message || "Something went wrong while forking the API.",
      variant: "destructive", // Default shadcn error variant
      duration: 4000,
    });
  }
};

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo =
        direction === "left" ? scrollLeft - 300 : scrollLeft + 300;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return "ទើបតែឥឡូវ";
    const now = new Date();
    const before = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - before.getTime()) / 1000);
    if (diffInSeconds < 60) return "មុននេះបន្តិច";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} នាទីមុន`;
    return `${Math.floor(diffInMinutes / 60)} ម៉ោងមុន`;
  };

  const bgColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-rose-500",
  ];

  return (
    <div className="flex min-h-screen justify-center bg-[#f8fafc] font-sans text-[#1e293b]">
      <div className="w-full">
        {/* --- Header Section --- */}
        <div className="sticky top-[80px] z-40 space-y-6 bg-[#f8fafc]/95 pb-4 pt-8 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4">
            <div className="group relative flex flex-1 items-center">
              <div className="absolute left-4 text-gray-400 transition-colors group-focus-within:text-blue-500">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search API models by name..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-24 text-sm shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {inputValue && (
                  <button
                    onClick={handleClearSearch}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={handleTriggerSearch}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 active:scale-90"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* --- Category Scroll --- */}
          <div className="group/scroll relative mx-auto flex w-full max-w-7xl items-center">
            <div className="pointer-events-none absolute left-0 z-30 h-full w-20 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/80 to-transparent" />
            <button
              onClick={() => scroll("left")}
              className="absolute left-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md hover:scale-110"
            >
              <ChevronLeft size={20} />
            </button>
            <div
              ref={scrollRef}
              className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth px-14 py-1"
            >
              {allCategories.length > 0 ? (
                allCategories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => handleCategoryClick(cat)}
                    className={`group relative h-10 min-w-[130px] shrink-0 overflow-hidden rounded-xl border-2 px-5 transition-all active:scale-95 ${queryTerm === cat ? "z-10 scale-105 border-blue-500 shadow-lg ring-4 ring-blue-500/20" : "border-transparent opacity-90"} ${bgColors[i % bgColors.length]}`}
                  >
                    <span className="relative z-20 flex h-full items-center justify-center text-[11px] font-bold text-white">
                      {cat}
                    </span>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10" />
                  </button>
                ))
              ) : (
                <div className="flex gap-3 px-14">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className="h-10 w-32 animate-pulse rounded-xl bg-gray-200"
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => scroll("right")}
              className="absolute right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md hover:scale-110"
            >
              <ChevronRight size={20} />
            </button>
            <div className="pointer-events-none absolute right-0 z-30 h-full w-20 bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/80 to-transparent" />
          </div>
          <div className="mx-auto h-px w-full max-w-7xl bg-gray-100" />
        </div>

        {/* --- API Grid --- */}
        <div className="mx-auto mb-10 mt-6 max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6">
            {filteredAndSortedApis.length === 0 && !isLoadingFeed ? (
              <div className="py-20 text-center text-gray-400">
                រកមិនឃើញទិន្នន័យឡើយ
              </div>
            ) : (
              filteredAndSortedApis.map((api: any, index: number) => (
                <div
                  key={`${api.id}-${index}`}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-5"
                >
                  {api.forkCount > 10 && (
                    <div className="absolute -right-10 top-3 rotate-45 bg-gradient-to-r from-orange-400 to-red-500 px-10 py-1 text-[10px] font-black text-white shadow-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={10} /> TRENDING
                      </div>
                    </div>
                  )}
                  <div className="relative z-10">
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
                      {api.description ||
                        "Professional API schema designed for robust data integration."}
                    </p>
                    <div className="group/copy relative flex items-center gap-3 overflow-hidden rounded-xl border border-blue-50 bg-blue-50/30 p-4 transition-all hover:bg-blue-50">
                      <code className="flex-1 truncate font-mono text-xs font-bold text-blue-800">
                        {api.endpointUrl}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(api.endpointUrl);
                          alert("Copied!");
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm transition-all hover:bg-blue-600 hover:text-white"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <rect width="14" height="14" x="8" y="8" rx="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                       
                            <div className="group/user flex cursor-pointer items-center gap-3">
                              <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-md ring-1 ring-gray-100 transition-transform group-hover/user:scale-110">
                                <Image
                                  unoptimized
                                  src={api.ownerAvatar || "/placeholder.png"}
                                  width={40}
                                  height={40}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h2 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600">
                                  {api.name}
                                </h2>
                                <p className="text-[11px] font-medium text-gray-400">
                                  {api.ownerName} •{" "}
                                  {getRelativeTime(api.updatedAt)}
                                </p>
                              </div>
                            </div>


                            

                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleForkClick(api)}
                          className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50/50 px-5 py-2.5 text-xs font-bold text-gray-700"
                        >
                          <GitFork size={14} className="text-blue-500" /> Fork{" "}
                          <span className="font-black text-blue-600">
                            ({api.forkCount || 0})
                          </span>
                        </button>
                        <ApiDetailsSheet api={api} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {/* --- 🎯 Infinite Scroll Trigger --- 
           <div 
  ref={observerTarget} 
  className="w-full py-20 flex justify-center items-center" // ថែម py-20 ឱ្យវាធំ
  style={{ minHeight: '150px' }} 
>
  {isFetching && (
    <div className="flex flex-col items-center gap-2 text-blue-600">
      <Loader2 className="animate-spin" size={32} />
      <span className="font-bold text-sm">កំពុងផ្ទុកទិន្នន័យ...</span>
    </div>
  )}
  {!hasMore && allApis.length > 0 && (
    <p className="text-gray-400 text-sm italic">--- អ្នកបានមើលអស់ហើយ ---</p>
  )}
</div>*/}
          </div>
        </div>
      </div>

      {/* --- Fork Modal (Modernized UI) --- */}
      <Dialog open={isForkModalOpen} onOpenChange={setIsForkModalOpen}>
        <DialogContent className="max-w-lg overflow-hidden rounded-lg border border-slate-200 bg-white/90 p-0 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl">
          {/* Header Section */}
          <div className="relative overflow-hidden px-8 pb-6 pt-12 text-center">
            {/* Decorative Background Blob */}
            <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

            <DialogTitle className="relative text-2xl font-bold tracking-tight text-slate-900">
              Fork API Schema
            </DialogTitle>
            <DialogDescription className="relative mt-2 px-4 text-[13px] font-medium leading-relaxed text-slate-500">
              ចម្លង API{" "}
              <span className="font-semibold text-blue-600">
                "{selectedApi?.name}"
              </span>{" "}
              ទៅកាន់ Workspace របស់អ្នកដើម្បីធ្វើការកែសម្រួល។
            </DialogDescription>
          </div>

          {/* Form Section */}
          <div className="space-y-5 px-8 pb-10 pt-2">
            {/* Workspace Selector */}
            <div className="group space-y-2">
              <label className="flex items-center gap-2 px-1 text-sm text-slate-600">
                Workspace
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-14 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-5 text-sm font-semibold text-slate-700 transition-all hover:border-blue-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10">
                    <span className="flex items-center gap-2.5">
                      {selectedWorkspaceId ? (
                        <>
                          <span className="text-lg">
                            <RiDashboardLine />
                          </span>
                          {
                            workspaces?.find(
                              (ws: any) => ws.id === selectedWorkspaceId,
                            )?.name
                          }
                        </>
                      ) : (
                        <span className="text-slate-400">
                          ជ្រើសរើស Workspace
                        </span>
                      )}
                    </span>
                    <ChevronDown size={18} className="text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[384px] rounded-xl border border-slate-100 p-1.5 shadow-2xl">
                  {workspaces?.map((ws: any) => (
                    <DropdownMenuItem
                      key={ws.id}
                      onClick={() => setSelectedWorkspaceId(ws.id)}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors focus:bg-blue-50 focus:text-blue-700"
                    >
                      <span className="flex items-center gap-2">
                        <RiDashboardLine /> {ws.name}
                      </span>
                      {selectedWorkspaceId === ws.id && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Folder Selector */}
            <div className="group space-y-2">
              <label className="flex items-center gap-2 px-1 text-sm text-slate-600">
                Target Folder
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  disabled={isLoadingFolders || !selectedWorkspaceId}
                >
                  <button className="flex h-14 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-5 text-sm font-semibold text-slate-700 transition-all hover:border-blue-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 disabled:opacity-40">
                    <span className="flex items-center gap-2.5">
                      {targetFolderId ? (
                        <>
                          <span className="text-lg">
                            <LuFolderUp />
                          </span>
                          {
                            folders?.find(
                              (f: any) => f.id.toString() === targetFolderId,
                            )?.name
                          }
                        </>
                      ) : (
                        <span className="text-slate-400">ជ្រើសរើស Folder</span>
                      )}
                    </span>
                    <ChevronDown size={18} className="text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[384px] rounded-xl border border-slate-100 p-1.5 shadow-2xl">
                  {folders?.map((f: any) => (
                    <DropdownMenuItem
                      key={f.id}
                      onClick={() => setTargetFolderId(f.id.toString())}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors focus:bg-blue-50 focus:text-blue-700"
                    >
                      <span className="flex items-center gap-2">
                        <LuFolderUp /> {f.name}
                      </span>
                      {targetFolderId === f.id.toString() && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-8 py-6">
            <button
              onClick={() => setIsForkModalOpen(false)}
              className="flex-1 rounded-xl border px-4 py-3.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-200/50 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmFork}
              disabled={isForking || !targetFolderId}
              className="relative flex-1 overflow-hidden rounded-xl bg-purple-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-black active:scale-95 disabled:opacity-30 disabled:active:scale-100"
            >
              {isForking ? (
                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
              ) : (
                "Confirm Fork"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
