import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type VerifyState = {
  email: string | null;
  reset_code: string | null;
};

const initialState: VerifyState = {
  email: null,
  reset_code: null,
};

const verifySlice = createSlice({
  name: "verify",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setResetCode: (state, action: PayloadAction<string>) => {
      state.reset_code = action.payload;
    },
  },
});

export const { setEmail, setResetCode } = verifySlice.actions;

export default verifySlice.reducer;
