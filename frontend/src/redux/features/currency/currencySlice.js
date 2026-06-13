import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCurrency: localStorage.getItem("currency") || "USD",
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currentCurrency = action.payload;
      localStorage.setItem("currency", action.payload);
    },
  },
});

export const { setCurrency } = currencySlice.actions;

export default currencySlice.reducer;
