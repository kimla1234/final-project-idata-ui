"use client";
import { formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import React, { useState, useEffect } from "react";
import {
  Trash2,
  Mail,
  Users,
  Calendar,
  Plus,
  Bookmark,
  Send,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import MessageCard from "./MessageCard";
import { FaRegEdit } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { selectActiveWorkspaceId } from "@/redux/feature/workspace/workspaceSlice";

import { format } from "date-fns";
import { useGetCampaignsByWorkspaceQuery } from "@/redux/service/campaign";

export default function ScheduledComponents() {
  const activeWorkspaceId = useSelector(selectActiveWorkspaceId);

  // ១. ទាញទិន្នន័យ Campaigns ពី Backend តាមរយៈ Workspace ID
  const {
    data: campaigns,
    isLoading,
    isError,
  } = useGetCampaignsByWorkspaceQuery(activeWorkspaceId as number, {
    skip: !activeWorkspaceId,
  });

  // State សម្រាប់ទុក Campaign ដែល User កំពុងចុចមើល Detail
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  // ២. បែងចែកយុទ្ធនាការតាម Status
  const upcomingCampaigns =
    campaigns?.filter((c: any) => c.status === "SCHEDULED") || [];
  const sentCampaigns =
    campaigns?.filter(
      (c: any) => c.status === "COMPLETED" || c.status === "SENDING",
    ) || [];

  // ៣. កំណត់យក Campaign ដំបូងមកបង្ហាញពេលទិន្នន័យ Load រួច
  useEffect(() => {
    if (upcomingCampaigns.length > 0 && !selectedCampaign) {
      setSelectedCampaign(upcomingCampaigns[0]);
    } else if (sentCampaigns.length > 0 && !selectedCampaign) {
      setSelectedCampaign(sentCampaigns[0]);
    }
  }, [campaigns]);

  if (isLoading)
    return <div className="p-10 text-center">Loading Campaigns...</div>;
  const stripHtml = (html: string | undefined | null) => {
    return (html || "").replace(/<[^>]*>?/gm, "");
  };

  const getRelativeDateLabel = (dateString: string | null | undefined) => {
    if (!dateString) return "Today";
    const date = new Date(dateString);

    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";

    // បើលើសពី ២ ថ្ងៃ ឱ្យបង្ហាញថា "In 2 days" ឬ "Feb 26"
    // ប្រសិនបើអ្នកចង់បាន "In x days" ប្រើ formatDistanceToNow
    return formatDistanceToNow(date, { addSuffix: true }).replace("about ", "");
  };

  return (
    <div className="flex h-full min-h-screen gap-6 bg-[#f8f9fc] p-6 font-sans">
      {/* ផ្នែកខាងឆ្វេង: បញ្ជីសារ (Dynamic Sidebar) */}
      <div className="flex w-[380px] flex-col gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2 rounded-xl bg-gray-100/50 p-1">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
            </TabsList>

            <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#9333ea] py-3.5 font-bold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 active:scale-95">
              <Plus size={20} /> Create New Message
            </button>

            <div className="no-scrollbar max-h-[calc(100vh-250px)] space-y-3 overflow-y-auto">
              <TabsContent value="upcoming" className="m-0 space-y-3">
                {upcomingCampaigns.map((c: any) => {
                  const displayDate = c.scheduledAt
                    ? getRelativeDateLabel(c.scheduledAt)
                    : "Today";
                  console.log(c.scheduledAt);
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCampaign(c)}
                      className="cursor-pointer"
                    >
                      <MessageCard
                        active={selectedCampaign?.id === c.id}
                        title={c.name}
                        content={stripHtml(c.content)}
                        date={displayDate}
                        time={
                          c.scheduledAt
                            ? format(new Date(c.scheduledAt), "hh:mm a")
                            : ""
                        }
                        recipientsCount={c.totalRecipients || 0}
                        tagsCount={c.folderIds?.length || 0}
                        statusColor="bg-purple-100 text-purple-700"
                      />
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="sent" className="m-0 space-y-3">
                {sentCampaigns.map((c: any) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCampaign(c)}
                    className="cursor-pointer"
                  >
                    <MessageCard
                      active={selectedCampaign?.id === c.id}
                      title={c.name}
                      content={stripHtml(c.content)}
                      date="Sent"
                      time={format(new Date(c.createdAt), "MMM dd")}
                      recipientsCount={c.totalRecipients || 0}
                      tagsCount={c.folderIds?.length || 0}
                      statusColor="bg-emerald-100 text-emerald-700"
                    />
                  </div>
                ))}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* ផ្នែកខាងស្តាំ: ខ្លឹមសារលម្អិត (Dynamic Detail) */}
      <div className="flex flex-1 flex-col gap-5">
        {selectedCampaign ? (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-extrabold text-[#2b3467]">
                {selectedCampaign.name}
              </h1>
              <div className="flex gap-2">
                <button className="rounded-xl border border-gray-200 bg-white p-2.5 text-slate-400 transition-all hover:bg-purple-50 hover:text-purple-600">
                  <FaRegEdit size={20} />
                </button>
                <button className="rounded-xl border border-gray-200 bg-white p-2.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center gap-3 text-xl font-bold text-[#2b3467]">
                  <Mail className="text-purple-500" /> Message details
                </div>
                {/* បង្ហាញ Content ជា HTML ចេញពី Editor */}
                <div
                  className="prose max-w-none leading-relaxed text-slate-600"
                  dangerouslySetInnerHTML={{ __html: selectedCampaign.content }}
                />
              </section>

              <Section icon={<Users size={22} />} title="Recipients">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {/* បង្ហាញចំនួនអ្នកទទួលសរុប */}
                    <span className="rounded-lg border bg-slate-50 px-4 py-2 font-medium text-slate-600">
                      Total Recipients: {selectedCampaign.totalRecipients}
                    </span>
                  </div>
                </div>
              </Section>

              <Section icon={<Calendar size={22} />} title="Schedule Info">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <Clock className="text-purple-500" size={20} />
                    <span className="text-lg font-bold text-[#2b3467]">
                      {selectedCampaign.scheduledAt
                        ? format(
                            new Date(selectedCampaign.scheduledAt),
                            "MMMM dd, yyyy",
                          )
                        : "Sent on " +
                          format(
                            new Date(selectedCampaign.createdAt),
                            "MMMM dd, yyyy",
                          )}
                    </span>
                  </div>
                  <span className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 font-medium text-slate-500">
                    {selectedCampaign.scheduledAt
                      ? format(
                          new Date(selectedCampaign.scheduledAt),
                          "hh:mm a",
                        )
                      : format(new Date(selectedCampaign.createdAt), "hh:mm a")}
                  </span>
                </div>
              </Section>
            </div>
          </>
        ) : (
          <div className="flex h-[60vh] items-center justify-center italic text-slate-400">
            Select a message to view details
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ icon, title, children }: any) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-4 flex items-center gap-3 text-xl font-bold text-[#2b3467]">
        {icon} <span>{title}</span>
      </div>
      {children}
    </div>
  );
}
