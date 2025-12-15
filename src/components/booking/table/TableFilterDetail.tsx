/* eslint-disable react-hooks/exhaustive-deps */
import { socket } from "@/hooks/socket";
import { useAuth } from "@/hooks/useAuth";
import { useBookingTable } from "@/hooks/useBookingTable";
import { useGetHoldTableQuery } from "@/store/api/orderApi";
import type { TableArea } from "@/types/table.type";
import {
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  Minus,
  Plus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface TableFilterForm {
  tableAreas: TableArea[];
}

const TableFilterDetail = ({ tableAreas }: TableFilterForm) => {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const { tableHold: tableHoldBookingTable } = useBookingTable();

  const {
    tableFilter,
    handlerGuestCountFilter,
    handlerReservationTimeFilter,
    handlerAreaFilter,
    handlerClearTableHoldAndSelectedTable,
  } = useBookingTable();

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
  ];

  const getMinTimeForToday = (selectedDate?: string) => {
    const today = new Date();
    if (!selectedDate) return "00:00";

    const [year, month, day] = selectedDate.split("-").map(Number);

    if (
      year === today.getFullYear() &&
      month === today.getMonth() + 1 &&
      day === today.getDate()
    ) {
      const now = new Date();
      // now.setHours(now.getHours() + 3);

      now.setHours(now.getHours() + 1);
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}`;
    }

    return "00:00";
  };

  // Lấy giá trị date/time từ Redux filter
  const getDateValue = () => {
    if (tableFilter.reservationTime) {
      return tableFilter.reservationTime.split("T")[0];
    }
    const today = new Date();
    return today.toISOString().split("T")[0]; // yyyy-mm-dd
  };
  const getTimeValue = () =>
    tableFilter.reservationTime?.split("T")[1]?.slice(0, 5) || "00:00";

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value; // yyyy-mm-dd
    const minTime = getMinTimeForToday(selectedDate); // truyền ngày đã chọn
    let timeToSet = getTimeValue();

    // Nếu giờ hiện tại < giờ tối thiểu → đặt lại
    if (timeToSet < minTime) timeToSet = minTime;

    handlerReservationTimeFilter(`${selectedDate}T${timeToSet}:00`);
  };

  const handleTimeChange = (time: string) => {
    handlerReservationTimeFilter(`${getDateValue()}T${time}:00`);
  };

  const handleGuestCountChange = (count: number) => {
    handlerGuestCountFilter(count);
  };

  const handleAreaSelect = (areaId: number) => {
    handlerAreaFilter(areaId);
  };

  const holdKey = tableHoldBookingTable
    ? `hold:${user?.data.id}:${tableHoldBookingTable.id}`
    : undefined;

  const { data: holdTTL } = useGetHoldTableQuery(holdKey!, {
    skip: !holdKey,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const ttl = holdTTL?.data;

    if (typeof ttl === "number" && ttl <= 0) {
      handlerClearTableHoldAndSelectedTable();
    }
  }, [holdTTL]);

  useEffect(() => {
    if (!socket) return;

    const handleHoldExpired = () => {
      handlerClearTableHoldAndSelectedTable();
    };
    socket.on("table_hold_expired", handleHoldExpired);
    return () => {
      socket.off("table_hold_expired", handleHoldExpired);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="text-orange-500" />
          Thông tin đặt bàn
        </h2>

        <div className="space-y-6">
          {/* Chọn ngày */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chọn ngày
            </label>
            <input
              type="date"
              value={getDateValue()}
              onChange={handleDateChange}
              min={getMinDate()}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Chọn giờ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={18} className="text-orange-500" />
              Chọn giờ
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {timeSlots
                .filter((time) => {
                  const [hour, minute] = time.split(":").map(Number);
                  const [minHour, minMinute] = getMinTimeForToday(
                    getDateValue()
                  )
                    .split(":")
                    .map(Number);

                  return (
                    hour > minHour || (hour === minHour && minute >= minMinute)
                  );
                })
                .map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeChange(time)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                      getTimeValue() === time
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                        : "bg-orange-50 text-gray-700 hover:bg-orange-100 border border-orange-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
            </div>
          </div>

          {/* Số lượng khách */}
          <div className="w-full bg-white p-2 rounded-full shadow-lg shadow-orange-100 border border-orange-100 flex items-center justify-between gap-2">
            {/* PHẦN 1: BỘ CHỌN SỐ LƯỢNG (Bên trái) */}
            <div className="flex items-center gap-3 pl-2 pr-4 border-r border-gray-100">
              {/* Icon & Label nhỏ */}
              <div className="flex items-center gap-2 text-orange-600">
                <Users size={20} />
                <span className="text-xs font-bold uppercase text-gray-400 hidden sm:block">
                  Khách
                </span>
              </div>

              {/* Bộ đếm */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleGuestCountChange(
                      Math.max(1, (tableFilter.guestCount || 2) - 1)
                    )
                  }
                  disabled={(tableFilter.guestCount || 2) <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>

                <span className="w-6 text-center font-bold text-lg text-gray-800 tabular-nums">
                  {tableFilter.guestCount || 2}
                </span>

                <button
                  onClick={() =>
                    handleGuestCountChange(
                      Math.min(10, (tableFilter.guestCount || 2) + 1)
                    )
                  }
                  disabled={(tableFilter.guestCount || 2) >= 10}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1">
              {tableHoldBookingTable ? (
                <Link to="/app/booking-table">
                  <button className="w-full h-10 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-full shadow-md transition-all flex items-center justify-center gap-2 group">
                    <span>Tiếp tục nhập thông tin</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </Link>
              ) : (
                <div className="h-10 flex items-center justify-center text-gray-400 text-sm italic pr-4">
                  Vui lòng chọn bàn
                </div>
              )}
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold rounded-lg transition-all"
          >
            <Filter size={20} />
            {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc khu vực"}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-3 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Khu vực ưa thích
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tableAreas.map((area: TableArea) => (
                  <button
                    key={area.areaId}
                    onClick={() => handleAreaSelect(area.areaId ?? 0)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      tableFilter.areaId === area.areaId
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-orange-50 border border-orange-200"
                    }`}
                  >
                    {area.name}
                  </button>
                ))}
                <button
                  onClick={() => handleAreaSelect(-1)}
                  className="px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-orange-50 border border-orange-200"
                >
                  Xóa chọn khu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableFilterDetail;
