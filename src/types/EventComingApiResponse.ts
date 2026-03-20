export interface TicketType {
    id: number;
    name: string;
    price: number;
    total_quantity: number;
}

export interface EventComing {
    id: number;
    uuid: string;
    title: string;
    description: string;
    start_date: string; // ISO date string
    end_date: string;
    image: string;
    location_name: string;
    categoryName: string;
    ticketTypes: TicketType[];
}

// Response is an array of events
export type EventComingApiResponse = EventComing[];
