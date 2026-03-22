"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { selectActiveWorkspaceId } from "@/redux/feature/workspace/workspaceSlice";
import { useGetWorkspaceMembersQuery } from "@/redux/service/workspace"; 
import { useSelector } from "react-redux";

export function AvatarGroupCountExample() {

  const activeWorkspaceId = useSelector(selectActiveWorkspaceId);



  const { data: members = [], isLoading } = useGetWorkspaceMembersQuery(
    activeWorkspaceId,
    {
      skip: !activeWorkspaceId,
    },
  );

  if (isLoading)
    return <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />;


  const maxDisplay = 3;
  const displayMembers = members.slice(0, maxDisplay);
  const remainingCount = members.length - maxDisplay;

  return (
    <AvatarGroup className="">

      {displayMembers.map((member: any, index: number) => (
        <Avatar

          key={member.id || `member-${index}`}
          className="h-[35px] w-[35px] border-none"
        >
          <AvatarImage
            src={member?.user?.avatarUrl}
            alt={member?.user?.name || "User"}
          />
          <AvatarFallback className="bg-purple-50 font-bold text-purple-700">
            {member?.user?.name
              ? member.user.name.substring(0, 2).toUpperCase()
              : "U"}
          </AvatarFallback>
        </Avatar>
      ))}


      {remainingCount > 0 && (
        <AvatarGroupCount className="h-[35px] w-[35px] border-none bg-purple-100 text-[15px] font-semibold text-purple-700">
          +{remainingCount}
        </AvatarGroupCount>
      )}
    </AvatarGroup>
  );
}
