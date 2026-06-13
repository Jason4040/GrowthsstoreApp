import { apiSlice } from "./apiSlice";
import { FAQ_URL } from "../constants";

export const faqApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublicFAQs: builder.query({
      query: () => ({
        url: `${FAQ_URL}/public`,
      }),
      providesTags: ["FAQ"],
      keepUnusedDataFor: 5,
    }),

    getMyFAQs: builder.query({
      query: () => ({
        url: `${FAQ_URL}/my-questions`,
      }),
      providesTags: ["FAQ"],
      keepUnusedDataFor: 5,
    }),

    getAdminFAQs: builder.query({
      query: () => ({
        url: `${FAQ_URL}/admin/questions`,
      }),
      providesTags: ["FAQ"],
      keepUnusedDataFor: 5,
    }),

    askQuestion: builder.mutation({
      query: (data) => ({
        url: `${FAQ_URL}/ask`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FAQ"],
    }),

    answerQuestion: builder.mutation({
      query: ({ id, answer }) => ({
        url: `${FAQ_URL}/${id}/answer`,
        method: "PUT",
        body: { answer },
      }),
      invalidatesTags: ["FAQ"],
    }),
  }),
});

export const {
  useGetPublicFAQsQuery,
  useGetMyFAQsQuery,
  useGetAdminFAQsQuery,
  useAskQuestionMutation,
  useAnswerQuestionMutation,
} = faqApiSlice;
