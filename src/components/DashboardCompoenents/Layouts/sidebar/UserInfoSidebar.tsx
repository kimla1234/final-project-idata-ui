"use client";

import { ChevronUpIcon, UserIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/DashboardCompoenents/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/DashboardCompoenents/ui/ConfirmModal";
import { useGetOrganizerQuery } from "@/redux/service/organizer";
import { useGetUserQuery } from "@/redux/service/user";
import { SettingsIcon } from "../header/user-info/icons";
import { LogOutIcon } from "./icons";
import { Check, MoreHorizontal, Plus } from "lucide-react";
import { CreateWorkspaceDialog } from "../header/CreateWorkspaceDialog";

export function UserInfoSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1. Fetch organizer data
  const { data: user, isLoading, error } = useGetUserQuery();

  // 2. Handle Logout Logic
  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/login");
  };

  // Import the new hook (ensure path is correct)
  const handleCreateClick = () => {
    setIsOpen(false);
    setIsDialogOpen(true);
  };

  // 3. Loading & Error States
  if (isLoading)
    return <div className="size-11 animate-pulse rounded-full bg-gray-200" />;
  if (error || !user) return null;

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="w-full rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <figure className="flex w-full items-center gap-3 rounded-md bg-slate-100 px-1 py-0.5 hover:bg-purple-50">
          <Image
            unoptimized
            // Updated to use logoImage from your JSON
            src={user?.profileImage || "/images/user/user-03.png"}
            className="size-7 rounded-md border-[1.5px] border-primary object-cover"
            alt={`Avatar of ${user.name}`}
            width={42}
            height={42}
          />

          <figcaption className="flex truncate items-center text-[15px] gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{user.name}</span>
            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className=" w-[263px] rounded-lg border border-slate-200 bg-white p-2 shadow-xl dark:border-dark-3 dark:bg-gray-dark"
        align="start"
      >
        {/* Header: User Info & Plan */}
        <div className="flex items-center gap-3 px-3 py-3">
          <Image
            unoptimized
            src={user?.profileImage || "/images/user/user-03.png"}
            className="size-10 rounded-md border border-slate-100 object-cover"
            alt="Avatar"
            width={40}
            height={40}
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight text-slate-900">
              {user.name}
            </span>
            <span className="text-[12px] font-medium text-slate-500">
              Free Plan · 1 member
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2 px-2 pb-3">
          <Link
            href="/settings"
            className="flex items-center justify-center gap-2 rounded-sm border border-slate-200 px-2 py-1 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <SettingsIcon className="size-4 opacity-70" />
            Settings
          </Link>
          <button className="flex items-center justify-center gap-2 rounded-sm border border-slate-200 px-2 py-1 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-50">
            <UserIcon className="size-4 opacity-70" />
            Invite
          </button>
        </div>

        <hr className="mx-2 mb-2 border-slate-100" />

        {/* Workspace Email Header */}
        <div className="mb-1 flex items-center justify-between px-3 py-1">
          <span className="max-w-[180px] truncate text-[12px] font-bold text-slate-500">
            {user.email}
          </span>
          <MoreHorizontal className="size-4 cursor-pointer text-slate-400" />
        </div>

        {/* Workspace List Section */}
        <div className="space-y-1">
          {/* Active Workspace */}
          <div className="group flex cursor-pointer items-center justify-between rounded-lg bg-slate-50/50 px-2 py-2">
            <div className="flex items-center gap-2.5">
              <Image
                src={user?.profileImage || "/images/user/user-03.png"}
                className="size-6 rounded-md object-cover"
                alt="ws"
                width={24}
                height={24}
              />
              <span className="text-[13px] font-bold text-slate-800">
                {user.name}'s Notion
              </span>
            </div>
            <Check className="size-4 text-slate-900" />
          </div>

          {/* Guest Workspaces (Mockup តាមរូបថត) */}
          <div className="group flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="flex size-6 items-center justify-center rounded-md bg-slate-200 text-[10px] font-bold">
                HS
              </div>
              <span className="text-[13px] font-medium text-slate-700">
                Hout Sovannarith's Notion
              </span>
            </div>
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
              Guest
            </span>
          </div>
        </div>

        <hr className="mx-2 my-2 border-slate-100" />

        {/* Bottom Actions */}
        <div className="p-1">
          <button
            onClick={handleCreateClick}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-bold text-blue-600 transition-colors hover:bg-blue-50"
          >
            <Plus className="size-4" />
            New workspace
          </button>
        </div>
      </DropdownContent>

      <ConfirmModal
        open={showSignOutModal}
        title="Confirm Sign Out"
        description="Are you sure you want to sign out?"
        onConfirm={handleLogout}
        onCancel={() => setShowSignOutModal(false)}
      />
      
    </Dropdown>
  );
}
