import { baseApi } from "./baseApi";
import type { APIResponse } from "@/types/response.type";
import type { GetTablesParams, PaginatedResponse, Table, TableArea } from "@/types/table.type";


export const tableApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTables: builder.query<PaginatedResponse<Table>, GetTablesParams>({
            query: (params) => ({
                url: '/tables',
                params: {
                    page: params.page,
                    size: params.size,
                    search: params.search,
                    guestFrom: params.guestFrom,
                    guestTo: params.guestTo,
                    areaId: params.areaId,
                    status: params.status
                }
            }),
            transformResponse: (response: APIResponse<PaginatedResponse<Table>>) => response.data,
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Table' as const, id })),
                        { type: 'Table', id: 'LIST' },
                    ]
                    : [{ type: 'Table', id: 'LIST' }],
        }),
        createTable: builder.mutation<Table, Table>({
            query: (body) => ({
                url: "/tables",
                method: "POST",
                body,
            }),
            transformResponse: (resp: APIResponse<Table>) => resp.data,
            invalidatesTags: [{ type: 'Table', id: 'LIST' }],
        }),
        updateTable: builder.mutation<Table, { id: number; body: Table }>({
            query: ({ id, body }) => ({
                url: `/tables/${id}`,
                method: "PUT",
                body,
            }),
            transformResponse: (resp: APIResponse<Table>) => resp.data,
            invalidatesTags: (_, __, { id }) => [{ type: 'Table', id }],
        }),
        deleteTable: builder.mutation<void, number>({
            query: (id) => ({
                url: `/tables/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: 'Table', id: 'LIST' }],
        }),
        getTableArea: builder.query<TableArea[], void>({
            query: () => "/table-areas",
            transformResponse: (resp: APIResponse<TableArea[]>) => resp.data,
        }),

    }),
});

export const {
    useGetTablesQuery,
    useCreateTableMutation,
    useUpdateTableMutation,
    useDeleteTableMutation,
    useGetTableAreaQuery,
} = tableApi;