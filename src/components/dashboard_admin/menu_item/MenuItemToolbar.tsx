import type { MenuCategory } from "@/types/menuItem.type";
import { Plus, Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface Props {
    onSearch: (s: string) => void;
    onAdd: () => void;
    onPriceFilter: (from?: number, to?: number) => void;
    onCategoryFilter: (categoryId?: number) => void;
    onActiveFilter: (active?: boolean) => void;
    categories: Array<MenuCategory>;
}

const MenuItemToolbar = ({
    onAdd,
    onSearch,
    onPriceFilter,
    onCategoryFilter,
    onActiveFilter,
    categories
}: Props) => {
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const applyPriceFilter = () => {
        onPriceFilter(
            priceFrom ? Number(priceFrom) : undefined,
            priceTo ? Number(priceTo) : undefined
        );
    };

    const clearPriceFilter = () => {
        setPriceFrom('');
        setPriceTo('');
        onPriceFilter(undefined, undefined);
    };

    const clearAllFilters = () => {
        setPriceFrom('');
        setPriceTo('');
        onPriceFilter(undefined, undefined);
        onCategoryFilter(undefined);
        onActiveFilter(undefined);
        // Reset selects
        const categorySelect = document.getElementById('category-filter') as HTMLSelectElement;
        const statusSelect = document.getElementById('status-filter') as HTMLSelectElement;
        if (categorySelect) categorySelect.value = '';
        if (statusSelect) statusSelect.value = '';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-4">
            {/* Row 1: Search, Filter Toggle và Add button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded"
                        placeholder="Tìm kiếm theo tên menu item..."
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
                        <Plus className="w-4 h-4" /> Thêm Menu Item
                    </button>
                </div>
            </div>

            {/* Row 2: Các bộ lọc (ẩn/hiện) */}
            {showFilters && (
                <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-700">Bộ lọc nâng cao</h3>
                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                            <X className="w-4 h-4" /> Xóa tất cả
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Price filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 whitespace-nowrap">Giá tiền:</span>
                            <input
                                type="number"
                                value={priceFrom}
                                onChange={(e) => setPriceFrom(e.target.value)}
                                placeholder="Từ"
                                className="w-24 px-2 py-1 border rounded text-sm"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                value={priceTo}
                                onChange={(e) => setPriceTo(e.target.value)}
                                placeholder="Đến"
                                className="w-24 px-2 py-1 border rounded text-sm"
                            />
                            <button
                                onClick={applyPriceFilter}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                                Áp dụng
                            </button>
                            <button
                                onClick={clearPriceFilter}
                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                            >
                                Xóa
                            </button>
                        </div>

                        {/* Category filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Danh mục:</span>
                            <select
                                id="category-filter"
                                onChange={(e) => onCategoryFilter(e.target.value ? Number(e.target.value) : undefined)}
                                className="px-3 py-1 border rounded text-sm"
                            >
                                <option value="">Tất cả</option>
                                {categories.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Trạng thái:</span>
                            <select
                                id="status-filter"
                                onChange={(e) => onActiveFilter(e.target.value ? e.target.value === 'true' : undefined)}
                                className="px-3 py-1 border rounded text-sm"
                            >
                                <option value="">Tất cả</option>
                                <option value="true">Đang hoạt động</option>
                                <option value="false">Ngừng hoạt động</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuItemToolbar;