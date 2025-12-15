import { Search } from "lucide-react";
interface BookingHistoryFilterProps {
  keyword: string;
  status: string;
  minPrice: string;
  maxPrice: string;

  searchKeyword: (value: string) => void;
  searchStatus: (value: string) => void;
  searchMinPrice: (value: string) => void;
  searchMaxPrice: (value: string) => void;
}

const BookingHistoryFilter = ({
  keyword,
  status,
  minPrice,
  maxPrice,

  searchKeyword,
  searchStatus,
  searchMinPrice,
  searchMaxPrice} : BookingHistoryFilterProps
) => {
  // const {
  //   keyword,
  //   status,
  //   minPrice,
  //   maxPrice,

  //   searchKeyword,
  //   searchStatus,
  //   searchMinPrice,
  //   searchMaxPrice,
  // } = useHistoryOrder();
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên"
            value={keyword}
            onChange={(e) => searchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <input
              type="number"
              placeholder="Giá tối thiểu"
              value={minPrice}
              onChange={(e) => searchMinPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="Giá tối đa"
              value={maxPrice}
              onChange={(e) => searchMaxPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
        <select
          value={status}
          onChange={(e) => searchStatus(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option disabled>Trạng thái</option>
          <option value="All">Tất cả </option>
          <option value="ORDERING">Đang chờ thanh toán</option>
          <option value="DEPOSITED_SUCCESS">Đã thanh toán cọc</option>
          <option value="SUCCESS">Đã thanh toán toàn bộ</option>
          <option value="CANCELLED">Đã hủy thanh toán</option>
          <option value="FAILED">Hết thời gian/Thanh toán thất bại</option>
        </select>
      </div>
    </div>
  );
};

export default BookingHistoryFilter;
