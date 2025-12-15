/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import type { APIResponse } from "@/types/response.type";
import type {
  CreateOrder,
  ListOrderPageResponse,
  OrderResponse,
  TableFilter,
  TableFlag,
  TableHoldRequest,
  TableHoldResponse,
  UpdateMenuOrderRequest,
} from "@/types/booking.type";
import type { PaginatedResponse } from "@/types/menuItem.type";
import type { Table } from "@/types/table.type";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //order online
    createOrder: builder.mutation<APIResponse<OrderResponse>, CreateOrder>({
      query: (orderData) => ({
        url: "/create-order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: [{ type: "ORDER", id: "LIST" }],
    }),

    createNowOrder: builder.mutation<APIResponse<OrderResponse>, CreateOrder>({
      query: (orderData) => ({
        url: "/create-now-order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: [{ type: "ORDER", id: "LIST" }],
    }),

    getMaxGuest: builder.query<APIResponse<number>, void>({
      query: () => ({
        url: "/max-guest",
        method: "GET",
      }),
    }),

    getOrderDetail: builder.query<APIResponse<OrderResponse>, number>({
      query: (orderId) => ({
        url: `/order-detail/${orderId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, orderId) => [
        { type: "ORDER", id: orderId },
      ],
    }),

    canceledOrder: builder.mutation<APIResponse<void>, number>({
      query: (orderId) => ({
        url: `/cancel-order/${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, orderId) => [
        { type: "ORDER", id: "LIST" },
        { type: "ORDER", id: orderId },
      ],
    }),

    // //cai nay dung cho order sap toi
    // canceledOrder1: builder.mutation<APIResponse<void>, number>({
    //   query: (orderId) => ({
    //     url: `/cancel-order1/${orderId}`,
    //     method: "POST",
    //   }),
    //   invalidatesTags: (result, error, orderId) => [
    //     { type: "ORDER", id: "LIST" },
    //     { type: "ORDER", id: orderId },
    //   ],
    // }),

    checkInOrder: builder.mutation<APIResponse<OrderResponse>, number>({
      query: (orderId) => ({
        url: `/order-checkIn/${orderId}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, orderId) => [
        { type: "ORDER", id: "LIST" },
        { type: "ORDER", id: orderId },
      ],
    }),

    // get list order by user
    getListOrder: builder.query<
      APIResponse<ListOrderPageResponse>,
      {
        keyword?: string;
        email?: string;
        phone?: string;
        status?: string;
        minPrice?: string;
        maxPrice?: string;
        page?: number;
        size?: number;
        sort?: string;
      } | void
    >({
      query: (params = { page: 1, size: 5 }) => {
        const { keyword, status, minPrice, maxPrice, page, size, sort } =
          params as any;

        const url = new URLSearchParams();
        if (keyword) url.append("keyword", keyword);
        if (size) url.append("size", size);
        if (sort) url.append("sort", sort);
        if (page) url.append("page", page);
        if (status) url.append("status", status);
        if (minPrice) url.append("minPrice", minPrice);
        if (maxPrice) url.append("maxPrice", maxPrice);

        return `/list-order?${url.toString()}`;
      },

      providesTags: [
        { type: "ORDER", id: "LIST" },
        { type: "LIST_ORDER_EMPTY", id: "LIST" },
      ],
    }),
    // get ALL orders (admin - không phân biệt user)
    getListAllOrder: builder.query<
      APIResponse<ListOrderPageResponse>,
      {
        keyword?: string;
        status?: string;
        minPrice?: string;
        maxPrice?: string;
        fromReservationTime?: string; // ISO string
        toReservationTime?: string; // ISO string
        page?: number;
        size?: number;
        sort?: string;
      } | void
    >({
      query: (params = { page: 1, size: 10 }) => {
        const {
          keyword,
          status,
          minPrice,
          maxPrice,
          fromReservationTime,
          toReservationTime,
          page,
          size,
          sort,
        } = params as any;

        const url = new URLSearchParams();
        if (keyword) url.append("keyword", keyword);
        if (status) url.append("status", status);
        if (minPrice) url.append("minPrice", minPrice);
        if (maxPrice) url.append("maxPrice", maxPrice);
        if (fromReservationTime)
          url.append("fromReservationTime", fromReservationTime);
        if (toReservationTime)
          url.append("toReservationTime", toReservationTime);
        if (page) url.append("page", page.toString());
        if (size) url.append("size", size.toString());
        if (sort) url.append("sort", sort);

        return `/list-all-order?${url.toString()}`;
      },
      providesTags: (result) =>
        result?.data.data
          ? [
              { type: "ORDER", id: "LIST" },
              // optionally provide each order item tag so RTKQ can invalidate individually
              ...result.data.data.map((o: any) => ({
                type: "ORDER" as const,
                id: o.id,
              })),
            ]
          : [{ type: "ORDER", id: "LIST" }],
    }),

    updateMenuOrder: builder.mutation<
      APIResponse<OrderResponse>,
      { orderId: number; menuItem: UpdateMenuOrderRequest[] }
    >({
      query: ({ orderId, menuItem }) => ({
        url: `/update-menu-order/${orderId}`,
        method: "PUT",
        body: { menuItem },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "ORDER", id: "LIST" },
        { type: "ORDER", id: orderId },
      ],
    }),

    getCurrentOrderOfTable: builder.query<OrderResponse, number>({
      query: (tableId) => ({
        url: `/table/${tableId}/current-order`,
        method: "GET",
      }),
      transformResponse: (resp: APIResponse<OrderResponse>) => resp.data,
      providesTags: (result) =>
        result
          ? [
              { type: "ORDER", id: "LIST" },
              { type: "ORDER", id: result.orderId },
            ]
          : [{ type: "ORDER", id: "LIST" }],
    }),

    selectMenuOrder: builder.mutation<
      APIResponse<OrderResponse>,
      {
        orderId: number;
        menuItem: UpdateMenuOrderRequest[];
        voucherId?: number;
      }
    >({
      query: ({ orderId, menuItem, voucherId }) => ({
        url: `/select-menu-order/${orderId}`,
        method: "PUT",
        body: { menuItem, voucherId },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "ORDER", id: "LIST" },
        { type: "ORDER", id: orderId },
      ],
    }),

    getListTableEmpty: builder.query<PaginatedResponse<Table>, TableFilter>({
      query: (params) => ({
        url: "/list-table-empty",
        params: {
          page: params.page,
          size: 6,
          keyword: params.keyword,
          guestFrom: params.guestFrom,
          guestTo: params.guestTo,
          areaId: params.areaId,
          status: params.status,
          guestCount: params.guestCount,
          reservationTime: params.reservationTime,
        },
      }),
      providesTags: () => [{ type: "LIST_ORDER_EMPTY", id: "LIST" }],
    }),

    holdTable: builder.mutation<
      APIResponse<TableHoldResponse>,
      TableHoldRequest
    >({
      query: (param) => ({
        url: "/hold_table",
        method: "POST",
        body: param,
      }),
      invalidatesTags: [{ type: "LIST_ORDER_EMPTY", id: "LIST" }],
    }),

    createOrderWithInfo: builder.mutation<
      APIResponse<OrderResponse>,
      CreateOrder
    >({
      query: (orderData) => ({
        url: "/create-order-info",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: [
        { type: "LIST_ORDER_EMPTY", id: "LIST" },
        { type: "ORDER", id: "LIST" },
      ],
    }),

    getHoldTable: builder.query<APIResponse<number>, string>({
      query: (key) => ({
        url: `/get-ttl/${key}`,
      }),
      providesTags: () => [{ type: "LIST_ORDER_EMPTY", id: "LIST" }],
    }),
    getHoldTableOfUser: builder.query<APIResponse<TableFlag[]>, void>({
      query: () => ({
        url: `/list-order-hold`,
      }),
      providesTags: () => [{ type: "LIST_ORDER_EMPTY", id: "LIST" }],
    }),

    deleteHoldTable: builder.mutation<APIResponse<string>, string>({
      query: (holdId) => ({
        url: `/delete-hold-table/${holdId}`,
        method: "DELETE",
      }),
    }),

    orderMoreFood: builder.mutation<
      APIResponse<OrderResponse>,
      { orderId: number; menuItem: UpdateMenuOrderRequest[] }
    >({
      query: ({ orderId, menuItem }) => ({
        url: `/order-more/${orderId}`,
        method: "PUT",
        body: { menuItem },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "ORDER", id: "LIST" },
        { type: "ORDER", id: orderId },
      ],
    }),

    updateOrderStatus: builder.mutation<
      APIResponse<OrderResponse>,
      { orderId: number; status: string }
    >({
      query: ({ orderId, status }) => ({
        url: `/update-order-status/${orderId}`,
        method: "PUT",
        body: status,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "ORDER", id: "LIST" },
        { type: "ORDER", id: orderId },
      ],
    }),

    moveTable: builder.mutation<
      APIResponse<OrderResponse>,
      { orderId: number; targetTableId: number }
    >({
      query: (body) => ({
        url: "/move-table",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "ORDER", id: "LIST" },
        { type: "ORDER", id: orderId },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetListOrderQuery,
  useGetMaxGuestQuery,
  useGetOrderDetailQuery,
  useCanceledOrderMutation,
  useUpdateMenuOrderMutation,
  useGetListTableEmptyQuery,
  useHoldTableMutation,
  useCreateOrderWithInfoMutation,
  useSelectMenuOrderMutation,
  useGetHoldTableQuery,
  useGetListAllOrderQuery,
  useCreateNowOrderMutation,
  useGetHoldTableOfUserQuery,
  useDeleteHoldTableMutation,
  useGetCurrentOrderOfTableQuery,
  useCheckInOrderMutation,
  useOrderMoreFoodMutation,
  useUpdateOrderStatusMutation,
  useMoveTableMutation,
} = orderApi;
