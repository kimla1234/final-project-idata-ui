"use client";
import React, { ReactNode, useState } from "react";
import {
  X,
  Smile,
  Image as ImageIcon,
  Bookmark,
  Cat,
  Flame,
  User,
  Wrench,
  CheckCircle2,
  Paperclip,
  Link2,
  Share2,
  Lock,
  Pencil,
  MoreVertical,
  Maximize2,
  SpellCheck,
  CalendarDays,
  CalendarIcon,
  PlusIcon,
} from "lucide-react";
import { LuSendHorizontal } from "react-icons/lu";
import { GrDocumentConfig } from "react-icons/gr";
import RichTextEditor from "../ui/RichTextEditor";
import FilterDropdown from "../EventCompoents/search/FilterDropdown";
import { DocumentCard } from "./DocumentCard";
import { cn } from "@/lib/utils";
import { MenuAction } from "./EditorToolbar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import SendOnSection from "./SendOnSection";
import SuggestedTemplates from "./SuggestedTemplates";
import { UploadModal } from "./UploadModal";
import { useStartCampaignMutation } from "@/redux/service/campaign";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { selectActiveWorkspaceId } from "@/redux/feature/workspace/workspaceSlice";
import { useGetFoldersByWorkspaceQuery } from "@/redux/service/folder";
import { useGetTenantsByWorkspaceQuery } from "@/redux/service/tenant";

// --- Types ---
interface TagProps {
  children: ReactNode;
  color: string;
  icon: ReactNode;
}

interface Tenant {
  id: string;
  name: string;
  address: string;
}

// --- Mock Data ---
const MOCK_DATA = {
  templates: [
    "Rent Reminder",
    "Scheduled Maintenance Notice",
    "Annual Safety Inspection",
    "General Announcement",
  ],
  selectedFilters: [
    {
      label: "Cat owners",
      icon: <Cat size={14} />,
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      label: "Old furnace",
      icon: <Flame size={14} />,
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
  ],
  tenants: [
    {
      id: "1",
      name: "Brooke Jones",
      address: "1252 Parkway Dr. #2 California City, CA, 90012",
    },
    {
      id: "2",
      name: "Pecky Smith",
      address: "91 Delito Place, California City, CA, 90012",
    },
    {
      id: "3",
      name: "Pecky Kimla",
      address: "91 Delito Place, California City, CA, 90012",
    },
  ],
  suggestedTags: [
    {
      label: "Rent due on 1st",
      icon: <User size={14} />,
      color: "bg-red-50 text-red-600 border-red-100",
    },
    {
      label: "John Miller",
      icon: <User size={14} />,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      label: "Maintenance Request",
      icon: <Wrench size={14} />,
      color: "bg-lime-50 text-lime-700 border-lime-200",
    },
    {
      label: "Maintenance",
      icon: <Wrench size={14} />,
      color: "bg-lime-50 text-lime-700 border-lime-200",
    },
  ],
};
// 1. Define a set of distinct color pairs
const CHIP_COLORS = [
  {
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-700",
    icon: "text-blue-400",
  },
  {
    bg: "bg-purple-50",
    border: "border-purple-100",
    text: "text-purple-700",
    icon: "text-purple-400",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    text: "text-emerald-700",
    icon: "text-emerald-400",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-100",
    text: "text-amber-700",
    icon: "text-amber-400",
  },
  {
    bg: "bg-rose-50",
    border: "border-rose-100",
    text: "text-rose-700",
    icon: "text-rose-400",
  },
  {
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    text: "text-indigo-700",
    icon: "text-indigo-400",
  },
];

export default function MessageComponent() {
  const { toast } = useToast();
  const [sendType, setSendType] = useState<"IMMEDIATELY" | "SCHEDULED">(
    "IMMEDIATELY",
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>("10:30:00");

  // State to track selected tenant IDs from the dropdown
  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const activeWorkspaceId = useSelector(selectActiveWorkspaceId);
  // --- 1. បន្ថែម State ថ្មីសម្រាប់ Direct Emails ---
  const [directEmails, setDirectEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  const { data: workspaceTenants, isLoading: isTenantLoading } =
    useGetTenantsByWorkspaceQuery(activeWorkspaceId as number, {
      skip: !activeWorkspaceId,
    });

  // បន្ថែម State សម្រាប់ Topic (ពីមុនជា defaultValue)
  const [startCampaign, { isLoading: isSending }] = useStartCampaignMutation();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const { data: folders, isLoading: isFolderLoading } =
    useGetFoldersByWorkspaceQuery(activeWorkspaceId as number, {
      skip: !activeWorkspaceId,
    });
  const folderOptions =
    folders?.map((f: any) => ({
      value: f.id.toString(),
      label: f.name,
    })) || [];

  // ប្រើ Map ដើម្បីរក្សាទុកតែ Email ដែលប្លែកៗគ្នា (Unique)
  const tenantOptions = React.useMemo(() => {
    if (!workspaceTenants) return [];
    const uniqueMap = new Map();
    workspaceTenants.forEach((t: any) => {
      if (!uniqueMap.has(t.email)) {
        uniqueMap.set(t.email, { value: t.email, label: t.name });
      }
    });
    return Array.from(uniqueMap.values());
  }, [workspaceTenants]);

  // Function សម្រាប់ទទួលទិន្នន័យពី SuggestedTemplates
  const handleSelectTemplate = (template: any) => {
    setTopic(template.subject || template.name); // យក subject បើគ្មានយក name
    setMessage(template.content || ""); // យក content ដាក់ចូល message
  };

  const handleAddEmail = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && emailInput.includes("@")) {
      e.preventDefault();

      // បំប្លែងទៅជា lowercase ដើម្បីកុំឱ្យជាន់គ្នា (ឧទាហរណ៍៖ A@g.com និង a@g.com)
      const newEmail = emailInput.trim().toLowerCase();

      if (!directEmails.includes(newEmail)) {
        setDirectEmails([...directEmails, newEmail]);
      }
      setEmailInput("");
    }
  };

  // Inside MessageComponent

  // Derived state: Get the full objects for the chips
  const selectedTenants = MOCK_DATA.tenants.filter((t) =>
    selectedTenantIds.includes(t.id),
  );

  const dropdownOptions = MOCK_DATA.tenants.map((t) => ({
    value: t.id,
    label: t.name,
  }));
  const activeTemplate = "Scheduled Maintenance Notice";
  const [message, setMessage] = useState(
    "Dear Tenants, We would like to inform you about scheduled maintenance in the building on Mon, Feb 6 at 12:41. Access to common areas will be temporarily unavailable. Thank you for your cooperation.",
  );

  // Simple mock function to "predict" text based on what's typed
  const handleTextChange = (val: string) => {
    setMessage(val);

    // Example: If user types "Dear", suggest "Tenants,"
    if (val.endsWith("Dear ")) {
      setAiSuggestion("Tenants,");
    } else if (val.endsWith("scheduled ")) {
      setAiSuggestion("maintenance for next Monday.");
    } else {
      setAiSuggestion("");
    }
  };

  // Function to accept suggestion with "Tab" key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab" && aiSuggestion) {
      e.preventDefault();
      // For Tiptap, we use the editor commands to insert text
      // If you have a ref to the editor, use editor.commands.insertContent(aiSuggestion)
      setMessage(message + aiSuggestion);
      setAiSuggestion("");
    }
  };

  const getColor = (id: string) => {
    // Convert the string ID into a number (works for "1", "2", "abc", etc.)
    const charSum = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = charSum % CHIP_COLORS.length;
    return CHIP_COLORS[index];
  };

  const handleSendMessage = async () => {
    if (!selectedFolderId && directEmails.length === 0) {
      toast({
        title: "Required Recipient",
        description: "សូមជ្រើសរើស Group ឬបញ្ចូល Email!",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        name: topic || "New Campaign",
        subject: topic || "No Subject",
        content: message,
        workspaceId: Number(activeWorkspaceId),
        folderIds: selectedFolderId ? [selectedFolderId] : [],
        directEmails: directEmails,
        images: [],
        links: [],
        sendType: sendType,
        scheduledAt:
          sendType === "SCHEDULED"
            ? `${startDate.toISOString().split("T")[0]}T${startTime}`
            : null,
      };

      const result = await startCampaign(payload).unwrap();
      toast({ title: "ជោគជ័យ", description: result });
      setDirectEmails([]);
      setSelectedFolderId(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "ការផ្ញើបរាជ័យ!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl font-sans text-slate-700">
      {/* Suggested Templates */}
      <section className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-slate-700">
          Suggested templates
        </h3>
        <SuggestedTemplates onSelect={handleSelectTemplate} />
      </section>

      {/* New Message Form */}
      <div className="overflow-hidden">
        <div className="">
          <h3 className="mb-4 text-xl font-semibold text-slate-700">
            New message
          </h3>

          <div className="space-y-6 rounded-md bg-white p-5">
            {/* Topic Input */}
            <div>
              <label className="text-md mb-2 block font-medium">Topic</label>
              <input
                type="text"
                value={topic || ""}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-slate-800 transition-all focus:bg-white focus:outline-none"
              />
            </div>

            {/* Text Message Area */}
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-md flex items-center gap-2 font-medium">
                    Text message
                  </label>
                  <div className="flex items-center justify-between">
                    {/* Smart AI Actions Bar */}
                    <div className="flex flex-wrap gap-2 border-t border-gray-50 pt-3">
                      <button className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-slate-50 px-3 py-1 text-[11px] transition-colors hover:bg-purple-50 hover:text-purple-600">
                        ✨ Fix Grammar
                      </button>
                      <button className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-slate-50 px-3 py-1 text-[11px] transition-colors hover:bg-purple-50 hover:text-purple-600">
                        📝 Make it professional
                      </button>
                      <button className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-slate-50 px-3 py-1 text-[11px] transition-colors hover:bg-purple-50 hover:text-purple-600">
                        ⏳ Shorten text
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-xl bg-white transition-all">
                  <div className="relative">
                    <RichTextEditor
                      value={message}
                      onChange={handleTextChange}
                      onKeyDown={handleKeyDown}
                    />

                    {/* Ghost Text Suggestion */}
                    {aiSuggestion && (
                      <div className="pointer-events-none absolute left-0 top-0 select-none text-slate-400 opacity-30">
                        <span className="invisible whitespace-pre-wrap">
                          {message}
                        </span>
                        <span>{aiSuggestion}</span>
                        <span className="ml-2 rounded border bg-gray-100 px-1 text-[10px]">
                          Tab to accept
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Attachment Section */}
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <DocumentCard
                    title="Business License"
                    fileName="business_license_2024.pdf"
                    size="3.2 MB"
                    date="1/21/2024"
                    status="Approved"
                  />
                  <DocumentCard
                    title="Tax Registration"
                    fileName="ein_documentation.pdf"
                    size="1.5 MB"
                    date="1/21/2024"
                    status="Pending Review"
                  />
                  <DocumentCard
                    title="Tax Registration"
                    fileName="ein_documentation.pdf"
                    size="1.5 MB"
                    date="1/21/2024"
                    status="Pending Review"
                  />
                </div>
              </div>

              <div className="mt-7 items-center gap-4 rounded-md border-t border-gray-50 bg-purple-50 px-3 py-2 pt-4 text-gray-600">
                <div className="it flex space-x-4">
                  <Paperclip
                    size={20}
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() => setIsUploadOpen(true)}
                  />
                  <Link2
                    size={20}
                    className="cursor-pointer hover:text-blue-500"
                  />
                  <Smile
                    size={20}
                    className="cursor-pointer hover:text-blue-500"
                  />
                  <Share2
                    size={20}
                    className="cursor-pointer hover:text-blue-500"
                  />
                  <ImageIcon
                    size={20}
                    className="cursor-pointer hover:text-blue-500"
                  />
                  <Lock
                    size={20}
                    className="cursor-pointer hover:text-blue-500"
                  />
                  <Pencil
                    size={20}
                    className="cursor-pointer hover:text-blue-500"
                  />
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className={cn(
                        "rounded-full transition-colors",
                        showMoreMenu
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100",
                      )}
                    >
                      <MoreVertical size={20} />
                    </button>
                    {showMoreMenu && (
                      <div className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/5">
                        <MenuAction
                          icon={<Maximize2 size={16} />}
                          label="Full screen"
                        />
                        <MenuAction
                          icon={<SpellCheck size={16} />}
                          label="Spell check"
                          hasDot
                        />
                        <hr className="my-1 border-gray-50" />
                        <MenuAction
                          icon={<CalendarDays size={16} />}
                          label="Set up a time"
                          hasSubmenu
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4 border-gray-100" />

          {/* Send To Section */}
          <section className="mt-8">
            <h3 className="mb-4 text-xl font-semibold text-slate-700">
              Send to
            </h3>

            <div className="flex flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              {/* Option 1: Folder Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Option 1: Select Group
                </label>
                <div className="flex items-center gap-3">
                  <FilterDropdown
                    title={isFolderLoading ? "Loading..." : "Choose Folder"}
                    options={folderOptions}
                    selectedValues={
                      selectedFolderId ? [selectedFolderId.toString()] : []
                    }
                    onChange={(vals) => setSelectedFolderId(Number(vals[0]))}
                  />
                </div>
              </div>

              <div className="h-px w-full bg-slate-100" />

              {/* Option 2: Smart Hybrid Tenant Selector */}
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Option 2: Individual Recipients
                </label>

                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-100">
                  <div className="flex flex-wrap gap-2">
                    {/* បង្ហាញ Chips សម្រាប់ Email ដែលបានរើស */}
                    {directEmails.map((email, index) => (
                      <span
                        key={`${email}-${index}`} // ប្រើ Index ជំនួយដើម្បីឱ្យ Key តែងតែ Unique
                        className="flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm animate-in zoom-in-95"
                      >
                        <User size={12} />
                        {workspaceTenants?.find((t: any) => t.email === email)
                          ?.name || email}
                        <X
                          size={14}
                          className="ml-1 cursor-pointer hover:text-red-300"
                          onClick={() =>
                            setDirectEmails(
                              directEmails.filter((e) => e !== email),
                            )
                          }
                        />
                      </span>
                    ))}
                    {/* Input សម្រាប់វាយ Email ឬ Search */}
                    <input
                      type="text"
                      placeholder={
                        directEmails.length === 0
                          ? "Search name or type new email..."
                          : ""
                      }
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={handleAddEmail}
                      className="min-w-[200px] flex-1 bg-transparent text-sm text-slate-700 outline-none"
                    />

                    {/* Dropdown សម្រាប់រើសពីបញ្ជី Tenant ក្នុង Workspace */}
                    <div className="border-l border-slate-200 pl-2">
                      <FilterDropdown
                        title={isTenantLoading ? "..." : "Browse"}
                        options={tenantOptions}
                        selectedValues={directEmails}
                        onChange={(vals) => {
                          // ប្រើ Set ដើម្បីចម្រោះយកតែ Email ដែលមិនស្ទួន
                          const uniqueEmails = Array.from(new Set(vals));
                          setDirectEmails(uniqueEmails);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <p className="px-1 text-[11px] italic text-slate-400">
                  * រើសឈ្មោះពីបញ្ជី ឬវាយ Email ថ្មីរួចចុច Enter។
                </p>
              </div>
            </div>
          </section>

          {/* Send on Section */}
          <SendOnSection
            onModeChange={(mode) => setSendType(mode)}
            onDateChange={(date) => setStartDate(date || new Date())}
            onTimeChange={(time) =>
              setStartTime(time.length === 5 ? `${time}:00` : time)
            }
          />
        </div>
      </div>
      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between border-t border-gray-100 pb-10 pt-8">
        <button className="rounded-md bg-white px-8 py-2.5 text-sm font-medium text-red-800 transition-colors hover:text-slate-600">
          Cancel
        </button>
        <div className="flex items-center gap-4">
          <button className="rounded-md border border-purple-300 bg-purple-100 px-8 py-2.5 text-sm font-semibold text-purple-600 transition-all hover:bg-blue-100">
            Review message
          </button>

          <button
            onClick={handleSendMessage}
            disabled={isSending}
            className="flex items-center gap-2 rounded-md bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
          >
            {isSending ? "Sending..." : "Send Message"}
            <LuSendHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
      {/* Place the Modal at the bottom of the JSX */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}

function Tag({ children, color, icon }: TagProps) {
  return (
    <button
      className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-[15px] transition-all hover:shadow-sm active:scale-95 ${color}`}
    >
      {icon} {children}
    </button>
  );
}
