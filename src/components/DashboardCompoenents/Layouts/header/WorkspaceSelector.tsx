"use client";

import {
  Search,
  Plus,
  LayoutGrid,
  Check,
  Loader2,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { Dropdown, DropdownContent, DropdownTrigger } from "../../ui/dropdown";
import { useState, useMemo } from "react";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";
import {
  useDeleteWorkspaceMutation,
  useGetMyWorkspacesQuery,
  useUpdateWorkspaceMutation,
} from "@/redux/service/workspace";
import { WorkspaceResponse } from "@/types/workspace";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveWorkspaceId,
  setActiveWorkspace,
} from "@/redux/feature/workspace/workspaceSlice";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const WorkspaceSelector = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  //////////////////// EDIT /////////////////////////////
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempName, setTempName] = useState("");
  const router = useRouter();
  const [updateWorkspace] = useUpdateWorkspaceMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [wsToDelete, setWsToDelete] = useState<number | null>(null);
  const [deleteWorkspace, { isLoading: isDeleting }] =
    useDeleteWorkspaceMutation();

  const handleRename = async (id: number) => {
    if (tempName.trim() !== "") {
      try {
        await updateWorkspace({
          id,
          name: tempName.trim(),
          description: "", 
        }).unwrap();
      } catch (err) {
        console.error("Failed to rename workspace", err);
      }
    }
    setEditingId(null);
  };
  const handleDelete = async () => {
    if (!wsToDelete || !password) return;

    try {
      await deleteWorkspace({ id: wsToDelete, password }).unwrap();
      setShowDeleteModal(false);
      setPassword("");
      setWsToDelete(null);

    } catch (err: any) {

      console.error("Delete failed:", err);
    }
  };
  //////////////////// end EDIT /////////////////////////////

  // 1. Local state to track the selected workspace ID
  const activeId = useSelector(selectActiveWorkspaceId);

  const { data: workspaces, isLoading, error } = useGetMyWorkspacesQuery();

  // 2. Filter logic for search bar
  const filteredWorkspaces = useMemo(() => {
    return workspaces?.filter((ws) =>
      ws.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [workspaces, searchQuery]);

  // 3. Find the active workspace object to display its name in the trigger
  const selectedWorkspace = workspaces?.find((ws) => ws.id === activeId);

  const handleSelect = (workspace: WorkspaceResponse) => {
    dispatch(setActiveWorkspace({ id: workspace.id, name: workspace.name }));
    setIsOpen(false);
  };

  const handleCreateClick = () => {
    setIsOpen(false);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
        <DropdownTrigger className="w-full">
          <div className="group flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1 hover:bg-purple-50">

            <div className="flex flex-1 items-center overflow-hidden">
              <span className="truncate whitespace-nowrap text-[15px] font-medium text-dark dark:text-white">
                {/* Dynamic Label */}
                {selectedWorkspace ? selectedWorkspace.name : "Workspaces"}
              </span>
            </div>


            <svg
              className="h-4 w-4 flex-shrink-0 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </DropdownTrigger>

        <DropdownContent className="left-[160px] w-[400px] rounded-lg border bg-white p-3 shadow-xl dark:bg-gray-900">
          <div className="mb-4 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workspaces..."
                className="w-full rounded-md border py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
            <button
              onClick={handleCreateClick}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:bg-gray-800"
            >
              Create
            </button>
          </div>

          <div className="max-h-[300px] space-y-1 overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-gray-400" />
              </div>
            )}

            {filteredWorkspaces?.map((workspace: WorkspaceResponse) => {
              const isEditing = editingId === workspace.id;

              return (
                <ContextMenu key={workspace.id}>
                  <ContextMenuTrigger className="w-full">
                    <button
                      onClick={() => !isEditing && handleSelect(workspace)}
                      className={`group flex w-full items-center gap-3 rounded-md p-2 transition-colors ${
                        activeId === workspace.id
                          ? "bg-purple-50 dark:bg-purple-900/20"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {/* Workspace Icon */}
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-indigo-100 text-xs font-bold text-indigo-600">
                        {workspace.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex flex-1 flex-col items-start overflow-hidden text-start">
                        {isEditing ? (
                          <input
                            autoFocus
                            className="w-full rounded-md border-none bg-transparent bg-white p-1 text-[17px] outline-none focus:border-none focus:ring-0"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onBlur={() => handleRename(workspace.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRename(workspace.id);
                              if (e.key === "Escape") setEditingId(null);
                              e.stopPropagation(); 
                            }}

                            onClick={(e) => {
                              e.stopPropagation();
                              e.nativeEvent.stopImmediatePropagation();
                            }}
                          />
                        ) : (
                          <span
                            className={cn(
                              "w-full truncate text-sm font-medium",
                              activeId === workspace.id
                                ? "text-purple-700"
                                : "text-gray-700",
                            )}
                          >
                            {workspace.name}
                          </span>
                        )}
                      </div>

                      {activeId === workspace.id && !isEditing && (
                        <Check className="ml-auto h-4 w-4 text-purple-600" />
                      )}
                    </button>
                  </ContextMenuTrigger>

                  <ContextMenuContent
                    className="w-48 bg-white"

                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <ContextMenuItem
                      onSelect={(e) => {

                        e.preventDefault();


                        (e as any).nativeEvent?.stopImmediatePropagation();

                        setEditingId(workspace.id);
                        setTempName(workspace.name);
                      }}
                      className="gap-2"
                    >
                      <PencilIcon className="size-4" />{" "}
                      <span>Rename Workspace</span>
                    </ContextMenuItem>

                    <ContextMenuSeparator />

                    <ContextMenuItem
                      onSelect={() => {

                        router.push(
                          `/workspaces/${workspace.id}/confirm-delete`,
                        );
                      }}
                      className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
                    >
                      <TrashIcon className="size-4" />
                      <span>Delete Workspace</span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </div>

          <hr className="my-3 border-gray-100 dark:border-gray-800" />

          <button className="flex w-full items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
            <LayoutGrid className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">View all workspaces</span>
          </button>
        </DropdownContent>
      </Dropdown>

      <CreateWorkspaceDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};
