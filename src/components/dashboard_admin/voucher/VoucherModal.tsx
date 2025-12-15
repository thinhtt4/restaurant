/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Voucher } from "@/types/voucher.type";
import { useEffect, useRef, useState } from "react";
import { createVoucherSchema, updateVoucherSchema } from "@/schemas/voucherSchema ";
import JoditEditor from "jodit-react";

interface VoucherModalProps {
    title: string;
    voucher: Voucher;
    onChange: (field: keyof Voucher, value: any) => void;
    onSave: (voucher: Voucher) => void;
    onClose: () => void;
    isUpdate?: boolean;
}

export default function VoucherModal({ title, voucher, onChange, onSave, onClose, isUpdate }: VoucherModalProps) {

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [description, setDescription] = useState(voucher.description || "");
    const previousMaxDiscount = useRef<number | null>(null);
    const [localMaxDiscount, setLocalMaxDiscount] = useState<number | "">(
        voucher.maxDiscountAmount ?? ""
    );
    const [localDiscountValue, setLocalDiscountValue] = useState<string>(
        voucher.discountValue?.toString() ?? ""
    );
    const [localMinOrderAmount, setLocalMinOrderAmount] = useState<string>(
        voucher.minOrderAmount?.toString() ?? ""
    );
    const [localUsageLimit, setLocalUsageLimit] = useState<string>(
        voucher.usageLimit?.toString() ?? ""
    );
    const [localUsageLimitPerUser, setLocalUsageLimitPerUser] = useState<string>(
        voucher.usageLimitPerUser?.toString() ?? ""
    );
    const [localApplyType, setLocalApplyType] = useState(voucher.applyType || "ORDER");

    const previousValues = useRef<{
        minOrderAmount: number | null;
        usageLimit: number | null;
        usageLimitPerUser: number | null;
    }>({
        minOrderAmount: null,
        usageLimit: null,
        usageLimitPerUser: null,
    });

    useEffect(() => {
        setLocalMaxDiscount(voucher.maxDiscountAmount ?? 0);
    }, [voucher.maxDiscountAmount]);

    useEffect(() => {
        setLocalApplyType(voucher.applyType || "ORDER");
    }, [voucher.applyType]);

    const handleSubmit = () => {

        const voucherToValidate = {
            ...voucher,
            description,
            maxDiscountAmount: localMaxDiscount === "" ? 0 : localMaxDiscount,
            applyType: localApplyType,
            minOrderAmount: Number(localMinOrderAmount),
            usageLimit: Number(localUsageLimit),
            usageLimitPerUser: Number(localUsageLimitPerUser),
            discountValue: Number(localDiscountValue),
        };

        const schema = isUpdate ? updateVoucherSchema : createVoucherSchema;

        const result = schema.safeParse(voucherToValidate);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach(err => {
                const key = err.path[0]?.toString();
                if (key) fieldErrors[key] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});
        onChange("description", description);
        onSave(voucherToValidate);
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <label className="block mb-1 font-medium">Mã</label>
                        <input
                            className={`border px-3 py-2 rounded w-full 
                                ${isUpdate ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                            value={voucher.code || ""}
                            onChange={e => onChange("code", e.target.value)}
                            disabled={isUpdate}
                        />
                        <p className="text-red-500 text-sm h-5 mt-1">{errors.code || ""}</p>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Loại</label>
                        <select
                            className="border px-3 py-2 rounded w-full"
                            value={voucher.discountType || "PERCENT"}
                            onChange={e => {
                                const newType = e.target.value;
                                if (newType === "FIXED") {
                                    previousMaxDiscount.current = voucher.maxDiscountAmount ?? null;
                                    setLocalMaxDiscount(0);
                                    onChange("maxDiscountAmount", 0);
                                }
                                if (newType === "PERCENT") {
                                    const restored = previousMaxDiscount.current ?? 0;
                                    setLocalMaxDiscount(restored);
                                    onChange("maxDiscountAmount", restored || null);
                                }
                                onChange("discountType", newType)
                            }}
                        >
                            <option value="PERCENT">PERCENT</option>
                            <option value="FIXED">FIXED</option>
                        </select>
                        <p className="text-red-500 text-sm h-5 mt-1">{errors.discountType || ""}</p>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium" title="">Giá trị giảm (Phần trăm hoặc Số tiền)</label>
                        <input
                            type="number"
                            className="border px-3 py-2 rounded w-full"
                            value={localDiscountValue}
                            onChange={e => {
                                setLocalDiscountValue(e.target.value);
                                const val = e.target.value;
                                onChange("discountValue", val === "" ? 0 : Number(val));
                            }}
                        />
                        <p className="text-red-500 text-sm h-5 mt-1">{errors.discountValue || ""}</p>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Apply Type</label>
                        <select
                            className="border px-3 py-2 rounded w-full"
                            value={localApplyType}
                            onChange={e => {
                                const newType = e.target.value as "ORDER" | "COMBO";
                                setLocalApplyType(newType);

                                // cập nhật giá trị chính cho parent
                                onChange("applyType", newType);

                                // =============== NẾU CHUYỂN SANG COMBO ===================
                                if (newType === "COMBO") {
                                    // lưu giá trị cũ để tí hồi lại
                                    previousValues.current = {
                                        minOrderAmount: voucher.minOrderAmount ?? 0,
                                        usageLimit: voucher.usageLimit ?? 0,
                                        usageLimitPerUser: voucher.usageLimitPerUser ?? 0,
                                    };

                                    // update state cho parent
                                    onChange("minOrderAmount", 0);
                                    onChange("usageLimit", 0);
                                    onChange("usageLimitPerUser", 0);

                                    // update local state
                                    setLocalMinOrderAmount("0");
                                    setLocalUsageLimit("0");
                                    setLocalUsageLimitPerUser("0");
                                }

                                // =============== NẾU CHUYỂN LẠI ORDER ===================
                                if (newType === "ORDER") {
                                    const prev = previousValues.current;

                                    const restoredMinOrder = prev.minOrderAmount ?? 0;
                                    // const restoredMaxDiscount = prev.maxDiscountAmount ?? 0;
                                    const restoredLimit = prev.usageLimit ?? 0;
                                    const restoredLimitUser = prev.usageLimitPerUser ?? 0;

                                    onChange("minOrderAmount", restoredMinOrder);
                                    onChange("usageLimit", restoredLimit);
                                    onChange("usageLimitPerUser", restoredLimitUser);

                                    setLocalMinOrderAmount(restoredMinOrder.toString());
                                    setLocalUsageLimit(restoredLimit.toString());
                                    setLocalUsageLimitPerUser(restoredLimitUser.toString());
                                }
                            }}
                        >
                            <option value="ORDER">ORDER</option>
                            <option value="COMBO">COMBO</option>
                        </select>
                        <p className="text-red-500 text-sm h-5 mt-1">
                            {errors.applyType || ""}
                        </p>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium" title="Giá trị tối thiểu đơn hàng để voucher được áp dụng (0 = áp dụng cho tất cả)">
                            Giá trị áp dụng (VND)</label>
                        <input
                            type="number"
                            className={`border px-3 py-2 rounded w-full 
                                ${localApplyType === "COMBO" ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                                }`}
                            value={localMinOrderAmount}
                            disabled={localApplyType === "COMBO"}
                            onChange={e => {
                                setLocalMinOrderAmount(e.target.value);
                                const val = e.target.value;
                                onChange("minOrderAmount", val === "" ? 0 : Number(val));
                            }}
                        />
                        <p className="text-red-500 text-sm h-5 mt-1">{errors.minOrderAmount || ""}</p>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium" title="Giá trị tối đa có thể giảm(nếu là Percent), vô hạn nếu là 0">
                            Giảm tối đa (VND)</label>
                        <input
                            type="number"
                            className={`border px-3 py-2 rounded w-full ${voucher.discountType === "FIXED"
                                ? "bg-gray-100 cursor-not-allowed"
                                : "bg-white"
                                }`}
                            value={voucher.discountType === "FIXED" ? "" : localMaxDiscount}
                            disabled={voucher.discountType === "FIXED"}
                            onChange={e => {
                                const val = e.target.value === "" ? "" : Number(e.target.value);
                                setLocalMaxDiscount(val);
                                onChange("maxDiscountAmount", val === "" ? 0 : val);
                            }}
                        />
                        <p className="text-red-500 text-sm h-5 mt-1">{errors.maxDiscountAmount || ""}</p>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Ngày bắt đầu</label>
                        <input
                            type="datetime-local"
                            className="border px-3 py-2 rounded w-full"
                            value={voucher.startAt ? voucher.startAt.slice(0, 16) : ""}
                            onChange={e => onChange("startAt", e.target.value)}
                        />
                        <p className="text-red-500 text-sm h-5 mt-1">{errors.startAt || ""}</p>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Ngày kết thúc</label>
                        <input
                            type="datetime-local"
                            className="border px-3 py-2 rounded w-full"
                            value={voucher.endAt ? voucher.endAt.slice(0, 16) : ""}
                            onChange={e => onChange("endAt", e.target.value)}
                        />
                        <p className="text-red-500 text-sm h-5 mt-1">{errors.endAt || ""}</p>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium" title="vô hạn nếu cài là 0">Giới hạn tổng</label>
                        <input
                            type="number"
                            className={`border px-3 py-2 rounded w-full 
                                ${localApplyType === "COMBO" ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                                }`}
                            value={localUsageLimit}
                            disabled={localApplyType === "COMBO"}
                            onChange={e => {
                                setLocalUsageLimit(e.target.value);
                                const val = e.target.value;
                                onChange("usageLimit", val === "" ? 0 : Number(val));
                            }}
                        />
                        <p className="text-red-500 text-sm h-5 mt-1">{errors.usageLimit || ""}</p>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium" title="vô hạn nếu cài là 0">Giới hạn mỗi user</label>
                        <input
                            type="number"
                            className={`border px-3 py-2 rounded w-full 
                                ${localApplyType === "COMBO" ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                                }`}
                            value={localUsageLimitPerUser}
                            disabled={localApplyType === "COMBO"}
                            onChange={e => {
                                setLocalUsageLimitPerUser(e.target.value);
                                const val = e.target.value;
                                onChange("usageLimitPerUser", val === "" ? 0 : Number(val));
                            }}
                        />
                        <p className="text-red-500 text-sm h-5 mt-1">{errors.usageLimitPerUser || ""}</p>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả
                        </label>
                        <div className="border rounded-lg overflow-hidden">
                            <JoditEditor
                                value={description}
                                onChange={(newContent) => {
                                    setDescription(newContent);
                                }}
                            />
                        </div>
                        <p className="text-red-500 text-sm h-5 mt-1">{errors.description || ""}</p>
                    </div>
                </div>


                <div className="flex justify-end gap-2 mt-6">
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={handleSubmit}
                    >
                        {title.includes("Tạo") ? "Tạo" : "Lưu"}
                    </button>
                    <button
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}



