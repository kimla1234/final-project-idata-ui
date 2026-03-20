"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useCreateApiSchemeMutation } from "@/redux/service/apiScheme";
import { useToast } from "@/hooks/use-toast";
interface CreateSchemaProps {
  folderId: number | null;
}
export default function CreateSchema({ folderId }: CreateSchemaProps) {
  const { toast } = useToast();
  const [createApiScheme, { isLoading }] = useCreateApiSchemeMutation();


  // State សម្រាប់គ្រប់គ្រងទិន្នន័យឱ្យត្រូវតាម DTO របស់បង
  const [formData, setFormData] = useState({
    name: "",
    endpointUrl: "",
    description: "",
    isPublic: true,
    folderId: folderId || 0,
  });

  React.useEffect(() => {
    if (folderId) {
      setFormData((prev) => ({ ...prev, folderId: folderId }));
    }
  }, [folderId]);

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

  // Logic សម្រាប់បន្ថែម/លុប Properties
  const addProperty = () =>
    setProperties([
      ...properties,
      { fieldName: "", type: "string", required: false },
    ]);
  const removeProperty = (index: number) =>
    setProperties(properties.filter((_, i) => i !== index));

  // Logic សម្រាប់បន្ថែម/លុប Keys
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

const handleGenerate = async () => {
  const payload = {
    ...formData,
    properties: properties,
    keys: keys,
  };

  try {
    await createApiScheme(payload).unwrap();
    toast({
      title: "Success",
      description: "Template created successfully!",
    });
    handleReset();
  } catch (error: any) {
    // 🎯 កែត្រង់នេះដើម្បីមើល Error Message ពី Backend ឱ្យច្បាស់
    const serverError = error?.data?.message || error?.data || "មានបញ្ហាក្នុងការបង្កើត Schema";
    
    toast({
      variant: "destructive", // ប្រើពណ៌ក្រហមសម្រាប់ Error
      title: "Generate Failed",
      description: serverError,
    });

    console.log("Full Error Object:", error); // មើល Object ទាំងមូល
  }
};

  const handleReset = () => {
    // ១. Reset ព័ត៌មានទូទៅ (Name, URL, Description)
    setFormData({
      name: "",
      endpointUrl: "",
      description: "",
      isPublic: true,
      folderId: 8,
    });

    // ២. Reset តារាង Properties ឱ្យសល់តែ id មួយជួរដំបូង
    setProperties([{ fieldName: "id", type: "number", required: true }]);

    // ៣. Reset តារាង Keys ឱ្យសល់តែ id ជា Primary Key មួយជួរដំបូង
    setKeys([
      {
        columnName: "id",
        primaryKey: true,
        foreignKey: false,
        referenceTable: "",
      },
    ]);
  };

  // ឧទាហរណ៍៖ បញ្ជី Table ដែលមានស្រាប់ក្នុង DB បង
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
        <button className="flex items-center gap-1.5 rounded bg-orange-500 px-3 py-1 text-[11px] font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600">
          <Plus className="size-3" /> Add new schema
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="right-2 mb-2 mt-2 flex h-[98vh] w-full flex-col rounded-lg bg-white shadow-2xl sm:max-w-[750px]"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-[#1e293b]">
            <Database className="size-5 text-orange-500" /> API Generation with
            Schema
          </SheetTitle>
          <p className="text-xs text-gray-400">Fill in to generate API</p>
        </SheetHeader>

        <div className="mt-6 h-screen space-y-8 overflow-y-auto pb-10">
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
                placeholder="Description for the schema"
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
                  <tr key={index} className="border-b">
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
                  <tr key={index} className="border-b">
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
                        disabled={!key.foreignKey} // បើមិនមែនជា FK ទេ មិនឱ្យរើស Table ឡើយ
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
        {/* 3. Bottom Actions - ជាប់នៅខាងក្រោមរហូត (Sticky/Fixed) */}
        <div className="bottom-0 flex items-center justify-between border-t bg-gray-50/50 p-6">
          <button className="rounded-full bg-[#0f172a] px-6 py-2 text-[12px] font-medium text-white shadow-lg hover:opacity-90">
            Swagger UI
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isLoading} // បិទប៊ូតុងពេលកំពុងបាញ់
              className={`flex items-center gap-2 rounded-full px-6 py-2 text-[12px] font-medium text-white shadow-lg transition-all ${
                isLoading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-[#1e293b] hover:bg-orange-600"
              }`}
            >
              <Sparkles className="size-3.5" />
              {isLoading ? "Generating..." : "Start Generate"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-full border bg-white px-6 py-2 text-[12px] font-medium text-gray-600 shadow-sm transition hover:bg-gray-50"
            >
              New Schema
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
