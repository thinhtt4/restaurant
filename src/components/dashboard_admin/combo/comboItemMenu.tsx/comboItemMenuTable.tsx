import { useEffect, useMemo, useState } from "react";
import { useComboItemSearchManager } from "@/hooks/useComboItemMenu";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useNavigate, useParams } from "react-router-dom";
import ComboItemModal from "./comboItemModal";


export default function ComboItemTable() {
    const { comboId } = useParams<{ comboId: string }>();
    const numericComboId = Number(comboId);
    const cm = useComboItemSearchManager(numericComboId);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editQuantity, setEditQuantity] = useState<number>(0);


    const navigate = useNavigate();
    const comboInfo = cm.comboInfo;

    const categories = useMemo(() => {
        if (!cm.comboItems) return [];
        return Array.from(
            new Set(
                cm.comboItems
                    // .filter(ci => ci.menuItem?.active)
                    .map(ci => ci.menuItem!.categoryName)
            )
        ).sort((a, b) => a.localeCompare(b));
    }, [cm.comboItems]);

    const [activeCategory, setActiveCategory] = useState(categories[0] || "");
    useEffect(() => {
        if (categories.length > 0) {
            setActiveCategory(categories[0]);
        }
    }, [categories]);

    const handleBack = () => navigate("/admin/combo");

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId != null) {
            await cm.handleDeleteComboItemById(selectedId);
            setConfirmOpen(false);
            setSelectedId(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
        setSelectedId(null);
    };

    const handleConfirmDeleteAll = async () => {
        await cm.handleDeleteAllComboItems();
        setConfirmDeleteAll(false);
    };

    console.log(comboInfo);
    console.log(cm.comboItems)

    if (cm.isLoading) return <p>Đang tải combo items ...</p>;
    if (cm.isError) return <p>Lỗi khi tải dữ liệu combo items.</p>;

    return (
        <div className="p-6 overflow-auto">
            <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
                <button
                    onClick={handleBack}
                    className="mr-4 px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                    ← Quay lại
                </button>
                Danh sách món ăn trong combo
                <button
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                    onClick={() => {
                        cm.setCreatingItem(true);
                    }}
                >
                    + Thêm món ăn
                </button>
                <button
                    className="bg-red-600 text-white px-4 py-1 rounded"
                    onClick={() => setConfirmDeleteAll(true)}
                >
                    Xóa tất cả
                </button>

            </h2>




            {/* Thông tin combo */}
            {comboInfo && (
                <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded shadow">
                    {comboInfo.imageUrl && (
                        <img
                            src={comboInfo.imageUrl}
                            alt={comboInfo.name}
                            className="w-32 h-32 object-cover rounded"
                        />
                    )}
                    <div>
                        <h3 className="text-xl font-semibold">{comboInfo.name}</h3>
                        <div className="text-gray-600">
                            <div dangerouslySetInnerHTML={{ __html: comboInfo.description ?? "" }} />
                        </div>
                        <p className={`mt-2 font-medium ${comboInfo.active ? "text-green-600" : "text-red-600"}`}>
                            {comboInfo.active ? "Hoạt động" : "Tạm dừng"}
                        </p>
                    </div>
                </div>
            )}

            {cm.comboItems.length === 0 ? (
                <p>Combo chưa có món ăn nào.</p>
            ) : (
                <>
                    {/* Tabs category */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`px-3 py-1 rounded ${activeCategory === cat
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200"
                                    }`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>


                    {/* Bảng món theo category */}
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Tên món</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Số lượng</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Giá</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Ảnh</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Danh mục</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Trạng thái</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {cm.comboItems
                                .filter(
                                    item =>
                                        // item.menuItem?.active &&
                                        item.menuItem?.categoryName === activeCategory
                                )
                                .map((item) => (
                                    <tr key={item.comboItemId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{item.menuItem?.name ?? "-"}</td>
                                        <td className="px-6 py-4">
                                            {editingId === item.comboItemId ? (
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={editQuantity}
                                                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                                                    className="w-20 border px-2 py-1 rounded"
                                                />
                                            ) : (
                                                item.quantity
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.menuItem?.price != null
                                                ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.menuItem.price)
                                                : "-"}
                                        </td>
                                        <td className="px-3 py-2">
                                            <img src="{item.menuItem?.price}" alt="món ăn" />
                                        </td>
                                        <td className="px-6 py-4">{item.menuItem?.categoryName ?? "-"}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${item.menuItem?.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                            >
                                                {item.menuItem?.active ? "Hoạt động" : "Tạm dừng"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-2">
                                            {editingId === item.comboItemId ? (
                                                <>
                                                    <button
                                                        onClick={async () => {
                                                            await cm.handleUpdateComboItem({
                                                                comboItemId: item.comboItemId,
                                                                comboId: item.comboId,
                                                                menuItemId: item.menuItemId,
                                                                quantity: editQuantity,
                                                            });
                                                            setEditingId(null);
                                                        }}
                                                        className="px-3 py-1 bg-green-600 text-white rounded"
                                                    >
                                                        Lưu
                                                    </button>

                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="px-3 py-1 bg-gray-400 text-white rounded"
                                                    >
                                                        Hủy
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(item.comboItemId);
                                                            setEditQuantity(item.quantity);
                                                        }}
                                                        className="p-2 bg-yellow-500 text-white rounded"
                                                        title="Sửa"
                                                    >
                                                        ✏️
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteClick(item.comboItemId)}
                                                        className="p-2 bg-red-600 text-white rounded"
                                                        title="Xóa"
                                                    >
                                                        🗑
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* Modal thêm món */}
            {cm.creatingItem && (
                <ComboItemModal
                    title="Thêm món cho combo"
                    comboId={numericComboId}
                    comboItems={cm.comboItems}
                    menuItems={cm.menuItems}
                    onSave={cm.handleCreateComboItem}
                    onClose={() => cm.setCreatingItem(false)}
                />
            )}


            {/* Xác nhận xóa */}
            <ConfirmDialog
                open={confirmOpen}
                title="Xác nhận xóa món ăn"
                description="Hành động này không thể hoàn tác."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            <ConfirmDialog
                open={confirmDeleteAll}
                title="Xóa tất cả món trong combo?"
                description="Hành động này sẽ xóa toàn bộ món ăn khỏi combo và không thể hoàn tác."
                onConfirm={handleConfirmDeleteAll}
                onCancel={() => setConfirmDeleteAll(false)}
            />

        </div>
    );
}
