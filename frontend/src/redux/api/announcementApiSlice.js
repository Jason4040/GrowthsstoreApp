import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

const ANNOUNCEMENT_URL = `${BASE_URL}/api/announcements`;

export const announcementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncement: builder.query({
      query: () => ({
        url: ANNOUNCEMENT_URL,
      }),
      providesTags: ["Announcement"],
    }),
    updateAnnouncement: builder.mutation({
      query: (data) => ({
        url: ANNOUNCEMENT_URL,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Announcement"],
    }),
  }),
});

export const { useGetAnnouncementQuery, useUpdateAnnouncementMutation } = announcementApiSlice;
