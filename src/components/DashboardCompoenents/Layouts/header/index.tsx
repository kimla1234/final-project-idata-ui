"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import { WorkspaceSelector } from "./WorkspaceSelector";
import { IoPersonAddOutline } from "react-icons/io5";
import { MdGroupAdd } from "react-icons/md";
import { AvatarGroupCountExample } from "./avatarGroupCount/AvatarGroupCount";
import { ImSearch } from "react-icons/im";
import { useState } from "react";
import { SearchDialog } from "./SearchDialog";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { selectActiveWorkspaceId } from "@/redux/feature/workspace/workspaceSlice";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const params = useParams();
const activeWorkspaceId = useSelector(selectActiveWorkspaceId);

const workspaceIdFromUrl = params.workspaceId || params.id; 

const finalWorkspaceId = activeWorkspaceId || (workspaceIdFromUrl ? Number(workspaceIdFromUrl) : null);

console.log("💎 Final Workspace ID to Dialog:", finalWorkspaceId); // Debug មើលត្រង់នេះ

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-1.5 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <Image
            src={"/images/logo/logo-icon.svg"}
            width={32}
            height={32}
            alt=""
            role="presentation"
          />
        </Link>
      )}

      <div className="max-xl:hidden ">
        <div className=" text-heading-6 text-dark dark:text-white">
          <WorkspaceSelector />
        </div>
      </div>

      <div className="flex w-full justify-center py-1">
          {/* Use a button here for the click trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex w-[300px]  items-center gap-2 bg-purple-50 border px-2 py-1.5 rounded-md hover:bg-purple-100 transition-colors text-gray-500"
          >
            <ImSearch />
            <span className="text-[15px]">Search ...</span>
          </button>
        </div>

      <div className="flex flex-1 items-center  justify-end  text-[15px] min-[375px]:gap-2">
        <div className="flex space-x-4">
          <div>
            <AvatarGroupCountExample />
          </div>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-2 rounded-md  bg-purple-600 p-2 text-[15px] leading-none  font-semibold text-white transition-all hover:bg-purple-700 hover:shadow-md "
          >
            <MdGroupAdd className="text-lg  " />
            <span className="max-sm:hidden ">Invite</span>
          </button>
          <Notification />
        </div>

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
      {/* ADD THIS LINE HERE */}
      <SearchDialog 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      <InviteMemberDialog
        isOpen={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)} 
        workspaceId={finalWorkspaceId ?? undefined}
      />
    </header>
  );
}
