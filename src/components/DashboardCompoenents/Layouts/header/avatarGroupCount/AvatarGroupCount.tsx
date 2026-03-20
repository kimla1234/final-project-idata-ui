"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { selectActiveWorkspaceId } from "@/redux/feature/workspace/workspaceSlice";
import { useGetWorkspaceMembersQuery } from "@/redux/service/workspace"; // ផ្លូវ Path ទៅកាន់ API service របស់អ្នក
import { useSelector } from "react-redux";

export function AvatarGroupCountExample() {
  // ១. ទាញយក Workspace ID បច្ចុប្បន្នពី Redux Store
  const activeWorkspaceId = useSelector(selectActiveWorkspaceId);

  // ២. Fetch ទិន្នន័យសមាជិក (ហៅ API)
  // កំណត់ឱ្យ skip ប្រសិនបើមិនទាន់មាន workspaceId
  const { data: members = [], isLoading } = useGetWorkspaceMembersQuery(
    activeWorkspaceId,
    {
      skip: !activeWorkspaceId,
    },
  );

  if (isLoading)
    return <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />;

  // ៣. រៀបចំ Logic បង្ហាញរូប (បង្ហាញត្រឹម ៣ នាក់ដំបូង)
  const maxDisplay = 3;
  const displayMembers = members.slice(0, maxDisplay);
  const remainingCount = members.length - maxDisplay;

  return (
    <AvatarGroup className="">
      {/* ក្នុង AvatarGroupCountExample.tsx */}
      {displayMembers.map((member: any, index: number) => (
        <Avatar
          // ប្រើ member.id បើមាន បើគ្មានប្រើ index ដើម្បីធានាថាវា unique ជានិច្ច
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

      {/* បង្ហាញលេខដែលនៅសល់ ប្រសិនបើមានសមាជិកលើសពី ៣ នាក់ */}
      {remainingCount > 0 && (
        <AvatarGroupCount className="h-[35px] w-[35px] border-none bg-purple-100 text-[15px] font-semibold text-purple-700">
          +{remainingCount}
        </AvatarGroupCount>
      )}
    </AvatarGroup>
  );
}
