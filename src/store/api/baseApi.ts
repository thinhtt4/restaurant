import type { RootState } from "@/store/store";

import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { APIResponse, AuthResponse } from "@/types/response.type";
import { logout, setAuth } from "../authSlice";
import type { User } from "@/types/user.type";
import type { ForgotPassword } from "@/types/forgotPassword.type";
import type { ResetPassword } from "@/types/resetPassword.type";

interface LoginRequest {
  email: string;
  password: string;
}
interface RegisterRequest {
  username: string;
  phone: string;
  password: string;
  email: string;
}

interface ErrorResponse {
  message?: string;
}

interface RefreshTokenResponse {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

const baseQuery = fetchBaseQuery({
  // baseUrl: import.meta.env.VITE_API_URL,
  baseUrl: "http://localhost:8080",

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (agrs, api, extraOptins) => {
  let result = await baseQuery(agrs, api, extraOptins);

  if (result.error?.status === 401) {
    const errorData = result.error.data as ErrorResponse;
    if (errorData?.message === "UNAUTHENTICATED") {
      const refreshToken = (api.getState() as RootState).auth.refreshToken;
      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            body: {
              refreshToken,
            },
          },
          api,
          extraOptins
        );
        const newAccessToken = (refreshResult.data as RefreshTokenResponse)
          ?.data?.accessToken;

        if (newAccessToken) {
          api.dispatch(
            setAuth({
              accessToken: newAccessToken,
              refreshToken,
            })
          );

          result = await baseQuery(agrs, api, extraOptins);
        } else {
          api.dispatch(logout());
        }
      }
    } else {
      api.dispatch(logout());
    }
  }

  if (result.error?.status === 403) {
    if (typeof window !== "undefined") {
      window.location.href = "/forbidden";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,


  tagTypes: [
    "Permissions",
    "Roles",
    "Voucher",
    "Combo",
    "ComboItem",
    "Blogs",
    "Users",
    "MenuItem",
    "MyInfo",
    "ORDER",
    "Table",
    "Chat",
    "LIST_ORDER_EMPTY",
    "VoucherCombo",
  ],



  endpoints: (builder) => ({
    // auth

    login: builder.mutation<APIResponse<AuthResponse>, LoginRequest>({
      query: (loginData) => ({
        url: "/auth/login",
        method: "POST",
        body: loginData,
      }),
    }),

    getMyInfo: builder.query<APIResponse<User>, void>({
      query: () => ({
        url: "/users/myInfo",
      }),
      providesTags: [{ type: "MyInfo", id: "CURRENT_USER" }],
    }),

    getGoogleUserInfo: builder.query<APIResponse<User>, void>({
      query: () => ({
        url: "/auth/me",
      }),
    }),

    logout: builder.mutation<{ success: string; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    register: builder.mutation<APIResponse<User>, RegisterRequest>({
      query: (userData) => ({
        url: "/users/create-user",
        method: "POST",
        body: userData,
      }),
    }),
    forgotPassword: builder.mutation<APIResponse<void>, ForgotPassword>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<APIResponse<void>, ResetPassword>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMyInfoQuery,
  useGetGoogleUserInfoQuery,
  useLogoutMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = baseApi;
