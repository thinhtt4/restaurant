import type { APIResponse } from "@/types/response.type";
import { baseApi } from "./baseApi";
import type { RoleResponse } from "@/types/role.type";


export interface CreateRoleRequest {
  name: string;
  description?: string | null;
  permissions?: string[];
}
export interface UpdateRoleRequest {
  description?: string | null;
  permissions?: string[];
}

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get list role
    getRoles: builder.query<APIResponse<RoleResponse[]>, void>({
      query: () => ({
        url: "/roles/list",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((r) => ({
                type: "Roles" as const,
                id: r.name,
              })),
              { type: "Roles" as const, id: "LIST" },
            ]
          : [{ type: "Roles" as const, id: "LIST" }],
    }),

    // get by name
    getRoleByName: builder.query<APIResponse<RoleResponse>, string>({
      query: (name) => ({
        url: `/roles/search/${encodeURIComponent(name)}`,
        method: "GET",
      }),
      providesTags: (_result, _error, name) => [
        { type: "Roles" as const, id: name },
      ],
    }),

    //create role
    createRole: builder.mutation<APIResponse<RoleResponse>, CreateRoleRequest>({
      query: (body) => ({ url: "/roles/create", method: "POST", body }),
      invalidatesTags: [
        { type: "Roles", id: "LIST" },
        { type: "MyInfo" },
      ],
    }),

    // update role
    updateRole: builder.mutation<
      APIResponse<RoleResponse>,
      { name: string; body: UpdateRoleRequest }
    >({
      query: ({ name, body }) => ({
        url: `/roles/update/${encodeURIComponent(name)}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (_result, _error, arg) => [
        { type: "Roles", id: arg.name },
        { type: "Roles", id: "LIST" },
        { type: "MyInfo" },
      ],
    }),

    // delete role
    deleteRole: builder.mutation<APIResponse<void>, string>({
      query: (name) => ({
        url: `/roles/delete/${encodeURIComponent(name)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, name) => [
        { type: "Roles", id: name },
        { type: "Roles", id: "LIST" },
        { type: "MyInfo" },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateRoleMutation,
  useGetRoleByNameQuery,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
  useGetRolesQuery,
} = roleApi;
