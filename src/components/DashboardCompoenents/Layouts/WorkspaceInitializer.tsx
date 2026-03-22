"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMyWorkspacesQuery } from "@/redux/service/workspace";
import { 
  selectActiveWorkspaceId, 
  setActiveWorkspace 
} from "@/redux/feature/workspace/workspaceSlice";

export const WorkspaceInitializer = () => {
  const dispatch = useDispatch();
  const activeId = useSelector(selectActiveWorkspaceId);
  const { data: workspaces, isLoading } = useGetMyWorkspacesQuery();

  useEffect(() => {

    if (!isLoading && workspaces && workspaces.length > 0) {
      

      if (!activeId) {

        const saved = localStorage.getItem("activeWorkspace");
        
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch(setActiveWorkspace({ id: parsed.id, name: parsed.name }));
        } else {

          dispatch(setActiveWorkspace({ 
            id: workspaces[0].id, 
            name: workspaces[0].name 
          }));
        }
      }
    }
  }, [workspaces, activeId, isLoading, dispatch]);

  return null; 
};