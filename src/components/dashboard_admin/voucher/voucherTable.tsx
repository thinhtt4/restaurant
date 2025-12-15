
import { EyeIcon, PencilIcon, CheckCircleIcon, BanIcon, Trash2 } from "lucide-react";
import type { Voucher } from "@/types/voucher.type";
import React, { useEffect } from "react";
import { socket } from "@/hooks/socket";


interface VoucherTableProps {
    vouchers: Voucher[];
    expandedId: number | null;
    onToggleDetails: (id: number) => void;
    onEdit: (v: Voucher) => void;
    onToggleActive: (id: number) => void;
    onDelete: (id: number) => void;
    onReload?: () => void;
}


export default function VoucherTable({
    vouchers,
    expandedId,
    onToggleDetails,
    onEdit,
    onToggleActive,
    onDelete,
    onReload
}: VoucherTableProps) {

    useEffect(() => {
        const handleReload = () => {
            if (onReload) onReload();
        };
        socket.on("reloadVoucherForManager", handleReload);
        return () => {
            socket.off("reloadVoucherForManager", handleReload);
        };
    }, [onReload]);

    const checkEffective = (voucher: Voucher) => {
        const now = new Date();
        if (!voucher.active) return false;
        if (voucher.startAt && new Date(voucher.startAt) > now) return false;
        if (voucher.endAt && new Date(voucher.endAt) < now) return false;
        return true;
    };

    if (vouchers.length === 0) return <p>Không có voucher nào.</p>;


    return (
        <table className="w-full">
            <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Mã</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Loại</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Giảm</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Giá trị áp dụng</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Hiệu lực</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Ngày cập nhật</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Hành động</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {vouchers.map((v) => (
                    <React.Fragment key={v.id}>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-semibold">{v.code}</td>
                            <td className="px-6 py-4">{v.discountType}</td>
                            <td className="px-6 py-4">{v.discountValue}{v.discountType === "PERCENT" ? "%" : "₫"}</td>
                            <td className="px-6 py-4">
                                {v.minOrderAmount != null
                                    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v.minOrderAmount)
                                    : "-"}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${v.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                    {v.active ? "Hoạt động" : "Tạm dừng"}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {checkEffective(v) ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                        Đang hiệu lực
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
                                        Hết hiệu lực
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">{v.updatedAt ? new Date(v.updatedAt).toLocaleDateString("vi-VN") : "-"}</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => onToggleDetails(v.id!)} title="Xem chi tiết" className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                        <EyeIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => onEdit(v)} title="Cập nhật voucher" className="p-2 text-green-600 hover:bg-green-50 rounded">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        className={`p-2 rounded ${v.active ? "bg-red-300 text-white" : "bg-green-500 text-white"}`}
                                        onClick={() => onToggleActive(v.id!)}
                                    >
                                        {v.active ? <BanIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                                    </button>
                                    <button
                                        onClick={() => onDelete(v.id!)}
                                        className="p-2 bg-red-600 text-white rounded"
                                        title="Xóa voucher"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </td>
                        </tr>


                        {expandedId === v.id && (
                            <tr className="bg-gray-50">
                                <td colSpan={7} className="px-6 py-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div>Ngày bắt đầu: {v.startAt ? new Date(v.startAt).toLocaleString("vi-VN", { hour12: false }) : "-"}</div>
                                        <div>Ngày kết thúc: {v.endAt ? new Date(v.endAt).toLocaleString("vi-VN", { hour12: false }) : "-"}</div>
                                        <div>Giới hạn tổng: {v.usageLimit ? v.usageLimit : "∞"}</div>
                                        <div>Giảm tối đa: {v.maxDiscountAmount ? v.maxDiscountAmount.toLocaleString("vi-VN") + " ₫" : "không giới hạn"}</div>
                                        <div>Giới hạn mỗi user: {v.usageLimitPerUser ? v.usageLimitPerUser : "∞"}</div>
                                        <div>Lượt đã dùng: {v.usedCount ?? 0}</div>
                                        <div>Ngày tạo: {v.createdAt ? new Date(v.createdAt).toLocaleDateString("vi-VN") : "-"}</div>
                                        <div>Người tạo: {v.createdBy}</div>
                                        <div>Người cập nhật: {v.updatedBy}</div>
                                        <div className="col-span-2">
                                            Apply Type: {v.applyType ?? "-"}
                                        </div>
                                        <div>Mô tả:
                                            <div className="border p-2 rounded" dangerouslySetInnerHTML={{ __html: v.description ?? "" }} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
}