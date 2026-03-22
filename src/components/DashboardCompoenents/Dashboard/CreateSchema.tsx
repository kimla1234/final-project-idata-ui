"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Plus,
  Database,
  ListPlus,
  KeyRound,
  Sparkles,
  MinusCircle,
  PlusCircle,
  FolderPlus,
  Loader2,
} from "lucide-react";
import { useCreateApiSchemeMutation } from "@/redux/service/apiScheme";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateFolderMutation,
  useGetFoldersByWorkspaceQuery,
} from "@/redux/service/folder";
import { useRouter } from "next/navigation";

interface CreateSchemaProps {
  folderId: number | null;
  children?: React.ReactNode;
  workspaceId: number; 
}

export default function CreateSchema({
  folderId: initialFolderId,
  workspaceId,
  children,
}: CreateSchemaProps) {
  const { toast } = useToast();
  const router = useRouter();
  // --- API Hooks (Real) ---
  const [createApiScheme, { isLoading: isGenerating }] =
    useCreateApiSchemeMutation();
  const [createFolder, { isLoading: isCreatingFolder }] =
    useCreateFolderMutation();
  const { data: folders, isLoading: isFetchingFolders } =
    useGetFoldersByWorkspaceQuery(workspaceId);

  // --- States ---
  const [isNewFolderMode, setIsNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    endpointUrl: "",
    description: "",
    isPublic: true,
    folderId: initialFolderId || 0,
  });

  const [properties, setProperties] = useState([
    { fieldName: "id", type: "number", required: true },
  ]);

  const [keys, setKeys] = useState([
    {
      columnName: "id",
      primaryKey: true,
      foreignKey: false,
      referenceTable: "",
    },
  ]);

  // Sync folderId with initial props
  useEffect(() => {
    if (initialFolderId) {
      setFormData((prev) => ({ ...prev, folderId: initialFolderId }));
    }
  }, [initialFolderId]);

  // --- Folder Logic ---
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    

    try {

      //  Structure: { workspaceId, body: { name } }
      const res = await createFolder({
        workspaceId: workspaceId,
        body: { name: newFolderName },
      }).unwrap();

      
      setFormData({ ...formData, folderId: res.id });
      setIsNewFolderMode(false);
      setNewFolderName("");
      toast({
        title: "Success",
        description: `Folder "${res.name}" created and selected.`,
      });
      
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.message || "Failed to create folder",
      });
    }
  };

  // --- Properties Logic ---
  const addProperty = () =>
    setProperties([
      ...properties,
      { fieldName: "", type: "string", required: false },
    ]);
  const removeProperty = (index: number) =>
    setProperties(properties.filter((_, i) => i !== index));

  // --- Keys Logic ---
  const addKey = () =>
    setKeys([
      ...keys,
      {
        columnName: "",
        primaryKey: false,
        foreignKey: false,
        referenceTable: "",
      },
    ]);
  const removeKey = (index: number) =>
    setKeys(keys.filter((_, i) => i !== index));

  // --- Main Generate Logic ---
 const handleGenerate = async () => {
    // ១. Validations
    if (!formData.name || !formData.endpointUrl || formData.folderId === 0) {
      toast({
        variant: "destructive",
        title: "Missing Info",
        description: "Please fill Schema Name, URL and select a Folder.",
      });
      return;
    }

    // ២. Sanitize Data (ប្តូរ "" ទៅ null ដើម្បីបង្ការ Error 500 នៅ Backend)
    const sanitizedKeys = keys.map((k) => ({
      ...k,
      referenceTable: k.referenceTable.trim() === "" ? null : k.referenceTable,
    }));

    const payload = { 
      ...formData, 
      properties: properties.filter(p => p.fieldName.trim() !== ""), // យកតែ field ដែលមានឈ្មោះ
      keys: sanitizedKeys 
    };

    try {
      const result = await createApiScheme(payload).unwrap();
      
      toast({
        title: "Success",
        description: "API Scheme generated successfully!",
      });

      handleReset();

      // ៣. Success Redirect
      if (result?.id) {
        router.push(`/schema/${result.id}?tab=Overview`);
      }
    } catch (error: any) {
      console.error("Generate Error:", error);
      toast({
        variant: "destructive",
        title: "Generate Failed (500)",
        description: error?.data?.message || "Internal Server Error. Please check backend logs.",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      endpointUrl: "",
      description: "",
      isPublic: true,
      folderId: initialFolderId || 0,
    });
    setProperties([{ fieldName: "id", type: "number", required: true }]);
    setKeys([
      {
        columnName: "id",
        primaryKey: true,
        foreignKey: false,
        referenceTable: "",
      },
    ]);
    setIsNewFolderMode(false);
  };

  const existingTables = [
    "users",
    "categories",
    "products",
    "orders",
    "customers",
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>

        <div className="inline-block w-full cursor-pointer">
          {children ? (
            children
          ) : (
            <button className="flex items-center gap-1.5 rounded bg-orange-500 px-3 py-1 text-[11px] font-semibold text-white shadow-orange-500/20 transition hover:bg-orange-600">
              <Plus className="size-3" /> Add new schema
            </button>
          )}
        </div>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="right-2 mb-2 mt-2 flex h-[98vh] w-full flex-col rounded-lg bg-white sm:max-w-[750px]"
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-[#1e293b]">
            <Database className="size-5 text-orange-500" /> API Generation with
            Schema
          </SheetTitle>
          <p className="text-xs text-gray-400">
            Design your schema structure and organize into folders.
          </p>
        </SheetHeader>

        <div className="mt-6 flex-1 space-y-8 overflow-y-auto px-1 pb-24">
          {/* --- Section: Folder Management (Real API Integration) --- */}
          <div className="space-y-3 rounded-xl border border-orange-100 bg-orange-50/30 p-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[13px] font-bold text-[#1e293b]">
                <FolderPlus size={16} className="text-orange-500" /> Target
                Folder
              </label>
              <button
                onClick={() => setIsNewFolderMode(!isNewFolderMode)}
                className="text-[11px] font-bold text-orange-600 underline transition-all hover:text-orange-700"
              >
                {isNewFolderMode ? "Select Existing" : "+ Create New Folder"}
              </button>
            </div>

            {isNewFolderMode ? (
              <div className="flex gap-2 animate-in fade-in slide-in-from-top-1">
                <input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter new folder name..."
                  className="flex-1 rounded-lg border border-gray-200 bg-white p-2 text-sm shadow-sm outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  onClick={handleCreateFolder}
                  disabled={isCreatingFolder}
                  className="flex items-center gap-1 rounded-lg bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-orange-600"
                >
                  {isCreatingFolder && (
                    <Loader2 size={12} className="animate-spin" />
                  )}
                  Create
                </button>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={formData.folderId}
                  disabled={isFetchingFolders}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      folderId: Number(e.target.value),
                    })
                  }
                  className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white p-2.5 text-sm shadow-sm outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value={0}>
                    {isFetchingFolders
                      ? "Loading folders..."
                      : "-- Select a folder to save --"}
                  </option>
                  {folders?.map((folder: any) => (
                    <option key={folder.id} value={folder.id}>
                      📁 {folder.name}
                    </option>
                  ))}
                </select>
                {isFetchingFolders && (
                  <Loader2 className="absolute right-3 top-3 size-4 animate-spin text-gray-400" />
                )}
              </div>
            )}
          </div>

          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1e293b]">
                Schema Name
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="example: users"
                className="w-full rounded-lg border border-gray-200 bg-gray-50/30 p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1e293b]">
                Endpoint URL
              </label>
              <input
                value={formData.endpointUrl}
                onChange={(e) =>
                  setFormData({ ...formData, endpointUrl: e.target.value })
                }
                placeholder="e-invoice-v2"
                className="w-full rounded-lg border border-gray-200 bg-gray-50/30 p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[13px] font-bold text-[#1e293b]">
                Description
              </label>
              <input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Briefly describe what this API does..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50/30 p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Section 2: Properties */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b pb-2">
              <ListPlus className="size-4 text-orange-500" />
              <h3 className="text-[14px] font-bold text-[#1e293b]">
                Properties
              </h3>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border bg-gray-50 text-left text-[12px] text-gray-500">
                  <th className="border-r p-2 font-semibold">Field name</th>
                  <th className="border-r p-2 font-semibold">Type</th>
                  <th className="border-r p-2 text-center font-semibold">
                    Require
                  </th>
                  <th className="p-2 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="border">
                {properties.map((prop, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50/50">
                    <td className="border-r p-2">
                      <input
                        value={prop.fieldName}
                        onChange={(e) => {
                          const newProps = [...properties];
                          newProps[index].fieldName = e.target.value;
                          setProperties(newProps);
                        }}
                        className="w-full bg-transparent p-1 text-sm outline-none"
                      />
                    </td>
                    <td className="border-r p-2">
                      <select
                        value={prop.type}
                        onChange={(e) => {
                          const newProps = [...properties];
                          newProps[index].type = e.target.value;
                          setProperties(newProps);
                        }}
                        className="w-full bg-transparent p-1 text-sm outline-none"
                      >
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="boolean">boolean</option>
                      </select>
                    </td>
                    <td className="border-r p-2 text-center">
                      <input
                        type="checkbox"
                        checked={prop.required}
                        onChange={(e) => {
                          const newProps = [...properties];
                          newProps[index].required = e.target.checked;
                          setProperties(newProps);
                        }}
                        className="accent-orange-500"
                      />
                    </td>
                    <td className="flex justify-center gap-2 p-2">
                      <button
                        onClick={() => removeProperty(index)}
                        className="text-red-400 transition hover:text-red-600"
                      >
                        <MinusCircle className="size-4" />
                      </button>
                      <button
                        onClick={addProperty}
                        className="text-green-500 transition hover:text-green-700"
                      >
                        <PlusCircle className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Keys */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b pb-2">
              <KeyRound className="size-4 text-orange-500" />
              <h3 className="text-[14px] font-bold text-[#1e293b]">Keys</h3>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border bg-gray-50 text-left text-[11px] text-gray-500">
                  <th className="border-r p-2 font-semibold">Column name</th>
                  <th className="border-r p-2 text-center font-semibold">PK</th>
                  <th className="border-r p-2 text-center font-semibold">FK</th>
                  <th className="border-r p-2 font-semibold">
                    Reference Table
                  </th>
                  <th className="p-2 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="border">
                {keys.map((key, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50/50">
                    <td className="border-r p-2">
                      <input
                        value={key.columnName}
                        onChange={(e) => {
                          const newKeys = [...keys];
                          newKeys[index].columnName = e.target.value;
                          setKeys(newKeys);
                        }}
                        className="w-full bg-transparent p-1 text-sm outline-none"
                      />
                    </td>
                    <td className="border-r p-2 text-center">
                      <input
                        type="checkbox"
                        checked={key.primaryKey}
                        onChange={(e) => {
                          const newKeys = [...keys];
                          newKeys[index].primaryKey = e.target.checked;
                          setKeys(newKeys);
                        }}
                        className="accent-blue-600"
                      />
                    </td>
                    <td className="border-r p-2 text-center">
                      <input
                        type="checkbox"
                        checked={key.foreignKey}
                        onChange={(e) => {
                          const newKeys = [...keys];
                          newKeys[index].foreignKey = e.target.checked;
                          setKeys(newKeys);
                        }}
                        className="accent-blue-600"
                      />
                    </td>
                    <td className="border-r p-2">
                      <select
                        value={key.referenceTable}
                        disabled={!key.foreignKey}
                        onChange={(e) => {
                          const newKeys = [...keys];
                          newKeys[index].referenceTable = e.target.value;
                          setKeys(newKeys);
                        }}
                        className={`w-full bg-transparent p-1 text-sm outline-none ${
                          !key.foreignKey
                            ? "cursor-not-allowed text-gray-300"
                            : "font-medium text-orange-600"
                        }`}
                      >
                        <option value="">-- Select Table --</option>
                        {existingTables.map((tableName) => (
                          <option key={tableName} value={tableName}>
                            {tableName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="flex justify-center gap-2 p-2">
                      <button
                        onClick={() => removeKey(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <MinusCircle className="size-4" />
                      </button>
                      <button
                        onClick={addKey}
                        className="text-green-500 hover:text-green-700"
                      >
                        <PlusCircle className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Bottom Actions - Sticky at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t bg-white p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <button className="rounded-full bg-[#0f172a] px-6 py-2 text-[12px] font-medium text-white shadow-lg transition-opacity hover:opacity-90">
            Swagger UI
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`flex items-center gap-2 rounded-full px-6 py-2 text-[12px] font-medium text-white shadow-lg shadow-orange-100 transition-all ${
                isGenerating
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-[#1e293b] hover:bg-orange-600 active:scale-95"
              }`}
            >
              {isGenerating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              {isGenerating ? "Generating..." : "Start Generate"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-full border bg-white px-6 py-2 text-[12px] font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 active:scale-95"
            >
              Reset Form
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
