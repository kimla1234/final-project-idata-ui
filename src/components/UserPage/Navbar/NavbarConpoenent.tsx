"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, CheckCheck } from "lucide-react";

import { UserInfo } from "./user-info";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NotificationItem from "./Notification/NotificationItem";
import { HiOutlineTicket } from "react-icons/hi2";

import { useGetUserQuery } from "@/redux/service/user";
import { useAppSelector } from "@/redux/hooks";
import { BellIcon } from "@/components/DashboardCompoenents/Layouts/header/notification/icons";

export default function NavbarComponent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch user data
  const { data: userResponse, isLoading, error } = useGetUserQuery();
  useEffect(() => {
    if (userResponse) {
      console.log("User Response:", userResponse);
      console.log("User Payload:", userResponse);
    }
  }, [userResponse]);

  // Map user for UserInfo component
  const mappedUser = userResponse
    ? {
        name: userResponse.name || "No Name",
        email: userResponse.email || "",
        profileImage: userResponse.profileImage,
      }
    : undefined;

  const isOrganizer = userResponse?.roles?.includes("USER");

  return (
    <div className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white">
      <header className="mx-auto flex items-center justify-between px-4 py-4 md:px-8">
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <Link href={`/`} className="flex items-center">
            <div className="borber flex w-[100px] items-center rounded-md border-purple-600 p-0.5 text-2xl font-black tracking-tighter">
              <Image
                src="/logo_1.png"
                width={130}
                height={40}
                alt="Logo"
                className="rounded-md object-contain"
              />
            </div>
          </Link>
        </div>

        {/* RIGHT: Desktop Links */}
        <div className="hidden items-center space-x-6 md:flex">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <div className="rounded-full px-3 py-2 hover:border-purple-300 hover:bg-purple-100">
              <Link href="/" className="hover:text-[#9b34eb]">
                Home
              </Link>
            </div>
            <div className="rounded-full px-3 py-2 hover:border-purple-300 hover:bg-purple-100">
              <Link href="/community" className="hover:text-[#9b34eb]">
                Community
              </Link>
            </div>
            <div className="rounded-full px-3 py-2 hover:border-purple-300 hover:bg-purple-100">
              <Link href="/about" className="hover:text-[#9b34eb]">
                About us
              </Link>
            </div>
            <span className="text-gray-300">|</span>
            <div className="rounded-full px-3 py-2 hover:border-purple-300 hover:bg-purple-100">
              <Link href="/contact" className="hover:text-[#9b34eb]">
                Contact us
              </Link>
            </div>
            <span className="text-gray-300">|</span>
            {isOrganizer && (
              <div className="rounded-full px-3 py-2 hover:border-purple-300 hover:bg-purple-100">
                <Link href="/dashboard" className="hover:text-[#9b34eb]">
                  My Dashboard
                </Link>
              </div>
            )}

            {/* Notifications */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5ff] transition-all hover:bg-purple-50 active:scale-90">
                  <BellIcon className="size-6 text-gray-600" />
                  <span className="absolute right-2.5 top-2.5 flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full border border-white bg-red-500"></span>
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent className="w-full rounded-l-[30px] border-l-0 p-0 sm:max-w-md">
                <div className="flex h-full flex-col bg-[#F8F9FA]">
                  <div className="bg-white px-6 py-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-xl font-bold">
                        Notifications
                      </SheetTitle>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    <NotificationItem
                      title="Ticket Confirmed!"
                      desc="Your booking for 'Tech Expo 2026' is successful."
                      time="2 mins ago"
                      isNew
                    />
                    <NotificationItem
                      title="New Event Alert"
                      desc="A new concert was added in your favorite category."
                      time="1 hour ago"
                    />
                    <NotificationItem
                      title="Profile Updated"
                      desc="You have successfully changed your password."
                      time="Yesterday"
                    />
                  </div>
                  <div className="border-t bg-white p-4">
                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 text-sm font-bold text-white transition-all active:scale-95">
                      <CheckCheck size={18} />
                      View All Activity
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              {isLoading ? (
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />
              ) : mappedUser ? (
                <div className="shrink-0">
                  <UserInfo user={mappedUser} />
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg border border-dashed border-[#9b34eb] bg-[#f5eafd] px-6 py-2 font-semibold text-[#9b34eb]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-[#9b34eb] px-6 py-2 font-semibold text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>
    </div>
  );
}
