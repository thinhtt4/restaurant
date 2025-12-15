import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { BookingInfo } from "@/types/booking.type";
import { useBooking } from "@/hooks/useBooking";
import { useForm } from "react-hook-form";
import { bookingTable, type BookingTable } from "@/schemas/bookingSchema";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/input/Input";
import { useGetHoldTableQuery } from "@/store/api/orderApi";
import CountdownTimer from "@/components/booking/table/CountDownTimer";
import { useBookingTable } from "@/hooks/useBookingTable";
import { socket } from "@/hooks/socket";
import { toast } from "sonner";

function formatDateTime(isoString: string) {
  if (!isoString) return "";

  const dateObj = new Date(isoString);

  return dateObj.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookingTable() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const holdData = location.state?.holdData;

  const { bookingInfo, setBookingInfo, confirmBookingWithInfo } = useBooking();
  const { tableHold, tableFilter, handleDeleteHoldTable } = useBookingTable();

  const {
    data: holdTtlResponse,
    isLoading,
    refetch,
  } = useGetHoldTableQuery(`hold:${user?.data.id}:${tableHold?.id}`, {
    skip: false,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const {
    refetch: bookingTableRefresh,
    handlerClearTableHoldAndSelectedTable,
  } = useBookingTable();

  const [duration, setDuration] = useState<number>(
    holdTtlResponse?.data || holdData?.holdExpire
  );

  // --- GIẢI PHÁP: Thêm useEffect này ---
  useEffect(() => {
    // Nếu có dữ liệu từ API, cập nhật ngay vào state
    if (holdTtlResponse?.data) {
      setDuration(holdTtlResponse.data);
    }
  }, [holdTtlResponse?.data]);

  useEffect(() => {
    if (tableHold) {
      setFormData((prev) => ({
        ...prev,
        people: tableHold.guestCount ?? prev.people,
        dateTime: tableFilter.reservationTime || prev.dateTime,
        note: bookingInfo?.note || prev.note,
        orderName: bookingInfo?.orderName || prev.orderName,
        email: bookingInfo?.email || prev.email,
        phone: bookingInfo?.phone || prev.phone,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableHold, bookingInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingTable>({
    resolver: zodResolver(bookingTable),
  });

  const [formData, setFormData] = useState<BookingInfo>(
    bookingInfo ?? {
      orderName: `${user?.data.firstName ?? ""} ${
        user?.data.lastName ?? ""
      }`.trim(),
      email: user?.data.email || "",
      phone: "",
      dateTime: tableFilter.reservationTime || "",
      people: tableHold?.guestCount || 2,
      note: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: BookingInfo) => ({
      ...prev,
      [name]: name === "people" ? parseInt(value) || 0 : value,
    }));
  };

  const timeOptions = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (const tmp of ["00", "15", "30", "45"]) {
      timeOptions.push(`${hour.toString().padStart(2, "0")}:${tmp}`);
    }
  }

  const onSubmit = () => {
    setBookingInfo(formData);
    confirmBookingWithInfo();
    handlerClearTableHoldAndSelectedTable()
    navigate("/app/booking-menu");
  };

  const handlerCancelHoldTable = () => {
    handleDeleteHoldTable(`hold:${user?.data.id}:${tableHold?.id}`);
    handlerClearTableHoldAndSelectedTable()
  };

  useEffect(() => {
    if (!socket) return;
    const handleDeleteHoldTable = () => {
      console.log("Hold table deleted - refetching TTL...");
      refetch();
    };
    const handleHoldExpired = (data: { tableId: number; userId: number }) => {
      console.log("Table hold expired event received:", data);

      // If current user's hold expired, redirect back to table selection
      if (user?.data.id === data.userId && tableHold?.id === data.tableId) {
        toast.info("Thời gian giữ bàn đã hết! Vui lòng chọn lại bàn.");
        handlerClearTableHoldAndSelectedTable();

        setTimeout(() => {
          bookingTableRefresh();

          navigate("/app/booking-table-available");
        }, 500); // 500ms delay
      } else {
        refetch();
      }
    };
    socket.on("delete_hold_table", handleDeleteHoldTable);
    socket.on("table_hold_expired", handleHoldExpired);
    return () => {
      socket.off("delete_hold_table", handleDeleteHoldTable);
      socket.off("table_hold_expired", handleHoldExpired);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user, tableHold, navigate, refetch]);

  return (
    <div className="min-h-screen  from-slate-900 via-slate-800 to-slate-900 py-12 px-4 mt-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-64 lg:h-auto">
              <img
                src="https://public.youware.com/users-website-assets/prod/85e22e3d-f87f-4ac3-a43c-cf5ea6e7d612/8ec5c4ecae8343cf8c85fad6c2c4db4a.jpg"
                alt="Couple dining"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Form Section */}
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <p className="text-amber-500 font-semibold mb-2">Đặt chỗ</p>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                  Điền thông tin khách hàng
                </h1>
                {/* <CountdownTimer duration={duration > 0 ? duration : 0} /> */}

                {isLoading ? (
                  <p>Đang tải thời gian...</p>
                ) : (
                  <CountdownTimer
                    key={duration}
                    duration={duration > 0 ? duration : 0}
                  />
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="orderName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Họ và tên bạn <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    {...register("orderName")}
                    error={errors.orderName?.message}
                    id="orderName"
                    value={formData.orderName}
                    onChange={handleChange}
                    placeholder="Anh Tuấn"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email của bạn <span className="text-red-500">*</span>
                  </label>
                  <Input
                    // {...register("email")}
                    // error={errors.email?.message}
                    type="text"
                    id="email"
                    value={user?.data.email}
                    readOnly
                    placeholder="sutten2004@gmail.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* <div>
                  <label
                    htmlFor="people"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Số người ăn <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="people"
                    name="people"
                    value={formData.people}
                    onChange={handleChange}
                    className="w-full h-[6vh] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all bg-white"
                    required
                  >
                    {guestOptions.map((num) => (
                      <option key={num} value={num}>
                        {num} người
                      </option>
                    ))}
                  </select>
                </div> */}

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("phone")}
                    error={errors.phone?.message}
                    type="text"
                    id="phone"
                    value={formData.phone} // ← dùng state
                    onChange={handleChange} // ← cập nhật state
                    placeholder="0877544321"
                  />
                </div>
                <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                  {tableHold ? (
                    <>
                      <p className="text-sm text-gray-700">
                        <strong>Bàn đã chọn:</strong>{" "}
                        {tableHold.code || `Bàn #${tableHold.id}`}
                      </p>

                      <p className="text-sm text-gray-700">
                        <strong>Sức chứa tối đa:</strong> {tableHold.guestCount}{" "}
                        người
                      </p>

                      <p className="text-sm text-gray-700">
                        <strong>Ngày đặt:</strong>{" "}
                        {formatDateTime(formData.dateTime)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Bạn chưa chọn bàn</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="note"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ghi chú thêm
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/app/booking-table-available")}
                    className="w-[15vw] bg-cyan-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                  >
                    TRỞ LẠI ĐẶT BÀN
                  </button>
                  <button
                    type="button"
                    onClick={() => handlerCancelHoldTable()}
                    className="w-[15vw] bg-amber-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl"
                  >
                    HỦY GIỮ BÀN
                  </button>
                  <button
                    type="submit"
                    className="w-[15vw] bg-amber-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl"
                  >
                    TIẾP THEO
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
