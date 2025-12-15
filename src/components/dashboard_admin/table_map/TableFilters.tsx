import { Search, Filter } from "lucide-react";
import type { TableArea } from "@/types/table.type";
import { useState } from "react";

interface Props {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedArea: number | null;
    setSelectedArea: (value: number | null) => void;
    selectedStatus: string | null;
    setSelectedStatus: (value: string | null) => void;
    Areas: TableArea[];
}

export default function TableFilters({
    searchTerm,
    setSearchTerm,
    selectedArea,
    setSelectedArea,
    selectedStatus,
    setSelectedStatus,
    Areas
}: Props) {
    const [showFilters, setShowFilters] = useState(false);

    const statusConfig = {
        EMPTY: { label: "Trống", color: "text-green-700", bgColor: "bg-green-50", borderColor: "border-green-300" },
        SERVING: { label: "Đang phục vụ", color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-300" },
        WAITING_PAYMENT: { label: "Chờ thanh toán", color: "text-orange-700", bgColor: "bg-orange-50", borderColor: "border-orange-300" },
        RESERVED: { label: "Đã đặt", color: "text-purple-700", bgColor: "bg-purple-50", borderColor: "border-purple-300" },
        OCCUPIED: { label: "Có khách", color: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-300" },
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Bộ Lọc</h2>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Filter size={20} />
                    {showFilters ? 'Ẩn Bộ Lọc' : 'Hiện Bộ Lọc'}
                </button>
            </div>

            {showFilters ? (
                <>
                    {/* Search */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Tìm kiếm</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                placeholder="Tìm mã bàn hoặc mô tả..."
                            />
                        </div>
                    </div>

                    {/* Area */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Khu vực</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedArea(null)}
                                className={`px-4 py-2 rounded-lg ${selectedArea === null ? "bg-blue-600 text-white" : "bg-gray-200"
                                    }`}
                            >
                                Tất cả
                            </button>

                            {Areas.map(area => (
                                <button
                                    key={area.areaId}
                                    onClick={() => setSelectedArea(area.areaId ?? 0)}
                                    className={`px-4 py-2 rounded-lg ${selectedArea === area.areaId ? "bg-blue-600 text-white" : "bg-gray-200"
                                        }`}
                                >
                                    {area.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Trạng thái</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedStatus(null)}
                                className={`px-4 py-2 rounded-lg ${selectedStatus === null ? "bg-blue-600 text-white" : "bg-gray-200"
                                    }`}
                            >
                                Tất cả
                            </button>

                            {Object.entries(statusConfig).map(([key, cfg]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedStatus(key)}
                                    className={`px-4 py-2 rounded-lg ${selectedStatus === key
                                        ? `${cfg.bgColor} ${cfg.color} border-2 ${cfg.borderColor}`
                                        : "bg-gray-200"
                                        }`}
                                >
                                    {cfg.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            ) : null}

        </div>
    );
}
