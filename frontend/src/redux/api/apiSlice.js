import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { setBackendDown } from "../features/system/serverStatusSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

const baseQueryWithServerCheck = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    // FETCH_ERROR happens when the server is down or unreachable (Failed to fetch)
    if (
      status === "FETCH_ERROR" ||
      status === "PARSING_ERROR" ||
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504
    ) {
      api.dispatch(setBackendDown(true));
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithServerCheck,
  tagTypes: ["Product", "Order", "User", "Category", "Location"],
  endpoints: () => ({}),
});
