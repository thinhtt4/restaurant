/* eslint-disable @typescript-eslint/no-explicit-any */
// blogApi.ts
import { baseApi } from "./baseApi";
import type { BlogResponse, BlogRequest, BlogPageResponse } from "@/types/blog.type";

export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBlogs: builder.query<
            BlogPageResponse,
            { keyword?: string; page?: number; size?: number; sort?: string } | void
        >({
            query: (params = { page: 1, size: 5 }) => {
                const { keyword = "", page = 1, size = 5, sort } = params as any;
                const sp = new URLSearchParams();
                if (keyword) sp.append("keyword", keyword);
                if (sort) sp.append("sort", sort);
                sp.append("page", String(page));
                sp.append("size", String(size));
                return `/blogs?${sp.toString()}`;
            },
        }),

        getBlogById: builder.query<BlogResponse, number>({
            query: (id) => `/blogs/${id}`,
            transformResponse: (response: { data: BlogResponse }) => response.data,
        }),

        createBlog: builder.mutation<BlogResponse, BlogRequest>({
            query: (body) => ({
                url: "/blogs",
                method: "POST",
                body,
            }),
            transformResponse: (response: { data: BlogResponse }) => response.data,
        }),

        updateBlog: builder.mutation<BlogResponse, { id: number; body: BlogRequest }>({
            query: ({ id, body }) => ({
                url: `/blogs/${id}`,
                method: "PUT",
                body,
            }),
        }),

        deleteBlog: builder.mutation<void, number>({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetBlogByIdQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogApi;
