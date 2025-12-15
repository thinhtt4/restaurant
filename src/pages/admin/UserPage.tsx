/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/dashboard_admin/UserPage.tsx
import  { useCallback, useMemo } from "react";
import UserToolbar from "@/components/dashboard_admin/user/UserToolbar";
import UserTable from "@/components/dashboard_admin/user/UserTable";
import UserModal from "@/components/dashboard_admin/user/UserModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PaginationControls from "@/components/ui/PaginationControls";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

export default function UserPage() {
  const {
    page,
    // size,
    keyword,
    // debouncedKeyword,
    data,
    isLoading,
    isFetching,
    refetch,

    // modal + selected from hook
    modalOpen,
    modalMode,
    selected,

    // confirm state from hook
    confirmOpen,
    confirmTarget,

    // actions
    openAdd,
    openEdit,
    closeModal,
    doCreate,
    doUpdate,
    askDelete,
    cancelDelete,
    doDelete,
    setSearch,
    goToPage,
  } = useUser();

  const users = useMemo(() => data?.data?.users ?? [], [data]);
  const totalPages = data?.data?.totalPages ?? 1;

  const handleSearch = useCallback(
    (kw: string) => {
      setSearch(kw);
    },
    [setSearch]
  );

  const handleOpenAdd = useCallback(() => {
    openAdd();
  }, [openAdd]);

  const handleOpenEdit = useCallback(
    (u: any) => {
      openEdit(u);
    },
    [openEdit]
  );

  const handleAskDelete = useCallback(
    (id: number) => {
      askDelete(id);
    },
    [askDelete]
  );

  const handleCancelDelete = useCallback(() => {
    cancelDelete();
  }, [cancelDelete]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await doDelete();
      toast.success("Đặt INACTIVE thành công");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Xóa thất bại");
    }
  }, [doDelete, refetch]);

  const handleSubmit = useCallback(
    async (payload: any) => {
      try {
        if (modalMode === "add") {
          await doCreate(payload);
          toast.success("Tạo user thành công");
        } else {
          await doUpdate(payload);
          toast.success("Cập nhật user thành công");
        }
        closeModal();
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || err?.message || "Lỗi server");
      }
    },
    [modalMode, doCreate, doUpdate, closeModal, refetch]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Quản lý User</h2>
          <p className="text-gray-600 mt-1">
            Tạo, sửa, xóa (set inactive) và phân quyền tài khoản
          </p>
        </div>

        <UserToolbar
          value={keyword}
          onSearch={handleSearch}
          onAddClick={handleOpenAdd}
        />

        {isLoading || isFetching ? (
          <div className="p-6 text-center">Đang tải...</div>
        ) : (
          <>
            <div className="mb-4">
              <UserTable
                users={users}
                onEdit={handleOpenEdit}
                onDeleteAsk={handleAskDelete}
              />
            </div>

            <div className="flex items-center justify-center mt-4">
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          </>
        )}

        <UserModal
          mode={modalMode}
          initial={selected}
          open={modalOpen}
          onOpenChange={(o) => (o ? null : closeModal())}
          onSubmit={handleSubmit}
        />

        <ConfirmDialog
          open={confirmOpen}
          title="Xác nhận"
          description={`Bạn có chắc muốn đặt INACTIVE user id=${confirmTarget}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
}
