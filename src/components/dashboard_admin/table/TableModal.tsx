import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Table, TableArea } from "@/types/table.type";
import { toast } from "sonner";

interface Props {
    mode: "add" | "edit";
    initial?: Table | null;
    areas?: TableArea[];
    open: boolean;
    onOpenChange: (o: boolean) => void;
    onSubmit: (data: {
        code: string;
        description?: string;
        guestCount: number;
        status: string;
        areaId: number;
    }) => Promise<void> | void;
}

export default function TableModal({ mode, initial, areas, open, onOpenChange, onSubmit }: Props) {
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [guestCount, setGuestCount] = useState<number>(0);
    const [status, setStatus] = useState("EMPTY");
    const [areaId, setAreaId] = useState<number>(0);

    useEffect(() => {
        if (open) {
            if (mode === "edit" && initial) {
                setCode(initial.code);
                setDescription(initial.description ?? "");
                setGuestCount(initial.guestCount);
                setStatus(initial.status);
                setAreaId(initial.areaId);
            } else {
                setCode("");
                setDescription("");
                setGuestCount(1);
                setStatus("EMPTY");
                setAreaId(areas?.[0]?.areaId ?? 0);
            }
        }
    }, [open, mode, initial, areas]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) {
            toast.error("Vui lòng nhập mã bàn");
            return;
        }

        if (guestCount < 1) {
            toast.error("Số lượng khách phải từ 1 người trở lên");
            return;
        }
        await onSubmit({ code: code.trim(), description, guestCount, status, areaId });
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="fixed inset-0 bg-black/20 pointer-events-auto" onClick={() => onOpenChange(false)} />
            <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl p-5 space-y-4 z-10 pointer-events-auto border-2 border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{mode === "add" ? "Thêm Bàn" : "Chỉnh sửa Bàn"}</h3>
                    <button type="button" onClick={() => onOpenChange(false)} className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã bàn <span className="text-red-500">*</span></label>
                        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã bàn" required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Mô tả..." className="w-full px-3 py-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng khách</label>
                        <input type="number" min={1} max={15} value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="EMPTY">Trống</option>
                            <option value="OCCUPIED">Đang sử dụng</option>
                            <option value="RESERVED">Đã đặt</option>
                            <option value="WAITING_PAYMENT">Chờ thanh toán</option>
                            <option value="SERVING">Phục vụ</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Khu vực</label>
                        <select value={areaId} onChange={(e) => setAreaId(Number(e.target.value))} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {areas?.map((a) => (
                                <option key={a.areaId} value={a.areaId}>{a.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">{mode === "add" ? "Thêm" : "Lưu"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
