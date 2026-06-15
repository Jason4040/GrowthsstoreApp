import { createSlice } from "@reduxjs/toolkit";

const getInitialUserInfo = () => {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return null;
  try {
    return JSON.parse(userInfo);
  } catch (e) {
    console.error("Failed to parse userInfo from localStorage:", e);
    localStorage.removeItem("userInfo");
    return null;
  }
};

const initialState = {
  userInfo: getInitialUserInfo(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime);
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
