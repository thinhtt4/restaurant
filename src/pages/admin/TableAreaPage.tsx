import { useTableAreas } from "@/hooks/useTableAreas";
import TableAreaTable from "@/components/dashboard_admin/table_area/TableAreaTable";
import TableAreaModal from "@/components/dashboard_admin/table_area/TableAreaModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PaginationControls from "@/components/ui/PaginationControls";
import TableAreaToolbar from "@/components/dashboard_admin/table_area/TableAreaToolbar";

export default function TableAreaPage() {
    const {
        tableAreas,
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
        handleSearch,
        totalPage,
        currentPage,
    } = useTableAreas();

    return (
        <div className="p-5 space-y-4 overflow-auto">
            <h2 className="text-2xl font-bold">Table Areas</h2>

            <TableAreaToolbar setSearch={handleSearch} onAdd={openAdd} />

            <TableAreaTable data={tableAreas} onEdit={openEdit} onDelete={askDelete} />

            <TableAreaModal
                open={modalOpen}
                mode={modalMode}
                initial={selected}
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
                description={`Bạn có chắc muốn xóa khu vực bàn "${confirmTarget?.name}" không?`}
                onConfirm={handleConfirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}
