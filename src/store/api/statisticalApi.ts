import { baseApi } from "./baseApi";
import type { APIResponse } from "@/types/response.type";

// Dữ liệu frontend cần cho chart
export type RevenueItem = {
  label: string; // dùng để chart hiển thị, vd: "01", "02", "15"
  revenue: number;
  orderCount: number;
};

// Dữ liệu backend trả về
export type RevenueResponseBackend = {
  date: string; // yyyy-MM-dd
  revenue: number;
  orderCount: number;
};

export type InvoiceStatusResponseBackend = {
  name: string;  // ORDERING, SUCCESS, FAILED, CANCELLED, DEPOSITED_SUCCESS.
  value: number; // %
  count: number;
};


export type StatResponseBackend = number[];

export const statisticalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRevenue: builder.query<
      APIResponse<RevenueResponseBackend[]>,
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => {
        const params = new URLSearchParams({ startDate, endDate });
        return `/statistical/revenue?${params.toString()}`;
      },
      transformResponse: (response: APIResponse<RevenueResponseBackend[]>) => response,
    }),

    getStat: builder.query<APIResponse<StatResponseBackend>, void>({
      query: () => `/statistical/stat`,
      transformResponse: (response: APIResponse<StatResponseBackend>) => response,
    }),


    getInvoiceStatus: builder.query<
      APIResponse<InvoiceStatusResponseBackend[]>,
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => {
        const params = new URLSearchParams({
          startDate,
          endDate,
        });
        return `/statistical/invoice?${params.toString()}`;
      },
      // transformResponse: (
      //   response: APIResponse<InvoiceStatusResponseBackend[]>
      // ) => response,
    }),

  }),
});

export const { useGetRevenueQuery, useGetStatQuery, useGetInvoiceStatusQuery, } = statisticalApi;
