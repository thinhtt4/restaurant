import { baseApi } from "./baseApi";
import type { APIResponse } from "@/types/response.type";
import type { GetTableAreasParams, PaginatedResponse, TableArea } from "@/types/table.type";


export const tableAreaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTableAreas: builder.query<PaginatedResponse<TableArea>, GetTableAreasParams>({
            query: (params) => ({
                url: '/table-areas',
                params: {
                    page: params.page,
                    size: params.size,
                    search: params.search,
                }
            }),
            transformResponse: (response: APIResponse<PaginatedResponse<TableArea>>) => response.data,
        }),
        createTableArea: builder.mutation<TableArea, TableArea>({
            query: (body) => ({
                url: "/table-areas",
                method: "POST",
                body,
            }),
            transformResponse: (resp: APIResponse<TableArea>) => resp.data,
        }),
        updateTableArea: builder.mutation<TableArea, { id: number; body: TableArea }>({
            query: ({ id, body }) => ({
                url: `/table-areas/${id}`,
                method: "PUT",
                body,
            }),
            transformResponse: (resp: APIResponse<TableArea>) => resp.data,
        }),
        deleteTableArea: builder.mutation<void, number>({
            query: (id) => ({
                url: `/table-areas/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetTableAreasQuery,
    useCreateTableAreaMutation,
    useUpdateTableAreaMutation,
    useDeleteTableAreaMutation,
} = tableAreaApi;