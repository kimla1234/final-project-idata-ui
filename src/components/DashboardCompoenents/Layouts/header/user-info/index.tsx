"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/DashboardCompoenents/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/DashboardCompoenents/ui/ConfirmModal";

import { useGetUserQuery } from "@/redux/service/user";
import { RiUserCommunityLine } from "react-icons/ri";
import { toast } from "@/hooks/use-toast";
// Import the new hook (ensure path is correct)


export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const router = useRouter();

  // 1. Fetch organizer data
  const { data: user, isLoading, error } = useGetUserQuery();

  // 2. Handle Logout Logic
  const handleLogout = async () => {
    try {
      const res = await fetch(`/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: data.message || "Logout Successful!",
          description: "You have been safely logged out.",
          variant: "success", // Ensure your toaster supports this variant
          duration: 3000,
        });

        // Redirect and reload
        router.push(`/`);
        window.location.reload();
      } else {
        // If 400 (Token not found), the user is effectively logged out anyway
        toast({
          title: "Session Expired",
          description: data.message || "Your session was already cleared.",
          variant: "destructive", // Shadcn default for errors
          duration: 3000,
        });

        // Optional: Redirect anyway since the token is missing/invalid
        router.push(`/`);
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to reach the server. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      console.error("Logout Error:", error);
    }
  };

  // 3. Loading & Error States
  if (isLoading) return <div className="size-11 animate-pulse rounded-full bg-gray-200" />;
  if (error || !user) return null;

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <figure className="flex items-center gap-3 hover:bg-purple-50 px-2 py-0.5  rounded-md">
          <Image
            unoptimized
            // Updated to use logoImage from your JSON
            src={user?.profileImage || "/placeholder.png"}
            className="size-9 rounded-full border-[1.5px] border-primary object-cover"
            alt={`Avatar of ${user.name}`}
            width={42}
            height={42}
          />

          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
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
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          
          <figcaption className="space-y-1 text-base font-medium">
            <div className="text-dark dark:text-white">{user.name}</div>
            <div className="text-sm text-gray-6">{user.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-[#4B5563] dark:text-dark-6">
          <Link
            href="/setting?tab=account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 dark:hover:bg-dark-3"
          >
            <UserIcon />
            <span className="font-medium">View profile</span>
          </Link>

          <Link
            href="/community"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 dark:hover:bg-dark-3"
          >
            <RiUserCommunityLine className="h-7 h-7 text-xl"/>
            <span className="font-medium">Back Communitry</span>
          </Link>

          <button
            onClick={() => setShowSignOutModal(true)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOutIcon />
            <span className="font-medium">Log Out</span>
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