import { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Receipt,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import OrderHistoryFeature from "./OrderHistoryFeature";
import { useHistoryOrder } from "@/hooks/useHistoryOrder";
import { useAuth } from "@/hooks/useAuth";
import type { OrderResponse } from "@/types/booking.type";
interface OrderDetailForm {
  handlerCancel: (orderId: number) => void;
  handlerShowOrderDetail: (order: OrderResponse) => void;
}

const OrderDetailModal = ({
  handlerShowOrderDetail,
  handlerCancel,
}: OrderDetailForm) => {
  const { showModalDetail, closeModalDetail, selectedOrder } =
    useHistoryOrder();
  const { user } = useAuth();

  // State để quản lý combo nào đang được mở
  const [expandedCombos, setExpandedCombos] = useState<number[]>([]);

  const formatVND = (amount: number) =>
    amount != null ? amount.toLocaleString("vi-VN") : "0 ₫";

  const toggleCombo = (index: number) => {
    setExpandedCombos((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const date = new Date(selectedOrder?.reservationTime || Date.now());

  return (
    <div>
      {showModalDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Chi Tiết Đơn Hàng</h2>
                  <p className="text-yellow-100">
                    Mã đơn: #{selectedOrder?.orderId}
                  </p>
                </div>
                <button
                  onClick={() => closeModalDetail()}
                  className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="text-gray-600" size={20} />
                  Thông Tin Khách Hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="text-gray-400" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Tên khách hàng</p>
                      <p className="font-medium text-gray-800">
                        {selectedOrder?.orderName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-800">
                        {user?.data.phone || selectedOrder?.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:col-span-2">
                    <Mail className="text-gray-400" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">
                        {user?.data.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="text-gray-600" size={20} />
                  Thông Tin Đặt Bàn
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex flex-col p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Ngày đặt</p>
                    <p className="font-semibold text-gray-800">
                      {date.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Thời gian</p>
                    <p className="font-semibold text-gray-800">
                      {date.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Số khách</p>
                    <p className="font-semibold text-gray-800">
                      {selectedOrder?.guestCount} người
                    </p>
                  </div>
                  <div className="flex flex-col p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Số bàn</p>
                    <p className="font-semibold text-gray-800">
                      {selectedOrder?.table.code}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Receipt className="text-gray-600" size={20} />
                  Chi Tiết Món Ăn
                </h3>
                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                          Món
                        </th>
                        <th className="text-center p-3 font-semibold text-gray-700 text-sm">
                          SL
                        </th>
                        <th className="text-right p-3 font-semibold text-gray-700 text-sm">
                          Đơn giá
                        </th>
                        <th className="text-right p-3 font-semibold text-gray-700 text-sm">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder?.orderItem
                        ?.filter((item) => item.menuItem !== null)
                        .map((item, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="p-3 text-gray-800 font-bold">
                              {item?.menuItem?.name}
                            </td>
                            <td className="p-3 text-center text-gray-600">
                              {item.quantityOnline}
                            </td>
                            <td className="p-3 text-right text-gray-600">
                              {formatVND(item.priceOnline)}
                            </td>
                            <td className="p-3 text-right font-medium text-gray-800">
                              {formatVND(
                                item.priceOnline * item.quantityOnline
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Combo Items Section */}
                {selectedOrder?.orderItem?.some(
                  (item) => item.menuItem === null
                ) && (
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                        COMBO
                      </span>
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder?.orderItem
                        ?.filter((item) => item.menuItem === null)
                        .map((combo, index) => (
                          <div
                            key={`combo-${index}`}
                            className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400 rounded overflow-hidden"
                          >
                            {/* Combo Header - Clickable */}
                            <div
                              onClick={() => toggleCombo(index)}
                              className="p-4 cursor-pointer hover:bg-orange-100/50 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="mt-1">
                                    {expandedCombos.includes(index) ? (
                                      <ChevronDown
                                        className="text-orange-600"
                                        size={20}
                                      />
                                    ) : (
                                      <ChevronRight
                                        className="text-orange-600"
                                        size={20}
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-800">
                                      {combo?.combo?.name ||
                                        `Combo ${index + 1}`}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      Số lượng: {combo.quantityOnline}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">
                                    Đơn giá: {formatVND(combo.priceOnline)}
                                  </p>
                                  <p className="font-bold text-orange-600 text-lg">
                                    {formatVND(
                                      combo.priceOnline * combo.quantityOnline
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Combo Items Details - Expandable */}
                            {expandedCombos.includes(index) &&
                              combo?.combo?.comboItems &&
                              combo.combo.comboItems.length > 0 && (
                                <div className="px-4 pb-4 pt-0 border-t border-orange-200 bg-white/50">
                                  <div className="pt-3">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">
                                      Các món trong combo:
                                    </p>
                                    <ul className="space-y-1">
                                      {combo.combo.comboItems.map(
                                        (comboItem, itemIndex) => (
                                          <li
                                            key={itemIndex}
                                            className="text-xs text-gray-600 flex items-start gap-2"
                                          >
                                            <span className="text-orange-500 mt-1">
                                              •
                                            </span>
                                            <span>
                                              {comboItem.menuItem?.name}{" "}
                                              {comboItem.quantity && (
                                                <span className="text-gray-500">
                                                  (x{comboItem.quantity})
                                                </span>
                                              )}
                                            </span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {selectedOrder?.voucher && (
                  <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Voucher áp dụng:
                      </p>
                      <p className="text-base font-bold text-green-700 mt-1">
                        {selectedOrder.voucher.code} – Giảm{" "}
                        {formatVND(selectedOrder.voucher.discountValue)}
                        {selectedOrder.voucher.discountType === "PERCENT"
                          ? "%"
                          : "đ"}
                      </p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-green-700 mt-1">Số tiền được giảm: {selectedOrder.voucher.maxDiscountAmount + "đ"}</p>
                    </div>
                  </div>
                )}
                {/* Note */}
                {selectedOrder?.note && (
                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm font-semibold text-gray-700">
                      Ghi chú:
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder?.note}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3 sticky bottom-0">
              <OrderHistoryFeature
                order={selectedOrder}
                handlerShowOrderDetail={handlerShowOrderDetail}
                handleCancel={handlerCancel}
                isDetail={true}
              />
            </div> */}

            {selectedOrder && (
              <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3 sticky bottom-0">
                <OrderHistoryFeature
                  order={selectedOrder}
                  handlerShowOrderDetail={handlerShowOrderDetail}
                  handleCancel={handlerCancel}
                  isDetail={true}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailModal;
