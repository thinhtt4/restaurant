import ConfirmDialog from "@/components/ui/ConfirmDialog";
import MenuCategoryModal from "@/components/dashboard_admin/category/CategoryModal";
import MenuCategoryToolbar from "@/components/dashboard_admin/category/CategoryToolbar";
import MenuCategoryTable from "@/components/dashboard_admin/category/CategoryTable";
import { useMenuCategories } from "@/hooks/useMenuCategories";
import PaginationControls from "@/components/ui/PaginationControls";

export default function CategoryPage() {
    const {
        categories,
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
        currentPage,
        totalPage,
    } = useMenuCategories();

    return (
        <div className="p-5 space-y-4 overflow-auto">
            <h2 className="text-2xl font-bold">Menu Category</h2>

            <MenuCategoryToolbar setSearch={handleSearch} onAdd={openAdd} />


            <MenuCategoryTable data={categories} onEdit={openEdit} onDelete={askDelete} />

            <MenuCategoryModal
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
