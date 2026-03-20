import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OptionType = {
  value: string;
  label: string;
};

// Define the initial state
interface EventsState {
  search: string;
  page: number;
  selectedCategory: OptionType | null; // Filter by category
  selectedLocation: OptionType | null; // Filter by location
  selectedEventType: OptionType | null; // Filter by event type
}

const initialState: EventsState = {
  search: "",
  page: 1,
  selectedCategory: null,
  selectedLocation: null,
  selectedEventType: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1; // Reset page when search changes
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<OptionType | null>) => {
      state.selectedCategory = action.payload;
      state.page = 1; // Reset page when category changes
    },
    setSelectedLocation: (state, action: PayloadAction<OptionType | null>) => {
      state.selectedLocation = action.payload;
      state.page = 1; // Reset page when location changes
    },
    setSelectedEventType: (state, action: PayloadAction<OptionType | null>) => {
      state.selectedEventType = action.payload;
      state.page = 1; // Reset page when event type changes
    },
  },
});

export const {
  setSearch,
  setPage,
  setSelectedCategory,
  setSelectedLocation,
  setSelectedEventType,
} = eventsSlice.actions;

export default eventsSlice.reducer;
