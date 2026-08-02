import { createSlice } from "@reduxjs/toolkit";

const serverStatusSlice = createSlice({
  name: "serverStatus",
  initialState: {
    isBackendDown: false,
  },
  reducers: {
    setBackendDown: (state, action) => {
      state.isBackendDown = action.payload !== undefined ? action.payload : true;
    },
  },
});

export const { setBackendDown } = serverStatusSlice.actions;
export default serverStatusSlice.reducer;
