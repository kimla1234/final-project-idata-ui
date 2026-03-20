import { normPlovApi } from "@/redux/api";
import { TemplateRequest, TemplateResponse } from "@/types/template";

export const templateApi = normPlovApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // ១. បង្កើត Template ថ្មីក្នុង Workspace (POST /api/v1/workspaces/{workspaceId}/templates)
    createTemplate: builder.mutation<
      TemplateResponse,
      { workspaceId: number; body: TemplateRequest }
    >({
      query: ({ workspaceId, body }) => ({
        url: `api/v1/workspaces/${workspaceId}/templates`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Templates"],
    }),

    // ២. ទាញយកបញ្ជី Template ទាំងអស់ក្នុង Workspace (GET /api/v1/workspaces/{workspaceId}/templates)
    getTemplatesByWorkspace: builder.query<TemplateResponse[], number>({
      query: (workspaceId) => `api/v1/workspaces/${workspaceId}/templates`,
      providesTags: ["Templates"],
    }),

    // ៣. មើល Template លម្អិតតាម ID (GET /api/v1/templates/{templateId})
    getTemplateById: builder.query<TemplateResponse, number>({
      query: (templateId) => `api/v1/templates/${templateId}`,
      providesTags: (result, error, arg) => [{ type: "Templates", id: arg }],
    }),

  }),
});

// Export hooks សម្រាប់យកទៅប្រើក្នុង UI Components
export const {
  useCreateTemplateMutation,
  useGetTemplatesByWorkspaceQuery,
  useGetTemplateByIdQuery,
} = templateApi;