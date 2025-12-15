// // src/pages/admin/RolePage.tsx
// import React, { useCallback, useState } from "react";
// import RoleToolbar from "@/components/dashboard_admin/role/RoleToolbar";
// import RoleTable from "@/components/dashboard_admin/role/RoleTable";
// import RoleModal from "@/components/dashboard_admin/role/RoleModal";
// import ConfirmDialog from "@/components/ui/ConfirmDialog";
// import { useRole } from "@/hooks/useRole";
// import { useGetRolesQuery, useGetRoleByNameQuery } from "@/store/api/roleApi";
// import { useDebounce } from "@/hooks/useDebounce";
// import { toast } from "sonner";
// import { useGetPermissionsQuery } from "@/store/api/permissionApi";

// export default function RolePage() {
//   const {
//     modalOpen,
//     modalMode,
//     selected,
//     confirmOpen,
//     confirmTarget,

//     openAdd,
//     openEdit,
//     closeModal,
//     doCreate,
//     doUpdate,
//     askDelete,
//     cancelDelete,
//     doDelete,
//   } = useRole();

//   const {data: permData , isLoading } = useGetPermissionsQuery(
//   {page: 1,
//   size: 1000,
//   sort: "name:asc",});

//   const availablePermissionNames: string[] = React.useMemo(() =>{
//     return (permData?.data.permissions ?? []).map((p) => p.name);
//   },[permData]);

//   const [keyword, setKeyword] = useState<string>("");
//   const debouncedKeyword = useDebounce(keyword, 300);

//   const rolesListQuery = useGetRolesQuery(undefined, {
//     skip: Boolean(debouncedKeyword),
//   });
//   const roleByNameQuery = useGetRoleByNameQuery(debouncedKeyword ?? "", {
//     skip: !debouncedKeyword,
//   });

//   const roles = React.useMemo(() => {
//     if (debouncedKeyword) {
//       const r = roleByNameQuery.data?.data;
//       return r ? [r] : [];
//     }
//     return rolesListQuery.data?.data ?? [];
//   }, [debouncedKeyword, roleByNameQuery.data, rolesListQuery.data]);

//   const isLoading = debouncedKeyword
//     ? roleByNameQuery.isLoading
//     : rolesListQuery.isLoading;
//   const isFetching = debouncedKeyword
//     ? roleByNameQuery.isFetching
//     : rolesListQuery.isFetching;
//   const isError = debouncedKeyword
//     ? roleByNameQuery.isError
//     : rolesListQuery.isError;
//   const refetch = debouncedKeyword
//     ? roleByNameQuery.refetch
//     : rolesListQuery.refetch;

//   const handleSearch = useCallback((kw: string) => {
//     setKeyword(kw);
//   }, []);

//   const handleSubmit = async (payload: {
//     name: string;
//     description?: string | null;
//     permissions?: string[] | any[];
//   }) => {
//     try {
//       if (modalMode === "add") {
//         await doCreate({
//           name: payload.name,
//           description: payload.description ?? null,
//           permissions: payload.permissions ?? [],
//         } as any);
//         toast.success("Tạo role thành công");
//       } else {
//         if (!selected) throw new Error("No selected role");
//         await doUpdate(selected.name, {
//           description: payload.description ?? null,
//           permissions: payload.permissions ?? [],
//         });
//         toast.success("Cập nhật role thành công");
//       }
//       closeModal();
//       // refetch current active query
//       refetch();
//     } catch (err: any) {
//       const msg = err?.data?.message || err?.message || "Lỗi server";
//       toast.error(msg);
//     }
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       await doDelete();
//       toast.success("Xóa role thành công");
//       refetch();
//     } catch (err: any) {
//       const msg = err?.data?.message || err?.message || "Xóa thất bại";
//       toast.error(msg);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 overflow-auto">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-6">
//           <h2 className="text-3xl font-bold">Quản lý Role</h2>
//           <p className="text-gray-600 mt-1">
//             Quản lý các vai trò trong hệ thống
//           </p>
//         </div>

//         <RoleToolbar
//           value={keyword}
//           onSearch={handleSearch}
//           onAddClick={openAdd}
//         />

//         {isLoading || isFetching ? (
//           <div className="p-6 text-center">Đang tải...</div>
//         ) : isError ? (
//           <div className="p-6 text-center text-red-500">
//             Lấy danh sách thất bại
//           </div>
//         ) : (
//           <div className="mb-4">
//             <RoleTable
//               roles={roles}
//               onEdit={openEdit}
//               onDeleteAsk={askDelete}
//             />
//           </div>
//         )}

//         <RoleModal
//           mode={modalMode}
//           initial={selected ?? undefined}
//           open={modalOpen}
//           onOpenChange={(o) => (o ? null : closeModal())}
//           onSubmit={handleSubmit}
//           availablePermissions={availablePermissionNames}
//         />

//         <ConfirmDialog
//           open={confirmOpen}
//           title="Xác nhận xóa"
//           description={`Bạn có chắc muốn xóa role "${confirmTarget}" không?`}
//           onConfirm={handleConfirmDelete}
//           onCancel={cancelDelete}
//         />
//       </div>
//     </div>
//   );
// }
