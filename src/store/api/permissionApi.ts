// import type { APIResponse } from "@/types/response.type";
// import { baseApi } from "./baseApi";
// import type {
//   PermissionPageResponse,
//   PermissionResponse,
// } from "@/types/permission.type";

// export interface PermissionForm {
//   name: string;
//   description?: string | null;
// }

// export const permissionApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     //Get list permission
//     getPermissions: builder.query<
//       PermissionPageResponse,
//       { keyword?: string; page?: number; size?: number; sort?: string } | void
//     >({
//       query: (params = { page: 1, size: 10 }) => {
//         const { keyword = "", page = 1, size = 10, sort } = params as any;
//         const sp = new URLSearchParams();
//         if (keyword) sp.append("keyword", keyword);
//         if (sort) sp.append("sort", sort);
//         sp.append("page", String(page));
//         sp.append("size", String(size));
//         return `/permission/list?${sp.toString()}`;
//       },
//       providesTags: (result) =>
//         result?.data?.permissions
//           ? [
//               ...result.data.permissions.map((p) => ({
//                 type: "Permissions" as const,
//                 id: p.name,
//               })),
//               { type: "Permissions" as const, id: "LIST" },
//             ]
//           : [{ type: "Permissions" as const, id: "LIST" }],
//     }),

//     //Create permission
//     createPermission: builder.mutation<
//       APIResponse<PermissionResponse>,
//       PermissionForm
//     >({
//       query: (body) => ({
//         url: "/permission/create",
//         method: "POST",
//         body,
//       }),

//       invalidatesTags: [{ type: "Permissions", id: "LIST" }],
//     }),

//     //Update permision
//     updatePermission: builder.mutation<
//       APIResponse<PermissionResponse>,
//       PermissionForm
//     >({
//       query: ({ name, body }) => ({
//         url: `/permission/update/${encodeURIComponent(name)}`,
//         method: "PUT",
//         body,
//       }),

//       invalidatesTags: (result, error, arg) => [
//         { type: "Permissions", id: arg.name },
//         { type: "Permissions", id: "LIST" },
//       ],
//     }),

//     //DELETE permission
//     deletePermission: builder.mutation<APIResponse<void>, string>({
//       query: (name) => ({
//         url: `permission/delete/${encodeURIComponent(name)}`,
//         method: "DELETE",
//       }),

//       invalidatesTags: (result, error, name) => [
//         { type: "Permissions", id: name },
//         { type: "Permissions", id: "LIST" },
//       ],
//     }),
//   }),

//   overrideExisting: false,
// });

// export const {
//   useGetPermissionsQuery,
//   useCreatePermissionMutation,
//   useDeletePermissionMutation,
//   useUpdatePermissionMutation,
// } = permissionApi;
