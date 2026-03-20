import { normPlovApi } from "@/redux/api";
import {
  WorkspaceRequest,
  WorkspaceResponse,
  WorkspaceStatsResponse,
} from "@/types/workspace";

export const workspaceApi = normPlovApi.injectEndpoints({
  endpoints: (builder) => ({
    createWorkspace: builder.mutation<
      WorkspaceResponse,
      { body: WorkspaceRequest }
    >({
      query: ({ body }) => ({
        url: `api/v1/workspaces`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Workspaces"],
    }),

    getMyWorkspaces: builder.query<WorkspaceResponse[], void>({
      query: () => `api/v1/workspaces/my`,
      providesTags: ["Workspaces"],
    }),

    getWorkspaceSummary: builder.query<WorkspaceStatsResponse, number>({
      query: (workspaceId) => `api/v1/workspaces/${workspaceId}/summary`,
      providesTags: (result, error, id) => [{ type: "Workspaces", id }],
    }),

    // ឧទាហរណ៍ក្នុង Redux Mutation
    updateWorkspace: builder.mutation<
      WorkspaceResponse,
      { id: number; name: string; description?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `api/v1/workspaces/${id}`,
        method: "PUT",
        body: body, // បញ្ជូន { name, description }
      }),
      invalidatesTags: ["Workspaces"],
    }),

    deleteWorkspace: builder.mutation<void, { id: number; password: string }>({
      query: ({ id, password }) => ({
        url: `api/v1/workspaces/${id}`,
        method: "DELETE",
        body: { password }, // បញ្ជូន password ទៅក្នុង request body តាម Backend DTO
      }),
      invalidatesTags: ["Workspaces"],
    }),

    // ក្នុង redux/service/workspace.ts
    inviteMember: builder.mutation<
      void,
      { workspaceId: number; body: { email: string; role: string } }
    >({
      query: ({ workspaceId, body }) => ({
        url: `api/v1/workspaces/${workspaceId}/invite`, // ត្រូវឱ្យត្រូវជាមួយ @PostMapping("/{id}/invite")
        method: "POST",
        body: body,
      }),
      // បន្ថែម invalidatesTags ដើម្បីឱ្យវា Refresh បញ្ជីសមាជិកអូតូ
      invalidatesTags: ["Workspaces"],
    }),

    getWorkspaceMembers: builder.query<any[], number | null>({
      query: (workspaceId) => `api/v1/workspaces/${workspaceId}/members`,
      providesTags: ["Members"], // ជួយឱ្យវា refresh ទិន្នន័យពេលយើង Invite នរណាម្នាក់រួច
    }),

    // បន្ថែម endpoint សម្រាប់ Update Member Role
    updateMemberRole: builder.mutation<
      void,
      { workspaceId: number; memberId: number; body: { role: string } }
    >({
      query: ({ workspaceId, memberId, body }) => ({
        url: `api/v1/workspaces/${workspaceId}/members/${memberId}/role`,
        method: "PATCH",
        body: body,
      }),
      // បន្ទាប់ពី Update ជោគជ័យ ឱ្យវាទាញទិន្នន័យសមាជិកមកថ្មី (Refresh List)
      invalidatesTags: ["Members"],
    }),

    // បន្ថែម joinWorkspace ចូលក្នុង endpoints
    joinWorkspace: builder.mutation<void, number>({
      query: (workspaceId) => ({
        url: `api/v1/workspaces/${workspaceId}/join`,
        method: "POST",
      }),
      // ពេល Join ជោគជ័យ ឱ្យវា Refresh ទាំងបញ្ជី Workspace និងបញ្ជីសមាជិក
      invalidatesTags: ["Workspaces", "Members"],
    }),

    revokeInvitation: builder.mutation<
      void,
      { workspaceId: number; email: string }
    >({
      query: ({ workspaceId, email }) => ({
        url: `api/v1/workspaces/${workspaceId}/invitations`,
        method: "DELETE",
        params: { email }, // បញ្ជូន email ជា query string (?email=...)
      }),
      invalidatesTags: ["Members"], // បញ្ជាឱ្យវាទាញបញ្ជីសមាជិកថ្មីភ្លាមៗក្រោយលុប
    }),
  }),
  overrideExisting: true,
});

// Export hooks សម្រាប់យកទៅប្រើក្នុង Components
export const {
  useCreateWorkspaceMutation,
  useGetMyWorkspacesQuery,
  useGetWorkspaceSummaryQuery,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useInviteMemberMutation,
  useGetWorkspaceMembersQuery,
  useUpdateMemberRoleMutation,
  useJoinWorkspaceMutation,
  useRevokeInvitationMutation,
} = workspaceApi;
