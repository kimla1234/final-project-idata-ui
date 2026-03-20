import { normPlovApi } from "@/redux/api";
// បងអាច Import Types តាមការរៀបចំរបស់បង (ឧទាហរណ៍៖ types/apiScheme.ts)
// ឬដាក់ interface បណ្ដោះអាសន្ននៅទីនេះ

export const apiSchemeApi = normPlovApi.injectEndpoints({
  endpoints: (builder) => ({
    // ១. បង្កើត API Scheme ថ្មី
    createApiScheme: builder.mutation<any, any>({
      query: (body) => ({
        url: `api/v1/api-schemes`,
        method: "POST",
        body: body,
      }),
      // បន្ទាប់ពីបង្កើតរួច ឱ្យវាទៅទាញទិន្នន័យថ្មីក្នុង Folder ឡើងវិញ
      invalidatesTags: ["ApiSchemes"],
    }),

    // ២. ទាញយកបញ្ជី API Schemes តាមរយៈ Folder ID
    getApiSchemesByFolder: builder.query<any[], number>({
      query: (folderId) => `api/v1/api-schemes/folder/${folderId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ApiSchemes" as const, id })),
              { type: "ApiSchemes", id: "LIST" },
            ]
          : [{ type: "ApiSchemes", id: "LIST" }],
    }),

    getApiSchemeById: builder.query<any, number>({
      query: (id) => ({
        url: `api/v1/api-schemes/${id}`, // បាញ់ទៅ GET /api/v1/api-schemes/{id}
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ApiSchemes", id }],
    }),

    deleteApiScheme: builder.mutation<void, number>({
      query: (id) => ({
        url: `api/v1/api-schemes/${id}`,
        method: "DELETE",
      }),
      // បន្ទាប់ពីលុបជោគជ័យ ឱ្យវាទាញបញ្ជី API ក្នុង Folder ឡើងវិញ (Refresh List)
      invalidatesTags: (result, error, id) => [
        { type: "ApiSchemes", id: "LIST" },
        { type: "ApiSchemes", id },
      ],
    }),

    // ៣. Update API Scheme (Properties, Keys, etc.)
    updateApiScheme: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `api/v1/api-schemes/${id}`,
        method: "PUT",
        body: body,
      }),
      // បន្ទាប់ពីកែជោគជ័យ ឱ្យវា Refresh ទិន្នន័យសម្រាប់ ID ហ្នឹង និង List ក្នុង Folder
      invalidatesTags: (result, error, { id }) => [
        { type: "ApiSchemes", id }, // Refresh ព័ត៌មានលម្អិត (DetailPage)
        { type: "ApiSchemes", id: "LIST" }, // Refresh បញ្ជីក្នុង Folder (Sidebar/Dashboard)
      ],
    }),

    // បន្ថែមទៅក្នុង endpoints របស់ apiSchemeApi
    generateAiMock: builder.mutation<any, { id: number; instruction: string }>({
      query: ({ id, instruction }) => ({
        url: `api/v1/ai/mock/${id}`,
        method: "POST",
        body: { instruction },
      }),
      // បន្ទាប់ពី Generate រួច បងអាចឱ្យវា Refresh បញ្ជីទិន្នន័យបាន (បើមាន Tag)
      invalidatesTags: ["ApiSchemes"],
    }),

    // ថែមចូលក្នុង endpoints របស់ apiSchemeApi
    previewSchemaFromFile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `api/v1/generate-file/preview`,
        method: "POST",
        body: formData,
      }),
    }),

    createSchemaFromFile: builder.mutation<any, any>({
      query: (body) => ({
        url: `api/v1/generate-file/generate-from-file`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["ApiSchemes"],
    }),

    generateSchemaFromPrompt: builder.mutation({
      query: (body: { prompt: string }) => ({
        url: "/api/v1/generate-file/generate-from-prompt", // ផ្ទៀងផ្ទាត់ URL ជាមួយ backend បង
        method: "POST",
        body,
      }),
    }),


// ៣. ប្តូរ Role សមាជិក (Admin/Member)
    updateMemberRole: builder.mutation<void, { workspaceId: number; memberId: number; role: string }>({
      query: ({ workspaceId, memberId, role }) => ({
        url: `api/v1/workspaces/${workspaceId}/members/${memberId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (result, error, { workspaceId }) => [{ type: "Members", id: workspaceId }],
    }),

    // ៤. លុបសមាជិកចេញពី Workspace (Trash Icon)
    removeMember: builder.mutation<void, { workspaceId: number; memberId: number }>({
      query: ({ workspaceId, memberId }) => ({
        url: `api/v1/workspaces/${workspaceId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { workspaceId }) => [{ type: "Members", id: workspaceId }],
    }),

  }),
  overrideExisting: true,
});

export const {
  useCreateApiSchemeMutation,
  useGetApiSchemesByFolderQuery,
  useGetApiSchemeByIdQuery,
  useDeleteApiSchemeMutation,
  useUpdateApiSchemeMutation,
  useGenerateAiMockMutation,
  usePreviewSchemaFromFileMutation,
  useCreateSchemaFromFileMutation,
  useGenerateSchemaFromPromptMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} = apiSchemeApi;
