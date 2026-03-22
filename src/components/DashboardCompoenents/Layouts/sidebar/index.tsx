"use client";

import { Logo } from "../../../logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons"; 
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import Image from "next/image";
import { ConfirmModal } from "@/components/DashboardCompoenents/ui/ConfirmModal";
import * as Icons from "./icons";
import {
  Folder,
  MoreHorizontal,
  PencilIcon,
  ShareIcon,
  Trash2Icon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PanelLeftIcon, Plus } from "lucide-react";
import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetFoldersByWorkspaceQuery,
  useUpdateFolderMutation,
} from "@/redux/service/folder";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveWorkspaceId,
  setActiveWorkspace,
} from "@/redux/feature/workspace/workspaceSlice";
import { CreateFolderDialog } from "./CreateFolderDialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FaRegEdit } from "react-icons/fa";

import { TrashIcon } from "@/assets/icons";
import { useToast } from "@/hooks/use-toast";
import { ConfirmModalDelete } from "./ConfirmModalDelete";
import { UserInfo } from "../header/user-info";
import { UserInfoSidebar } from "./UserInfoSidebar";
import { CreateWorkspaceDialog } from "../header/CreateWorkspaceDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { IoDuplicateOutline } from "react-icons/io5";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
interface SidebarProps {
  selectedWorkspaceId?: number | null; 
}
export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const dispatch = useDispatch();
  const { toast } = useToast();

  ////////////////////////////////////////////////////////////////
  const [updateFolder] = useUpdateFolderMutation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempName, setTempName] = useState("");
  const [folderToDelete, setFolderToDelete] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFolder, { isLoading: isDeleting }] = useDeleteFolderMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);



  const handleRename = async (id: number) => {
   
    if (tempName.trim() !== "" && activeWorkspaceId) {
      try {
        console.log("Saving folder:", id, "with new name:", tempName);


        await updateFolder({
          workspaceId: activeWorkspaceId as number,
          folderId: id,
          name: tempName.trim(),
        }).unwrap(); 
      } catch (error) {
        console.error("Failed to update folder name:", error);
       
      }
    }
    setEditingId(null); 
  };

  const handleConfirmDelete = async () => {
    if (folderToDelete && activeWorkspaceId) {
      try {

        await deleteFolder({
          workspaceId: activeWorkspaceId,
          folderId: folderToDelete,
        }).unwrap();

        toast({
          title: "Deleted Successfully",
          description: "Your folder has been removed.",
        });


        if (pathname.includes(`/folders/${folderToDelete}`)) {

          const remainingFolders =
            apiFolders?.filter((f) => f.id !== folderToDelete) || [];

          if (remainingFolders.length > 0) {

            const nextFolder = remainingFolders[0];
            router.push(
              `/workspaces/${activeWorkspaceId}/folders/${nextFolder.id}`,
            );
          } else {

            router.push(`/dashboard`);
          }
        }
      } catch (error: any) {
        toast({
          title: "Delete Failed",
          description: error?.data?.message || "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setShowDeleteModal(false);
        setFolderToDelete(null);
      }
    }
  };
  ////////////////////////////////////////////////////////////////


  const activeWorkspaceId = useSelector(selectActiveWorkspaceId);
  const [isDialogOpenW, setIsOpenWorkspace] = useState(false);
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const prevWorkspaceIdRef = useRef(activeWorkspaceId);


  useEffect(() => {
    if (params.workspaceId) {
      const idFromUrl = Number(params.workspaceId);
      if (idFromUrl !== activeWorkspaceId) {
        dispatch(
          setActiveWorkspace({
            id: idFromUrl,
            name: "",
          }),
        );
      }
    }
  }, [params.workspaceId, activeWorkspaceId, dispatch]);


  useEffect(() => {
    const currentWS = activeWorkspaceId;
    const prevWS = prevWorkspaceIdRef.current;
    if (prevWS !== null && prevWS !== currentWS) {
      if (pathname.includes("/folders/")) {
        router.push(`/dashboard`);
      }
    }
    prevWorkspaceIdRef.current = currentWS;
  }, [activeWorkspaceId, pathname, router]);


  const { data: apiFolders } = useGetFoldersByWorkspaceQuery(
    activeWorkspaceId as number,
    { skip: !activeWorkspaceId },
  );

  const dynamicNavData = NAV_DATA.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      if (item.title === "Schema") {

        const authServiceItems =
          apiFolders
            ?.filter((folder) => folder.name.toLowerCase() === "auth service")
            .map((folder) => ({
              id: folder.id,
              title: folder.name,
              url: `/workspaces/${activeWorkspaceId}/folders/${folder.id}`,
              icon: Icons.Folders || Folder,
            })) || [];


        const otherFoldersFromApi =
          apiFolders
            ?.filter((folder) => folder.name.toLowerCase() !== "auth service")
            .map((folder) => ({
              id: folder.id,
              title: folder.name,
              url: `/workspaces/${activeWorkspaceId}/folders/${folder.id}`,
              icon: Icons.Folders || Folder,
            })) || [];

        return {
          ...item,
          items: [

            {
              id: "sample-schema-parent",
              title: "Sample Schema",
              icon: Icons.Schema || Folder,

              items: authServiceItems,
            },


            ...otherFoldersFromApi,


            {
              id: "add-new-folder",
              title: "Add new schema",
              url: "#",
              icon: Plus,
              onClick: () => setShowAddFolderModal(true),
            },
          ],
        };
      }
      return item;
    }),
  }));

  const isCollapsed = !isOpen && !isMobile;

  // --- Company Info Logic ---
  const [companyData, setCompanyData] = useState({
    name: "Loading...",
    email: "",
    logo: null as string | null,
  });
  useEffect(() => {
    const fetchUserData = () => {
      const savedData = localStorage.getItem("registered_user");
      if (savedData) {
        try {
          const user = JSON.parse(savedData);
          setCompanyData({
            name: user.companyName || "My Company",
            email: user.companyEmail || "",
            logo: user.companyLogo || null,
          });
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchUserData();
  }, []);

  const toggleExpanded = (title: string) => {
    if (isCollapsed) setIsOpen(true);
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };



   const handleSignOut = async () => {
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

  const topNav = dynamicNavData.filter((s) => s.label === "MAIN MENU");
  const bottomNav = dynamicNavData.filter((s) => s.label === "OTHERS");

  // Import the new hook (ensure path is correct)
  const handleCreateClick = () => {
    setIsOpenWorkspace(true); // ដំណើរការហើយពេលនេះ!
  };

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "overflow-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",

          isMobile
            ? isOpen
              ? "w-[280px]"
              : "w-0"
            : isOpen
              ? "w-[280px]"
              : "w-[80px]",
        )}
      >
        <div className="flex h-full flex-col pb-6">
          {/* 1. Header & Logo Section */}
          <div
            className={cn(
              "mt-5 flex items-center space-x-1 px-2",
              isCollapsed ? "justify-center" : "justify-between",
            )}
          >
            {!isCollapsed && (
              <div className="flex items-center space-x-3.5">
                <UserInfoSidebar />
                <div onClick={handleCreateClick} className="cursor-pointer">
                  <FaRegEdit className="-mt-0.5 h-[20px] w-[20px] transition-transform" />
                </div>
              </div>
            )}


            <button
              onClick={toggleSidebar}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <PanelLeftIcon
                className={cn(
                  "size-5 transition-transform",
                  !isOpen && "rotate-180",
                )}
              />
            </button>
          </div>

          {/* 2. Middle Section (Navigation) */}
          {/* Navigation Area */}
          <div className="no-scrollbar mt-6 flex-1 overflow-y-auto px-3">
            {topNav.map((section) => (
              <div key={section.label} className="mb-5">
                <nav>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <MenuItem
                                as={
                                  (item.items.length > 0
                                    ? "button"
                                    : "link") as "link" | "button"
                                }
                                href={item.url ?? "#"}
                                isActive={
                                  pathname === item.url ||
                                  item.items.some(
                                    (sub: any) => pathname === sub.url,
                                  )
                                }
                                className={cn(
                                  "flex w-full items-center justify-between space-x-3 rounded-lg px-4 py-3",
                                  isCollapsed && "justify-center px-0",
                                )}
                                onClick={() =>
                                  item.items.length > 0 &&
                                  toggleExpanded(item.title)
                                }
                              >
                                <div className="flex items-center space-x-3 text-gray-800">
                                  <item.icon className="size-6 shrink-0" />
                                  {!isCollapsed && (
                                    <span className="font-normal">
                                      {" "}
                                      {item.title}
                                    </span>
                                  )}
                                </div>
                                {item.items.length > 0 && !isCollapsed && (
                                  <ChevronUp
                                    className={cn(
                                      "size-4 text-end transition-transform",
                                      !expandedItems.includes(item.title) &&
                                        "rotate-180",
                                    )}
                                  />
                                )}
                              </MenuItem>
                            </div>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent side="right">
                              {item.title}
                            </TooltipContent>
                          )}
                        </Tooltip>

                        {/* Sub-items (Folders) with Context Menu & Inline Edit */}
                        {item.items.length > 0 &&
                          expandedItems.includes(item.title) &&
                          !isCollapsed && (
                            <ul className="ml-9 mt-2 space-y-1 dark:border-gray-800">
                              {item.items.map((subItem: any, index: number) => {
                                const excludedFolders = [
                                  "M-Banking",
                                  "E-Commerce",
                                  "E-Learning",
                                ];
                                if (excludedFolders.includes(subItem.title)) {
                                  return null; // មិន Render Folder ទាំងនេះនៅទីនេះទេ
                                }

                                if (subItem.items && subItem.items.length > 0) {
                                  return (
                                    <CollapsibleSubItem
                                      key={subItem.id}
                                      item={subItem}
                                      pathname={pathname}
                                    />
                                  );
                                }

                                const isAddFolder =
                                  subItem.id === "add-new-folder";
                                const isEditing = editingId === subItem.id;
                                const SubIcon = subItem.icon || Folder;

                                // ១. លទ្ធផលបង្ហាញពេលកំពុង Edit (ប្រើ key ផ្សេងពី id ធម្មតា)
                                if (isEditing) {
                                  return (
                                    <li
                                      key={`editing-${subItem.id || index}`}
                                      className="flex items-center space-x-2 py-1 pl-4"
                                    >
                                      <SubIcon className="size-4 shrink-0 text-purple-500" />
                                      <input
                                        autoFocus
                                        className="w-full rounded-md border bg-slate-100 p-1 text-[14px] text-purple-600 outline-none"
                                        value={tempName}
                                        onChange={(e) =>
                                          setTempName(e.target.value)
                                        }
                                        onBlur={() => handleRename(subItem.id)}
                                        onKeyDown={(e) =>
                                          e.key === "Enter" &&
                                          handleRename(subItem.id)
                                        }
                                      />
                                    </li>
                                  );
                                }

                                // ២. UI Content សម្រាប់បង្ហាញធម្មតា
                                const menuItemContent = (
                                  <div className="group relative flex items-center">
                                    <MenuItem
                                      as={isAddFolder ? "button" : "link"}
                                      href={
                                        isAddFolder ? undefined : subItem.url
                                      }
                                      isActive={pathname === subItem.url}
                                      onClick={subItem.onClick}
                                      className="flex w-full items-center space-x-2 py-2 pl-4 pr-8 text-sm transition-colors"
                                    >
                                      <SubIcon className="size-4 shrink-0" />
                                      <span className="truncate">
                                        {subItem.title}
                                      </span>
                                    </MenuItem>

                                    {!isAddFolder && (
                                      <div className="absolute right-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <button className="flex size-6 items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                                              <MoreHorizontal className="size-4 text-gray-500" />
                                            </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent
                                            align="center"
                                            className="w-[220px] bg-white"
                                          >
                                            <div className="px-3 py-2 text-[14px] font-medium text-slate-500">
                                              Folder Options
                                            </div>
                                            <DropdownMenuItem
                                              className="gap-2"
                                              onClick={() => {
                                                setEditingId(subItem.id);
                                                setTempName(subItem.title);
                                              }}
                                            >
                                              <FaRegEdit className="size-4" />{" "}
                                              <span>Rename</span>
                                            </DropdownMenuItem>
                                            
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              onClick={() => {
                                                setFolderToDelete(subItem.id);
                                                setShowDeleteModal(true);
                                              }}
                                              className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700"
                                            >
                                              <TrashIcon className="size-4" />{" "}
                                              <span>Delete Folder</span>
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    )}
                                  </div>
                                );

                                // ៣. លទ្ធផលបង្ហាញសម្រាប់ប៊ូតុង "Add new folder"
                                if (isAddFolder) {
                                  return (
                                    <li key="add-folder-static-item">
                                      {menuItemContent}
                                    </li>
                                  );
                                }

                                // ៤. លទ្ធផលបង្ហាញសម្រាប់ Folder ធម្មតា (មកពី API)
                                return (
                                  <li key={subItem.id || index}>
                                    {isAddFolder ? (
                                      menuItemContent
                                    ) : (
                                      <ContextMenu>
                                        <ContextMenuTrigger>
                                          {menuItemContent}
                                        </ContextMenuTrigger>
                                        <ContextMenuContent className="w-[220px] bg-white">
                                          <div className="px-3 py-2 text-[14px] font-medium text-slate-500">
                                            Folder Options
                                          </div>
                                          <ContextMenuGroup>
                                            <ContextMenuItem
                                              className="gap-2"
                                              onClick={() => {
                                                setEditingId(subItem.id);
                                                setTempName(subItem.title);
                                              }}
                                            >
                                              <FaRegEdit className="size-4" />{" "}
                                              <span>Rename</span>
                                            </ContextMenuItem>
                                            
                                          </ContextMenuGroup>
                                          <ContextMenuSeparator />
                                          <ContextMenuItem
                                            onClick={() => {
                                              setFolderToDelete(subItem.id);
                                              setShowDeleteModal(true);
                                            }}
                                            className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700"
                                          >
                                            <TrashIcon className="size-4" />{" "}
                                            <span>Delete Folder</span>
                                          </ContextMenuItem>
                                        </ContextMenuContent>
                                      </ContextMenu>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>

          {/* 3. Bottom Section (Others/Sign out) */}
          <div className="mt-auto border-t border-gray-100 px-3 pt-4 text-gray-700 dark:border-gray-800">
            {bottomNav.map((section) => (
              <ul key={section.label} className="space-y-2">
                {section.items.map((item) => {
                  const isSignOut = item.title === "Sign out";
                  return (
                    <li key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <MenuItem
                              as={isSignOut ? "button" : "link"}
                              href={item.url || "/"}
                              onClick={() =>
                                isSignOut && setShowSignOutModal(true)
                              }
                              isActive={pathname === item.url}
                              isDestructive={isSignOut}
                              className={cn(
                                "flex w-full items-center space-x-3 rounded-xl transition-all",
                                isCollapsed
                                  ? "h-12 justify-center px-0"
                                  : "px-4 py-3",
                              )}
                            >
                              <item.icon className="size-6 shrink-0" />
                              {!isCollapsed && (
                                <span className="font-normal text-gray-800">
                                  {item.title}
                                </span>
                              )}
                            </MenuItem>
                          </div>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right">
                            {item.title}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      </aside>

      <ConfirmModal
        open={showSignOutModal}
        title="Confirm Sign Out"
        description="Are you sure you want to sign out?"
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOutModal(false)}
      />

      <CreateFolderDialog
        isOpen={showAddFolderModal}
        onClose={() => setShowAddFolderModal(false)}
        workspaceId={activeWorkspaceId as number}
      />

      <ConfirmModalDelete
        open={showDeleteModal}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your folder and remove its data from our servers."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setFolderToDelete(null);
        }}
      />
      <CreateWorkspaceDialog
        isOpen={isDialogOpenW} // ប្រាកដថាប្រើ variable តែមួយដែលបាន set ខាងលើ
        onClose={() => setIsOpenWorkspace(false)}
      />
    </TooltipProvider>
  );
}

function CollapsibleSubItem({
  item,
  pathname,
}: {
  item: any;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && item.items.length > 0;
  const Icon = item.icon || Folder;

  return (
    <li className="list-none">
      <button
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={cn(
          "group flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
          isOpen && "bg-gray-50 dark:bg-gray-900",
        )}
      >
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <Icon className="size-4 shrink-0" />
          <span className="text-[14px] font-medium">{item.title}</span>
        </div>
        {hasChildren && (
          <ChevronUp
            className={cn(
              "size-3 text-gray-400 transition-transform duration-200",
              !isOpen && "rotate-180",
            )}
          />
        )}
      </button>

      {/* បង្ហាញកូនជាន់ទី ៣ (M-Banking, E-Commerce...) */}
      {hasChildren && isOpen && (
        <ul className="ml-7 mt-1 space-y-1 border-l border-gray-100 pl-4 dark:border-gray-800">
          {item.items.map((child: any) => (
            <li key={child.id}>
              <Link
                href={child.url}
                className={cn(
                  "flex items-center space-x-2 rounded-md px-3 py-2 text-[13px] transition-colors hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-gray-800",
                  pathname === child.url
                    ? "bg-purple-50 font-medium text-purple-600"
                    : "text-gray-500",
                )}
              >
                <child.icon className="size-3.5 shrink-0" />
                <span className="truncate">{child.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
