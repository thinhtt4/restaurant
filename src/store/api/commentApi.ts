// commentApi.ts
import { baseApi } from "./baseApi";
import type {
    CommentResponse,
    CommentRequest
} from "@/types/comment.type";

// Response wrapper types
interface CommentListResponse {
    data: CommentResponse[];
}

interface SingleCommentResponse {
    data: CommentResponse;
}

interface CommentCountResponse {
    data: number;
}

export const commentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Lấy tất cả comments của 1 blog
        getCommentsByBlogId: builder.query<CommentResponse[], number>({
            query: (blogId) => `/blogs/${blogId}/comments`,
            transformResponse: (response: CommentListResponse) => response.data,
        }),

        // Lấy số lượng comments
        getCommentCount: builder.query<number, number>({
            query: (blogId) => `/blogs/${blogId}/comments/count`,
            transformResponse: (response: CommentCountResponse) => response.data,
        }),

        // Tạo comment mới
        createComment: builder.mutation<
            CommentResponse,
            { blogId: number; body: CommentRequest }
        >({
            query: ({ blogId, body }) => ({
                url: `/blogs/${blogId}/comments`,
                method: "POST",
                body,
            }),
            transformResponse: (response: SingleCommentResponse) => response.data,
        }),

        // Cập nhật comment
        updateComment: builder.mutation<
            CommentResponse,
            { blogId: number; commentId: number; body: CommentRequest }
        >({
            query: ({ blogId, commentId, body }) => ({
                url: `/blogs/${blogId}/comments/${commentId}`,
                method: "PUT",
                body,
            }),
            transformResponse: (response: SingleCommentResponse) => response.data,
        }),

        // Xóa comment
        deleteComment: builder.mutation<void, { blogId: number; commentId: number }>({
            query: ({ blogId, commentId }) => ({
                url: `/blogs/${blogId}/comments/${commentId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetCommentsByBlogIdQuery,
    useGetCommentCountQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentApi;