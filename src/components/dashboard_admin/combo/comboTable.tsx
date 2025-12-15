import { useState } from "react";
import { PencilIcon, CheckCircleIcon, BanIcon, TagIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { ComboResponse } from "@/types/combo.type";
import VoucherSelectModal from "./comboVoucher/VoucherSelectModal";

interface ComboTableProps {
    combos: ComboResponse[];
    onEdit: (combo: ComboResponse) => void;
    onDelete: (id: number) => void;
    onToggleActive: (id: number) => void;
    onViewImage: (url: string) => void;
}

export default function ComboTable({
    combos,
    onEdit,
    onDelete,
    onToggleActive,
    onViewImage,
}: ComboTableProps) {
    const [selectedComboId, setSelectedComboId] = useState<number | null>(null);
    const [showVoucherModal, setShowVoucherModal] = useState(false);

    const handleSelectVoucher = (comboId: number) => {
        setSelectedComboId(comboId);
        setShowVoucherModal(true);
    };

    const handleCloseModal = () => {
        setShowVoucherModal(false);
        setSelectedComboId(null);
    };

    if (combos.length === 0) return <p>Không có combo nào.</p>;

    return (
        <>
            <table className="w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                            Tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                            Mô tả
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                            Ảnh
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                            Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap w-[120px]">
                            Số món
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                            Giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                            Ngày tạo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                            Ngày cập nhật
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">
                            Hành động
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {combos.map((c) => {
                        const hasVouchers = c.vouchers && c.vouchers.length > 0;

                        return (
                            <tr key={c.comboId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold">{c.name}</td>
                                <td className="px-6 py-4">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: c.description ?? "" }}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <img
                                        src={c.imageUrl || "/no-image.png"}
                                        alt={c.name}
                                        className="w-16 h-16 rounded-lg object-cover border cursor-pointer"
                                        onClick={() => onViewImage(c.imageUrl || "/no-image.png")}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${c.active
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {c.active ? "Hoạt động" : "Tạm dừng"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap w-[120px]">
                                    <Link
                                        to={`/admin/comboItem/${c.comboId}`}
                                        className="p-2 bg-blue-500 text-white rounded"
                                        title="Xem món ăn trong combo"
                                        onClick={() => {
                                            localStorage.setItem("selectedComboForManager", JSON.stringify(c));
                                        }}
                                    >
                                        {c.comboItems?.length ?? 0} 🍽 Xem món
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        {/* Giá gốc */}
                                        <div
                                            className={
                                                c.totalSavings > 0
                                                    ? "line-through text-gray-400 text-sm"
                                                    : "font-semibold"
                                            }
                                        >
                                            {c.comboPrice.toLocaleString("vi-VN")} ₫
                                        </div>

                                        {/* Giá sau giảm */}
                                        {c.totalSavings > 0 && (
                                            <>
                                                <div className="font-bold text-red-600 text-lg">
                                                    {c.finalPrice.toLocaleString("vi-VN")} ₫
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                                                            -{c.totalSavings.toLocaleString("vi-VN")} ₫
                                                        </span>
                                                    </div>

                                                    {/* Danh sách vouchers áp dụng */}
                                                    {hasVouchers && (
                                                        <div className="text-xs text-gray-600 flex flex-wrap gap-1">
                                                            {c.vouchers!.map((v) => (
                                                                <span
                                                                    key={v.id}
                                                                    className="bg-gray-100 px-1.5 py-0.5 rounded"
                                                                >
                                                                    {v.code}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString("vi-VN") : "-"}
                                </td>
                                <td className="px-6 py-4">
                                    {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString("vi-VN") : "-"}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleSelectVoucher(c.comboId!)}
                                            className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${hasVouchers
                                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                            title={
                                                hasVouchers
                                                    ? `${c.vouchers!.length} voucher đã áp dụng`
                                                    : "Chưa có voucher"
                                            }
                                        >
                                            <TagIcon className="w-4 h-4" />
                                            {hasVouchers
                                                ? `${c.vouchers!.length} Voucher`
                                                : "Chọn Voucher"}
                                        </button>

                                        <button
                                            onClick={() => onEdit(c)}
                                            title="Cập nhật combo"
                                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>

                                        <button
                                            className={`p-2 rounded ${c.active
                                                ? "bg-red-300 text-white"
                                                : "bg-green-500 text-white"
                                                }`}
                                            onClick={() => onToggleActive(c.comboId!)}
                                        >
                                            {c.active ? (
                                                <BanIcon className="h-5 w-5" />
                                            ) : (
                                                <CheckCircleIcon className="h-5 w-5" />
                                            )}
                                        </button>

                                        <button
                                            className="p-2 bg-red-600 text-white rounded"
                                            onClick={() => onDelete(c.comboId!)}
                                            title="Xóa combo"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Modal chọn voucher */}
            {showVoucherModal && selectedComboId && (
                <VoucherSelectModal
                    comboId={selectedComboId}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}
