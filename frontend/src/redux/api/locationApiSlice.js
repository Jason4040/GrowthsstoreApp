import { apiSlice } from "./apiSlice";
import { LOCATION_URL } from "../constants";

export const locationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query({
      query: ({ country, level, parent }) => {
        const params = new URLSearchParams({ country, level });
        if (parent) params.set("parent", parent);
        return `${LOCATION_URL}?${params.toString()}`;
      },
      providesTags: [{ type: "Location", id: "LIST" }],
    }),

    createLocation: builder.mutation({
      query: (newLocation) => ({
        url: `${LOCATION_URL}`,
        method: "POST",
        body: newLocation,
      }),
      invalidatesTags: [{ type: "Location", id: "LIST" }],
    }),

    updateLocation: builder.mutation({
      query: ({ locationId, name }) => ({
        url: `${LOCATION_URL}/${locationId}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: [{ type: "Location", id: "LIST" }],
    }),

    deleteLocation: builder.mutation({
      query: (locationId) => ({
        url: `${LOCATION_URL}/${locationId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Location", id: "LIST" }],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationApiSlice;
