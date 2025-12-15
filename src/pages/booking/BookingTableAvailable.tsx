import { Calendar, Users, Filter, MapPin } from "lucide-react";
import TableFilterDetail from "@/components/booking/table/TableFilterDetail";
import { useTableAreas } from "@/hooks/useTableAreas";
import { useBookingTable } from "@/hooks/useBookingTable";
import type { Table } from "@/types/table.type";
import { useBooking } from "@/hooks/useBooking";
import { useEffect, useState } from "react";
import { socket } from "@/hooks/socket";
import PaginationControls from "@/components/ui/PaginationControls";

const BookingTableAvailable = () => {
  const { tableAreas } = useTableAreas();
  const {
    tableEmpty,
    totalPages,
    // isFetching,
    refetch,
    tableFilter,
    selectedTableAvailable,
    handlerPageChange,
    handlerSelectedAvailable,
    handlerHoldTable,
    
  } = useBookingTable();

  const { formatDateTime } = useBooking();
  const [selectTableId, setSelectTableId] = useState(0);

  // useEffect(() => {
  //   if (!socket) return;
  //   const handleTableUpdate = () => {
  //     console.log("Table availability updated - refetching...");
  //     refetch();
  //   };
  //   const handleHoldExpired = (data: { tableId: number; userId: number }) => {
  //     console.log("Table hold expired:", data);
  //     // Delay refetch to allow Redis to auto-delete OrderFlag
  //     setTimeout(() => {
  //       console.log("Refetching after delay...");
  //       refetch();
  //     }, 600); // 600ms delay to ensure Redis has deleted the OrderFlag
  //   };
  //   socket.on("hold_table", handleTableUpdate);
  //   socket.on("delete_hold_table", handleTableUpdate);
  //   socket.on("reset_table_available", handleTableUpdate);
  //   socket.on("table_hold_expired", handleHoldExpired);
  //   return () => {
  //     socket.off("hold_table", handleTableUpdate);
  //     socket.off("delete_hold_table", handleTableUpdate);
  //     socket.off("reset_table_available", handleTableUpdate);
  //     socket.off("table_hold_expired", handleHoldExpired);
  //   };
  // }, [socket, refetch]);

  useEffect(() => {
    if (!socket) return;
    const handleTableUpdate = () => {
      refetch();
    };

    const handleExpire = (holdId: string) => {
      console.log("Hold expired:", holdId);
      setTimeout(() => {
        refetch();
      }, 300);
    };

  
    socket.on("table_hold_expired", handleExpire);
    socket.on("hold_table", handleTableUpdate);
    socket.on("reset_table_available", handleExpire);
    return () => {
      socket.off("table_hold_expired", handleExpire);
      socket.off("hold_table", handleTableUpdate);
      socket.off("reset_table_available", handleExpire);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, refetch]);

  function isBookingDisabled(): boolean {
    if (
      !tableFilter.reservationTime ||
      !tableFilter.guestCount ||
      tableFilter.guestCount <= 0
    ) {
      return true;
    }

    const date = new Date(tableFilter.reservationTime);
    if (isNaN(date.getTime())) return true;

    const now = new Date();
    if (date < now) return true;

    // Thêm kiểm tra xem bàn đã được chọn chưa
    if (!selectedTableAvailable?.id) return true;

    return false;
  }

  return (
    <div className="mt-18 min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form đặt bàn */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card thông tin đặt bàn */}
            <TableFilterDetail tableAreas={tableAreas} />

            {/* Danh sách bàn còn trống */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Bàn còn trống ({tableEmpty.length})
              </h2>

              {tableEmpty.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">
                    Không có bàn phù hợp với yêu cầu của bạn
                  </p>
                  <p className="text-sm mt-2">Vui lòng thử điều chỉnh bộ lọc</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {tableEmpty.map((table: Table) => (
                    <div
                      key={table.id}
                      className="p-4 bg-linear-to-br from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
                      onClick={() => {
                        handlerSelectedAvailable(table);
                        setSelectTableId(table.id || 0);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-800">
                          {table.code}
                        </h3>
                        <div>
                          {selectTableId === table.id ? (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                              Đang chọn
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Users size={16} className="text-orange-500" />
                          <span>Sức chứa: {table.guestCount} người</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin size={16} className="text-orange-500" />
                          <span> {table.areaName}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <PaginationControls
              page={tableFilter.page || 1}
              totalPages={totalPages} // đúng tổng số trang
              onPageChange={handlerPageChange}
            />
          </div>

          {/* Sidebar - Tóm tắt đặt bàn */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Tóm tắt đặt bàn
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Calendar className="text-orange-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Ngày</p>
                    <p className="font-semibold text-gray-800">
                      {tableFilter.reservationTime
                        ? formatDateTime(tableFilter.reservationTime)
                        : "Chưa chọn"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <Filter className="text-amber-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Thông tin bàn</p>
                    <p className="font-semibold text-gray-800">
                      {selectedTableAvailable?.code &&
                      selectedTableAvailable?.guestCount
                        ? `${selectedTableAvailable.code} bàn cho ${selectedTableAvailable.guestCount} người`
                        : "Chưa có"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Users className="text-orange-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Số khách</p>
                    <p className="font-semibold text-gray-800">
                      {tableFilter.guestCount} người
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  handlerHoldTable();
                }}
                disabled={isBookingDisabled()}
                className={` w-full py-4 rounded-lg font-bold text-lg transition-all transform
                  ${isBookingDisabled() ? "hover:scale-105" : "hover:scale-100"}
                  ${
                    !isBookingDisabled()
                      ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Xác nhận đặt bàn
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Bằng cách đặt bàn, bạn đồng ý với điều khoản dịch vụ của chúng
                tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTableAvailable;
