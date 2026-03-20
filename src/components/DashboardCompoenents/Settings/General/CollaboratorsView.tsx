"use client";

import React, { useState, useMemo } from "react";
import {
  Trash2,
  Users,
  Search,
  ChevronDown,
  Globe,
  Lock,
  Loader2,
  MailX,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectActiveWorkspaceId } from "@/redux/feature/workspace/workspaceSlice";
import {
  useGetWorkspaceMembersQuery,
  useRevokeInvitationMutation,
  useUpdateMemberRoleMutation,
} from "@/redux/service/workspace";
import {
  useRemoveMemberMutation,
  useUpdateApiSchemeMutation,
} from "@/redux/service/apiScheme";
import { InviteMemberDialog } from "../../Layouts/header/InviteMemberDialog";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/DashboardCompoenents/ui/dropdown-menu"; // 👈 ត្រូវតែមានពាក្យ -menu បែបនេះ


interface CollaboratorsViewProps {
  schema: any;
}

export default function CollaboratorsView({ schema }: CollaboratorsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const activeWorkspaceId = useSelector(selectActiveWorkspaceId);
  const { toast } = useToast();

  // --- API Hooks ---
  const { data: members = [], isLoading: isLoadingMembers } =
    useGetWorkspaceMembersQuery(activeWorkspaceId as number, {
      skip: !activeWorkspaceId,
    });

  const [removeMember] = useRemoveMemberMutation();
  const [revokeInvitation, { isLoading: isRevoking }] =
    useRevokeInvitationMutation();
  const [updateMemberRole, { isLoading: isUpdatingRole }] =
    useUpdateMemberRoleMutation();
  const [updateApiScheme, { isLoading: isUpdatingVisibility }] =
    useUpdateApiSchemeMutation();

  // --- Handlers ---

  // ១. ប្តូរស្ថានភាព Public / Private
  const handleToggleVisibility = async () => {
    if (!schema) return;
    try {
      const slugOnly = schema.endpointUrl.split("/").pop();
      await updateApiScheme({
        id: schema.id,
        body: {
          ...schema,
          endpointUrl: slugOnly,
          isPublic: !schema.isPublic,
        },
      }).unwrap();
      toast({
        title: "Visibility Updated",
        description: `API is now ${!schema.isPublic ? "Public" : "Private"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change visibility",
        variant: "destructive",
      });
    }
  };

  // ២. ប្តូរ Role សមាជិក
  const handleRoleChange = async (memberId: number, newRole: string) => {
    if (!activeWorkspaceId || !memberId) return;
    try {
      await updateMemberRole({
        workspaceId: activeWorkspaceId,
        memberId,
        body: { role: newRole },
      }).unwrap();
      toast({
        title: "Role Updated",
        description: `Member role changed to ${newRole.toLowerCase()}.`,
      });
    } catch (err) {
      toast({ title: "Update Failed", variant: "destructive" });
    }
  };

  // ៣. លុបសមាជិក (Real Member)
  const handleRemoveUser = async (memberId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;

    try {
      await removeMember({
        workspaceId: activeWorkspaceId as number,
        memberId,
      }).unwrap();
      toast({ title: "Removed", description: `${name} has been removed.` });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not remove member",
        variant: "destructive",
      });
    }
  };

  // ៤. លុបការអញ្ជើញ (Pending Invitation)
  const handleRevokeInvite = async (email: string) => {
    if (!window.confirm(`Cancel invitation for ${email}?`)) return;
    try {
      await revokeInvitation({
        workspaceId: activeWorkspaceId as number,
        email,
      }).unwrap();
      toast({ title: "Revoked", description: "Invitation cancelled." });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not revoke invitation",
        variant: "destructive",
      });
    }
  };

  // Filter ឈ្មោះសមាជិកតាមការ Search
  const filteredMembers = members.filter(
    (m: any) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 duration-500 animate-in fade-in">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-slate-700">
          Collaborators and teams
        </h2>
        <button
          onClick={handleToggleVisibility}
          disabled={isUpdatingVisibility}
          className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50"
        >
          {isUpdatingVisibility && (
            <Loader2 className="size-3 animate-spin text-purple-600" />
          )}
          Manage visibility
        </button>
      </div>

      {/* Info Card - Repository Status */}
      <div className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-2 shadow-sm">
          {schema?.isPublic ? (
            <Globe className="h-5 w-5 text-green-600" />
          ) : (
            <Lock className="h-5 w-5 text-amber-600" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">
            {schema?.isPublic ? "Public repository" : "Private repository"}
          </p>
          <p className="text-sm text-slate-500">
            {schema?.isPublic
              ? "This repository is public and visible to anyone."
              : "This repository is private and only visible to collaborators."}
          </p>
        </div>
      </div>

      {/* Direct Access Section */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Direct access
            </p>
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-700">
                {members.length} entities
              </span>{" "}
              have access to this repository.
            </p>
          </div>
          <Users className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Manage Access Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Manage access
          </h3>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
          >
            Add people
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {/* Table Header/Filter */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Select all
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Find a collaborator..."
                  className="h-8 w-64 rounded-md border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* List Items */}
          <div className="divide-y divide-slate-100">
            {isLoadingMembers ? (
              <div className="p-10 text-center text-sm text-slate-400">
                Loading members...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">
                No collaborators found.
              </div>
            ) : (
              filteredMembers.map((user: any) => {
                const isPending = user.role?.includes("PENDING");
                const isOwner = user.role === "OWNER";
                const displayRole = user.role
                  ?.replace(" (PENDING)", "")
                  .toLowerCase();

                return (
                  <div
                    key={user.id || user.email}
                    className="group flex items-center justify-between p-4 transition-colors hover:bg-slate-50/80"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-purple-600"
                      />
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-inner ${isPending ? "bg-slate-300" : "bg-purple-500"}`}
                      >
                        {user.name?.substring(0, 2).toUpperCase() ||
                          user.email.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="cursor-pointer text-sm font-bold text-purple-600 transition-all hover:underline">
                            {user.name || user.email.split("@")[0]}
                          </p>
                          {isPending && (
                            <span className="rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* 🎯 Change Role Dropdown (ជិតប៊ូតុងលុប) */}
                      {!isOwner && !isPending && (
                        <DropdownMenu>
  {/* ១. Trigger: ប៊ូតុងសម្រាប់ចុចបើក */}
  <DropdownMenuTrigger asChild>
    <button className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[13px] font-medium text-slate-600 transition-all hover:text-slate-900 outline-none">
      <span className="capitalize">
        {user.role.toLowerCase()}
      </span>
      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
    </button>
  </DropdownMenuTrigger>

  {/* ២. Content: បញ្ជី Role សម្រាប់រើស */}
  <DropdownMenuContent align="end" className="w-32 bg-white shadow-md border border-slate-200">
    {["ADMIN", "EDITOR", "VIEWER"].map((r) => (
      <DropdownMenuItem
        key={r}
        onSelect={() => handleRoleChange(user.id, r)}
        className="cursor-pointer capitalize text-slate-600 focus:bg-slate-50 focus:text-purple-600"
      >
        {r.toLowerCase()}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
                      )}

                      {/* 🎯 Action Buttons (Revoke/Delete) */}
                      {isPending ? (
                        <button
                          disabled={isRevoking}
                          onClick={() => handleRevokeInvite(user.email)}
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          <MailX className="size-3" />{" "}
                          {isRevoking ? "..." : "Revoke"}
                        </button>
                      ) : (
                        !isOwner && (
                          <button
                            onClick={() => handleRemoveUser(user.id, user.name)}
                            className="rounded-md bg-red-50 p-2 text-red-600  "
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )
                      )}

                      {isOwner && (
                        <span className="px-2 text-[12px] font-bold text-slate-400">
                          Owner
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Organization Promo Section */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 p-6">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-purple-100 bg-purple-50 text-purple-600 shadow-sm">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  Get team access controls and discussions for your contributors
                  in an organization.
                </p>
                <div className="flex items-center gap-2">
                  <span className="rounded border border-orange-200 bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-orange-700">
                    New
                  </span>
                  <p className="text-xs text-slate-500">
                    Private repos and unlimited members are free.
                  </p>
                </div>
              </div>
            </div>
            <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-slate-50">
              Create an organization
            </button>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      <InviteMemberDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        workspaceId={activeWorkspaceId as number}
      />

      {/* Pagination Footer */}
      <div className="flex items-center justify-center gap-4 text-sm font-medium text-slate-600">
        <button className="flex items-center gap-1 hover:text-purple-600 disabled:opacity-50">
          <span className="text-lg">‹</span> Previous
        </button>
        <button className="flex items-center gap-1 hover:text-purple-600">
          Next <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  );
}
