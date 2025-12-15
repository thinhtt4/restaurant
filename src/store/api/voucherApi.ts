import { baseApi } from "./baseApi";
import type { APIResponse } from "@/types/response.type";
import type { Voucher } from "@/types/voucher.type";

export const voucherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================================
    // GET ALL VOUCHERS (with filters)
    // ================================
    getAllVoucher: builder.query<
      APIResponse<{ data: Voucher[]; totalPages: number }>,
      {
        page: number;
        pageSize: number;
        type?: string;
        active?: boolean;
        code?: string;
        applyType?: string;
      }
    >({
      query: ({ page, pageSize, type, active, code, applyType }) => {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });

        if (type) params.append("type", type);
        if (active !== undefined) params.append("active", String(active));
        if (code) params.append("code", code);
        if (applyType) params.append("applyType", applyType);

        return `/voucher/getAll?${params.toString()}`;
      },

      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map((item) => ({
                type: "Voucher" as const,
                id: item.id,
              })),
              { type: "Voucher", id: "LIST" },
            ]
          : [{ type: "Voucher", id: "LIST" }],
    }),

    // ================================
    // GET VOUCHER BY USER
    // ================================
    getVoucherByUser: builder.query<Voucher[], void>({
      query: () => `/voucher/voucher-filter`,
      providesTags: [{ type: "Voucher", id: "LIST" }],
    }),

    // ================================
    // CREATE
    // ================================
    createVoucher: builder.mutation<APIResponse<Voucher>, Voucher>({
      query: (body) => ({
        url: "/voucher/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Voucher", id: "LIST" }],
    }),

    // ================================
    // UPDATE
    // ================================
    updateVoucher: builder.mutation<APIResponse<Voucher>, Voucher>({
      query: (body) => ({
        url: "/voucher/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, arg) => [
        { type: "Voucher", id: arg.id },
        { type: "Voucher", id: "LIST" }, // <- giúp reload list nếu đang ở danh sách
      ],
    }),

    // ================================
    // TOGGLE ACTIVE
    // ================================
    toggleVoucherActive: builder.mutation<APIResponse<Voucher>, number>({
      query: (id) => ({
        url: `/voucher/toggle-active/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Voucher", id },
        { type: "Voucher", id: "LIST" },
      ],
    }),

    // ================================
    // DELETE
    // ================================
    deleteVoucher: builder.mutation<APIResponse<Boolean>, number>({
      query: (id) => ({
        url: `/voucher/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Voucher", id: "LIST" }],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllVoucherQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useToggleVoucherActiveMutation,
  useDeleteVoucherMutation,
  useGetVoucherByUserQuery,
} = voucherApi;
