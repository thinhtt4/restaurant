import { Search, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  activeStatus: string | undefined; // Đổi từ activeTab sang activeStatus
  onStatusChange: (status: string | undefined) => void; // Đổi từ onTabChange
  dateFilter: string;
  timeFilter: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onSearch: (s: string) => void;
  onAdd: () => void;
  searchValue?: string;
}

const BookingToolbar = ({
  activeStatus,
  onStatusChange,
  dateFilter,
  timeFilter,
  onDateChange,
  onTimeChange,
  onSearch,
  searchValue = "",
}: Props) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchValue) {
        onSearch(localSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, searchValue, onSearch]);

  const activeFiltersCount =
    (dateFilter && dateFilter !== "all" ? 1 : 0) +
    (timeFilter && timeFilter !== "all" ? 1 : 0);

  // Định nghĩa tabs với status value tương ứng
  const tabs = [
    { status: undefined, label: "Tất cả" },
    { status: "ORDERING", label: "Chờ đặt cọc" },
    { status: "DEPOSITED_SUCCESS", label: "Chờ nhận bàn" },
    { status: "CHECK_IN", label: "Đã nhận bàn" },
    { status: "SUCCESS", label: "Đã hoàn thành" },
    { status: "CANCELLED", label: "Đã hủy" },
  ];

  // const clearAllFilters = () => {
  //     onDateChange("all");
  //     onTimeChange("all");
  // };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const handleSearchClear = () => {
    setLocalSearch("");
    onSearch("");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(localSearch);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-4">
      {/* Row 1: Title and Add Button */}
      {/* <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Quản lý đặt bàn</h1>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                    <Plus className="w-4 h-4" /> Tạo đơn đặt bàn
                </button>
            </div> */}

      {/* Row 2: Search, Filter Toggle, and Tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={localSearch}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tìm kiếm theo tên, SĐT, email..."
            />
            {localSearch && (
              <button
                onClick={handleSearchClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50 w-full sm:w-auto justify-center transition-colors ${
              activeFiltersCount > 0
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-300"
            }`}
          >
            <Filter className="w-4 h-4" />
            Bộ lọc
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Tabs - giờ dùng status trực tiếp */}
        <div className="flex gap-6 border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.status ?? "all"}
              onClick={() => onStatusChange(tab.status)}
              className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
                activeStatus === tab.status
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 3: Filters (ẩn/hiện) */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Bộ lọc nâng cao</h3>
            {/* <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                            <X className="w-4 h-4" /> Xóa tất cả
                        </button> */}
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-600 mb-2 block">
                Lọc theo ngày
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "Tất cả" },
                  { id: "yesterday", label: "Hôm qua" },
                  { id: "today", label: "Hôm nay" },
                  { id: "tomorrow", label: "Ngày mai" },
                  { id: "week", label: "Tuần này" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => onDateChange(id)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      dateFilter === id || (!dateFilter && id === "all")
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-600 mb-2 block">
                Lọc theo khung giờ
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "Tất cả" },
                  { id: "morning", label: "Sáng (8:00 - 12:00)" },
                  { id: "afternoon", label: "Chiều (12:00 - 17:00)" },
                  { id: "evening", label: "Tối (17:00 - 23:00)" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => onTimeChange(id)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      timeFilter === id || (!timeFilter && id === "all")
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingToolbar;
