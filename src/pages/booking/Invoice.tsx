/* eslint-disable @typescript-eslint/no-explicit-any */
import { Printer, ArrowLeft, CreditCard, Wallet } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderDetailQuery } from "@/store/api/orderApi";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import ConfirmPayment from "@/components/booking/confirm/ConfirmPayment";
import { useMomoPaymentMutation } from "@/store/api/paymentApi";
import { toast } from "sonner";
import { PaymentCountdownTimer } from "@/components/booking/payment/PaymentCountdownTimer";
import { usePaymentVnpayMutation } from "@/store/api/paymentApi";

const PAYMENT_EXPIRY_MINUTES = 1;

const RestaurantInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [paymentVnPay] = usePaymentVnpayMutation();
  const [momoPayment] = useMomoPaymentMutation();
  const { orderId } = useParams<{ orderId?: string }>();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("deposit");

  const handlerPayment = (payment: "full" | "deposit") => {
    setPaymentType(payment);
    setShowPaymentModal(true);
  };

  const {
    data: orderDetailData,
    isLoading,
    isError,
    refetch: refetchOrderDetail,
  } = useGetOrderDetailQuery(Number(orderId), {
    skip: !orderId, // tránh gọi API khi id bị undefined
  });

  const { user } = useAuth();
  const orderDetail = orderDetailData?.data;

  // kiẻm tra xem order đá hết hạn thời gian thanh toán chưa - tự động cập nhật mỗi giây
  const [isPaymentExpired, setIsPaymentExpired] = useState(false);
  const hasRefetchedRef = useRef(false); // Flag đẻ chỉ refetch 1 lần khi hết thời gian

  useEffect(() => {
    const createdAt = orderDetail?.createdAt;
    if (!createdAt || orderDetail?.status !== "ORDERING") {
      setIsPaymentExpired(false);
      hasRefetchedRef.current = false; // reset flag khi order thay doi
      return;
    }

    //reset flag khi order moi duoc load
    hasRefetchedRef.current = false;

    const checkExpired = () => {
      const created = new Date(createdAt).getTime();
      const now = Date.now();
      const expiryTime = created + PAYMENT_EXPIRY_MINUTES * 60 * 1000;
      const expired = now > expiryTime;

      setIsPaymentExpired(expired);

      // lan dau phat hien het thoi gian - refetch de cap nhat status tu backend
      if (expired && !hasRefetchedRef.current) {
        hasRefetchedRef.current = true;
        refetchOrderDetail();
      }
    };

    // kiem tra ngay lap tuc
    checkExpired();

    // kiem tra moi giay de tu dong disable khi het thoi gian
    const interval = setInterval(checkExpired, 1000);

    return () => clearInterval(interval);
  }, [orderDetail?.createdAt, orderDetail?.status, refetchOrderDetail]);

  const formatVND = (amount: number) => {
    // đảm bảo amount là number
    const n = Number(amount) || 0;
    return n.toLocaleString("vi-VN") + " VND";
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr; // fallback nếu không parse được

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const totalAmount =
    orderDetail?.orderItem?.reduce(
      (sum: number, item: any) =>
        sum +
        (Number(item.priceOnline) || 0) * (Number(item.quantityOnline) || 0),
      0
    ) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Đang tải chi tiết đơn hàng...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.</div>
      </div>
    );
  }

  const handlerBanking = async () => {
    if (!orderDetail) return;

    let amount = 0;

    if (orderDetail.status === "ORDERING") {
      if (orderDetail.depositAmount != 0) {
        amount = orderDetail.depositAmount ?? orderDetail.totalAmount * 0.3;
      } else if (orderDetail.depositTable != 0) {
        amount = orderDetail.depositTable;
      }
    } else {
      toast.error("Đơn hàng không thể thanh toán");
      return;
    }

    try {
      const res = await paymentVnPay({
        orderId: orderId!,
        amount: amount,
      }).unwrap();

      console.log(res);

      if (res) {
        window.location.href = res;
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Thanh toán cọc thất bại!");
    }
  };

  const handlerMomo = async () => {
    if (!orderDetail) return;

    let amount = 0;

    if (orderDetail.status === "ORDERING") {
      if (orderDetail.depositAmount != 0) {
        amount = orderDetail.depositAmount ?? orderDetail.totalAmount * 0.3;
      } else if (orderDetail.depositTable != 0) {
        amount = orderDetail.depositTable;
      }
    } else {
      toast.error("Đơn hàng không thể thanh toán ");
      return;
    }

    try {
      const res = await momoPayment({
        orderId: orderId!,
        amount: amount,
      }).unwrap();

      console.log(res);

      if (res && res.payUrl) {
        window.location.href = res.payUrl;
      } else {
        toast.error("Không nhận được link thanh toán từ MoMo!");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Thanh toán MoMo thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-18">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
              <div className="text-pink-600 text-2xl">🏵️</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Nhà Hàng Hương Sen
          </h1>
          <p className="text-sm text-gray-600">
            Điện thoại: {orderDetailData?.data.phone} | Email:{" "}
            {user?.data.email}
          </p>
        </div>

        {/* Payment Countdown Timer  */}
        {orderDetail?.createdAt && orderDetail?.status === "ORDERING" && (
          <PaymentCountdownTimer
            createdAt={orderDetail.createdAt}
            expiryMinutes={PAYMENT_EXPIRY_MINUTES}
            onExpired={() => {
              toast.warning("Thời gian thanh toán đã hết.");
            }}
          />
        )}

        {/* Customer Information */}
        <div className="bg-white border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Thông tin khách hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Tên:</span>
              <span className="text-gray-600 ml-2">
                {orderDetailData?.data.orderName} | Mã:{" "}
                {orderDetail?.orderId ?? "-"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Phone:</span>
              <span className="text-gray-600 ml-2">
                {orderDetailData?.data.phone}
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="text-gray-600 ml-2">
                {user?.data?.email || "-"}
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold text-gray-700">Ngày đặt:</span>
              <span className="text-gray-600 ml-2">
                {orderDetail?.reservationTime
                  ? formatDateTime(orderDetail.reservationTime)
                  : "-"}{" "}
                | Số người: {orderDetail?.guestCount ?? "-"} | Số bàn:{" "}
                {orderDetail?.table?.code ?? "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Chi tiết đơn hàng
          </h2>
          <div className="overflow-x-auto">
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
                {orderDetail?.orderItem && orderDetail.orderItem.length > 0 ? (
                  orderDetail.orderItem.map((item: any, index: number) => {
                    const name = item?.menuItem?.name ?? item?.combo?.name;
                    const qty = Number(item?.quantityOnline) || 0;
                    const price = Number(item?.priceOnline) || 0;
                    return (
                      <tr
                        key={item?.id ?? index}
                        className="border-b border-gray-100"
                      >
                        <td className="p-3 text-gray-800 font-bold">{name}</td>
                        <td className="p-3 text-center text-gray-600">{qty}</td>
                        <td className="p-3 text-right text-gray-600">
                          {formatVND(price)}
                        </td>
                        <td className="p-3 text-right font-medium text-gray-800">
                          {formatVND(price * qty)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      Không có món trong đơn hàng
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-300">
                  <td
                    colSpan={3}
                    className="p-3 text-right font-bold text-gray-800"
                  >
                    Tổng cộng:
                  </td>
                  <td className="p-3 text-right font-bold text-gray-800">
                    {formatVND(totalAmount)}
                  </td>
                </tr>

                {orderDetail?.voucher && (
                  <tr className="border-t border-gray-300 bg-pink-50/50 text-sm">
                    <td colSpan={3} className="p-3 text-right align-top">
                      <div className="flex flex-col items-end justify-center h-full">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-medium">
                            Mã ưu đãi:
                          </span>
                          <span className="px-2 py-0.5 bg-pink-100 border border-pink-200 text-pink-600 text-xs rounded font-bold uppercase tracking-wider">
                            {orderDetail.voucher.code}
                          </span>
                        </div>

                        {/* Dòng ghi chú nhỏ về điều kiện giảm giá */}
                        <div className="text-xs text-gray-500 mt-1 italic">
                          {orderDetail.voucher.discountType === "PERCENT"
                            ? `(Giảm ${Number(
                                orderDetail.voucher.discountValue
                              )}%${
                                orderDetail.voucher.maxDiscountAmount &&
                                orderDetail.voucher.maxDiscountAmount > 0
                                  ? ` - Tối đa ${formatVND(
                                      orderDetail.voucher.maxDiscountAmount
                                    )}`
                                  : ""
                              })`
                            : "(Giảm trực tiếp vào đơn hàng)"}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold text-pink-600 align-top">
                      {/* Hiển thị số tiền hoặc % bên cột giá */}
                      {orderDetail.voucher.discountType === "PERCENT" ? (
                        <span>
                          -{Number(orderDetail.voucher.discountValue)}%
                        </span>
                      ) : (
                        <span>
                          -{formatVND(orderDetail.voucher.discountValue)}
                        </span>
                      )}
                    </td>
                  </tr>
                )}

                <tr className="border-t-2 border-gray-300">
                  <td
                    colSpan={3}
                    className="p-3 text-right font-bold text-gray-800"
                  >
                    Tiền cọc {orderDetail?.depositTable !== 0 ? "bàn" : "món"}:
                  </td>
                  <td className="p-3 text-right font-bold text-amber-600">
                    {formatVND(
                      orderDetail?.depositTable !== 0
                        ? orderDetail?.depositTable ?? 0
                        : orderDetail.depositAmount
                    )}
                  </td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td
                    colSpan={3}
                    className="p-3 text-right font-bold text-gray-800"
                  >
                    Tổng đơn:
                  </td>
                  <td className="p-3 text-right font-bold text-amber-600">
                    {formatVND(
                      (orderDetail?.depositAmount ?? 0) < 0
                        ? orderDetail?.depositTable || 0
                        : orderDetail?.totalAmount || 0
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-sm text-gray-600 mt-2">
            Ghi chú: {orderDetail?.note ?? "Không có"}
          </p>
        </div>

        {/* Action Buttons */}

        <div className="bg-white p-6 flex gap-3 justify-center border-t border-gray-200 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
            type="button"
          >
            <Printer size={18} />
            In
          </button>

          <button
            onClick={async () => {
              // Refetch order detail trước khi quay lại để đảm bảo status được cập nhật nếu đã hết thời gian
              await refetchOrderDetail();
              navigate("/app/booking-history");
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
            type="button"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
          {orderDetail?.status === "ORDERING" && (
            <button
              onClick={() => handlerPayment("deposit")}
              disabled={isPaymentExpired}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                isPaymentExpired
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700 text-white"
              }`}
              title={isPaymentExpired ? "Đã hết thời gian thanh toán" : ""}
            >
              <Wallet size={20} />
              Thanh toán cọc
            </button>
          )}

          {(orderDetail?.status === "DEPOSITED_SUCCESS" ||
            orderDetail?.status === "CHECK_IN") && (
            <button
              onClick={() => handlerPayment("full")}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <CreditCard size={20} />
              Thanh toán
            </button>
          )}
        </div>
      </div>
      {orderDetail && (
        <ConfirmPayment
          orderDetail={orderDetail}
          showPaymentModal={showPaymentModal}
          setShowPaymentModal={setShowPaymentModal}
          paymentType={paymentType}
          handlerBanking={handlerBanking}
          handlerMomo={handlerMomo}
        />
      )}
    </div>
  );
};

export default RestaurantInvoice;
