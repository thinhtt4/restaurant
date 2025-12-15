import { baseApi } from "./baseApi";
import type { APIResponse } from "@/types/response.type";
import type { MenuCategory } from "@/types/menuItem.type";
import type { GetMenuCategoriesParams, PaginatedResponse } from "@/types/menuCategory.type";


export const tableAreaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMenuCategories: builder.query<PaginatedResponse<MenuCategory>, GetMenuCategoriesParams>({
            query: (params) => ({
                url: '/menu-categories',
                params: {
                    page: params.page,
                    size: params.size,
                    search: params.search,
                    type: params.type,
                }
            }),
            transformResponse: (response: APIResponse<PaginatedResponse<MenuCategory>>) => response.data,
        }),
        createMenuCategory: builder.mutation<MenuCategory, MenuCategory>({
            query: (body) => ({
                url: "/menu-categories",
                method: "POST",
                body,
            }),
            transformResponse: (resp: APIResponse<MenuCategory>) => resp.data,
        }),
        updateMenuCategory: builder.mutation<MenuCategory, { id: number; body: MenuCategory }>({
            query: ({ id, body }) => ({
                url: `/menu-categories/${id}`,
                method: "PUT",
                body,
            }),
            transformResponse: (resp: APIResponse<MenuCategory>) => resp.data,
        }),
        deleteMenuCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `/menu-categories/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetMenuCategoriesQuery,
    useCreateMenuCategoryMutation,
    useUpdateMenuCategoryMutation,
    useDeleteMenuCategoryMutation,
} = tableAreaApi;