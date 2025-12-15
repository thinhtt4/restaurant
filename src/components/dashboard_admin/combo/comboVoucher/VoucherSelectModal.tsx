/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState, useEffect, useRef } from "react";
import { useGetAllVoucherQuery } from "@/store/api/voucherApi";
import {
    useGetVouchersByComboIdQuery,
    useAssignVoucherToComboMutation,
    useRemoveVoucherFromComboMutation
} from "@/store/api/voucherComboApi ";
import { toast } from "sonner"
import { CheckCircleIcon, XCircleIcon, TagIcon, XIcon } from "lucide-react";
import type { Voucher } from "@/types/voucher.type";


interface VoucherSelectModalProps {
    comboId: number;
    onClose: () => void;
}

export default function VoucherSelectModal({ comboId, onClose }: VoucherSelectModalProps) {
    const [selectedVouchers, setSelectedVouchers] = useState<Set<number>>(new Set());
    const [isSaving, setIsSaving] = useState(false);
    const initializedRef = useRef(false);
    const currentComboIdRef = useRef(comboId);

    // Lấy danh sách tất cả voucher active
    const { data: voucherData, isLoading: voucherLoading } = useGetAllVoucherQuery({
        page: 1,
        pageSize: 100,
        active: true,
    });

    // Lấy vouchers đã được gán cho combo này
    const {
        data: assignedVouchersData,
        isLoading: assignedLoading,
        refetch: refetchAssignedVouchers  // ADDED: Lấy function refetch
    } = useGetVouchersByComboIdQuery(comboId, {
        refetchOnMountOrArgChange: true,
        skip: false,
    });

    const [assignVoucher] = useAssignVoucherToComboMutation();
    const [removeVoucher] = useRemoveVoucherFromComboMutation();
    const rawVouchers = voucherData?.data?.data || [];

    const now = new Date();

    const vouchers = rawVouchers.filter((v: Voucher) => {
        if (!v.startAt || !v.endAt) return false;

        const start = new Date(v.startAt);
        const end = new Date(v.endAt);
        console.log("v.applyType =", v.applyType);

        return (
            v.active === true &&
            start <= now &&
            end >= now &&
            v.applyType === "COMBO"
        );
    });

    const assignedVouchers = assignedVouchersData?.data || [];

    // Reset khi comboId thay đổi
    useEffect(() => {
        if (currentComboIdRef.current !== comboId) {
            currentComboIdRef.current = comboId;
            initializedRef.current = false;
            setSelectedVouchers(new Set());
        }
    }, [comboId]);

    // Load vouchers chỉ 1 lần khi có data
    useEffect(() => {
        if (!initializedRef.current && !assignedLoading && assignedVouchersData) {
            const assigned = new Set<number>(assignedVouchers.map(v => v.id!));
            setSelectedVouchers(assigned);
            initializedRef.current = true;

            console.log(`[VoucherModal] Initialized combo ${comboId} with ${assigned.size} vouchers`);
        }
    }, [assignedVouchers, assignedLoading, assignedVouchersData, comboId]);

    // Toggle voucher selection
    const handleToggleVoucher = (voucherId: number) => {
        setSelectedVouchers((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(voucherId)) {
                newSet.delete(voucherId);
            } else {
                newSet.add(voucherId);
            }
            return newSet;
        });
    };

    // Lưu thay đổi
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const currentAssignedIds = new Set(assignedVouchers.map(v => v.id!));
            const selectedIds = selectedVouchers;

            // Tìm vouchers cần thêm
            const toAdd = Array.from(selectedIds).filter(id => !currentAssignedIds.has(id));

            // Tìm vouchers cần xóa
            const toRemove = Array.from(currentAssignedIds).filter(id => !selectedIds.has(id));

            console.log(`[VoucherModal] Combo ${comboId}: Add ${toAdd.length}, Remove ${toRemove.length}`);

            // Thực hiện thêm
            for (const voucherId of toAdd) {
                await assignVoucher({
                    voucherId,
                    comboId,
                }).unwrap();
            }

            // Thực hiện xóa
            for (const voucherId of toRemove) {
                await removeVoucher({
                    voucherId,
                    comboId,
                }).unwrap();
            }

            // ADDED: Refetch data sau khi lưu thành công
            await refetchAssignedVouchers();

            toast.success("Cập nhật voucher thành công!");
            onClose();
        } catch (error: any) {
            console.error("Error:", error);
            toast.error(error?.data?.message || "Có lỗi xảy ra khi lưu");
        } finally {
            setIsSaving(false);
        }
    };

    if (voucherLoading || assignedLoading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6">
                    <p>Đang tải danh sách voucher...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <TagIcon className="w-6 h-6 text-amber-600" />
                        Chọn Voucher cho Combo #{comboId}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Danh sách voucher */}
                <div className="flex-1 overflow-y-auto p-6">
                    {vouchers.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            Không có voucher nào đang hoạt động
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {vouchers.map((voucher: Voucher) => {
                                const isSelected = selectedVouchers.has(voucher.id!);

                                return (
                                    <div
                                        key={voucher.id}
                                        onClick={() => handleToggleVoucher(voucher.id!)}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                            ? "border-amber-500 bg-amber-50"
                                            : "border-gray-200 hover:border-amber-300"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            {/* Voucher Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-mono font-bold text-lg text-amber-700">
                                                        {voucher.code}
                                                    </span>
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                                                        {voucher.discountType === "PERCENT"
                                                            ? `-${voucher.discountValue}%`
                                                            : `-${voucher.discountValue.toLocaleString()}₫`}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-2">
                                                    {voucher.description}
                                                </p>

                                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                                    {/* {voucher.minOrderAmount && (
                                                        <span>
                                                            Đơn tối thiểu: {voucher.minOrderAmount.toLocaleString()}₫
                                                        </span>
                                                    )} */}
                                                    {voucher.endAt && (
                                                        <span>
                                                            HSD: {new Date(voucher.endAt).toLocaleDateString("vi-VN")}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Checkbox Icon */}
                                            <div>
                                                {isSelected ? (
                                                    <CheckCircleIcon className="w-6 h-6 text-amber-600" />
                                                ) : (
                                                    <XCircleIcon className="w-6 h-6 text-gray-300" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                    <p className="text-sm text-gray-600">
                        Đã chọn: <span className="font-semibold">{selectedVouchers.size}</span> voucher
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 text-sm font-medium transition-colors"
                        >
                            {isSaving ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}