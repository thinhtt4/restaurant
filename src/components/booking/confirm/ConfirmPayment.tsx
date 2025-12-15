import type { OrderResponse } from "@/types/booking.type";
import { useState } from "react";
import { CreditCard, Wallet } from "lucide-react";


interface ConfirmPaymentProps {
  orderDetail: OrderResponse;
  showPaymentModal: boolean;
  setShowPaymentModal: (show: boolean) => void;
  paymentType: "full" | "deposit";
  handlerBanking: () => void;
  handlerMomo: () => void;
}


const ConfirmPayment = ({
  orderDetail,
  showPaymentModal,
  setShowPaymentModal,
  paymentType,
  handlerBanking,

  handlerMomo
}: ConfirmPaymentProps) => {
  const [selectedMethod, setSelectedMethod] = useState("vnpay");

  const formatCurrency = (amount: number) => {

    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handlerPayment = () => {
    if (selectedMethod === "vnpay") {
      handlerBanking();
    } else {
      handlerMomo();
    }
    setShowPaymentModal(false);
  }


  return (
    <div>
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-600/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {paymentType === "full"
                  ? "Thanh toán toàn bộ"
                  : "Thanh toán cọc"}
              </h3>

              <div className="mb-6">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <p className="text-gray-600 mb-2">Tổng hóa đơn:</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(orderDetail.totalAmount)}
                  </p>
                </div>

                {paymentType === "deposit" && (
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Số tiền cọc:
                    </label>
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                      <p className="text-gray-600 mb-2">Số tiền cọc:</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(orderDetail.depositAmount)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Còn lại:{" "}
                      {formatCurrency(
                        Math.round(orderDetail.depositTable !== 0 ? orderDetail.depositTable : orderDetail.totalAmount * 0.3)
                      )}
                    </p>
                  </div>
                )}

                {paymentType === "full" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      Số tiền thanh toán:{" "}
                      {formatCurrency(orderDetail.depositTable ? orderDetail.paidAmount - orderDetail.depositTable : orderDetail.paidAmount)}
                    </p>
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="mt-6">
                  <label className="block text-gray-700 font-semibold mb-3">
                    Chọn phương thức thanh toán:
                  </label>
                  <div className="space-y-3">
                    {/* VNPay Option */}
                    <div
                      onClick={() => setSelectedMethod("vnpay")}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedMethod === "vnpay"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="vnpay"
                        checked={selectedMethod === "vnpay"}
                        onChange={() => setSelectedMethod("vnpay")}
                        className="w-5 h-5 text-blue-600"
                      />
                      <CreditCard className="w-6 h-6 ml-3 text-blue-600" />
                      <div className="ml-3 flex-1">
                        <p className="font-semibold text-gray-800">VNPay</p>
                        <p className="text-sm text-gray-600">
                          Thanh toán qua VNPay
                        </p>
                      </div>
                      <img
                        src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                        alt="VNPay"
                        className="h-8 object-contain"
                      />
                    </div>

                    {/* MoMo Option */}
                    <div
                      onClick={() => setSelectedMethod("momo")}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedMethod === "momo"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-300"
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="momo"
                        checked={selectedMethod === "momo"}
                        onChange={() => setSelectedMethod("momo")}
                        className="w-5 h-5 text-pink-600"
                      />
                      <Wallet className="w-6 h-6 ml-3 text-pink-600" />
                      <div className="ml-3 flex-1">
                        <p className="font-semibold text-gray-800">MoMo</p>
                        <p className="text-sm text-gray-600">
                          Thanh toán qua ví MoMo
                        </p>
                      </div>
                      <img
                        src="https://developers.momo.vn/v3/img/logo.svg"
                        alt="MoMo"
                        className="h-8 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => handlerPayment()}
                >
                  Xác nhận thanh toán
                </button>
              </div>
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmPayment;
