import { normPlovApi } from "@/redux/api";
import { FolderRequest, FolderResponse } from "@/types/folder";

export const folderApi = normPlovApi.injectEndpoints({
  endpoints: (builder) => ({
    // ១. បង្កើត Folder ថ្មី (ត្រូវបោះ workspaceId ចូលក្នុង URL)
    createFolder: builder.mutation<
      FolderResponse,
      { workspaceId: number; body: { name: string } }
    >({
      query: ({ workspaceId, body }) => ({
        // ត្រូវតែមាន api/v1 ឱ្យដូច Postman ១០០%
        url: `api/v1/workspaces/${workspaceId}/folders`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Folders"],
    }),

    // ២. ទាញយកបញ្ជី Folder តាម Workspace (បោះ workspaceId ចូលក្នុង URL)
    getFoldersByWorkspace: builder.query<FolderResponse[], number>({
      query: (workspaceId) => `api/v1/workspaces/${workspaceId}/folders`,
      providesTags: ["Folders"],
    }),

    // redux/service/folder.ts
    updateFolder: builder.mutation<
      FolderResponse,
      { workspaceId: number; folderId: number; name: string }
    >({
      query: ({ workspaceId, folderId, name }) => ({
        url: `api/v1/workspaces/${workspaceId}/folders/${folderId}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Folders"],
    }),

    deleteFolder: builder.mutation<
      void,
      { workspaceId: number; folderId: number }
    >({
      query: ({ workspaceId, folderId }) => ({
        url: `api/v1/workspaces/${workspaceId}/folders/${folderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Folders"],
    }),
  }),
});

export const {
  useCreateFolderMutation,
  useGetFoldersByWorkspaceQuery,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
} = folderApi;
