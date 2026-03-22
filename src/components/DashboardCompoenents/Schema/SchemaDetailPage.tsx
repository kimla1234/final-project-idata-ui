"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Edit3,
  FileText,
  Globe,
  Send,
  Layout,
  ArrowLeft,
  Copy,
  Share2,
  Database,
  Zap,
  CheckCircle2,
  Clock,
  Terminal,
  ChevronRight,
  Play,
  Trash2,
  Save,
  Layers,
  MinusCircle,
  PlusCircle,
  Key,
  RefreshCw,
  Download,
  Check,
  Loader2,
  Sparkles,
  SparklesIcon,
  Lock,
  EyeOff,
  Eye,
  MessageSquare,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; 

import {
  useGenerateAiMockMutation,
  useGetApiSchemeByIdQuery,
  useGetApiSchemesByFolderQuery,
  useUpdateApiSchemeMutation,
} from "@/redux/service/apiScheme";

import "swagger-ui-react/swagger-ui.css";
import dynamic from "next/dynamic";
import { useTogglePublishStatusMutation } from "@/redux/service/community";


const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <div className="p-10 text-center">Loading Swagger...</div>,
});

export default function SchemaDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [schemaName, setSchemaName] = useState("");
  const [swaggerKey, setSwaggerKey] = useState(0);
  const [spec, setSpec] = useState<any>(null);

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const id = params.id;


  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishDescription, setPublishDescription] = useState("");




  const [generateAiMock, { isLoading: isMocking }] =
    useGenerateAiMockMutation();
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const [updateApiScheme, { isLoading: isUpdating }] =
    useUpdateApiSchemeMutation();

  const [togglePublish, { isLoading: isPublishing }] =
    useTogglePublishStatusMutation();


  const [fields, setFields] = useState<any[]>([]);
  const [keys, setKeys] = useState<any[]>([]);


  const workspaceId = params.workspaceId;
  //const folderId = params.id ? Number(params.id) : 0;
  const folderId = params.folderId
    ? Number(params.folderId)
    : params.id
      ? Number(params.id)
      : 0;
  const schemaId = params.schemaId ? Number(params.schemaId) : null;
  const { data: allSchemesInFolder } = useGetApiSchemesByFolderQuery(folderId, {
    skip: !folderId,
    refetchOnMountOrArgChange: true, 
  });

  const {
    data: schema,
    isLoading,
    refetch,
  } = useGetApiSchemeByIdQuery(schemaId as number, {
    skip: !schemaId,
  });


  const url = schema?.endpointUrl || "";


  const projectKeyMatch = url.match(/engine-([^\/]+)/);
  const projectKey = projectKeyMatch ? projectKeyMatch[1] : "";


  const urlParts = url.split("/");
  const realSlug = urlParts[urlParts.length - 1] || "";

  useEffect(() => {
    if (schema) {

      setSchemaName(schema.name || "");

      // ២. Map Properties (FieldName)
      if (schema.properties && Array.isArray(schema.properties)) {
        const mapped = schema.properties.map((f: any) => ({
          name: f.fieldName || "",
          type: f.type || "string",
          require: f.required || false,
        }));
        setFields(mapped);
      }

      // ៣. Map Keys
      if (schema.keys && Array.isArray(schema.keys)) {
        const mappedKeys = schema.keys.map((k: any) => ({
          columnName: k.columnName || "",
          isPk: !!k.primaryKey, 
          isFk: !!k.foreignKey, 
          referenceTable: k.referenceTable || "",
        }));
        setKeys(mappedKeys);
      }
    }
  }, [schema]);

  useEffect(() => {
    const fetchAndFixSwagger = async () => {
      try {

        const response = await fetch("https://api.idata.fit/v3/api-docs");
        if (!response.ok) throw new Error("Failed to fetch API docs");

        const data: any = await response.json();


        const url = schema?.endpointUrl || "";
        const projectKeyMatch = url.match(/engine-([^\/]+)/);
        const projectKey = projectKeyMatch ? projectKeyMatch[1] : "";
        const urlParts = url.split("/");
        const realSlug = (urlParts[urlParts.length - 1] || "").toLowerCase();


        data.servers = [
          { url: "https://api.idata.fit", description: "API Engine Server" },
        ];


        if (realSlug === "auth") {
          data.paths = {
            [`/api/v1/engine-${projectKey}/auth/register`]: {
              post: {
                tags: ["Auth Service"],
                summary: "Register a new user",
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        example: {
                          username: "dara",
                          password: "123",
                          full_name: "Dara Tech",
                        },
                      },
                    },
                  },
                },
                responses: {
                  "201": { description: "Created" },
                  "401": { description: "Unauthorized" },
                },
              },
            },
            [`/api/v1/engine-${projectKey}/auth/login`]: {
              post: {
                tags: ["Auth Service"],
                summary: "Login to get JWT Token",
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        example: { username: "dara", password: "123" },
                      },
                    },
                  },
                },
                responses: {
                  "200": {
                    description: "Success",
                    content: {
                      "application/json": {
                        example: {
                          message: "Login successful",
                          accessToken: "eyJhbG...",
                          refreshToken: "eyJhbG...",
                          user: { username: "kimla" },
                        },
                      },
                    },
                  },
                },
              },
            },
            [`/api/v1/engine-${projectKey}/auth/refresh`]: {
              post: {
                tags: ["Auth Service"],
                summary: "Refresh expired Access Token",
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          refreshToken: { type: "string" },
                        },
                        example: { refreshToken: "eyJhbG..." },
                      },
                    },
                  },
                },
                responses: { "200": { description: "Token refreshed" } },
              },
            },
          };
        } else {

          let dynamicExample: Record<string, any> = {};
          fields.forEach((f: any) => {
            const fieldName = f.name || f.fieldName;
            if (
              fieldName &&
              typeof fieldName === "string" &&
              fieldName.toLowerCase() !== "id"
            ) {
              dynamicExample[fieldName] = getSampleValue(f.type);
            }
          });

          if (data.paths) {
            const newPaths: Record<string, any> = {};
            Object.keys(data.paths).forEach((oldPath) => {
              if (oldPath.includes("/auth")) return;

              let newPathKey = oldPath
                .replace("{projectKey}", projectKey)
                .replace("{slug}", realSlug);

              if (!newPathKey.includes(projectKey)) {
                newPathKey = newPathKey.replace(
                  /\/engine\//,
                  `/engine-${projectKey}/`,
                );
              }

              const pathOps = JSON.parse(JSON.stringify(data.paths[oldPath]));
              Object.keys(pathOps).forEach((method) => {
                if (pathOps[method].parameters) {
                  pathOps[method].parameters = pathOps[
                    method
                  ].parameters.filter(
                    (p: any) => p.name !== "slug" && p.name !== "projectKey",
                  );
                }
                if (["post", "put"].includes(method.toLowerCase())) {
                  const content =
                    pathOps[method].requestBody?.content["application/json"];
                  if (content) {
                    content.schema = {
                      type: "object",
                      example: dynamicExample,
                    };
                  }
                }
              });
              newPaths[newPathKey] = pathOps;
            });
            data.paths = newPaths;
          }
        }


        setSpec(data);
      } catch (error) {
        console.error("❌ Swagger Spec Error:", error);
        setSpec(null);
      }
    };

    if (schema) fetchAndFixSwagger();
  }, [schema, fields, swaggerKey]);


  let dynamicExample: Record<string, any> = {};

  function getSampleValue(type: any) {
    const t = String(type).toLowerCase();
    if (t.includes("int") || t.includes("num") || t.includes("double"))
      return 0;
    if (t.includes("bool")) return true;
    return "string";
  }

  useEffect(() => {
    if (schema?.name) setSchemaName(schema.name);
  }, [schema]);

  const [publishData, setPublishData] = useState({
    description: schema?.description || "",
    category: "General",
    tags: "",
  });

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "Overview",
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const handleTogglePublic = async () => {
    if (!schema) return;
    const slugOnly = schema.endpointUrl.split("/").pop();

    try {
      await updateApiScheme({
        id: schema.id,
        body: {
          ...schema,
          endpointUrl: slugOnly,
          isPublic: !schema.isPublic, // ប្តូរតែសិទ្ធិ Access
          isPublished: schema.isPublished, // រក្សាតម្លៃ Published នៅដដែល
        },
      }).unwrap();
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const tabs = [
    { id: "Overview", label: "Overview", icon: <Layout className="size-4" /> },
    {
      id: "Editor",
      label: "Schema Editor",
      icon: <Edit3 className="size-4" />,
    },

    { id: "Swagger", label: "Swagger UI", icon: <Globe className="size-4" /> },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-[#0f172a]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">
            Loading schema details...
          </p>
        </div>
      </div>
    );
  }


  const apiEndpoints =
    realSlug === "auth"
      ? [
          {
            method: "POST",
            path: `https://api.idata.fit${schema?.endpointUrl}/register`,
            desc: "ចុះឈ្មោះអ្នកប្រើប្រាស់ថ្មី (Register)",
            color: "green",
          },
          {
            method: "POST",
            path: `https://api.idata.fit${schema?.endpointUrl}/login`,
            desc: "ចូលប្រើប្រាស់ដើម្បីយក Token (Login)",
            color: "green",
          },
          {
            method: "POST",
            path: `https://api.idata.fit${schema?.endpointUrl}/refresh`,
            desc: "បន្តសុពលភាព Token (Refresh Token)",
            color: "orange",
          },
        ]
      : [

          {
            method: "GET",
            path: schema?.endpointUrl,
            desc: "Retrieve all records",
            color: "blue",
          },
          {
            method: "POST",
            path: schema?.endpointUrl,
            desc: "Create a new record",
            color: "green",
          },
          {
            method: "GET",
            path: `${schema?.endpointUrl}/{id}`,
            desc: "Retrieve a single record",
            color: "blue",
          },
          {
            method: "PUT",
            path: `${schema?.endpointUrl}/{id}`,
            desc: "Update an existing record",
            color: "orange",
          },
          {
            method: "DELETE",
            path: `${schema?.endpointUrl}/{id}`,
            desc: "Delete a record",
            color: "red",
          },
        ];

  const handleSaveSchemaChanges = async () => {
    try {
      const payload = {
        name: schemaName,
        // 🎯 ទាញយកតែ Slug ចុងក្រោយគេនៃ URL
        endpointUrl:
          schema?.endpointUrl?.split("/").filter(Boolean).pop() || "",

        properties: fields.map((f) => ({
          fieldName: f.name,
          type: f.type,
          required: f.require,
        })),

        // 🎯 ត្រូវ Map keys ឱ្យត្រូវតាម Backend API (primaryKey/foreignKey)
        keys: keys.map((k) => ({
          columnName: k.columnName,
          primaryKey: k.isPk, // ✅ កែពី isPk ទៅជា primaryKey
          foreignKey: k.isFk, // ✅ កែពី isFk ទៅជា foreignKey
          referenceTable: k.referenceTable || "",
        })),

        isPublic: schema?.isPublic,
      };
      console.log("Check Data:", allSchemesInFolder);
      // ១. Update ទៅ Backend
      await updateApiScheme({ id: Number(schemaId), body: payload }).unwrap();

      // ២. ទាញទិន្នន័យថ្មីមកវិញភ្លាម
      refetch();

      alert("រក្សាទុកបានជោគជ័យ!");
    } catch (error) {
      console.error("Update failed:", error);
      //alert("រក្សាទុកមិនបានសម្រេច៖ " + error.data?.message);
    }
  };
  // សម្រាប់ Keys Section
  const addKeyRow = () => {
    setKeys([
      ...keys,
      { columnName: "", isPk: false, isFk: false, referenceTable: "" },
    ]);
  };

  const removeKeyRow = (index: number) => {
    setKeys(keys.filter((_, i) => i !== index));
  };

  //  Properties
  const addFieldRow = () => {
    setFields([...fields, { name: "", type: "string", require: false }]);
  };

  //  Properties
  const removeFieldRow = (index: number) => {
    if (fields.length > 1) {
      // ទុកយ៉ាងហោចណាស់ ១ ជួរ
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  // សម្រាប់ Update ឈ្មោះ Field ក្នុង Properties
  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index].name = value; // Update ឈ្មោះក្នុង State
    setFields(updatedFields);
  };

  // សម្រាប់ Update ឈ្មោះ Column ក្នុង Keys
  const handleKeyChange = (index: number, value: string) => {
    const updatedKeys = [...keys];
    updatedKeys[index] = {
      ...updatedKeys[index],
      columnName: value,
    };
    setKeys(updatedKeys);
  };

  const getRelativeTime = (dateString: string | undefined) => {
    if (!dateString) return "just now";

    const now = new Date();
    const updatedDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - updatedDate.getTime()) / 1000,
    );

    if (diffInSeconds < 60) return "just now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    // បើលើសពី ៧ ថ្ងៃ ឱ្យវាបង្ហាញកាលបរិច្ឆេទធម្មតា
    return updatedDate.toLocaleDateString("km-KH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleStartAiGeneration = async () => {
    const schemaId = schema?.id;
    if (!schemaId || !aiPrompt.trim()) return;

    // 🎯 បង្កើត Schema Context ដើម្បីប្រាប់ AI ឱ្យស្គាល់ Field ពិតប្រាកដ
    const schemaContext = fields
      .map((f) => `- ${f.name} (${f.type})`)
      .join("\n");

    // 🎯 រៀបចំ Prompt ថ្មីដែលបង្ខំឱ្យ AI ដើរតាម Schema
    const finalPrompt = `
    Strictly use only these fields from the schema:
    ${schemaContext}
    
    User Instruction: ${aiPrompt}
    
    Important: Do not add any extra fields that are not in the list above.
  `;

    try {
      // បាញ់ទៅ Backend ជាមួយ finalPrompt
      await generateAiMock({
        id: Number(schemaId),
        instruction: finalPrompt,
      }).unwrap();

      setIsAiModalOpen(false);
      setAiPrompt("");
    } catch (error) {
      console.error("Mutation Error:", error);
    }
  };

  const handleDownloadJson = () => {
    if (!spec) {
      alert("មិនទាន់មានទិន្នន័យសម្រាប់ទាញយកឡើយ!");
      return;
    }

    // ១. បំប្លែង Spec Object ទៅជា String
    const dataStr = JSON.stringify(spec, null, 2);

    // ២. បង្កើត Blob (Binary Large Object)
    const blob = new Blob([dataStr], { type: "application/json" });

    // ៣. បង្កើត URL បណ្ដោះអាសន្នសម្រាប់ Download
    const url = window.URL.createObjectURL(blob);

    // ៤. បង្កើត Tag <a> បណ្ដោះអាសន្នដើម្បី Trigger Download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${schema?.name || "api-docs"}.json`; // ឈ្មោះ File ពេលទាញយក

    document.body.appendChild(link);
    link.click();

    // ៥. សម្អាតទិន្នន័យពី Memory
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // --- 🎯 Function សម្រាប់ហៅពេល Confirm Publish ---
  const handlePublishClick = () => {
    if (schema?.isPublished) {
      // បើ Publish រួចហើយ ចុចទៅគឺ Unpublish យកតែម្ដង
      handleTogglePublishAction("");
    } else {
      // បើមិនទាន់ Publish ទេ ឱ្យបើក Modal សិន
      setPublishDescription(schema?.description || "");
      setIsPublishModalOpen(true);
    }
  };

  const handleTogglePublishAction = async (desc: string) => {
    try {
      await togglePublish({ id: Number(schemaId), description: desc }).unwrap();
      setIsPublishModalOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col rounded-lg bg-[#fcfcfc] dark:bg-[#0f172a]">
      {/* --- Top Navigation / Header --- */}
      <header className="sticky top-0 z-10 border-b bg-white px-6 py-4 dark:border-gray-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Database className="size-5 text-blue-500" />
                <h1 className="w-fit text-lg font-bold text-gray-800 dark:text-white">
                  <input
                    type="text"
                    value={schemaName}
                    onChange={(e) => setSchemaName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.blur(); 
                        handleSaveSchemaChanges();
                      }
                    }}
                    className="w-[100px] bg-transparent text-lg font-bold outline-none focus:bg-purple-100"
                  />
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePublishClick}
              disabled={isPublishing}
              className="rounded-lg bg-gradient-to-r from-purple-400 to-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:from-purple-500 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {schema?.isPublished ? "Unpublish API" : "Publish to Community"}
            </button>
            {/* --- 🎯 ផ្នែក Modal សម្រាប់សរសេរព័ត៌មានមុន Publish --- */}
            <Dialog
              open={isPublishModalOpen}
              onOpenChange={setIsPublishModalOpen}
            >
              <DialogContent className="rounded-lg bg-white p-6 sm:max-w-[650px]">
                <DialogHeader>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Globe className="size-8" />
                  </div>
                  <DialogTitle className="text-center text-2xl font-black">
                    Publish your API
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    ដាក់ API របស់អ្នកឱ្យពិភពលោកបានឃើញ!
                    សូមសរសេររៀបរាប់បន្តិចពីវា។
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    rows={4}
                    value={publishDescription}
                    onChange={(e) => setPublishDescription(e.target.value)}
                    placeholder="តើ API នេះប្រើសម្រាប់ធ្វើអ្វី?"
                  />
                </div>

                <DialogFooter className="flex gap-2">
                  <button
                    onClick={() => setIsPublishModalOpen(false)}
                    className="flex-1 rounded-xl border py-3 text-sm font-bold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleTogglePublishAction(publishDescription)
                    }
                    disabled={isPublishing || !publishDescription.trim()}
                    className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <Loader2 className="mx-auto size-5 animate-spin" />
                    ) : (
                      "Confirm Publish"
                    )}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* --- Tab Switcher --- */}
        <div className="mt-6 flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                router.push(`?tab=${tab.id}`, { scroll: false });
              }}
              className={cn(
                "relative flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300",
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-8">
        <div className="mx-auto w-full">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 gap-10 duration-700 animate-in fade-in slide-in-from-bottom-4 lg:grid-cols-12">
              {/* --- ផ្នែកខាងឆ្វេង: Main Content (8 Columns) --- */}
              <div className="space-y-12 lg:col-span-8">
                {/* API Header & Access URL */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/30">
                        <Key className="size-5 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        API Authentication
                      </h3>
                    </div>
                    <button
                      onClick={handleTogglePublic}
                      disabled={isUpdating} // ប្រើ loading status ពី updateApiScheme
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95",
                        schema?.isPublic
                          ? "border border-green-200 bg-green-100 text-green-700 hover:bg-green-200"
                          : "border border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-200",
                        isUpdating && "cursor-not-allowed opacity-50",
                      )}
                    >
                      {isUpdating ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : schema?.isPublic ? (
                        <Globe className="size-3" />
                      ) : (
                        <Lock className="size-3" />
                      )}

                      {isUpdating
                        ? "Updating..."
                        : schema?.isPublic
                          ? "Public Access"
                          : "Private (Key Required)"}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* --- ១. API Endpoint URL --- */}
                    <div className="group relative flex flex-col gap-1 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900">
                      <span className="text-[10px] font-bold uppercase text-gray-400">
                        Endpoint URL
                      </span>
                      <div className="flex items-center justify-between">
                        <code className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {schema?.endpointUrl ||
                            "https://api.idata.com/v1/..."}
                        </code>
                        <button
                          onClick={() => handleCopy(schema?.endpointUrl || "")}
                          className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {copied ? (
                            <Check className="size-4 text-green-500" />
                          ) : (
                            <Copy className="size-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* --- ២. Secret API Key (x-api-key) --- */}
                    {!schema?.isPublic && (
                      <div className="group relative flex flex-col gap-1 overflow-hidden rounded-2xl border border-dashed border-orange-200 bg-orange-50/20 p-4 duration-500 animate-in fade-in zoom-in-95 dark:border-orange-900/30 dark:bg-orange-950/10">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-orange-600">
                            Secret Key (x-api-key)
                          </span>
                          <Lock className="size-3 text-orange-400" />
                        </div>

                        <div className="flex items-center justify-between">
                          <code className="font-mono text-sm font-bold text-gray-700 dark:text-gray-300">
                            {showApiKey
                              ? schema?.apiKey || "sk_live_xxxx"
                              : "••••••••••••••••••••••••••••"}
                          </code>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="rounded-lg p-2 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/30"
                            >
                              {showApiKey ? (
                                <EyeOff className="size-4 text-orange-500" />
                              ) : (
                                <Eye className="size-4 text-orange-500" />
                              )}
                            </button>

                            <button
                              onClick={() => {
                                handleCopy(schema?.apiKey || "");
                                setApiKeyCopied(true);
                                setTimeout(() => setApiKeyCopied(false), 2000);
                              }}
                              className="rounded-lg p-2 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/30"
                            >
                              {apiKeyCopied ? (
                                <Check className="size-4 text-green-500" />
                              ) : (
                                <Copy className="size-4 text-orange-500" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --- ៣. Integration Instruction (បង្ហាញតែពេល Private ប៉ុណ្ណោះ) --- */}
                  {!schema?.isPublic && (
                    <div className="flex gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3 duration-500 animate-in fade-in slide-in-from-top-2 dark:border-blue-900/20 dark:bg-blue-900/10">
                      <SparklesIcon className="mt-0.5 size-4 shrink-0 text-blue-500" />
                      <p className="text-[11px] leading-relaxed text-blue-700 dark:text-blue-400">
                        <span className="font-bold uppercase">
                          Integration:
                        </span>{" "}
                        ប្រើប្រាស់ Key ខាងលើក្នុង Request Header ឈ្មោះ{" "}
                        <code className="rounded bg-blue-100 px-1 font-bold dark:bg-blue-800">
                          x-api-key
                        </code>{" "}
                        ដើម្បីទទួលបានសិទ្ធិចូលប្រើប្រាស់ API នេះពីខាងក្រៅ។
                      </p>
                    </div>
                  )}

                  {/* --- ៤. បន្ថែម៖ សារបញ្ជាក់សម្រាប់ Public (Optional) --- */}
                  {schema?.isPublic && (
                    <div className="flex gap-2 rounded-xl border border-green-100 bg-green-50/50 p-3 duration-500 animate-in fade-in slide-in-from-top-2 dark:border-green-900/20 dark:bg-green-900/10">
                      <Globe className="mt-0.5 size-4 shrink-0 text-green-500" />
                      <p className="text-[11px] leading-relaxed text-green-700 dark:text-green-400">
                        <span className="font-bold uppercase">
                          Public Access:
                        </span>{" "}
                        API នេះត្រូវបានបើកជាសាធារណៈ។
                        អ្នកអាចហៅប្រើប្រាស់បានភ្លាមៗដោយពុំចាំបាច់ប្រើប្រាស់ API
                        Key ឡើយ។
                      </p>
                    </div>
                  )}
                </section>

                {/* Endpoints List Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Available Endpoints
                      </h3>
                      <p className="text-xs text-gray-500">
                        Manage and test your generated REST operations.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {apiEndpoints.map((api, idx) => {
                      // បង្កើត Full URL សម្រាប់ប្រើប្រាស់ (ឧទាហរណ៍៖ http://.../engine/10/users/all)
                      const fullPath = `${schema?.endpointUrl || ""}`;

                      return (
                        <div
                          key={idx}
                          className={cn(
                            "group flex cursor-pointer items-center justify-between rounded-xl border p-1.5 transition-all hover:shadow-md hover:ring-1 hover:ring-offset-0",
                            api.color === "blue" &&
                              "border-blue-100 bg-blue-50/30 hover:ring-blue-200 dark:border-blue-900/20",
                            api.color === "green" &&
                              "border-green-100 bg-green-50/30 hover:ring-green-200 dark:border-green-900/20",
                            api.color === "orange" &&
                              "border-orange-100 bg-orange-50/30 hover:ring-orange-200 dark:border-orange-900/20",
                            api.color === "red" &&
                              "border-red-100 bg-red-50/30 hover:ring-red-200 dark:border-red-900/20",
                          )}
                        >
                          <div className="flex w-full items-center gap-4">
                            {/* Method Badge */}
                            <div
                              className={cn(
                                "flex h-9 w-20 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white shadow-sm transition-transform group-hover:scale-95",
                                api.color === "blue" && "bg-blue-500",
                                api.color === "green" && "bg-green-500",
                                api.color === "orange" && "bg-orange-500",
                                api.color === "red" && "bg-red-500",
                              )}
                            >
                              {api.method}
                            </div>

                            {/* Path & Description */}
                            <div className="flex w-full items-center justify-between overflow-hidden">
                              <div className="flex flex-col truncate">
                                <span className="truncate font-mono text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                  {api.path}
                                </span>
                                <span className="text-[10px] italic text-gray-500 dark:text-gray-400">
                                  {api.desc}
                                </span>
                              </div>

                              {/* Action Buttons (បង្ហាញជាប់ជានិច្ច - No Hover Required) */}
                              <div className="flex items-center gap-1.5 px-3 transition-all">
                                {/* ប៊ូតុង Copy */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(fullPath);
                                    // បន្ថែម toast បន្តិចដើម្បីឱ្យ User ដឹងថាបាន Copy រួច
                                  }}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 shadow-sm transition-all hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                  title="Copy Full URL"
                                >
                                  <Copy className="size-3.5" />
                                </button>

                                {/* ប៊ូតុង Test */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTab("Swagger");
                                  }}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 shadow-sm transition-all hover:border-orange-200 hover:text-orange-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                  title="Test Endpoint"
                                >
                                  <Play className="size-3.5 fill-current" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* --- ផ្នែកខាងស្តាំ: Sidebar Info (4 Columns) --- */}
              <div className="space-y-6 lg:col-span-4">
                <div className="sticky top-28 space-y-6">
                  {/* Metadata Card */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-[15px] text-gray-400">
                        API Metadata
                      </h3>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm",
                          schema?.isPublic
                            ? "border border-green-100 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20"
                            : "border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/20",
                        )}
                      >
                        {schema?.isPublic ? "Public" : "Private"}
                      </span>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-4 px-1">
                        {/* Version */}
                        <div className="flex items-center justify-between text-[13px]">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Zap className="size-3.5" />
                            <span>Version</span>
                          </div>
                          <span className="font-mono font-bold text-gray-900 dark:text-white">
                            v1.0.0
                          </span>
                        </div>

                        {/* Last Sync/Update Time */}
                        <div className="flex items-center justify-between text-[13px]">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="size-3.5" />
                            <span>Last Sync</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {getRelativeTime(schema?.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Audit Trail */}
                    <div className="mt-8 space-y-3 border-t border-dashed border-gray-100 pt-6 dark:border-gray-800">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Edit3 className="size-3" />
                          <span className="italic">កែប្រែចុងក្រោយដោយ</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-700 dark:text-gray-300">
                            {/* បង្ហាញឈ្មោះអ្នកកែប្រែ បើអត់មានបង្ហាញឈ្មោះ Owner */}
                            {schema?.lastModifiedBy?.name ||
                              schema?.owner?.name ||
                              "User"}
                          </span>
                          <div className="size-1.5 animate-pulse rounded-full bg-green-500" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="size-3" />
                          <span className="italic">កាលបរិច្ឆេទកែប្រែ</span>
                        </div>
                        <span className="font-bold text-gray-600 dark:text-gray-400">
                          {schema?.updatedAt
                            ? new Date(schema.updatedAt).toLocaleDateString(
                                "km-KH",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )
                            : "09 មីនា ២០២៦"}
                        </span>
                      </div>

                      <div className="mt-2 rounded-lg bg-orange-50/50 p-2 dark:bg-orange-900/10">
                        <p className="text-[10px] leading-relaxed text-orange-600/80 dark:text-orange-400">
                          <span className="font-bold">កំណត់ចំណាំ៖</span>{" "}
                          រាល់ការកែប្រែ Schema
                          នឹងត្រូវបានកត់ត្រាទុកក្នុងប្រព័ន្ធសុវត្ថិភាព។
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Editor" && (
            <div className="space-y-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-in fade-in zoom-in-95 dark:border-gray-800 dark:bg-gray-900">
              {/* --- Section 1: Properties --- */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-3 dark:border-gray-800">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <Layers className="size-4 text-orange-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                    Properties
                  </h3>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-4 py-3">Field name</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3 text-center">Require</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {fields.map((field, index) => (
                        <tr
                          key={index}
                          className="group hover:bg-gray-50/30 dark:hover:bg-gray-800/30"
                        >
                          <td className="p-2">
                            <input
                              type="text"
                              value={field.name || ""}
                              onChange={(e) =>
                                handleFieldChange(index, e.target.value)
                              }
                              className="w-full rounded-lg border-transparent bg-transparent px-3 py-2 outline-none focus:border-orange-500 focus:bg-white dark:text-white dark:focus:bg-gray-800"
                              placeholder="field_name"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={field.type}
                              onChange={(e) => {
                                const updatedFields = [...fields];
                                updatedFields[index].type = e.target.value;
                                setFields(updatedFields);
                              }}
                              className="w-full rounded-lg border-gray-100 bg-transparent px-3 py-2 outline-none focus:border-orange-500 dark:border-gray-700 dark:text-gray-300"
                            >
                              <option value="string">string</option>
                              <option value="number">number</option>
                              <option value="boolean">boolean</option>
                            </select>
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              className="size-4 rounded accent-orange-500"
                              checked={field.require}
                              onChange={(e) => {
                                const updatedFields = [...fields];
                                updatedFields[index].require = e.target.checked;
                                setFields(updatedFields);
                              }}
                            />
                          </td>
                          {/* ក្នុងផ្នែក Keys Table */}
                          <td className="p-2">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => removeFieldRow(index)}
                                className="text-red-400 transition-colors hover:text-red-500"
                              >
                                <MinusCircle className="size-5" />
                              </button>
                              <button
                                onClick={addFieldRow}
                                className="text-green-400 transition-colors hover:text-green-500"
                              >
                                <PlusCircle className="size-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* --- Section 2: Keys --- */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-3 dark:border-gray-800">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <Key className="size-4 text-orange-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                    Keys
                  </h3>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-4 py-3">Column name</th>
                        <th className="px-4 py-3 text-center">PK</th>
                        <th className="px-4 py-3 text-center">FK</th>
                        <th className="px-4 py-3">Reference Table</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    {/* --- Section 2: Keys --- */}
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {keys.map((key, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30"
                        >
                          <td className="p-2">
                            <input
                              type="text"
                              value={key.columnName || ""} // ការពារ undefined
                              onChange={(e) =>
                                handleKeyChange(index, e.target.value)
                              }
                              className="w-full rounded-lg border-transparent bg-transparent px-3 py-2 outline-none dark:text-white"
                              placeholder="column_name"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={!!key.isPk}
                              onChange={(e) => {
                                const updatedKeys = [...keys];
                                // បង្កើត Object ថ្មីសម្រាប់ index មួយនេះ ដើម្បីកុំឱ្យជួប error read-only
                                updatedKeys[index] = {
                                  ...updatedKeys[index],
                                  isPk: e.target.checked,
                                };
                                setKeys(updatedKeys);
                              }}
                              className="size-4 rounded accent-blue-500"
                            />
                          </td>
                          {/* --- ផ្នែក FK Checkbox --- */}
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={!!key.isFk}
                              onChange={(e) => {
                                const updatedKeys = [...keys];
                                // បង្កើត Object ថ្មីជានិច្ច កុំប្រើ updatedKeys[index].isFk = ...
                                updatedKeys[index] = {
                                  ...updatedKeys[index],
                                  isFk: e.target.checked,
                                };
                                setKeys(updatedKeys);
                              }}
                              className="size-4 rounded accent-blue-500"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={key.referenceTable || ""}
                              onChange={(e) => {
                                const updatedKeys = [...keys];
                                updatedKeys[index] = {
                                  ...updatedKeys[index],
                                  referenceTable: e.target.value,
                                };
                                setKeys(updatedKeys);
                              }}
                              className="w-full rounded-lg border border-gray-100 bg-transparent px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-500 dark:border-gray-700 dark:text-gray-300"
                            >
                              <option value="">
                                {isLoading
                                  ? "Loading..."
                                  : "-- Select Table --"}
                              </option>
                              {allSchemesInFolder?.map((s: any) => (
                                <option key={s.id} value={s.name}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => removeKeyRow(index)} // ត្រូវហៅ function key
                                className="text-red-400 transition-colors hover:text-red-500"
                              >
                                <MinusCircle className="size-5" />
                              </button>
                              <button
                                onClick={addKeyRow} // ត្រូវហៅ function key
                                className="text-green-400 transition-colors hover:text-green-500"
                              >
                                <PlusCircle className="size-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Footer Save Changes */}
              <div className="flex items-center justify-end border-t pt-6">
                <button
                  disabled={isUpdating}
                  onClick={handleSaveSchemaChanges}
                  className={cn(
                    "flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all active:scale-95",
                    isUpdating
                      ? "cursor-not-allowed opacity-70"
                      : "hover:bg-orange-700",
                  )}
                >
                  {isUpdating ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {isUpdating ? "SAVING..." : "SAVE SCHEMA CHANGES"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "Swagger" && (
            <div
              key={swaggerKey}
              className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4"
            >
              {/* --- 🎯 AI Mock Data Modal (Chat Interface) --- */}
              <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                <DialogContent className="rounded-lg bg-white p-10 sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="size-5 text-purple-600" />
                      AI Data Generator
                    </DialogTitle>
                    <DialogDescription>
                      Tell AI how you want your mock data to look. Describe
                      quantity, format, or specific details.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-4">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Example: Generate 20 users with Cambodian names, random ages between 18-60, and sample profile pictures..."
                      className="min-h-[120px] w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-950"
                    />
                  </div>

                  <DialogFooter>
                    <button
                      onClick={() => setIsAiModalOpen(false)}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStartAiGeneration}
                      disabled={isMocking || !aiPrompt.trim()}
                      className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-purple-700 disabled:bg-purple-300"
                    >
                      {isMocking ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Sparkles className="size-4" />
                      )}
                      {isMocking ? "Generating..." : "Generate with AI"}
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* --- Header Section --- */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-black text-gray-800 dark:text-white">
                        {schema?.name || "Product API"}
                      </h2>
                      <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
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
                    <p className="mt-4 max-w-2xl text-sm text-gray-500">
                      {schema?.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* 🎯 ប៊ូតុងបើក Modal */}
                    <button
                      onClick={() => setIsAiModalOpen(true)}
                      className="flex items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-600 transition-all hover:bg-purple-100 dark:border-purple-900/30 dark:bg-purple-900/20"
                    >
                      <Sparkles className="size-3" /> Generate AI Mock Data
                    </button>
                  </div>
                </div>

                {/* --- Base URL Section --- */}
                <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-orange-100 bg-orange-50/30 p-5 dark:border-orange-900/20 dark:bg-orange-900/10">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                      <Database className="size-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                        Base Server URL
                      </span>
                      <code className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        https://api.idata.fit/api/v1/engine-{projectKey}/
                        {realSlug}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleCopy(
                          `https://api.idata.fit/api/v1/engine-${projectKey}/${realSlug}`,
                        )
                      }
                      className="flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50"
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
                      className="flex h-9 items-center gap-2 rounded-lg bg-orange-500 px-3 text-xs font-medium text-white hover:bg-orange-600"
                    >
                      <Download className="size-3.5" /> Download
                    </button>
                  </div>
                </div>
              </div>

              {/* --- Swagger UI Section --- */}
              <div className="swagger-custom-style overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
                  .dark .swagger-ui {
                    filter: invert(88%) hue-rotate(180deg);
                  }
                `}</style>
                <SwaggerUI
                  key={swaggerKey}
                  spec={spec}
                  docExpansion="list"
                  tryItOutEnabled={true}
                  persistAuthorization={true}
                  requestInterceptor={(request: any) => {
                    if (projectKey && realSlug) {
                      request.url = request.url
                        .replace("{projectKey}", projectKey)
                        .replace("{slug}", realSlug);
                    }

                    const currentApiKey =
                      schema?.workspace?.apiKey || schema?.apiKey;

                    if (currentApiKey) {
                      request.headers = {
                        ...request.headers,
                        "x-api-key": currentApiKey,
                      };
                    }

                    return request;
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
