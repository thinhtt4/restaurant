import { baseApi } from "./baseApi";
import type { APIResponse } from "@/types/response.type";
import type { Voucher } from "@/types/voucher.type";

export interface AssignVoucherRequest {
    voucherId: number;
    comboIds: number[];
}

export const voucherComboApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Gán voucher cho một combo
        assignVoucherToCombo: builder.mutation<
            APIResponse<void>,
            { voucherId: number; comboId: number }
        >({
            query: ({ voucherId, comboId }) => ({
                url: `/voucher-combos/assign?voucherId=${voucherId}&comboId=${comboId}`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: "Voucher", id: arg.voucherId },
                { type: "Combo", id: arg.comboId },
                { type: "VoucherCombo", id: "LIST" },
            ],
        }),

        // Gán voucher cho nhiều combo
        assignVoucherToCombos: builder.mutation<
            APIResponse<void>,
            AssignVoucherRequest
        >({
            query: (body) => ({
                url: "/voucher-combos/assign-multiple",
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: "Voucher", id: arg.voucherId },
                ...arg.comboIds.map(id => ({ type: "Combo" as const, id })),
                { type: "VoucherCombo", id: "LIST" },
            ],
        }),

        // Xóa voucher khỏi combo
        removeVoucherFromCombo: builder.mutation<
            APIResponse<void>,
            { voucherId: number; comboId: number }
        >({
            query: ({ voucherId, comboId }) => ({
                url: `/voucher-combos/remove?voucherId=${voucherId}&comboId=${comboId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: "Voucher", id: arg.voucherId },
                { type: "Combo", id: arg.comboId },
                { type: "VoucherCombo", id: "LIST" },
            ],
        }),

        // Xóa tất cả combo khỏi voucher
        removeAllCombosFromVoucher: builder.mutation<APIResponse<void>, number>({
            query: (voucherId) => ({
                url: `/voucher-combos/remove-all/${voucherId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, voucherId) => [
                { type: "Voucher", id: voucherId },
                { type: "Combo", id: "LIST" },
                { type: "VoucherCombo", id: "LIST" },
            ],
        }),

        // Lấy danh sách voucher của combo 
        getVouchersByComboId: builder.query<APIResponse<Voucher[]>, number>({
            query: (comboId) => `/voucher-combos/combo/${comboId}/vouchers`,
            providesTags: (result,_error, comboId) =>
                result
                    ? [
                        ...result.data.map((v) => ({
                            type: "VoucherCombo" as const,
                            id: `${comboId}-${v.id}`,
                        })),
                        { type: "VoucherCombo", id: `COMBO-${comboId}` },
                        { type: "VoucherCombo", id: "LIST" },
                    ]
                    : [{ type: "VoucherCombo", id: `COMBO-${comboId}` }, 
                        { type: "VoucherCombo", id: "LIST" },
                    ],
        }),

    }),
    overrideExisting: false,
});

export const {
    useAssignVoucherToComboMutation,
    useAssignVoucherToCombosMutation,
    useRemoveVoucherFromComboMutation,
    useRemoveAllCombosFromVoucherMutation,
    useGetVouchersByComboIdQuery,
} = voucherComboApi;