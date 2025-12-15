import type { APIResponse } from "@/types/response.type";
import { baseApi } from "./baseApi";
import type { Combo, ComboResponse } from "@/types/combo.type";

export const comboApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCombo: builder.query<
            APIResponse<{
                data: ComboResponse[];
                page: number;
                pageSize: number;
                totalElements: number;
                totalPages: number;
            }>,
            { page: number; pageSize: number; name?: string; active?: boolean },
            {
                refetchOnMountOrArgChange: true,
            }
        >({
            query: ({ page, pageSize, name, active }) => {
                const params = new URLSearchParams({
                    page: String(page),
                    pageSize: String(pageSize),
                });
                if (name) params.append("name", name);
                if (active !== undefined) params.append("active", String(active));
                return `/combos/getAll?${params.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.data.map(c => ({ type: "Combo" as const, id: c.comboId })),
                        { type: "Combo", id: "LIST" },
                    ]
                    : [{ type: "Combo", id: "LIST" }],

        }),

        createCombo: builder.mutation<APIResponse<ComboResponse>, Combo>({
            query: (body) => ({ url: "/combos/create", method: "POST", body }),
            invalidatesTags: [{ type: 'Combo', id: 'LIST' }],
        }),

        updateCombo: builder.mutation<APIResponse<ComboResponse>, Combo>({
            query: (body) => ({ url: "/combos/update", method: "PUT", body }),
            invalidatesTags: (_, __, arg) =>
                arg.comboId
                    ? [{ type: "Combo", id: arg.comboId }]
                    : [{ type: "Combo", id: "LIST" }],
        }),

        deleteCombo: builder.mutation<APIResponse<boolean>, number>({
            query: (id) => ({ url: `/combos/${id}`, method: "DELETE" }),
            invalidatesTags: [{ type: "Combo", id: "LIST" }],
        }),

        toggleComboActive: builder.mutation<APIResponse<ComboResponse>, number>({
            query: (id) => ({ url: `/combos/toggle-active/${id}`, method: "PUT" }),
            invalidatesTags: (_, __, arg) => [
                { type: "Combo", id: arg },
                { type: "Combo", id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllComboQuery,
    useCreateComboMutation,
    useUpdateComboMutation,
    useDeleteComboMutation,
    useToggleComboActiveMutation,
} = comboApi;
