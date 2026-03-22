"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, CheckCheck, Home, Users, BookOpen, Mail, LayoutDashboard } from "lucide-react";

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
  const pathname = usePathname();

  // Close mobile menu whenever the path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Fetch user data
  const { data: userResponse, isLoading, error } = useGetUserQuery();

  // Map user for UserInfo component
  const mappedUser = userResponse
    ? {
        name: userResponse.name || "No Name",
        email: userResponse.email || "",
        profileImage: userResponse.profileImage,
      }
    : undefined;

  const isOrganizer = userResponse?.roles?.includes("USER");

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Community", href: "/community", icon: <Users size={18} /> },
    { name: "Learn", href: "/learn", icon: <BookOpen size={18} /> },
    { name: "Contact us", href: "/contact", icon: <Mail size={18} /> },
  ];

  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <header className="mx-auto flex items-center justify-between px-4 py-4 md:px-8 max-w-7xl">
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <Link href={`/`} className="flex items-center">
            <div className="flex w-[100px] items-center rounded-md p-0.5 text-2xl font-black tracking-tighter">
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
          <nav className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`rounded-full px-4 py-2 transition-all hover:bg-purple-100 hover:text-[#9b34eb] ${
                  pathname === link.href ? "bg-purple-50 text-[#9b34eb]" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <span className="text-gray-300 mx-2">|</span>
            
            {isOrganizer && (
              <Link
                href="/dashboard"
                className="rounded-full px-4 py-2 hover:bg-purple-100 hover:text-[#9b34eb] transition-all"
              >
                My Dashboard
              </Link>
            )}

            {/* Notifications */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5ff] transition-all hover:bg-purple-50 active:scale-90 mx-2">
                  <BellIcon className="size-5 text-gray-600" />
                  <span className="absolute right-2 top-2 flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full border border-white bg-red-500"></span>
                  </span>
                </button>
              </SheetTrigger>
              
            </Sheet>

            {/* User Info / Auth Buttons */}
            <div className="flex items-center ml-4">
              {isLoading ? (
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />
              ) : mappedUser ? (
                <UserInfo user={mappedUser} />
              ) : (
                <div className="flex gap-3">
                  <Link href="/login" className="rounded-lg border border-[#9b34eb]/20 bg-[#f5eafd] px-5 py-2 text-sm font-bold text-[#9b34eb] hover:bg-[#9b34eb]/10 transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="rounded-lg bg-[#9b34eb] px-5 py-2 text-sm font-bold text-white hover:bg-[#862dcb] shadow-md shadow-purple-200 transition-all">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* MOBILE: Toggle Button and Notification Bell */}
        <div className="flex items-center gap-4 md:hidden">
           {/* Show notification bell even on mobile header */}
           <button className="relative p-2 rounded-full bg-gray-50">
             <BellIcon className="size-6 text-gray-600" />
             <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500"></span>
           </button>
           
           <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 w-full h-fit flex flex-col bg-white md:hidden animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between px-6 py-5 border-b">
             <Image src="/logo_1.png" width={100} height={30} alt="Logo" />
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500">
               <X size={28} />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 text-gray-700 font-bold hover:bg-purple-50 hover:text-[#9b34eb] transition-all"
                >
                  <span className="text-gray-400 group-hover:text-[#9b34eb]">{link.icon}</span>
                  {link.name}
                </Link>
              ))}

              {isOrganizer && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-100"
                >
                  <LayoutDashboard size={18} />
                  My Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="p-6 border-t bg-gray-50/50">
            {mappedUser ? (
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-[#9b34eb]">
                      {mappedUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{mappedUser.name}</p>
                      <p className="text-xs text-gray-500">{mappedUser.email}</p>
                    </div>
                 </div>
                 {/* You could add a logout button here */}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link href="/login" className="text-center py-4 rounded-2xl border border-gray-200 font-bold text-gray-700 bg-white">
                  Login
                </Link>
                <Link href="/register" className="text-center py-4 rounded-2xl bg-[#9b34eb] font-bold text-white shadow-lg shadow-purple-100">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}