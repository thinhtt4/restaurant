import { useState } from "react";
import { useComboManager } from "@/hooks/useComboManager";
import ComboTable from "@/components/dashboard_admin/combo/comboTable";
import PaginationControls from "@/components/ui/PaginationControls";
import ComboModal from "@/components/dashboard_admin/combo/ComboModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ComboFilter from "@/components/dashboard_admin/combo/ComboFilter";

export default function ComboPage() {
    const cm = useComboManager();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId != null) {
            await cm.handleDeleteCombo(selectedId);
            setConfirmOpen(false);
            setSelectedId(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
        setSelectedId(null);
    };

    if (cm.isLoading) return <p>Đang tải danh sách combo ...</p>;
    if (cm.isError) return <p>Lỗi khi tải dữ liệu combo.</p>;

    return (
        <div className="p-6 overflow-auto">
            <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
                Danh sách Combo
            </h2>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <ComboFilter filter={cm.filter} updateFilter={cm.updateFilter} />
                    {/* Nút tạo combo */}
                    <button
                        className="bg-blue-600 text-white px-4 py-1 rounded"
                        onClick={() => {
                            cm.setCreatingCombo(true);
                            cm.setComboValue(cm.createDefaultCombo());
                        }}
                    >
                        + Tạo Combo
                    </button>
                </div>
            </div>


            {/* ComboTable */}
            <ComboTable
                combos={cm.combos}
                onEdit={(c) => { cm.setComboValue(c); cm.setIsEditing(true); }}
                onDelete={handleDeleteClick}
                onToggleActive={cm.handleToggleActive}
                onViewImage={setSelectedImage}
            />

            <PaginationControls
                page={cm.page}
                totalPages={cm.totalPages}
                onPageChange={cm.setPage}
            />

            {/* Modal tạo */}
            {cm.comboValue && cm.creatingCombo && (
                <ComboModal
                    title="Tạo Combo Mới"
                    combo={cm.comboValue}
                    onChange={cm.handleChange}
                    onSave={cm.handleCreateCombo}
                    onClose={() => { cm.setCreatingCombo(false); cm.setComboValue(null); }}
                    isUpdate={false}
                />
            )}

            {/* Modal cập nhật */}
            {cm.comboValue && cm.isEditing && (
                <ComboModal
                    title="Cập nhật Combo"
                    combo={cm.comboValue}
                    onChange={cm.handleChange}
                    onSave={cm.handleSaveEdit}
                    onClose={() => { cm.setIsEditing(false); cm.setComboValue(null); }}
                    isUpdate={true}
                />
            )}

            <ConfirmDialog
                open={confirmOpen}
                title="Xác nhận xóa combo"
                description="Hành động này không thể hoàn tác."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Ảnh lớn"
                        className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain shadow-lg"
                    />
                </div>
            )}
        </div>
    );
}
