import type { MenuCategory } from "@/types/menuItem.type";
import { DollarSign, Filter, Search, X } from "lucide-react";
import { useState } from "react";

interface CategoryFilterForm{
  categories : MenuCategory[],
  setCategoryId : (value: number) => void,
  setSearch: (value: string) => void,
  handlePriceFilter: (priceFrom?: number, priceTo?: number) => void,
}
const CategoryFilter = ({
  categories,
  setCategoryId,
  setSearch,
  handlePriceFilter,
}:CategoryFilterForm) => {
  const priceRanges = [
    { label: "Dưới 50k", min: 0, max: 50000 },
    { label: "50k - 100k", min: 50000, max: 100000 },
    { label: "100k - 200k", min: 100000, max: 200000 },
    { label: "200k - 300k", min: 200000, max: 300000 },
    { label: "Trên 300k", min: 300000, max: 999999999 },
  ];

  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const handlerSelectedCategory = (id: number) => {
    setCategoryId(id);
    setSelectedCategoryId(id);
  };

  const clearFilters = () => {
    setCategoryId(1);
    setSelectedCategoryId(0);
    setMaxPrice("-1");
    setMinPrice("-1");
    handlePriceFilter(0, 100000000);
  };
  const setPriceRange = (min: number, max: number) => {
    if (min === 300000) {
      setMinPrice(min.toString());
      setMaxPrice("");
    } else {
      setMinPrice(min.toString());
      setMaxPrice(max.toString());
    }
    handlePriceFilter(min, max);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 p-6 bg-white rounded-xl shadow-lg">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Tìm kiếm tên món ăn..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Price Range Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <DollarSign
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="number"
            placeholder="Giá từ (VNĐ)"
            value={minPrice ==="-1" ? "" : minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="relative">
          <DollarSign
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="number"
            placeholder="Giá đến (VNĐ)"
            value={maxPrice === "-1" ? "" : maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Quick Price Filters */}
      <div className="flex flex-wrap gap-2">
        {priceRanges.map((range, index) => (
          <button
            key={index}
            onClick={() => setPriceRange(range.min, range.max)}
            className={`px-4 py-2 rounded-full transition text-sm font-medium
            ${ minPrice !== "-1" &&
    maxPrice !== "-1" &&
              (maxPrice !== "" &&
                Number(minPrice) === range.min &&
                Number(maxPrice) === range.max) ||
              (range.min === 300000 && maxPrice === "")
                ? "bg-orange-600 text-white"
                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
            }
          `}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="text-gray-600" size={20} />
        <span className="text-gray-700 font-medium">Danh mục:</span>
        {categories.map((category) => (
          <button
            key={category.categoryId}
            className={`px-4 py-2 rounded-full transition text-sm font-medium ${
              selectedCategoryId === category.categoryId
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handlerSelectedCategory(category.categoryId ?? 0)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
      >
        <X size={18} />
        Xóa bộ lọc
      </button>
      {/* </div> */}
    </div>
  );
};

export default CategoryFilter;
