import { useState } from "react";
import { X, ArrowRightLeft, Users } from "lucide-react";
import type { Table } from "@/types/table.type";
import { toast } from "sonner";

interface MoveTableModalProps {
    tables: Table[];
    isOpen: boolean;
    onClose: () => void;
    currentTable: Table;
    onConfirm: (newTableId: number) => Promise<void>;
}

export default function MoveTableModal({
    isOpen,
    onClose,
    currentTable,
    onConfirm,
    tables,

}: MoveTableModalProps) {
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

    const filteredTables = tables.filter(item => item.status === "EMPTY");

    const availableTables = filteredTables.filter((t: Table) => t.id !== currentTable.id) || [];

    const handleConfirm = async () => {
        if (!selectedTableId) {
            toast.error("Vui lòng chọn bàn muốn chuyển đến!");
            return;
        }
        await onConfirm(selectedTableId);
        handleClose();
    };

    const handleClose = () => {
        setSelectedTableId(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="p-5 bg-blue-600 text-white rounded-t-2xl flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <ArrowRightLeft className="text-white" size={24} />
                        <div>
                            <h2 className="text-xl font-bold">Chuyển bàn</h2>
                            <p className="text-blue-100 text-sm">
                                Đang chuyển từ bàn <span className="font-bold text-white">{currentTable.code}</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <X size={22} />
                    </button>
                </div>

                {/* Body - List Table */}
                <div className="p-6 overflow-y-auto flex-1">
                    <h3 className="font-semibold text-gray-700 mb-4">Chọn bàn trống để chuyển đến:</h3>

                    {availableTables.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            Không có bàn trống nào khác để chuyển.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {availableTables.map((table: Table) => (
                                <button
                                    key={table.id}
                                    onClick={() => setSelectedTableId(table.id ?? 0)}
                                    className={`
                    relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                    ${selectedTableId === table.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                        }
                  `}
                                >
                                    <span className="text-lg font-bold">{table.code}</span>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Users size={14} />
                                        <span>{table.guestCount} chỗ</span>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 mt-1">
                                        Trống
                                    </span>

                                    {/* Selected Indicator */}
                                    {selectedTableId === table.id && (
                                        <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-white transition-colors text-gray-700"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedTableId}
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-200"
                    >
                        Xác nhận chuyển
                    </button>
                </div>
            </div>
        </div>
    );
}