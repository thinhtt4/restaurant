import type { APIResponse } from "@/types/response.type";
import { baseApi } from "./baseApi";
import type { ChatMessage } from "@/types/chat";
import type { User } from "@/types/user.type";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatHistory: builder.query<APIResponse<ChatMessage[]>, string>({
      query: (recipientUsername) => ({
        url: `/api/v1/chat/history/${recipientUsername}`,
        method: "GET",
      }),

      providesTags: (_result, _error, recipientUsername) => [
        { type: "Chat", id: recipientUsername },
      ],
    }),

    getUserWhoHaveChatted: builder.query<APIResponse<User[]>, void>({
      query: () => ({
        url: `/api/v1/chat/users`,
        method: "GET",
      }),
      providesTags: [{ type: "Chat", id: "USER_LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetChatHistoryQuery, useGetUserWhoHaveChattedQuery } =
  chatApi;
