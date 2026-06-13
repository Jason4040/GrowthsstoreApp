import { apiSlice } from "./apiSlice";
import { MESSAGES_URL } from "../constants";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (userId) => ({
        url: userId ? `${MESSAGES_URL}/${userId}` : MESSAGES_URL,
      }),
      // We don't cache too long since it's a polling chat
      keepUnusedDataFor: 1,
    }),

    sendMessage: builder.mutation({
      query: (message) => ({
        url: MESSAGES_URL,
        method: "POST",
        body: message,
      }),
    }),

    getChatUsers: builder.query({
      query: () => ({
        url: `${MESSAGES_URL}/chats/users`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetChatUsersQuery,
} = messageApiSlice;
