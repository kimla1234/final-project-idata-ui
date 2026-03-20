"use client";

import { useState, useMemo } from "react";
import { X, Loader2, ChevronDown } from "lucide-react";
import {
  useInviteMemberMutation,
  useGetWorkspaceMembersQuery,
  useUpdateMemberRoleMutation,
  useRevokeInvitationMutation,
} from "@/redux/service/workspace";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaLink } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectToken } from "@/redux/feature/auth/authSlice"; // 🎯 ទាញ Email ពី Auth Slice

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { jwtDecode } from "jwt-decode";

export function InviteMemberDialog({
  isOpen,
  onClose,
  workspaceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: number;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");
  const { toast } = useToast();
  const token = useSelector(selectToken);
  const [revokeInvitation, { isLoading: isRevoking }] = useRevokeInvitationMutation();

  const userEmail = useMemo(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.sub; // ឬ decoded.email ទៅតាមអ្វីដែល Backend បោះមកក្នុង Token
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [token]);

  // ១. ទាញបញ្ជីសមាជិក (Backend ត្រូវផ្ញើទាំង Member និង Invitation ដែលមានពាក្យ PENDING មកជាមួយ)
  const { data: members = [], isLoading: isFetching } =
    useGetWorkspaceMembersQuery(workspaceId as number, {
      skip: !workspaceId || !isOpen,
    });

  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();
  const [updateMemberRole, { isLoading: isUpdating }] =
    useUpdateMemberRoleMutation();

  // ២. រកមើល Role របស់ខ្លួនឯងក្នុងចំណោម Members (ប្រើ Email ជាសោរ)
  const currentUserInWorkspace = useMemo(() => {
    if (!userEmail || members.length === 0) return null;
    return members.find((m: any) => m.email === userEmail);
  }, [members, userEmail]);

  // ៣. កំណត់សិទ្ធិ Manage (Owner ឬ Admin)
  const isOwner = currentUserInWorkspace?.role === "OWNER";
  const isAdmin = currentUserInWorkspace?.role === "ADMIN";
  const canManage = isOwner || isAdmin;

  if (!isOpen) return null;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !canManage) return;

    try {
      await inviteMember({
        workspaceId,
        body: { email: email.trim().toLowerCase(), role },
      }).unwrap();
      toast({ title: "Success 🎉", description: `Invite sent to ${email}` });
      setEmail("");
    } catch (err: any) {
      toast({
        title: "Failed",
        description: err?.data?.message || "Error",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = () => {
    if (!workspaceId) return;
    const inviteLink = `${window.location.origin}/register?email=${encodeURIComponent(email)}&workspaceId=${workspaceId}`;
    navigator.clipboard.writeText(inviteLink);
    toast({ title: "Link Copied! 📋" });
  };

  const handleRoleChange = async (memberId: number, newRole: string) => {
    if (!workspaceId || !memberId) return;
    try {
      await updateMemberRole({
        workspaceId,
        memberId,
        body: { role: newRole },
      }).unwrap();
      toast({ title: "Role Updated" });
    } catch (err: any) {
      toast({ title: "Update Failed", variant: "destructive" });
    }
  };

  const handleRevoke = async (targetEmail: string) => {
  if (!workspaceId) return;
  try {
    await revokeInvitation({ workspaceId, email: targetEmail }).unwrap();
    toast({ title: "Success", description: "Invitation revoked successfully." });
  } catch (err: any) {
    toast({ 
      title: "Error", 
      description: err?.data?.message || "Failed to revoke invitation", 
      variant: "destructive" 
    });
  }
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 font-sans backdrop-blur-[2px]">
      <div className="w-full max-w-[540px] overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-[20px] font-bold text-[#1a1a1a]">
            {canManage ? "Invite to workspace" : "Workspace Members"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Invite Form Section */}
        {canManage ? (
          <form onSubmit={handleInvite} className="px-6 pb-4">
            <div className="flex items-center gap-2 rounded-lg border-2 border-blue-500 p-1.5 focus-within:ring-2 focus-within:ring-blue-100">
              <input
                type="email"
                required
                placeholder="Enter email address..."
                className="flex-1 px-3 py-1.5 text-[15px] outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="border-l px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[14px] font-medium text-gray-700 outline-none"
                    >
                      <span className="capitalize">{role.toLowerCase()}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[120px]">
                    {["ADMIN", "EDITOR", "VIEWER"].map((r) => (
                      <DropdownMenuItem
                        key={r}
                        onClick={() => setRole(r)}
                        className="capitalize cursor-pointer"
                      >
                        {r.toLowerCase()}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <button
                type="submit"
                disabled={isInviting || !email}
                className="rounded-md bg-[#f07c54] px-5 py-2 text-[14px] font-bold text-white hover:bg-[#e06b43] disabled:opacity-50"
              >
                {isInviting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Invite"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="px-6 pb-4">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-[13px] text-slate-600">
              You are currently an{" "}
              <strong>{currentUserInWorkspace?.role || "Member"}</strong>. Only
              owners/admins can invite.
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="mt-4 max-h-[300px] overflow-y-auto px-6 pb-6">
          <h3 className="mb-4 text-[14px] font-bold text-gray-500">
            Manage access
          </h3>
          {isFetching ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member: any, index: number) => {
                const isSelf = member.email === userEmail;
                const isPending = member.role.includes("PENDING");
                const displayRole = member.role.replace(" (PENDING)", "");
                const isTargetOwner = member.role === "OWNER";

                // លក្ខខណ្ឌ Disable ដូរ Role
                const isDisabled =
                  !canManage || isTargetOwner || (isAdmin && isSelf) || isPending;

                return (
                  <div
                    key={member.id || index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className={`h-9 w-9 ${isPending ? "opacity-60 grayscale-[0.5]" : ""}`}>
                        <AvatarImage src={member.profileImage} />
                        <AvatarFallback className="bg-orange-100 font-bold text-orange-600">
                          {member.email.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-semibold text-gray-900">
                            {member.username || member.email.split("@")[0]}{" "}
                            {isSelf && (
                              <span className="text-[10px] font-normal text-slate-400">
                                (You)
                              </span>
                            )}
                          </p>
                          {/* 🎯 បង្ហាញ Badge Pending */}
                          {isPending && (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-gray-500 capitalize">
                          {isPending ? displayRole : member.role.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPending && canManage ? (
                        /* 🎯 ប៊ូតុង Revoke សម្រាប់ Pending Invite */
                        <button 
                        disabled={isRevoking}
                          className="text-[12px] font-medium text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                          onClick={() => handleRevoke(member.email)}
                        >
                         {isRevoking ? "..." : "Revoke"}
                        </button>
                      ) : (
                        /* Dropdown ប្តូរ Role ធម្មតា */
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild disabled={isDisabled}>
                            <button className="flex items-center gap-1 text-[13px] font-medium text-gray-600 disabled:opacity-50">
                              <span className="capitalize">
                                {member.role.toLowerCase()}
                              </span>
                              {!isDisabled && (
                                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                              )}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {["ADMIN", "EDITOR", "VIEWER"].map((r) => (
                              <DropdownMenuItem
                                key={r}
                                onClick={() => handleRoleChange(member.id, r)}
                                className="capitalize cursor-pointer"
                              >
                                {r.toLowerCase()}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-gray-50 p-6">
          <div>
            <p className="text-[14px] font-bold text-gray-800">Workspace Link</p>
            <p className="text-[12px] text-gray-500">Invite others via URL.</p>
          </div>
          {canManage && (
            <button
              onClick={handleCopyLink}
              className="rounded-lg flex items-center gap-2 border bg-white px-3 py-1.5 text-[14px] font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
            >
              <FaLink className="text-blue-500 h-4 w-4" /> Copy link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}