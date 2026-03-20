"use client";

import React, { useMemo, useState } from "react";
import { X, Tag, Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // ប្តូរតាម UI Library របស់អ្នក
import { cn } from "@/lib/utils";

interface EditTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tags: string[]) => void;
  selectedCount: number;
  isUpdating: boolean;
}
const ICON_NAMES = [
  // --- ក្រុមទូទៅ (General & Interface) ---
  "Home", "LayoutDashboard", "Settings", "Settings2", "Bell", "Search", 
  "User", "Users", "UserPlus", "UserMinus", "LogOut", "LogIn", 
  "Info", "HelpCircle", "AlertCircle", "CheckCircle", "XCircle", "Shield",
  "Trash2", "Pencil", "Edit", "Plus", "Minus", "X", "Check", "MoreHorizontal",
  "MoreVertical", "ExternalLink", "Link", "Copy", "Download", "Upload",

  // --- ក្រុមទំនាក់ទំនង និង សារ (Communication) ---
  "Mail", "MessageSquare", "MessageCircle", "Phone", "Send", "Share2", 
  "AtSign", "Mic", "Video", "Rss",

  // --- ក្រុមឯកសារ និង ថត (Files & Folders) ---
  "Folder", "FolderPlus", "File", "FileText", "Files", "Archive", 
  "Clipboard", "ClipboardList", "Save", "HardDrive", "Database",

  // --- ក្រុមជំនួញ និង ហិរញ្ញវត្ថុ (Business & Finance) ---
  "Briefcase", "CreditCard", "Wallet", "Banknote", "DollarSign", "PieChart", 
  "BarChart", "BarChart2", "TrendingUp", "TrendingDown", "ShoppingBag", 
  "ShoppingCart", "Store", "Tag", "Gift", "Package",

  // --- ក្រុមពេលវេលា និង ទីតាំង (Time & Location) ---
  "Calendar", "Clock", "History", "Map", "MapPin", "Compass", 
  "Globe", "Navigation", "Flag",

  // --- ក្រុមបច្ចេកទេស និង ឧបករណ៍ (Technical & Tools) ---
  "Wrench", "Hammer", "Monitor", "Smartphone", "Cpu", "HardHat", 
  "Key", "Lock", "Unlock", "Code", "Terminal", "Wifi", "Zap",

  // --- ក្រុមបរិយាកាស និង រូបភាព (Lifestyle & Media) ---
  "Sun", "Moon", "Cloud", "CloudRain", "Wind", "Camera", "Image", 
  "Music", "Play", "Pause", "Star", "Heart", "Anchor", "Coffee", 
  "PawPrint", "Truck", "Plane"
];
interface LocalTag {
  name: string;
  icon: string;
}
export function EditTagsModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isUpdating,
}: EditTagsModalProps) {
  const [tagInput, setTagInput] = useState("");
  // ប្តូរ State tags ឱ្យទៅជា Array នៃ Object ដើម្បីចាំ Icon នីមួយៗ
  const [tags, setTags] = useState<LocalTag[]>([]);
  const [selectedIcon, setSelectedIcon] = useState("PawPrint");
  const [searchQuery, setSearchQuery] = useState("");

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.some(t => t.name === trimmed)) {
      // រក្សាទុកទាំងឈ្មោះ និង Icon ដែលកំពុងជ្រើសរើស
      setTags([...tags, { name: trimmed, icon: selectedIcon }]);
      setTagInput("");
    }
  };

  const filteredIcons = useMemo(() => {
    return ICON_NAMES.filter((name) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const removeTag = (nameToRemove: string) => {
    setTags(tags.filter((t) => t.name !== nameToRemove));
  };

  const handleApplyTags = () => {
    // បំប្លែងពី Object {icon, name} ទៅជា String "IconName:TagName" សម្រាប់ផ្ញើទៅ DB
    const tagsToSave = tags.map(tag => `${tag.icon}:${tag.name}`);
    onConfirm(tagsToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-md bg-white p-6 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Tag className="size-5 text-purple-600" />
            Edit Tags ({selectedCount})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-slate-500">
            បន្ថែម Tags ថ្មីសម្រាប់អនុវត្តលើអតិថិជនដែលបានជ្រើសរើស។ វានឹងជំនួស
            Tags ចាស់ទាំងអស់។
          </p>

          <div className="flex flex-wrap gap-2 rounded-md border bg-slate-50 p-3">
            {tags.map((tag) => {
              const IconComponent = (Icons as any)[tag.icon] || Icons.Tag;
              return (
                <span
                  key={tag.name}
                  className="flex items-center gap-1.5 rounded-md bg-white border border-purple-100 px-2 py-1 text-xs font-bold text-purple-600 shadow-sm"
                >
                  <IconComponent className="size-3.5" />
                  {tag.name}
                  <X
                    className="size-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeTag(tag.name)}
                  />
                </span>
              );
            })}
            <input
              className="min-w-[100px] flex-1 rounded-md bg-transparent text-sm outline-none"
              placeholder="Type and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
          </div>
          {/* Icon Selector with Search */}
          <div className="space-y-2">
            <label className="ttext-sm text-slate-500">Icon</label>
            <div className="flex h-[250px] flex-col overflow-hidden rounded-lg border">
              {/* Search Bar */}
              <div className="relative border-b bg-slate-50 p-2">
                <Icons.Search className="absolute left-4 top-4 size-3.5 text-slate-400" />
                <input
                  className="w-full rounded-md border bg-white py-1.5 pl-8 pr-3 text-sm outline-none"
                  placeholder="Search icons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Grid Icons (Dynamic Rendering) */}
              <div className="grid flex-1 grid-cols-5 gap-2 overflow-y-auto p-3">
                {filteredIcons.map((name) => {
                  // ទាញ Component មកប្រើតាមរយៈឈ្មោះ String
                  const IconComponent =
                    (Icons as any)[name] || Icons.HelpCircle;
                  return (
                    <button
                      key={name}
                      onClick={() => setSelectedIcon(name)}
                      className={cn(
                        "flex items-center justify-center rounded-md p-2.5 transition-all hover:bg-slate-100",
                        selectedIcon === name
                          ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-300"
                          : "text-slate-500",
                      )}
                    >
                      <IconComponent className="size-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyTags}
            disabled={isUpdating || tags.length === 0}
            className="flex items-center justify-center gap-2 rounded-md bg-purple-600 px-8 py-2 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-50 shadow-md shadow-purple-200"
          >
            {isUpdating && <Loader2 className="size-4 animate-spin" />}
            Apply changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
