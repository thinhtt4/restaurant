import { useBooking } from "@/hooks/useBooking";
import { useComboBooking } from "@/hooks/useComboBooking";
import { useMenuItems } from "@/hooks/useMenuItems";
import type { CartItem } from "@/types/booking.type";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BookingConfirmPopUp from "./BookingCheckInfoPopup";
import { useState } from "react";

const ChooseMenuItems = () => {
  const { updateComboCartQuantity } = useComboBooking();
  const navigate = useNavigate();

  const [bookingConfirmInfoOpen, setBookingConfirmInfoOpen] = useState(false);

  const {
    orders,
    listIdIsNotActive,
    getTotalPrice,
    clearMenuItemNotActive,
    addToCart,
    updateCartQuantity,
    clearCartForBooking,
  } = useBooking();

  const { refetchMenuItems } = useMenuItems();

  const handlerConfirmOrder = async () => {
    console.log("---------------------------------",orders);
    if(orders === null|| orders?.orderId === null || orders?.orderId === 0){
      setBookingConfirmInfoOpen(true)
      return
    }
    console.log("---------------------------------",orders);
    if (
      !orders?.cartItems ||
      !Array.isArray(orders.cartItems) ||
      !orders.cartItems.length
    ) {
      navigate("/app/booking-confirm");
      return;
    }
    const tmpMenuNotActive = await listIdIsNotActive(
      orders.cartItems.map((order) => order.id)
    );
    if (tmpMenuNotActive === undefined || tmpMenuNotActive.length === 0) {
      navigate("/app/booking-confirm");
    } else {
      tmpMenuNotActive.forEach((orderId) => clearMenuItemNotActive(orderId));
      refetchMenuItems();
      toast.warning(
        "Những item ở dưới đang không được sử dụng trong nhà hàng nữa!(Đã xóa)"
      );
    }
  };

  const getItemQuantity = (id: number, type: "menu" | "combo") => {
    const cartItems = orders?.cartItems;
    if (!cartItems || !Array.isArray(cartItems)) return 0;

    const orderItem = cartItems.find(
      (item) =>
        item.type === type &&
        (type === "menu" ? item.id === id : item.comboId === id)
    );
    return orderItem ? orderItem.quantity : 0;
  };

  const handleIncrease = (item: CartItem) => {
    addToCart({
      ...item,
      quantity: 1,
      type: item.type || "menu",
    });
  };

  const handleDecrease = (item: CartItem) => {
    const type = item.type || "menu";
    const id = type === "combo" ? item.comboId : item.id;
    const quantity = getItemQuantity(id || 0, type);

    if (quantity > 0) {
      if (type === "combo") {
        updateComboCartQuantity(id || 0, quantity - 1);
      } else {
        updateCartQuantity(id || 0, quantity - 1);
      }
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-20">
      <div className="p-4 max-w-md mx-auto">
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
          Danh sách món đã chọn
        </h3>
        <button
          onClick={clearCartForBooking}
          className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          Xóa tất cả
        </button>
      </div>

      {!orders?.cartItems ||
      !Array.isArray(orders.cartItems) ||
      orders.cartItems.length === 0 ? (
        <>
          <p className="text-center text-gray-500">
            Chưa có món nào được chọn.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/app/booking-table")}
              className="bg-cyan-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              TRỞ LẠI
            </button>
            <button
              onClick={() => handlerConfirmOrder()}
              className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              TIẾP THEO
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {orders?.cartItems.map((item, index: number) => (
              <div
                key={item.id + "" + index}
                className="flex items-center gap-4 pb-4 border-b border-gray-200"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-amber-500">
                    {(item.price ?? 0).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={item.quantity === 0}
                    >
                      -
                    </button>

                    <span className="w-8 text-center text-gray-800 font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleIncrease(item)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold text-amber-500">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right mb-4">
            <p className="text-xl font-bold text-amber-500">
              Tổng tiền: {(getTotalPrice() ?? 0).toLocaleString("vi-VN")} ₫
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => navigate("/app/booking-table")}
              className="bg-cyan-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              TRỞ LẠI
            </button>
            <button
              onClick={() => handlerConfirmOrder()}
              className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              TIẾP THEO
            </button>
          </div>
        </>
      )}
      {bookingConfirmInfoOpen && <BookingConfirmPopUp setBookingConfirmInfoOpen={setBookingConfirmInfoOpen}/>}
    </div>
  );
};

export default ChooseMenuItems;
