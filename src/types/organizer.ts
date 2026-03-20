export interface OrganizerResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  logoImage: string;
  description: string;
  address: string;
  status: boolean;
  createdByUserUuid: string;
}

// ១. បង្កើត Type សម្រាប់ Event Response (យោងតាម JSON ដែលអ្នកផ្ដល់ឱ្យ)
export type TicketType = {
  id: number;
  name: string;
  price: number;
  total_quantity: number;
  sold_quantity: number;
};

export type MyEventResponse = {
  id: number;
  uuid: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  image: string;
  imagesEvent: string[];
  latitude: string;
  start_time:string;
  end_time:string;
  longitude: string;
  location_name: string;
  categoryName: string;
  ticketTypes: TicketType[];
  createdAt: string;
  status: boolean;
};


export interface TicketTypeUpdateRequest {
  name: string;
  price: number;
  total_quantity: number;
  is_published?: boolean; // Optional if you don't always send it
  is_display?: boolean;
}

export interface EventUpdateRequest {
  title: string;
  description?: string;
  start_date: string; // ISO string format for Date
  end_date: string;   // ISO string format for Date
  image?: string;
  seat_plan?: string;
  location_name?: string;
  latitude?: string;
  longitude?: string;
  imagesEvent?: string[];
  status: boolean;
  categoryId: number;
  ticketTypes?: TicketTypeUpdateRequest[];
}




export interface EventRequest {
  title: string;
  description: string;
  start_date: string; // ISO 8601 format
  end_date: string;   // ISO 8601 format
  image: string;
  //seat_plan: string;
  imagesEvent: string[];
  location_name: string;
  latitude: string;
  longitude: string;
  category_id: number;
  ticketTypes: TicketType[];
}




export interface OrganizerRequest {
  name: string;
  email: string;
  phoneNumber: string;
  logoImage: string;
  description: string;
  aaddress?: string;
}

