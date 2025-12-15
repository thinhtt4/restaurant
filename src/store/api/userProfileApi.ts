import type { ProfileFormData } from "@/schemas/profileSchema";
import { baseApi } from "./baseApi";
import type { APIResponse } from "@/types/response.type";
import type { User } from "@/types/user.type";

interface ResUploadFileDTO {
    fileName: string;
    uploadedAt: string;
}

export const userProfileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAccount: builder.query<APIResponse<User>, void>({
            query: () => ({
                url: "/profile",
            }),
        }),
        updateProfile: builder.mutation<APIResponse<User>, ProfileFormData>({
            query: (body) => ({
                url: "/profile/edit",
                method: "PUT",
                body,
            }),
        }),
        // Upload file (avatar)
        uploadFile: builder.mutation<string, FormData>({
            query: (formData) => ({
                url: "/files",
                method: "POST",
                body: formData,
            }),
            transformResponse: (res: ResUploadFileDTO) => res.fileName, // lấy path ảnh
        }),
        // Update avatar
        updateAvatar: builder.mutation<User, { avatarUrl: string }>({
            query: (body) => ({
                url: "/profile/avatar",
                method: "PATCH",
                body,
            }),
            transformResponse: (res: APIResponse<User>) => res.data, // chỉ lấy data User
        }),

         changePassword: builder.mutation<APIResponse<void>, { oldPassword: string; newPassword: string }>({
            query: (body) => ({
                url: "/users/change-pwd-user",
                method: "PUT",
                body,
            }),
        }),


    }),
});

export const {
    useGetAccountQuery, useUpdateProfileMutation, useUploadFileMutation, useUpdateAvatarMutation,useChangePasswordMutation
} = userProfileApi;