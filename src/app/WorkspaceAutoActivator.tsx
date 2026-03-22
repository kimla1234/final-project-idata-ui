"use client";

import { selectActiveWorkspaceId, setActiveWorkspace } from "@/redux/feature/workspace/workspaceSlice";
import { useGetMyWorkspacesQuery } from "@/redux/service/workspace";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function WorkspaceAutoActivator() {
  const dispatch = useDispatch();
  const activeId = useSelector(selectActiveWorkspaceId);
  

  const { data: workspaces, isLoading } = useGetMyWorkspacesQuery();

  useEffect(() => {

    if (!isLoading && workspaces && workspaces.length > 0 && !activeId) {
      

      const firstWorkspace = workspaces[0];
      
      dispatch(setActiveWorkspace({
        id: firstWorkspace.id,
        name: firstWorkspace.name
      }));
      
      console.log("Auto-activated Workspace:", firstWorkspace.name);
    }
  }, [workspaces, activeId, isLoading, dispatch]);

  return null; 
}