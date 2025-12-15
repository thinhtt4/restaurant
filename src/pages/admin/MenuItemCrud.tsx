import { useMenuItems } from "@/hooks/useMenuItems";
import MenuItemTable from "@/components/dashboard_admin/menu_item/MenuItemTable";
import MenuItemToolbar from "@/components/dashboard_admin/menu_item/MenuItemToolbar";
import MenuItemModal from "@/components/dashboard_admin/menu_item/MenuItemModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PaginationControls from "@/components/ui/PaginationControls";

export default function MenuItemPage() {
    const {
        menuItems,
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
        setSearch,
        handleActiveFilter,
        handleCategoryFilter,
        handlePriceFilter,
        currentPage,
        totalPages,
        handlePageChange,
    } = useMenuItems();

    return (
        <div className="min-h-screen bg-gray-50 p-6  overflow-auto">
            <div className="max-w-7xl mx-auto"></div>
            <div className="p-5 space-y-4 overflow-auto">
                <h2 className="text-2xl font-bold">Menu Items</h2>

                <MenuItemToolbar onSearch={setSearch} onAdd={openAdd} categories={categories ?? []} onActiveFilter={handleActiveFilter} onCategoryFilter={handleCategoryFilter} onPriceFilter={handlePriceFilter} />

                <MenuItemTable data={menuItems} onEdit={openEdit} onDelete={askDelete} />
                <MenuItemModal
                    open={modalOpen}
                    mode={modalMode}
                    initial={selected}
                    categories={categories}
                    onOpenChange={closeModal}
                    onSubmit={handleSubmit}
                />

                {!isLoading && totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <PaginationControls
                            page={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}

                <ConfirmDialog
                    open={confirmOpen}
                    title="Xác nhận xóa"
                    description={`Bạn có chắc muốn xóa MenuItems "${confirmTarget?.name}" không?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={cancelDelete}
                />
            </div>
        </div>
    );
}
