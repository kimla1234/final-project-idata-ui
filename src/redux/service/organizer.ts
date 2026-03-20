import {
  EventRequest,
  EventUpdateRequest,
  MyEventResponse,
  OrganizerResponse,
} from "@/types/organizer";
import { normPlovApi } from "../api";
import build from "next/dist/build";

export const userApi = normPlovApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizer: builder.query<OrganizerResponse, void>({
      query: () => ({
        url: `api/v1/organizer/my-organizer`,
        method: "GET",
      }),
      providesTags: ["OrganizerProfile"],
    }),

    getMyEvent: builder.query<MyEventResponse[], void>({
      query: () => ({
        url: `api/v1/events/my-events`,
        method: "GET",
      }),
      providesTags: ["Events"],
    }),

    // Changed to .mutation for data modification
    editEvent: builder.mutation<
      void,
      { uuid: string; body: Partial<EventUpdateRequest> }
    >({
      query: ({ uuid, body }) => ({
        url: `api/v1/events/${uuid}`,
        method: "PATCH", // or "PATCH" depending on your backend preference
        body: body,
      }),

      // This tells RTK Query to refetch 'getMyEvent' so the UI updates
      invalidatesTags: (result, error, { uuid }) => [
        { type: "Events", id: uuid }, // ធ្វើឱ្យ Update ក្នុងទំព័រ Detail ភ្លាម
        "Events", // សម្រាប់ Update ក្នុង List នៃ "my-events"
      ],
    }),

    // Create event
    // Assuming EventResponse is what your backend returns (often the created object with an ID)
    createEvent: builder.mutation<any, { body: EventRequest }>({
      query: ({ body }) => ({
        url: `api/v1/events`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Events"],
    }),


    postImage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `api/v1/media/upload-image`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["userProfile"],
    }),

    deleteEventByUuid: builder.mutation<string, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `api/v1/events/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),

    getOrganizerById: builder.query<OrganizerResponse, string>({
      query: (id) => ({
        url: `/api/v1/organizer/${id}`,
        method: "GET",
      }),
    }),

  }),
  overrideExisting: true,
});

// RTK Query automatically generates a hook based on the endpoint name
export const {
  useGetOrganizerQuery,
  useGetMyEventQuery,
  useEditEventMutation,
  useCreateEventMutation,
  usePostImageMutation,
  useGetOrganizerByIdQuery,
  useDeleteEventByUuidMutation,
} = userApi;
