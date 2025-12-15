/* eslint-disable @typescript-eslint/no-explicit-any */
// likeApi.ts
import { baseApi } from "./baseApi";

export const likeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Toggle like/unlike
    toggleLike: builder.mutation<boolean, number>({
      query: (blogId) => ({
        url: `/blogs/${blogId}/likes`,
        method: "POST",
      }),
      transformResponse: (response: any) => response.data,

      // Optimistic update - CÁCH 1: Đơn giản hơn
      async onQueryStarted(blogId, { dispatch, queryFulfilled }) {
        // Lấy state hiện tại từ cache
        let wasLiked = false;

        // Patch trạng thái like
        const patchStatus = dispatch(
          likeApi.util.updateQueryData("getLikeStatus", blogId, (draft) => {
            wasLiked = draft;
            return !draft;
          })
        );

        // Patch số lượng like
        const patchCount = dispatch(
          likeApi.util.updateQueryData("getLikeCount", blogId, (draft) => {
            return draft + (wasLiked ? -1 : 1);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchStatus.undo();
          patchCount.undo();
        }
      },
    }),

    // Lấy trạng thái like (chỉ trả về boolean)
    getLikeStatus: builder.query<boolean, number>({
      query: (blogId) => `/blogs/${blogId}/likes/status`,
      transformResponse: (response: any) => {
        return response.data === true;
      },
    }),

    // Lấy số lượng like
    getLikeCount: builder.query<number, number>({
      query: (blogId) => `/blogs/${blogId}/likes/count`,
      transformResponse: (response: any) => {
        return Number(response.data) || 0;
      },
    }),
  }),
});

export const {
  useToggleLikeMutation,
  useGetLikeStatusQuery,
  useGetLikeCountQuery,
} = likeApi;
