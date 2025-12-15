import type {
  ListOrderPageResponse,
  OrderResponse,
} from "@/types/booking.type";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Mail,
  Phone,
  Users,
  XCircle,
} from "lucide-react";
import OrderDetailModal from "./OrderDetailModal";
import OrderHistoryFeature from "./OrderHistoryFeature";
import OrderUpdateMenu from "./OrderUpdateMenu";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { socket } from "@/hooks/socket";
import { useHistoryOrder } from "@/hooks/useHistoryOrder";

interface BookingListProps {
  data: ListOrderPageResponse;
  handlerCancel: (orderId: number) => void;
  handlerShowOrderDetail: (order: OrderResponse) => void;
}
const BookingList = ({
  data,
  handlerCancel,
  handlerShowOrderDetail,
}: // handlerShowUpdateMenu
BookingListProps) => {
  // const { selectedOrder, selectedOrderDetail, showOrderUpdateMenu } = useHistoryOrder();
  const { user } = useAuth();
  const { refetch } = useHistoryOrder();

  useEffect(() => {
    if (!socket) return;
    const handleTableUpdate = () => {
      console.log("update_status_order");
      refetch();
    };

    socket.on("update_status_order", handleTableUpdate);
    return () => {
      socket.off("update_status_order", handleTableUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, refetch]);

  const formatVND = (amount: number | undefined) => {
    if (amount == null) return "0₫";
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const orders = Array.isArray(data) ? data : data?.data || [];

  return (
    <div className="space-y-4">
      {orders.map((order: OrderResponse) => (
        <div key={order.orderId} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left Column */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  {order.orderName ||
                    user?.data.firstName + " " + user?.data.lastName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>Email: {user?.data.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  <span>Mã hóa đơn: {order.orderId}</span>
                </div>
              </div>

              {/* Middle Column */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>Số điện thoại: {user?.data.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Số người: {order.guestCount}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Ngày đặt:{" "}
                    {new Date(order.reservationTime).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <span>Số bàn: {order.table.code}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Status and Actions */}
            <div className="flex flex-col items-end gap-3 min-w-[200px]">
              <div className="flex items-center gap-2 text-sm font-medium">
                {order.status === "ORDERING" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-300 text-yellow-700">
                    <Clock className="w-4 h-4" />
                    <span>Chờ thanh toán cọc</span>
                  </div>
                )}

                {order.status === "SUCCESS" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Đã thanh toán</span>
                  </div>
                )}

                {order.status === "DEPOSITED_SUCCESS" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Đã thanh toán cọc</span>
                  </div>
                )}

                {order.status === "CANCELLED" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-300 text-red-700">
                    <XCircle className="w-4 h-4" />
                    <span>Đã hủy</span>
                  </div>
                )}

                {order.status === "FAILED" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500 text-red-800">
                    <AlertCircle className="w-4 h-4" />
                    <span>Thất bại</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="text-sm text-gray-600">
                  Số tiền thanh toán:{" "}
                </span>
                <span className="font-semibold">
                  {formatVND(order.totalAmount || order.depositTable)}
                </span>
              </div>
              {/* ORDER FEATURE ABOUT PAYMENT */}
              <OrderHistoryFeature
                order={order}
                handlerShowOrderDetail={handlerShowOrderDetail}
                handleCancel={handlerCancel}
              />
            </div>
          </div>
        </div>
      ))}
      {
        <OrderDetailModal
          handlerShowOrderDetail={handlerShowOrderDetail}
          handlerCancel={handlerCancel}
        />
      }
      {<OrderUpdateMenu />}
    </div>
  );
};

export default BookingList;
