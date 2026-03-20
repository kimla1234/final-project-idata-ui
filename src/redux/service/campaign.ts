// @/redux/service/campaign.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { normPlovApi } from "@/redux/api";

export const campaignApi = normPlovApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaignsByWorkspace: builder.query<any[], number>({
      query: (workspaceId) => `api/v1/campaigns/workspace/${workspaceId}`,
      // ប្រើជា Function បែបនេះដើម្បីបញ្ចៀស String mismatch error
      providesTags: (result) => 
        result ? [...result.map(({ id }) => ({ type: 'Campaigns' as const, id })), 'Campaigns'] : ['Campaigns'],
    }),

    startCampaign: builder.mutation<string, any>({
      query: (body) => ({
        url: `api/v1/campaigns/send`,
        method: "POST",
        body: body,
        responseHandler: (response: Response) => response.text(),
      }),
      // ប្រើជា Function ត្រឡប់មកវិញនូវ Array
      invalidatesTags: (result, error) => error ? [] : ["Campaigns"],
    }),
  }),
  overrideExisting: true,
});

export const { useStartCampaignMutation,useGetCampaignsByWorkspaceQuery } = campaignApi;