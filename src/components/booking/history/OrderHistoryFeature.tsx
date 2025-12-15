import { useBooking } from "@/hooks/useBooking";
import { useHistoryOrder } from "@/hooks/useHistoryOrder";
import type { OrderResponse } from "@/types/booking.type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface OrderHistoryForm {
  order: OrderResponse;
  handlerShowOrderDetail: (order: OrderResponse) => void;
  handleCancel: (orderId: number) => void;
  isDetail?: boolean;
}

const OrderHistoryFeature = ({
  order,
  handlerShowOrderDetail,
  handleCancel,
  isDetail = false,
}: OrderHistoryForm) => {
  const [tmpStatus, setTmpStatus] = useState(order.status);
  const { showUpdateOrderMenu } = useHistoryOrder();
  const { setBookingInfo,continueChooseMenu } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    setTmpStatus(order.status);
  }, [order.status]);

  const handlerCancelOrder = (orderId: number) => handleCancel(orderId);

  const renderButtons = () => {
    switch (tmpStatus) {
      case "ORDERING":
        return (
          <>
            {!isDetail && order.totalAmount !== null && (
              <button
                onClick={() => handlerShowOrderDetail(order)}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                XEM CHI TIẾT
              </button>
            )}
            <button
              onClick={() => handlerCancelOrder(order.orderId)}
              className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              HỦY ĐẶT BÀN
            </button>
            {order.totalAmount === null && (
              <button
                onClick={() => {
                  navigate("/app/booking-menu")
                  continueChooseMenu(order.orderId)
                  setBookingInfo({
                    orderName: order.orderName,
                    email: order.user.email,
                    phone: order.phone || "",
                    dateTime: order.reservationTime,
                    people: order.guestCount,
                    note: order.note,
                  })
                }}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                TIẾP TỤC CHỌN MÓN
              </button>
            )}
            <button
              onClick={() => navigate(`/app/invoice/${order.orderId}`)}
              className="px-4 py-2 border border-gray-300 rounded text-sm bg-yellow-500 text-white hover:bg-yellow-600"
            >
              THANH TOÁN CỌC
            </button>
          </>
        );

      case "SUCCESS":
        return (
          <>
            {!isDetail && (
              <button
                onClick={() => handlerShowOrderDetail(order)}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                XEM CHI TIẾT
              </button>
            )}

            <button
              onClick={() => showUpdateOrderMenu(order)}
              className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              YÊU CẦU ĐỔI MÓN
            </button>
          </>
        );

      case "CANCELLED":
      case "FAILED":
        return (
          <button
            onClick={() => navigate("/app/booking-table-available")}
            className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            ĐẶT BÀN LẠI
          </button>
        );

      case "DEPOSITED_SUCCESS":
        return (
          <>
            {!isDetail && (
              <button
                onClick={() => handlerShowOrderDetail(order)}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                XEM CHI TIẾT
              </button>
            )}
            {(order.depositTable === null || order.depositTable === 0) && (
              <button
                onClick={() => showUpdateOrderMenu(order)}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                YÊU CẦU ĐỔI MÓN
              </button>
            )}
            <button
              onClick={() => navigate(`/app/invoice/${order.orderId}`)}
              className="px-4 py-2 border border-gray-300 rounded text-sm bg-yellow-500 text-white hover:bg-yellow-600"
            >
              THANH TOÁN
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return <div className="flex items-end gap-2">{renderButtons()}</div>;
};

export default OrderHistoryFeature;
