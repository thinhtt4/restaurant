/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UserPageData, UserSingleResponse } from "@/types/user.type";
import { baseApi } from "./baseApi";
import type { APIResponse } from "@/types/response.type";

export interface UserAdminCreateForm {
  username: string;
  email: string;
  password: string;
  roles?: string[];
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  status?: string | null;
}

export interface UserAdminUpdateForm {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  roles?: string[];
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //get all usser
    getUsers: builder.query<
      APIResponse<UserPageData>,
      { page?: number; size?: number; keyword?: string; sort?: string } | void
    >({
      query: (params = { page: 1, size: 5 }) => {
        const { page = 1, size = 10, keyword = "", sort } = params as any;
        const sp = new URLSearchParams();
        if (keyword) sp.append("keyword", keyword);
        if (sort) sp.append("sort", sort);
        sp.append("page", String(page));
        sp.append("size", String(size));
        return `/users/list?${sp.toString()}`;
      },
      providesTags: (result) =>
        result?.data?.users
          ? [
              ...result.data.users.map((u) => ({
                type: "Users" as const,
                id: u.id,
              })),
              { type: "Users" as const, id: "LIST" },
            ]
          : [{ type: "Users" as const, id: "LIST" }],
    }),

    //create account
    createUserByAdmin: builder.mutation<
      UserSingleResponse,
      UserAdminCreateForm
    >({
      query: (body) => ({ url: "/admin/create-account", method: "POST", body }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    //update account
    updateUserByAdmin: builder.mutation<
      UserSingleResponse,
      UserAdminUpdateForm
    >({
      query: (body) => ({ url: "/admin/update-account", method: "PUT", body }),
      invalidatesTags: (_result, _error, arg) => {
        const tags: Array<{ type: "Users" | "MyInfo"; id?: string | number }> =
          [{ type: "Users" as const, id: "LIST" }];
        if (arg.roles !== undefined) {
          tags.push({ type: "MyInfo" as const });
        }
        return tags;
      },
    }),

    //delete account
    deleteUserByAdmin: builder.mutation<APIResponse<void>, number>({
      query: (id) => ({ url: `/admin/delete-account/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useCreateUserByAdminMutation,
  useUpdateUserByAdminMutation,
  useDeleteUserByAdminMutation,
} = userApi;
