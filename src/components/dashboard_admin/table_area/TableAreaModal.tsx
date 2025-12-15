import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { TableArea } from "@/types/table.type";

interface Props {
    mode: "add" | "edit";
    initial?: TableArea | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { name: string }) => Promise<void> | void;
}

export default function TableAreaModal({ mode, initial, open, onOpenChange, onSubmit }: Props) {
    const [name, setName] = useState("");

    useEffect(() => {
        if (open) {
            if (mode === "edit" && initial) {
                setName(initial.name);
            } else {
                setName("");
            }
        }
    }, [open, mode, initial]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        await onSubmit({ name: name.trim() });
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="fixed inset-0 bg-black/20 pointer-events-auto" onClick={() => onOpenChange(false)} />
            <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl p-5 space-y-4 z-10 pointer-events-auto border-2 border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {mode === "add" ? "Thêm khu vực" : "Chỉnh sửa khu vực"}
                    </h3>
                    <button type="button" onClick={() => onOpenChange(false)} className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên khu vực <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tên khu vực"
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{mode === "add" ? "Thêm" : "Lưu"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
