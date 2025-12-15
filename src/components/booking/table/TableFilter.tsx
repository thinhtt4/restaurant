import { useBookingTable } from "@/hooks/useBookingTable";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TableFilter() {
  const navigate = useNavigate();

  const {
    refetch,
  } = useBookingTable();
  const { tableFilter, handlerGuestCountFilter, handlerReservationTimeFilter } =
    useBookingTable();

  const getDateValue = () => tableFilter.reservationTime?.split("T")[0] || "";
  const getTimeValue = () =>
    tableFilter.reservationTime?.split("T")[1]?.slice(0, 5) || "00:00";

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlerReservationTimeFilter(`${e.target.value}T${getTimeValue()}:00`);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlerReservationTimeFilter(`${getDateValue()}T${e.target.value}:00`);
  };

  const handleSearch = () => {
    refetch()
    navigate("/app/booking-table-available");
  };

  return (
    <div className="w-full bg-linear-to-r from-red-500 to-red-600 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Ngày */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Ngày
              </label>
              <input
                type="date"
                value={getDateValue()}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Thời gian */}
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Thời gian
              </label>
              <input
                type="time"
                value={getTimeValue()}
                onChange={handleTimeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Số người */}
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Số người
              </label>
              <div className="relative">
                <select
                  value={tableFilter.guestCount || 2}
                  onChange={(e) =>
                    handlerGuestCountFilter(parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500 appearance-none bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} người
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-8 rounded-lg transition duration-200 whitespace-nowrap"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
