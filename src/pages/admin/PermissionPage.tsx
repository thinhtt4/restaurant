
// import PermissionToolbar from "@/components/dashboard_admin/permissions/PermissionToolbar";
// import PermissionTable from "@/components/dashboard_admin/permissions/PermissionTable";

// import ConfirmDialog from "@/components/ui/ConfirmDialog";
// import PaginationControls from "@/components/ui/PaginationControls";
// import { usePermissions } from "@/hooks/usePermissions";
// import { toast } from "sonner";
// import PermissionModal from "@/components/dashboard_admin/permissions/PermissionModal";

// export default function PermissionPage() {
//   const {
//     page,
//     data,
//     isLoading,
//     isFetching,
//     isError,
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
//     setSearch,
//     goToPage,
//   } = usePermissions();

//   const pageData = data?.data;
//   const permissions = pageData?.permissions ?? [];

//   const handleSubmit = async (payload: {
//     name: string;
//     description?: string | null;
//   }) => {
//     try {
//       if (modalMode === "add") {
//         await doCreate(payload);
//         toast.success("Thêm permission thành công");
//       } else {
//         await doUpdate(selected!.name, payload.description ?? null);
//         toast.success("Cập nhật permission thành công");
//       }
//     } catch (err: any) {
//       const msg = err?.data?.message || err?.message || "Lỗi server";
//       toast.error(msg);
//     }
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       await doDelete();
//       toast.success("Xóa permission thành công");
//     } catch (err: any) {
//       const msg = err?.data?.message || err?.message || "Xóa thất bại";
//       toast.error(msg);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6  overflow-auto">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-6">
//           <h2 className="text-3xl font-bold">Quản lý Permission</h2>
//           <p className="text-gray-600 mt-1">
//             Quản lý các quyền truy cập trong hệ thống
//           </p>
//         </div>

//         <PermissionToolbar onSearch={setSearch} onAddClick={openAdd} />

//         {isLoading || isFetching ? (
//           <div className="p-6 text-center">Đang tải...</div>
//         ) : isError ? (
//           <div className="p-6 text-center text-red-500">
//             Lấy danh sách thất bại
//           </div>
//         ) : (
//           <>
//             <div className="mb-4">
//               <PermissionTable
//                 permissions={permissions}
//                 onEdit={openEdit}
//                 onDeleteAsk={askDelete}
//               />
//             </div>

//             {pageData && pageData.totalPages > 1 && (
//               <div className="flex justify-center mt-4">
//                 <PaginationControls
//                   page={page}
//                   totalPages={pageData.totalPages}
//                   onPageChange={goToPage}
//                 />
//               </div>
//             )}
//           </>
//         )}

//         <PermissionModal
//           mode={modalMode}
//           initial={selected || undefined}
//           open={modalOpen}
//           onOpenChange={(o) => (o ? null : closeModal())}
//           onSubmit={handleSubmit}
//         />
//         <ConfirmDialog
//           open={confirmOpen}
//           title="Xác nhận xóa"
//           description={`Bạn có chắc muốn xóa permission "${confirmTarget}" không?`}
//           onConfirm={handleConfirmDelete}
//           onCancel={cancelDelete}
//         />
//       </div>
//     </div>
//   );
// }
