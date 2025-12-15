import { useState } from "react";
import { useVoucherManager } from "@/hooks/useVoucherManager";
import VoucherFilter from "@/components/dashboard_admin/voucher/VoucherFilter";
import PaginationControls from "@/components/ui/PaginationControls";
import VoucherModal from "@/components/dashboard_admin/voucher/VoucherModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import VoucherTable from "@/components/dashboard_admin/voucher/voucherTable";

export default function VoucherPage() {
    const vm = useVoucherManager();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    if (vm.isLoading) return <p>Đang tải danh sách voucher ...</p>;
    if (vm.isError) return <p>Lỗi khi tải dữ liệu voucher.</p>;

    const handleDeleteClick = (id: number) => { setSelectedId(id); setConfirmOpen(true); };
    const handleConfirmDelete = async () => { if (selectedId != null) { await vm.handleDeleteVoucher(selectedId); setConfirmOpen(false); setSelectedId(null); } };
    const handleCancelDelete = () => { setConfirmOpen(false); setSelectedId(null); };

    return (
        <div className="p-6 overflow-auto">
            <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
                Danh sách Voucher
            </h2>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <VoucherFilter filter={vm.filter} updateFilter={vm.updateFilter} />
                    <button
                        className="bg-blue-600 text-white px-4 py-1 rounded"
                        onClick={() => {
                            vm.setCreatingVoucher(true);
                            vm.setVoucherValue(vm.createDefaultVoucher());
                        }}
                    >
                        + Tạo Voucher
                    </button>
                </div>
            </div>

            {/* Voucher Table */}
            <VoucherTable
                vouchers={vm.vouchers}
                expandedId={vm.expandedId}
                onToggleDetails={vm.handleToggleDetails}
                onEdit={(v) => { vm.setVoucherValue(v); vm.setIsEditing(true); }}
                onToggleActive={vm.handleToggleActive}
                onDelete={handleDeleteClick}
                onReload={() => vm.refetch()}
            />

            {/* Pagination */}
            <PaginationControls
                page={vm.page}
                totalPages={vm.totalPages}
                onPageChange={vm.setPage}
            />

            {/* Modals */}
            {vm.voucherValue && vm.creatingVoucher && (
                <VoucherModal
                    title="Tạo Voucher Mới"
                    voucher={vm.voucherValue}
                    onChange={vm.handleChange}
                    onSave={vm.handleCreateVoucher}
                    onClose={() => { vm.setCreatingVoucher(false); vm.setVoucherValue(null); }}
                    isUpdate={false}
                />
            )}
            {vm.voucherValue && vm.isEditing && (
                <VoucherModal
                    title="Cập nhật Voucher"
                    voucher={vm.voucherValue}
                    onChange={vm.handleChange}
                    onSave={vm.handleSaveEdit}
                    onClose={() => { vm.setIsEditing(false); vm.setVoucherValue(null); }}
                    isUpdate={true}
                />
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Xác nhận xóa voucher"
                description="Hành động này không thể hoàn tác."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}
