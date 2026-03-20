"use client";

import React, { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Loader2,
  MessageSquare,
  Layout,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/DashboardCompoenents/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"; // ប្រាកដថាអ្នកមាន component នេះ
import { useToast } from "@/hooks/use-toast";
import {
  useCreateTemplateMutation,
  useGetTemplatesByWorkspaceQuery,
} from "@/redux/service/tempate";
import { useSelector } from "react-redux";
import { selectActiveWorkspaceId } from "@/redux/feature/workspace/workspaceSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CreateTempate from "./CreateTempate";

export default function TemplateManager() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const activeWorkspaceId = useSelector(selectActiveWorkspaceId);

  const [createTemplate, { isLoading: isCreating }] =
    useCreateTemplateMutation();
  const { data: customTemplates, isFetching } = useGetTemplatesByWorkspaceQuery(
    activeWorkspaceId as number,
    { skip: !activeWorkspaceId },
  );

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
  });

  const handleSave = async () => {
    if (!formData.name || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTemplate({
        workspaceId: activeWorkspaceId!,
        body: {
          name: formData.name,
          subject: formData.subject || formData.name,
          content: formData.content,
        },
      }).unwrap();

      toast({
        title: "Success",
        description: "Template created successfully!",
      });
      setIsOpen(false);
      setFormData({ name: "", subject: "", content: "" });
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error?.data?.message || "Error creating template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className=" px-6  bg-white ">
      <Tabs defaultValue="custom" className="w-full  ">
        <div className="flex items-center justify-between">
          <TabsList className="mb-8 w-fit rounded-md border  border-slate-100 bg-slate-200/50 p-1">
            <TabsTrigger
              value="custom"
              className="rounded-md px-8 data-[state=active]:bg-white data-[state=active]:"
            >
              Custom
            </TabsTrigger>
            <TabsTrigger
              value="suggested"
              className="rounded-md px-8 data-[state=active]:bg-white data-[state=active]:"
            >
              Suggested
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center -mt-7 justify-between">
            <CreateTempate/>
          </div>
        </div>

        <TabsContent value="custom" className="mt-0">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-20">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-sm text-slate-400">Fetching templates...</p>
            </div>
          ) : customTemplates && customTemplates.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
              {customTemplates.map((item: any) => (
                <div
                  key={item.id}
                  className="group rounded-md border bg-slate-50 border-slate-100  p-5  "
                >
                  

                  <h4 className="mb-1 font-bold text-slate-800">{item.name}</h4>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-100 py-20">
              <div className="mb-4 rounded-full bg-slate-50 p-4">
                <Layout className="h-8 w-8 text-slate-300" />
              </div>
              <p className="font-medium text-slate-500">
                No templates created yet.
              </p>
              <p className="text-sm text-slate-400">
                Start by adding your first message template.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
