/* eslint-disable @typescript-eslint/no-explicit-any */
import { socket } from "@/hooks/socket";
import { useVoucherManager } from "@/hooks/useVoucherManager";
import { selectVoucherForOrder } from "@/store/bookingSlice";
import type { RootState } from "@/store/store";
import type { Voucher } from "@/types/voucher.type";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const VoucherPopup = ({
  setShowModalSelectVoucher,
  getTotalPriceWithoutVoucher,
}: any) => {
  const { voucherFilterOfUser, refetchVoucher } = useVoucherManager();

  const dispatch = useDispatch();
  const selectedVoucher = useSelector(
    (state: RootState) => state.booking.selectedVoucher
  );

  const totalWithoutVoucher = getTotalPriceWithoutVoucher();

  useEffect(() => {
    socket.on("reloadVoucherToOrder", () => {
      refetchVoucher();
      dispatch(selectVoucherForOrder(null));
    });
    return () => {
      socket.off("reloadVoucherToOrder");
    };
  }, []);

  const handleChooseVoucher = (voucher: Voucher) => {
    dispatch(selectVoucherForOrder(voucher));
    setShowModalSelectVoucher(false);
  };

  const handleRemoveVoucher = () => {
    dispatch(selectVoucherForOrder(null));
    setShowModalSelectVoucher(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Chọn Voucher</h2>
          <button
            onClick={() => setShowModalSelectVoucher(false)}
            className="p-2 rounded-full hover:bg-red-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Voucher List */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 flex-1">
          {voucherFilterOfUser.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              Bạn chưa có voucher nào có thể sử dụng.
            </p>
          ) : (
            voucherFilterOfUser.map((voucher: Voucher) => {
              const isDisabled =
                totalWithoutVoucher < (voucher.minOrderAmount ?? 0);
              const usedPercent =
                voucher.usageLimit && voucher.usageLimit !== 0
                  ? Math.min(
                      Math.round(((voucher.usedCount ?? 0) / voucher.usageLimit) * 100),
                      100
                    )
                  : 0;
              return (
                <div
                  key={voucher.id}
                  onClick={() => !isDisabled && handleChooseVoucher(voucher)}
                  className={`border rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-transform
                      ${
                        selectedVoucher?.id === voucher.id
                          ? "border-red-500 shadow-lg scale-105 bg-red-50"
                          : "border-gray-200 hover:border-red-500 hover:shadow-md hover:scale-105 bg-white"
                      }
                       ${
                         isDisabled
                           ? "opacity-50 cursor-not-allowed hover:border-gray-200 hover:shadow-none hover:scale-100"
                           : ""
                       }
                    `}
                >
                  {/* Top Row: Type & Value */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shrink-0
            ${
              voucher.discountType === "PERCENT"
                ? "bg-red-100 text-red-600"
                : "bg-blue-100 text-blue-600"
            }`}
                    >
                      {voucher.discountType === "PERCENT"
                        ? "Loại %"
                        : "Loại VND"}
                    </span>
                    <span className="text-xl font-extrabold text-gray-800 break-words">
                      {voucher.discountValue}
                      {voucher.discountType === "PERCENT" ? "%" : " VND"}
                    </span>
                  </div>

                  {/* Name / Code */}
                  <div className="flex flex-col gap-1 break-words">
                    {voucher.code && (
                      <p className="text-sm font-semibold text-gray-700 break-words">
                        Mã: <span className="text-red-600">{voucher.code}</span>
                      </p>
                    )}
                    {voucher.description && (
                      <p
                        className="text-sm text-gray-600 break-words"
                        dangerouslySetInnerHTML={{
                          __html: voucher.description,
                        }}
                      />
                    )}
                  </div>

                  {/* Dates Row */}
                  <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-500 mt-1 gap-2 break-words">
                    <p>
                      Bắt đầu:{" "}
                      {voucher.startAt ? formatDate(voucher.startAt) : "-"}
                    </p>
                    <p className="text-orange-500 font-semibold">
                      Hết hạn: {voucher.endAt ? formatDate(voucher.endAt) : "-"}
                    </p>
                  </div>

                  {/* Condition Row */}
                  <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-500 mt-1 gap-2 break-words">
                    <p>
                      Giá có thể áp dụng:{" "}
                      {voucher.minOrderAmount && voucher.minOrderAmount > 0
                        ? `${voucher.minOrderAmount.toLocaleString()} VNĐ`
                        : "Không giới hạn"}
                    </p>
                    <p>
                      Giảm tối đa:{" "}
                      {voucher.maxDiscountAmount &&
                      voucher.maxDiscountAmount > 0
                        ? `${voucher.maxDiscountAmount.toLocaleString()} VNĐ`
                        : "Không giới hạn"}
                    </p>
                  </div>

                  {/* Usage Progress */}
                  {voucher.usedCount !== undefined &&
                    voucher.usageLimit !== undefined && (
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Đã dùng: {voucher.usedCount}</span>
                          <span>
                            {voucher.usageLimit === 0
                              ? "Không giới hạn lượt sử dụng"
                              : `${usedPercent}%`}
                          </span>
                        </div>
                        {voucher.usageLimit !== 0 && (
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-red-500"
                              style={{ width: `${usedPercent}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
          {selectedVoucher && (
            <button
              onClick={handleRemoveVoucher}
              className="px-4 py-2 bg-gray-200 text-red-500 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Xóa voucher
            </button>
          )}
          <button
            onClick={() => setShowModalSelectVoucher(false)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherPopup;
