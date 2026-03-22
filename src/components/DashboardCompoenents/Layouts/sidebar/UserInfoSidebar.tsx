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

import { useGetUserQuery } from "@/redux/service/user";


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
    <figure className="flex w-full items-center gap-3 rounded-md bg-slate-100 py-0.5 hover:bg-purple-50">
          <Image
            unoptimized
            // Updated to use logoImage from your JSON
            src={user?.profileImage || "/placeholder.png"}
            className="size-7 rounded-md border-[1.5px] border-primary object-cover"
            alt={`Avatar of ${user.name}`}
            width={42}
            height={42}
          />

          <figcaption className="flex px-2 truncate items-center text-[15px] gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{user.name}</span>
            
          </figcaption>
        </figure>
  );
}
