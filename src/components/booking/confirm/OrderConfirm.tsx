import { useBooking } from "@/hooks/useBooking";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import OrderConfirmModal from "./OrderConfirmModal";
import { useGetOrderDetailQuery } from "@/store/api/orderApi";
import VoucherPopup from "./VoucherPopup";
import { useComboBooking } from "@/hooks/useComboBooking";
import type { Combo } from "@/types/combo.type";
import { socket } from "@/hooks/socket";

export const OrderConfirm = () => {
  const {
    refetch: refetchCombos,
    clearComboFromCart,
    updateComboPriceInCart,
  } = useComboBooking();
  useEffect(() => {
    if (!socket) return;

    const handlerUpdateCombo = async () => {
      console.log("Combo updated from manager");

      // Refetch để lấy danh sách combo mới nhất
      const { data } = await refetchCombos();

      if (!data?.data?.data) return;

      const activeCombos = data.data.data;
      // Kiểm tra các combo trong giỏ hàng
      const comboItemsInCart = orders?.cartItems?.filter(
        (item) => item.type === "combo"
      ) || [];

      comboItemsInCart.forEach((cartItem) => {
        const comboId = cartItem.comboId;

        // Tìm combo mới nhất từ API
        const updatedCombo = activeCombos.find(
          (combo: Combo) => combo.comboId === comboId
        );

        if (!updatedCombo) {
          clearComboFromCart(comboId!);
          toast.warning(
            `Combo "${cartItem.name}" đã bị xóa khỏi giỏ hàng do không còn khả dụng`
          );
        } else {
          const newPrice = updatedCombo.finalPrice ?? 0;
          const oldPrice = cartItem.price;

          if (newPrice !== oldPrice) {
            updateComboPriceInCart(comboId!, newPrice);

            toast.info(
              `Giá combo "${cartItem.name}" đã được cập nhật từ ${oldPrice.toLocaleString()}đ sang ${newPrice.toLocaleString()}đ`,
              { duration: 5000 }
            );
          }
        }
      });
    };

    socket.on("combo_update", handlerUpdateCombo);

    return () => {
      socket.off("combo_update", handlerUpdateCombo);
    };
  }, [socket, refetchCombos, clearComboFromCart, updateComboPriceInCart]);
  const navigate = useNavigate();
  const {
    bookingInfo,
    orders,
    getTotalPrice,
    getTotalPriceWithoutVoucher,
    confirmBooking,
    listIdIsNotActive,
    clearMenuItemNotActive,
  } = useBooking();
  const [showModalConfirmOrder, setShowModalConfirmModal] = useState(false);
  const [showModalSelectVoucher, setShowModalSelectVoucher] = useState(false);

  const handleBack = () => {
    navigate("/app/booking-menu");
  };

  useEffect(() => {
    if (showModalSelectVoucher) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModalSelectVoucher]);

  const handleConfirm = async () => {
    try {
      if (!orders?.cartItems) {
        return;
      }
      if (orders.cartItems.length === 0) {
        setShowModalConfirmModal(true);
        return;
      }
      const tmpMenuNotActive = await listIdIsNotActive(
        orders?.cartItems.map((order) => order.id)
      );

      if (tmpMenuNotActive && tmpMenuNotActive.length > 0) {
        tmpMenuNotActive.forEach((orderId) => clearMenuItemNotActive(orderId));
        toast.error("Những item đang không được sử dụng nữa! (Đã xóa)");

        if (orders.cartItems.length === tmpMenuNotActive.length) {
          toast.error("Không còn món nào trong giỏ, vui lòng chọn món mới!");
          navigate("/app/booking-menu");
          return;
        }
        return;
      }

      if (orders.cartItems.length > 0) {
        await confirmBooking();
      } else {
        navigate("/app/booking-menu");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đặt bàn thất bại, vui lòng thử lại!");
      navigate("/app/home");
    }
  };

  const {
    data: orderDetailData,
    // isLoading,
    // isError,
  } = useGetOrderDetailQuery(Number(orders?.orderId), {
    skip: !orders?.orderId, // tránh gọi API khi id bị undefined
  });

  return (
    <div className="flex-1 p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Danh sách món đã chọn
        </h1>

        {orders?.cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin đặt bàn
            </h2>

            <div className="flex justify-between py-2 text-gray-700">
              <span>Bàn:</span>
              <span className="font-semibold">
                {orderDetailData?.data.table.code || "Chưa chọn bàn"}
              </span>
            </div>

            <div className="flex justify-between py-2 text-gray-700">
              <span>Số người:</span>
              <span className="font-semibold">{bookingInfo?.people} người</span>
            </div>

            <div className="flex justify-between py-2 text-gray-700">
              <span>Tiền cọc mặc định:</span>
              <span className="text-amber-500 font-bold text-lg">
                {Number(100000).toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Món ăn
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Số lượng
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders?.cartItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <span className="font-medium text-gray-800">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-amber-500">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order voucher */}
        {orders && orders.cartItems && orders.cartItems.length > 0 && (
          <>
            <button
              onClick={() => setShowModalSelectVoucher(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
            >
              CHỌN VOUCHER
            </button>

            {showModalSelectVoucher && (
              <VoucherPopup
                setShowModalSelectVoucher={setShowModalSelectVoucher}
                order={orders}
                getTotalPriceWithoutVoucher={getTotalPriceWithoutVoucher}
              />
            )}
          </>
        )}

        {/* Total */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-end items-center">
            <span className="text-xl font-bold text-gray-800 mr-4">
              Tổng tiền món:
            </span>
            <span className="text-2xl font-bold text-amber-500">
              {getTotalPrice().toLocaleString("vi-VN")} ₫
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBack}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            TRỞ LẠI
          </button>
          <button
            onClick={() => {
              handleConfirm();
            }}
            className="px-8 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            TIẾP THEO
          </button>
        </div>
      </div>
      {/* {showModal && <ChangeTableModal setShowModal={setShowModal} />} */}
      {showModalConfirmOrder && (
        <OrderConfirmModal
          setShowModalConfirmModal={setShowModalConfirmModal}
        />
      )}
    </div>
  );
};
