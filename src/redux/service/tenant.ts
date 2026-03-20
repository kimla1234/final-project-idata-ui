import { normPlovApi } from "@/redux/api";
import { TenantRequest, TenantResponse } from "@/types/tenant";

export const tenantApi = normPlovApi.injectEndpoints({
  endpoints: (builder) => ({
    // ១. បង្កើត Tenant ថ្មីក្នុង Folder (POST /api/v1/folders/{folderId}/tenants)
    createTenant: builder.mutation<
      TenantResponse,
      { folderId: number; body: TenantRequest }
    >({
      query: ({ folderId, body }) => ({
        url: `api/v1/folders/${folderId}/schema`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["schema"],
    }),

    // ២. ទាញយកបញ្ជី Tenant តាម Folder (GET /api/v1/folders/{folderId}/tenants)
    getTenantsByFolder: builder.query<TenantResponse[], number>({
      query: (folderId) => `api/v1/folders/${folderId}/schema`,
      providesTags: ["schema"],
    }),

    deleteMultipleTenants: builder.mutation<void, number[]>({
      query: (ids) => ({
        url: `api/v1/tenants/bulk-delete`,
        method: "DELETE",
        body: ids,
      }),
      invalidatesTags: ["schema"],
    }),

    // ៤. កែ Tags ច្រើនក្នុងពេលតែមួយ
    updateMultipleTenantsTags: builder.mutation<
      void,
      { ids: number[]; tags: string[] }
    >({
      query: (body) => ({
        url: `api/v1/tenants/bulk-tags`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["schema"],
    }),


    getTenantsByWorkspace: builder.query<TenantResponse[], number>({
      query: (workspaceId) => `api/v1/workspaces/${workspaceId}/schema`,
      providesTags: ["schema"],
    }),


  }),
});

// Export hooks សម្រាប់យកទៅប្រើក្នុង Components
export const {
  useCreateTenantMutation,
  useGetTenantsByFolderQuery,
  useDeleteMultipleTenantsMutation,
  useUpdateMultipleTenantsTagsMutation,
  useGetTenantsByWorkspaceQuery
} = tenantApi;
