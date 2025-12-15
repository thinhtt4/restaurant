import { Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { OrderResponse } from "@/types/booking.type";

// Helper functions
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTimeSlot = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const hour = date.getHours();
  return `${hour} - ${hour + 2} giờ`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { text: string; className: string }> = {
    ORDERING: { text: "Chờ đặt cọc", className: "bg-amber-50 text-amber-700" },
    DEPOSITED_SUCCESS: {
      text: "Chờ nhận bàn",
      className: "bg-purple-50 text-purple-700",
    },
    CHECK_IN: { text: "Đã nhận bàn", className: "bg-blue-50 text-blue-700" },
    SUCCESS: {
      text: "Đã hoàn thành",
      className: "bg-emerald-50 text-emerald-700",
    },
    CANCELLED: { text: "Đã hủy", className: "bg-red-50 text-red-700" },
    FAILED: {
      text: "Thanh toán cọc thất bại",
      className: "bg-orange-100 text-orange-700",
    },
  };
  const { text, className } = statusMap[status] || {
    text: status,
    className: "bg-slate-50 text-slate-700",
  };
  return (
    <span className={`${className} px-3 py-1 rounded text-sm font-medium`}>
      {text}
    </span>
  );
};

interface BookingTableProps {
  orders: OrderResponse[];
  isLoading: boolean;
  selectedId?: number | null;
  onSelectBooking: (id: number) => void;
}

export default function BookingTable({
  orders,
  isLoading,
  selectedId,
  onSelectBooking,
}: BookingTableProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12">
        <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12">
        <p className="text-center text-slate-500">Không có đơn đặt bàn nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
              Dự kiến nhận bàn
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
              Khách hàng
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
              Đặt cọc
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
              Số khách
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
              Khu vực/Bàn
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            // Build khu vực/bàn string
            const areaTable = [
              order.table?.areaName || "",
              order.table?.name ? `bàn ${order.table.name}` : "bàn",
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <tr
                key={order.orderId}
                onClick={() => onSelectBooking(order.orderId)}
                className={`border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer ${
                  selectedId === order.orderId ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div>{formatDate(order.reservationTime)}</div>
                  <div className="text-xs text-slate-500">
                    ({formatTimeSlot(order.reservationTime)})
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div>{order.orderName || order.user?.username || "-"}</div>
                  <div className="text-xs text-slate-500">
                    {order.user?.phone || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatCurrency(order.depositAmount)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {order.guestCount}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {areaTable || "-"}
                </td>
                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                <td className="px-6 py-4 text-center">
                  <Link
                    to={`/admin/booking/${order.orderId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Chi tiết
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
