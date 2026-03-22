"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Copy,
  ExternalLink,
  ShieldCheck,
  Play,
  Check,
  Code2,
  Database,
  UserPlus,
  Mail,
  Box,
  FolderHeart,
  Share2,
  Sparkles,
  Download,
  Loader2,
  GitFork,
  LayoutGrid,
  ChevronDown,
  FolderPlus,
  ArrowRight,
  ChevronDownCircle,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { MdOutlineAdd } from "react-icons/md";
import {
  useForkApiSchemeMutation,
  useGetPublicApiDetailQuery,
} from "@/redux/service/community";
import { useGetMyWorkspacesQuery } from "@/redux/service/workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/DashboardCompoenents/ui/dropdown-menu";
import { useGetFoldersByWorkspaceQuery } from "@/redux/service/folder";
import { useFollowUserMutation } from "@/redux/service/user";
import { RiDashboardLine } from "react-icons/ri";
import { LuFolderUp } from "react-icons/lu";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

interface ApiDetailsSheetProps {
  api: any;
  projectKey?: string;
  realSlug?: string;
}

export default function ApiDetailsSheet({
  api,
  projectKey = "demo",
  realSlug = "endpoint",
}: ApiDetailsSheetProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedApi, setSelectedApi] = useState<any>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(
    null,
  );

  const { data: folders, isLoading: isLoadingFolders } =
    useGetFoldersByWorkspaceQuery(selectedWorkspaceId ?? 0, {
      skip: !selectedWorkspaceId,
    });
  const [forkApi, { isLoading: isForking }] = useForkApiSchemeMutation();

  const { data: workspaces, isLoading: isLoadingWorkspaces } =
    useGetMyWorkspacesQuery();
  const {
    data: apiDetail,
    isLoading,
    isFetching,
  } = useGetPublicApiDetailQuery(api.id, {
    skip: !isOpen,
  });
  const [targetFolderId, setTargetFolderId] = useState<string>("");


  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();
  const [isFollowed, setIsFollowed] = useState(api.isFollowed);


  const handleFollowClick = async () => {
    const previousState = isFollowed;

    setIsFollowed(!previousState);

    try {
      await followUser(api.ownerUuid).unwrap();
    } catch (error) {

      setIsFollowed(previousState);

    }
  };


  useEffect(() => {
    setIsFollowed(api.isFollowed);
  }, [api.isFollowed]);

  const generatedSpec = useMemo(() => {
    const targetData = apiDetail || api;

    if (targetData?.spec) return targetData.spec;

    const endpointUrl = targetData?.endpointUrl || "";


    const projectKeyMatch = endpointUrl.match(/engine-([^\/]+)/);
    const detectedProjectKey = projectKeyMatch
      ? projectKeyMatch[1]
      : projectKey; 


    const urlParts = endpointUrl.split("/").filter(Boolean);
    const detectedSlug = urlParts[urlParts.length - 1] || realSlug;


    const propertiesObj: any = {};
    const requiredFields: string[] = [];

    targetData?.properties?.forEach((prop: any) => {
      const fieldName = prop.fieldName || prop.name;
      propertiesObj[fieldName] = {
        type: prop.type === "number" ? "integer" : prop.type || "string",
        example:
          prop.type === "number"
            ? 0
            : prop.type === "boolean"
              ? true
              : "string",
      };
      if (prop.required) requiredFields.push(fieldName);
    });


    const collectionPath = `/api/v1/engine-${detectedProjectKey}/${detectedSlug}`;
    const itemPath = `${collectionPath}/{id}`;

    return {
      openapi: "3.0.0",
      info: {
        title: targetData?.name || "API Documentation",
        version: "1.0.0",
        description: targetData?.description || "Dynamic API documentation",
      },
      servers: [{ url: "https://api.idata.fit" }],
      components: {
        schemas: {
          Model: {
            type: "object",
            required: requiredFields,
            properties: propertiesObj,
          },
        },
      },
      paths: {
        [collectionPath]: {
          get: {
            tags: [targetData.name],
            summary: `Get all ${targetData.name}`,
            responses: {
              "200": {
                description: "Success",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Model" },
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: [targetData.name],
            summary: `Create new ${targetData.name}`,
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Model" },
                },
              },
            },
            responses: { "201": { description: "Created" } },
          },
        },
        [itemPath]: {
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          get: {
            tags: [targetData.name],
            summary: `Get ${targetData.name} by ID`,
            responses: {
              "200": {
                description: "Success",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Model" },
                  },
                },
              },
            },
          },
          put: {
            tags: [targetData.name],
            summary: `Update ${targetData.name}`,
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Model" },
                },
              },
            },
            responses: { "200": { description: "Updated" } },
          },
          delete: {
            tags: [targetData.name],
            summary: `Delete ${targetData.name}`,
            responses: { "204": { description: "Deleted" } },
          },
        },
      },
    };
  }, [apiDetail, api, projectKey, realSlug]); 
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);
  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(generatedSpec, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${api.name || "api-spec"}.json`;
    a.click();
  };

  const handleForkClick = (api: any) => {
    setSelectedApi(api);
    if (workspaces && workspaces.length > 0) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
    setIsForkModalOpen(true);
  };

  const handleConfirmFork = async () => {
    if (!selectedApi || !targetFolderId) return;
    try {
      await forkApi({
        originalId: selectedApi.id,
        targetFolderId: Number(targetFolderId),
      }).unwrap();
      alert(`ជោគជ័យ! API ត្រូវបាន Fork ទៅកាន់ Folder របស់អ្នក។`);
      setIsForkModalOpen(false);
    } catch (error) {
      console.error("Fork error:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-gray-200 transition hover:bg-blue-600 active:scale-95">
          <Play size={14} fill="currentColor" />
          Use API
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-screen w-full justify-center border-none bg-black bg-opacity-70 p-0 sm:max-w-screen-3xl"
      >
        <SheetDescription className="hidden">
          Detailed API documentation for {api.name}
        </SheetDescription>

        <div className="flex h-full w-[85%]">
          <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* --- Sticky Header --- */}
            <div className="top-0 z-50 flex items-center justify-between py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl from-blue-500 to-blue-700 text-white shadow-lg">
                  <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-blue-500/20">
                    <Image
                      unoptimized
                      src={api.ownerAvatar || "/placeholder.png"}
                      width={48}
                      height={48}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <SheetTitle className="text-left text-xl text-white">
                    {api.name}
                  </SheetTitle>
                  <div className="mt-0.5 flex items-center gap-2 text-white">
                    <span className="text-gray-300">{api.ownerName} •</span>

                    <span
                      className={`text-md font-bold ${isFollowed ? "text-green-400" : "text-blue-400"}`}
                    >
                      {isFollowed ? "Following" : "Follow"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-full space-y-12 rounded-md bg-white px-10 py-12 pb-32">

              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-black text-gray-800">
                        {api.name}
                      </h2>
                      <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold text-purple-700">
                        <Sparkles className="size-3" /> AI READY
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded bg-gray-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        1.0.0
                      </span>
                      <span className="rounded bg-[#89bf04] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        OAS 3.0
                      </span>
                      <span className="rounded bg-blue-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        LIVE
                      </span>
                    </div>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-500">
                      {api.description ||
                        "Professional API schema designed for robust data integration."}
                    </p>
                  </div>
                  <button
                    onClick={() => handleForkClick(api)}
                    className="flex items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-600 transition-all hover:bg-purple-100"
                  >
                    <Sparkles className="size-3" /> Fork
                  </button>
                </div>

                {/* --- Base URL Section --- */}
                <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-orange-100 bg-orange-50/30 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                      <Database className="size-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                        Base Server URL
                      </span>
                      <code className="text-sm font-bold text-gray-700">
                        {api.endpointUrl}
                      </code>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(api.endpointUrl)}
                      className="flex h-9 items-center gap-2 rounded-lg border bg-white px-3 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-50"
                    >
                      {copied ? (
                        <Check className="size-3.5 text-green-500" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                      {copied ? "Copied!" : "Copy URL"}
                    </button>
                    <button
                      onClick={handleDownloadJson}
                      className="flex h-9 items-center gap-2 rounded-lg bg-orange-500 px-3 text-xs font-medium text-white shadow-sm transition hover:bg-orange-600"
                    >
                      <Download className="size-3.5" /> Download Spec
                    </button>
                  </div>
                </div>
              </div>

              {/* --- 🎯 Swagger UI Section --- */}
              <div className="swagger-custom-style overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <style jsx global>{`
                  .swagger-ui .topbar,
                  .swagger-ui .info {
                    display: none;
                  }
                  .swagger-ui .btn.execute {
                    background-color: #f97316;
                    border-color: #f97316;
                    color: white;
                  }
                  .swagger-ui .scheme-container {
                    background: transparent;
                    box-shadow: none;
                    padding: 0;
                  }
                `}</style>

                {isLoading || isFetching ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-24">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="animate-pulse text-sm font-bold text-gray-400">
                      Generating Documentation...
                    </p>
                  </div>
                ) : (
                  <SwaggerUI
                    spec={generatedSpec}
                    docExpansion="list"
                    tryItOutEnabled={true}
                    supportedSubmitMethods={["get"]}
                  />
                )}
              </div>

              {/* Security Info */}
              <div className="flex flex-col gap-4 text-gray-700 rounded-lg bg-purple-50 p-8 ">
            

                {/* Access Restriction Info */}
                <div className=" flex gap-6  border-slate-800 ">
                  <div className="w-[32px]" />{" "}
                  {/* Spacer to align with icon above */}
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      <span className="font-bold uppercase text-orange-400">
                        Note:
                      </span>{" "}
                      Public access is restricted to{" "}
                      <code className="rounded bg-slate-400 px-1.5 py-0.5 text-blue-600">
                        GET
                      </code>{" "}
                      requests only.
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-700">
                      To use all methods (POST, PUT, DELETE), please{" "}
                      <span className="cursor-pointer font-bold text-blue-400 underline decoration-blue-400/30 underline-offset-4 hover:text-blue-300">
                        Fork
                      </span>{" "}
                      this API into your own workspace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🎯 Sidebar Actions (Right) */}
          <div className="z-50 mt-[60px] flex w-[100px] flex-col items-center gap-6 py-8">
            <div className="group relative">
              <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-blue-500/20">
                <Image
                  unoptimized
                  src={api.ownerAvatar || "/placeholder.png"}
                  width={48}
                  height={48}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                onClick={handleFollowClick}
                disabled={isFollowing}
                className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full shadow-lg transition-all duration-300 active:scale-90 ${isFollowed ? "rotate-[360deg] bg-green-500" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isFollowing ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : isFollowed ? (
                  <Check
                    size={12}
                    strokeWidth={4}
                    className="text-white duration-300 animate-in zoom-in"
                  />
                ) : (
                  <MdOutlineAdd
                    size={16}
                    className="text-white duration-300 animate-in fade-in"
                  />
                )}
              </button>
            </div>
            {[
              {
                Icon: Box,
                label: "Fork API",
                action: () => handleForkClick(api), //  Modal Fork
              },
              {
                Icon: FolderHeart,
                label: "រក្សាទុក",
                action: () => handleForkClick(api),
              },
              {
                Icon: Share2,
                label: "ចែករំលែក",
                action: () => handleCopy(api.endpointUrl), //  Copy Link
              },
            ].map(({ Icon, label, action }, idx) => (
              <div
                key={idx}
                className="group relative flex items-center justify-end"
              >
                <div className="invisible absolute right-full mr-3 flex items-center opacity-0 transition-all duration-300 group-hover:visible group-hover:-translate-x-1 group-hover:opacity-100">
                  <span className="relative z-10 whitespace-nowrap rounded-sm bg-purple-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-xl">
                    {label}
                  </span>
                  <div className="-ml-1 h-2 w-2 rotate-45 bg-purple-600"></div>
                </div>

                <button
                  onClick={action} //  Action
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm ring-1 ring-gray-100 transition hover:bg-blue-600 hover:text-white active:scale-90"
                >
                  <Icon size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
      {/* --- 🎯 Fork Modal --- */}
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
    </Sheet>
  );
}
