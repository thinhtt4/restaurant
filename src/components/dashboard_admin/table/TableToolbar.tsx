import type { TableArea } from "@/types/table.type";
import { Filter, Plus, Search, X } from "lucide-react";
import { useState } from "react";

interface Props {
    onSearch: (s: string) => void;
    onAdd: () => void;
    onGuestFilter: (from?: number, to?: number) => void;
    onAreaFilter: (areaId?: number) => void;
    onStatusFilter: (status?: string) => void;
    areas: Array<TableArea>;
}

const TableToolbar = ({
    onAdd,
    onSearch,
    onGuestFilter,
    onAreaFilter,
    onStatusFilter,
    areas
}: Props) => {
    const [guestFrom, setGuestFrom] = useState('');
    const [guestTo, setGuestTo] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const applyGuestFilter = () => {
        onGuestFilter(
            guestFrom ? Number(guestFrom) : undefined,
            guestTo ? Number(guestTo) : undefined
        );
    };

    const clearGuestFilter = () => {
        setGuestFrom('');
        setGuestTo('');
        onGuestFilter(undefined, undefined);
    };

    const clearAllFilters = () => {
        setGuestFrom('');
        setGuestTo('');
        onGuestFilter(undefined, undefined);
        onAreaFilter(undefined);
        onStatusFilter(undefined);
        // Reset selects
        const areaSelect = document.getElementById('area-filter') as HTMLSelectElement;
        const statusSelect = document.getElementById('status-filter') as HTMLSelectElement;
        if (areaSelect) areaSelect.value = '';
        if (statusSelect) statusSelect.value = '';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-4">

            {/* Row 1: Search + Filter toggle + Add button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">

                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded"
                        placeholder="Tìm kiếm theo code hoặc mô tả..."
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        <Filter className="w-4 h-4" />
                        Bộ lọc
                    </button>

                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        <Plus className="w-4 h-4" /> Thêm Table
                    </button>
                </div>
            </div>

            {/* Row 2: Bộ lọc nâng cao */}
            {showFilters && (
                <div className="border-t pt-4 space-y-4">

                    {/* Header + Clear all */}
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-700">Bộ lọc nâng cao</h3>

                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                            <X className="w-4 h-4" /> Xóa tất cả
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center">

                        {/* Guest filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Số khách:</span>

                            <input
                                type="number"
                                value={guestFrom}
                                onChange={(e) => setGuestFrom(e.target.value)}
                                placeholder="Từ"
                                className="w-20 px-2 py-1 border rounded text-sm"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                value={guestTo}
                                onChange={(e) => setGuestTo(e.target.value)}
                                placeholder="Đến"
                                className="w-20 px-2 py-1 border rounded text-sm"
                            />

                            <button
                                onClick={applyGuestFilter}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                                Áp dụng
                            </button>
                            <button
                                onClick={clearGuestFilter}
                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                            >
                                Xóa
                            </button>
                        </div>

                        {/* Area filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Khu vực:</span>

                            <select
                                id="area-filter"
                                onChange={(e) =>
                                    onAreaFilter(e.target.value ? Number(e.target.value) : undefined)
                                }
                                className="px-3 py-1 border rounded text-sm"
                            >
                                <option value="">Tất cả</option>
                                {areas.map(area => (
                                    <option key={area.areaId} value={area.areaId}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Trạng thái:</span>

                            <select
                                id="status-filter"
                                onChange={(e) =>
                                    onStatusFilter(e.target.value || undefined)
                                }
                                className="px-3 py-1 border rounded text-sm"
                            >
                                <option value="">Tất cả</option>
                                <option value="EMPTY">Trống</option>
                                <option value="SERVING">Phục vụ</option>
                                <option value="WAITING_PAYMENT">Chờ thanh toán</option>
                                <option value="RESERVED">Đã đặt</option>
                                <option value="OCCUPIED">Đang sử dụng</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableToolbar;
