import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";




const getSavedWorkspace = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("activeWorkspace");
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

const savedData = getSavedWorkspace();

type WorkspaceStateType = {
  activeWorkspaceId: number | null;
  activeWorkspaceName: string | null;
};

const initialState: WorkspaceStateType = {
  activeWorkspaceId: savedData ? savedData.id : null,
  activeWorkspaceName: savedData ? savedData.name : null,
};


const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setActiveWorkspace(
      state, 
      action: PayloadAction<{ id: number; name: string }>
    ) {
      state.activeWorkspaceId = action.payload.id;
      state.activeWorkspaceName = action.payload.name;
      
      // រក្សាទុកក្នុង LocalStorage ដើម្បីកុំឱ្យបាត់ពេល Refresh ឬប្តូរ Route
      if (typeof window !== "undefined") {
        localStorage.setItem("activeWorkspace", JSON.stringify(action.payload));
      }
    },
    
    clearActiveWorkspace(state) {
      state.activeWorkspaceId = null;
      state.activeWorkspaceName = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("activeWorkspace");
      }
    },
  },
});

export const { setActiveWorkspace, clearActiveWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;

export const selectActiveWorkspaceId = (state: RootState) => state.workspace.activeWorkspaceId;
export const selectActiveWorkspaceName = (state: RootState) => state.workspace.activeWorkspaceName;