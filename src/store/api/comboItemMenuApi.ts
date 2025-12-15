import type { ComboItem, ComboItemResponse } from "@/types/combo.type";
import { baseApi } from "./baseApi";

import type { APIResponse } from "@/types/response.type";
import type { MenuItem } from "@/types/menuItem.type";


export const comboItemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy tất cả menu item (cho dropdown khi thêm combo item)
    getAllMenuItem: builder.query<APIResponse<MenuItem[]>, void>({
      query: () => "/comboItem/allComboMenuItem",
      providesTags: [{ type: "ComboItem", id: "LIST" }],
    }),

    // Lấy tất cả combo item theo comboId
    getComboItemsByComboId: builder.query<APIResponse<ComboItemResponse[]>, number>({
      query: (comboId) => `/comboItem/getAll/${comboId}`,
      providesTags: (result) =>
        result
          ? [
            ...result.data.map((item) => ({ type: "ComboItem" as const, id: item.comboItemId })),
            { type: "ComboItem", id: "LIST" },
          ]
          : [{ type: "ComboItem", id: "LIST" }],
    }),

    // Thêm combo item (POST list)
    addComboItem: builder.mutation<APIResponse<ComboItemResponse[]>, ComboItem[]>({
      query: (body) => ({ url: "/comboItem/create", method: "POST", body }),
      invalidatesTags: [{ type: "ComboItem", id: "LIST" }],
    }),

    // Cập nhật combo item (PATCH 1 item)
    updateComboItem: builder.mutation<APIResponse<ComboItemResponse[]>, ComboItem>({
      query: (body) => ({ url: "/comboItem/update", method: "PATCH", body }),
      invalidatesTags: (_, __, arg) => [{ type: "ComboItem", id: arg.comboItemId }],
    }),

    // Xóa 1 combo item
    deleteComboItem: builder.mutation<APIResponse<ComboItemResponse[]>, number>({
      query: (comboItemId) => ({ url: `/comboItem/delete/${comboItemId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "ComboItem", id: "LIST" }],
    }),

    // Xóa tất cả combo item của 1 combo
    deleteAllComboItems: builder.mutation<APIResponse<boolean>, number>({
      query: (comboId) => ({ url: `/comboItem/deleteAll/${comboId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "ComboItem", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllMenuItemQuery,
  useGetComboItemsByComboIdQuery,
  useAddComboItemMutation,
  useUpdateComboItemMutation,
  useDeleteComboItemMutation,
  useDeleteAllComboItemsMutation,
} = comboItemApi;
