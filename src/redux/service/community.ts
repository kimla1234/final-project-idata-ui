import { normPlovApi } from "../api";

// បងអាចប្រើ Type ចាស់ពី apiSchemeApi ឬកំណត់ថ្មីនៅទីនេះ
export const communityApi = normPlovApi.injectEndpoints({
  endpoints: (builder) => ({
    // ១. ទាញយក API ទាំងអស់ដែលគេបាន Publish (សម្រាប់ទំព័រ Explore/Community)

    // ក្នុង communityService.ts
    getCommunityFeed: builder.query<
      any[],
      { search?: string; page: number; size: number }
    >({
      query: ({ search, page, size }) => ({
        url: `api/v1/api-schemes/public/feed`,
        params: { search, page, size },
      }),
      // 🎯 នេះជាចំណុចសំខាន់ដើម្បីឱ្យវាតទិន្នន័យគ្នា
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs.search || "all-items";
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 0) return newItems;
        return [...currentCache, ...newItems];
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      providesTags: (result) =>
    result
      ? [
          ...result.map(({ id }: any) => ({ type: "CommunityFeed" as const, id })),
          { type: "CommunityFeed", id: "LIST" },
        ]
      : [{ type: "CommunityFeed", id: "LIST" }],
}),
    // ២. មើលព័ត៌មានលម្អិតនៃ Public API (សម្រាប់ពេលគេ Share Link ទៅអ្នកផ្សេង)
    getPublicApiDetail: builder.query<any, number>({
      query: (id) => ({
        url: `api/v1/api-schemes/public/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ApiSchemes", id }],
    }),

    // ៣. Toggle Publish Status (ប្រើ PATCH ដើម្បីប្តូរពី Private ទៅ Public ឬច្រឡំមកវិញ)
    // ចំណាំ៖ Endpoint នេះត្រូវហៅទៅ /{id}/publish ដូចដែលយើងរៀបចំក្នុង Controller
    togglePublishStatus: builder.mutation<
      void,
      { id: number; description?: string }
    >({
      query: ({ id, description }) => ({
        url: `api/v1/api-schemes/${id}/publish`,
        method: "PATCH",
        // 🎯 ប្រើ params object បែបនេះ Redux/Axios នឹង Encode ឱ្យអូតូ
        params: { description: description || "" },
      }),
      invalidatesTags: ["ApiSchemes"],
    }),

    // ៤. Fork API (ចម្លង API របស់អ្នកដទៃមកដាក់ក្នុង Folder របស់ខ្លួនឯង)
    forkApiScheme: builder.mutation<
      any,
      { originalId: number; targetFolderId: number }
    >({
      query: ({ originalId, targetFolderId }) => ({
        url: `api/v1/api-schemes/${originalId}/fork`,
        method: "POST",
        params: { targetFolderId }, // បញ្ជូនតាម Query Parameter
      }),
      invalidatesTags: ["ApiSchemes"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCommunityFeedQuery,
  useGetPublicApiDetailQuery,
  useTogglePublishStatusMutation,
  useForkApiSchemeMutation,
} = communityApi;
