import { useTables } from "@/hooks/useTable";
import TableTable from "@/components/dashboard_admin/table/TableTable";
import TableToolbar from "@/components/dashboard_admin/table/TableToolbar";
import TableModal from "@/components/dashboard_admin/table/TableModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PaginationControls from "@/components/ui/PaginationControls";

export default function TablePage() {
    const {
        tables,
        tableArea,
        isLoading,
        modalOpen,
        modalMode,
        selected,
        confirmOpen,
        confirmTarget,
        openAdd,
        openEdit,
        closeModal,
        askDelete,
        cancelDelete,
        handleSubmit,
        handleConfirmDelete,
        handlePageChange,
        setSearch,
        handleGuestFilter,
        handleAreaFilter,
        handleStatusFilter,
        currentPage,
        totalPage,
    } = useTables();

    return (
        <div className="p-5 space-y-4 overflow-auto">
            <h2 className="text-2xl font-bold">Tables</h2>

            <TableToolbar onSearch={setSearch} onAdd={openAdd} onGuestFilter={handleGuestFilter} onAreaFilter={handleAreaFilter} onStatusFilter={handleStatusFilter} areas={tableArea ?? []} />

            <TableTable data={tables} onEdit={openEdit} onDelete={askDelete} />

            <TableModal
                open={modalOpen}
                mode={modalMode}
                initial={selected}
                areas={tableArea}
                onOpenChange={closeModal}
                onSubmit={handleSubmit}
            />

            {!isLoading && totalPage > 1 && (
                <div className="flex justify-center mt-4">
                    <PaginationControls
                        page={currentPage}
                        totalPages={totalPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <ConfirmDialog
                open={confirmOpen}
                title="Xác nhận xóa"
                description={`Bạn có chắc muốn xóa bàn "${confirmTarget?.code}" không?`}
                onConfirm={handleConfirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}
