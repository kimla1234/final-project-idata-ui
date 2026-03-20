import { normPlovApi } from "@/redux/api";
import { EventComingApiResponse } from "@/types/EventComingApiResponse";
export interface TicketType {
  id: number;
  name: string;
  price: number;
  total_quantity: number;
  sold_quantity: number
}

export interface EventData {
  id: number;
  uuid: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  image: string;
  latitude: string;  
  start_time : string ; 
  end_time:string;
  imagesEvent: string[];
  longitude: string;
  location_name: string;
  categoryName: string;
  ticketTypes: TicketType[];
  status: boolean;
  organizerId: number
}

export const eventApi = normPlovApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchEventComing: builder.query<EventComingApiResponse, void>({
      query: () => ({
        url: `api/v1/events/this-week`,
        method: "GET",
      }),
    }),

    getEvents: builder.query<EventData[], { category?: string }>({
      // Remove 'Query' from here
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.category) params.append("category", filters.category);
        return { url: `api/v1/events?${params.toString()}`, method: "GET" };
      },
    }),

    getEventsByUuid: builder.query<EventData, string>({
      query: (uuid) => ({
        url: `api/v1/events/${uuid}`,
        method: "GET",
      }),
      providesTags: (result, error, uuid) => [{ type: "Events", id: uuid }],
    }),
  }),
});

export const { useFetchEventComingQuery, useGetEventsQuery , useGetEventsByUuidQuery} = eventApi;
