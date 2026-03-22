"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import React from "react";
import { useSidebarContext } from "./sidebar-context";


const menuItemBaseStyles = cva(
  "rounded-lg px-3.5 font-medium text-dark-4 transition-all duration-200 dark:text-dark-6",
  {
    variants: {
      isActive: {
        true: "bg-[#EDE9FE] text-[#7F22FE] hover:bg-[rgba(87,80,241,0.07)] dark:bg-[#FFFFFF1A] dark:text-white",
        false: "hover:bg-gray-100 hover:text-dark hover:dark:bg-[#FFFFFF1A] hover:dark:text-white",
      },
      isDestructive: {
        true: "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400",
      },
    },
    defaultVariants: {
      isActive: false,
      isDestructive: false,
    },
  },
);


interface MenuItemProps {
  className?: string;
  children: React.ReactNode;
  isActive: boolean;
  isDestructive?: boolean;
  as?: "link" | "button"; 
  href?: string;         
  onClick?: () => void;  
}

export function MenuItem({
  className,
  children,
  isActive,
  isDestructive,
  as = "button", 
  href,
  onClick,
}: MenuItemProps) {
  const { toggleSidebar, isMobile } = useSidebarContext();


  const styles = menuItemBaseStyles({
    isActive,
    isDestructive,
    className: as === "link" ? "relative block py-2" : "flex w-full items-center gap-2 py-3",
  });


  if (as === "link") {
    return (
      <Link
        href={href || "#"} 
        onClick={() => {
          if (onClick) onClick(); 
          if (isMobile) toggleSidebar();
        }}
        className={cn(styles, className)}
      >
        {children}
      </Link>
    );
  }


  return (
    <button
      type="button"
      onClick={() => {
        if (onClick) onClick();
        
      }}
      aria-expanded={isActive}
      className={cn(styles, className)}
    >
      {children}
    </button>
  );
}