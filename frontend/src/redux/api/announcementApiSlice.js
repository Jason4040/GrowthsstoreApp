import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

const ANNOUNCEMENT_URL = `${BASE_URL}/api/announcements`;

export const announcementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: () => ({
        url: ANNOUNCEMENT_URL,
      }),
      providesTags: ["Announcement"],
    }),
    createAnnouncement: builder.mutation({
      query: (data) => ({
        url: ANNOUNCEMENT_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Announcement"],
    }),
    updateAnnouncement: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${ANNOUNCEMENT_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Announcement"],
    }),
    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `${ANNOUNCEMENT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcement"],
    }),
  }),
});

export const { 
  useGetAnnouncementsQuery, 
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation
} = announcementApiSlice;
