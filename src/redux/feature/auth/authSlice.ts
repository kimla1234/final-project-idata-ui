import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

type initialStateType = {
  token: string | null; 
  isAuthenticated: boolean;
  user: UserType;
};

type UserType = {
  email: string;
  name?: string;
  profileImage?: string;
} | null;

const initialState: initialStateType = {
  token: null,
  user: null,

  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      console.log("AuthSlice Access Token Set in Redux:", action.payload); // Log token
      state.token = action.payload;
      state.isAuthenticated = true;

    },

    setUser(state, action: PayloadAction<UserType>) {
      state.user = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },

  // reducers: {
  //     setAccessToken(state, action: PayloadAction<string> ) {
  //         console.log("Access Token Set in Redux:", action.payload);
  //         state.token = action.payload;
  //     },
  // },
});

export const { setAccessToken, setAuthenticated,setUser } = authSlice.actions;
export default authSlice.reducer;

// customize selector for easy component access
export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthentication = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.auth.user;
