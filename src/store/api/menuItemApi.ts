import { baseApi } from "./baseApi";
import type { APIResponse } from "@/types/response.type";
import type {
  MenuItem,
  MenuCategory,
  PaginatedResponse,
  GetMenuItemsParams,
} from "@/types/menuItem.type";

interface MenuItemRequest {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  active: boolean;
  imageUrl?: string;
}
export const menuItemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMenuItems: builder.query<
      PaginatedResponse<MenuItem>,
      GetMenuItemsParams
    >({
      query: (params) => ({
        url: "/menu-items",
        params: {
          page: params.page,
          size: params.size,
          search: params.search,
          priceFrom: params.priceFrom,
          priceTo: params.priceTo,
          categoryId: params.categoryId,
          active: params.active,
        },
      }),
      transformResponse: (response: APIResponse<PaginatedResponse<MenuItem>>) =>
        response.data,
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({
              type: "MenuItem" as const,
              id,
            })),
            { type: "MenuItem", id: "LIST" },
          ]
          : [{ type: "MenuItem", id: "LIST" }],
    }),

    createMenuItem: builder.mutation<APIResponse<MenuItem>, MenuItemRequest>({
      query: (data) => ({
        url: "/menu-items",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "MenuItem", id: "LIST" },
        { type: "ComboItem", id: "LIST" },
      ],
    }),

    updateMenuItem: builder.mutation<
      APIResponse<MenuItem>,
      { id: number; data: MenuItemRequest }
    >({
      query: ({ id, data }) => ({
        url: `/menu-items/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "MenuItem", id },
        { type: "ComboItem", id: "LIST" },
      ],
    }),

    deleteMenuItem: builder.mutation<APIResponse<void>, number>({
      query: (id) => ({
        url: `/menu-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "MenuItem", id: "LIST" },
        { type: "ComboItem", id: "LIST" },
      ],
    }),

    getCategories: builder.query<MenuCategory[], void>({
      query: () => "/menu-categories",
      transformResponse: (response: APIResponse<MenuCategory[]>) =>
        response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetCategoriesQuery,
  useLazyGetMenuItemsQuery,
} = menuItemApi;
