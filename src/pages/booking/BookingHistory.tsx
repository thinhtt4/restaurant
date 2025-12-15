/* eslint-disable @typescript-eslint/no-explicit-any */
import { useHistoryOrder } from "@/hooks/useHistoryOrder";
import { Link } from "react-router-dom";
import PaginationControls from "@/components/ui/PaginationControls";
import BookingHistoryFilter from "@/components/booking/history/BookingHistoryFilter";
import BookingList from "@/components/booking/history/BookingList";
import { useEffect } from "react";

export default function BookingHistory() {
  const {
    page,
    keyword,
    status,
    minPrice,
    maxPrice,

    data,
    refetch,

    handleCancel,
    searchKeyword,
    goToPage,
    searchStatus,
    searchMinPrice,
    searchMaxPrice,
    selectedOrderDetail,
    // showUpdateOrderMenu
  } = useHistoryOrder();

  // Refetch khi component mount để đảm bảo dữ liệu được cập nhật (đặc biệt là status FAILED cho các order quá hạn)
  useEffect(() => {
    refetch();
  }, []); // Chỉ chạy 1 lần khi component mount

  // Tự động refetch khi có order ORDERING đã quá thời gian thanh toán (1 phút)
  useEffect(() => {
    const orders = data?.data?.data || [];
    const orderingOrders = orders.filter(
      (order: any) => order.status === "ORDERING" && order.createdAt
    );

    if (orderingOrders.length === 0) {
      return; // Không có order ORDERING nào, không cần refetch
    }

    // Kiểm tra xem có order nào đã quá thời gian không
    const checkAndRefetch = () => {
      const now = Date.now();
      const PAYMENT_EXPIRY_MINUTES = 1;
      const hasExpiredOrder = orderingOrders.some((order: any) => {
        const createdAt = new Date(order.createdAt).getTime();
        const expiryTime = createdAt + PAYMENT_EXPIRY_MINUTES * 60 * 1000;
        return now >= expiryTime;
      });

      if (hasExpiredOrder) {
        // Có order đã quá thời gian, refetch để cập nhật status từ backend
        refetch();
      }
    };

    // Kiểm tra ngay lập tức
    checkAndRefetch();

    // Kiểm tra mỗi 5 giây để phát hiện khi order hết thời gian
    const interval = setInterval(checkAndRefetch, 5000);

    return () => clearInterval(interval);
  }, [data?.data?.data, refetch]);

  // const orders = data?.data || [];

  const handleCancelOrder = async (orderId: number) => {
    await handleCancel(orderId);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-18">
      <div className="bg-linear-to-r from-gray-800 to-gray-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Lịch sử đặt bàn
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link to={"/app/home"} className="text-yellow-400 hover:underline">
              TRANG CHỦ
            </Link>
            <span>/</span>
            <span>LỊCH SỬ</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <BookingHistoryFilter
          keyword={keyword}
          maxPrice={maxPrice}
          minPrice={minPrice}
          status={status}
          searchKeyword={searchKeyword}
          searchMaxPrice={searchMaxPrice}
          searchMinPrice={searchMinPrice}
          searchStatus={searchStatus}
        />

        {/* Booking Cards */}
        <BookingList
          data={
            data?.data ?? { data: [], totalElement: 0, totalPage: 0, size: 0 }
          } // default fallback
          handlerCancel={handleCancelOrder}
          handlerShowOrderDetail={selectedOrderDetail}
        />

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <PaginationControls
            page={page}
            totalPages={data?.data?.totalPage || 1}
            onPageChange={goToPage}
          />
        </div>
      </div>
    </div>
  );
}
