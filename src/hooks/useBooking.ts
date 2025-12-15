// hooks/useBooking.ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  setBookingInfo,
  addToOrder,
  updateQuantity,
  clearOrders,
  clearOrdersByMenuId,
  updateTableBooking,
  addToOrderId,
  selectVoucherForOrder,
  clearCartForBookingMenu,
  selecteMenuByOrderId,
  updateMenuPrice,
} from "@/store/bookingSlice";
import type {
  BookingInfo,
  CartItem,
  OrderMenu,
  UpdateMenuOrderRequest,
  UpdateTableLocalStorage,
} from "@/types/booking.type";
import {
  useCreateOrderWithInfoMutation,
  useSelectMenuOrderMutation,
} from "@/store/api/orderApi";
import { useCallback } from "react";
import { useLazyGetMenuItemsQuery } from "@/store/api/menuItemApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { clearTableSelection } from "@/store/bookingTableSlice";

export function useBooking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bookingInfo = useSelector(
    (state: RootState) => state.booking.bookingInfo
  );
  const orders = useSelector((state: RootState) => state.booking.orders);

  const selectedVoucher = useSelector(
    (state: RootState) => state.booking.selectedVoucher
  );

  // Dùng thao tác với nhưng cãi trên fe
  const saveBookingInfo = (info: BookingInfo) => {
    dispatch(setBookingInfo(info));
  };

  const addToCart = (item: CartItem) => {
    dispatch(addToOrder(item));
    toast.success(`Đã thêm món vào giỏ hàng`);
  };

  const updateTable = (item: UpdateTableLocalStorage) => {
    dispatch(updateTableBooking(item));
  };

  const updateCartQuantity = (itemId: number, quantity: number) => {
    dispatch(updateQuantity({ itemId, quantity }));
  };

  const clearMenuItemNotActive = (menuId: number) => {
    dispatch(clearOrdersByMenuId({ menuId }));
  };

  const clearCart = () => {
    dispatch(clearOrders());
  };

  const clearCartForBooking = () => {
    dispatch(clearCartForBookingMenu());
  };

  const continueChooseMenu = (orderId: number) => {
    dispatch(selecteMenuByOrderId(orderId));
  };

  const getTotalPrice = () => {
    if (!orders) return 100000;

    let total = orders.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (selectedVoucher) {
      const { discountType, discountValue, maxDiscountAmount } =
        selectedVoucher;

      if (discountType === "PERCENT") {
        const discount = (total * discountValue) / 100;
        total -=
          maxDiscountAmount && maxDiscountAmount > 0
            ? Math.min(discount, maxDiscountAmount)
            : discount;
      } else if (discountType === "FIXED") {
        total -= discountValue;
      }

      if (total < 0) total = 0;
    }

    return total;
  };

  const getTotalPriceWithoutVoucher = () => {
    if (!orders) return 100000;

    return orders.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // const getTotalPrice = () => {
  //   if(orders?.cartItems.length === 0) return 100000
  //   return (orders?.cartItems || []).reduce(
  //     (total, item) => total + item.price * item.quantity,
  //     0
  //   );
  // };

  const [triggerGetMenuItems] = useLazyGetMenuItemsQuery();

  const listIdIsNotActive = useCallback(
    async (menuIds: number[]) => {
      // Gọi API: lấy tất cả menu inactive
      const { data } = await triggerGetMenuItems({
        page: 1,
        size: 1000,
        active: false,
      }).unwrap();

      const allMenus = data || [];

      const inactiveMenus = allMenus.filter((m) => m.active === false);

      // Trả về các ID nằm trong list menuIds nhưng bị inactive
      return menuIds.filter((id) =>
        inactiveMenus.some((menu) => menu.id === id)
      );
    },
    [triggerGetMenuItems]
  );

  // Cái này là dùng đẻ gọi API => lưu order
  // const confirmBooking = async () => {
  //   try {
  //     // Lấy dữ liệu từ localStorage
  //     const bookingInfoLS = JSON.parse(
  //       localStorage.getItem("bookingInfo") || "{}"
  //     );
  //     const ordersLS = JSON.parse(localStorage.getItem("orders") || "[]");

  //     const orderData = {
  //       orderName: bookingInfoLS.orderName,
  //       phone:bookingInfoLS.phone,
  //       tableId: bookingInfoLS.tableId ?? 1, // nếu bạn có tableId trong bookingInfo
  //       depositAmount: bookingInfoLS.depositAmount ?? 0,
  //       paidAmount: bookingInfoLS.paidAmount ?? 0,
  //       totalAmount: ordersLS.reduce(
  //         (total: number, item: CartItem) =>
  //           total + item.price * (item.quantity ?? 1),
  //         0
  //       ),
  //       guestCount: bookingInfoLS.people ?? 1,
  //       reservationTime: `${bookingInfoLS.date}T${bookingInfoLS.time}:00`, // ghép date + time
  //       note: bookingInfoLS.note ?? "",
  //       items: ordersLS.map((item: CartItem) => ({
  //         menuItemId: Number(item.id), // map id sang menuItemId
  //         quantityOnline: item.quantity ?? 1, // map quantity sang quantityOnline

  //       })),
  //     };

  //     const response = await createOrder(orderData).unwrap();

  //     toast.success(" Đặt bàn thành công! Cảm ơn bạn đã sử dụng dịch vụ.");
  //     console.log("Order created:", response);

  //     // Xóa dữ liệu sau khi đặt bàn thành công
  //     localStorage.removeItem("orders");
  //     localStorage.removeItem("bookingInfo");
  //     clearCart();
  //   } catch (error) {
  //     toast.error("Đặt bàn thất bại, vui lòng thử lại!");
  //   }
  // };

  const [selectMenuOrder] = useSelectMenuOrderMutation();

  const confirmBooking = async () => {
    try {
      // Lấy dữ liệu order từ localStorage
      const ordersLS: OrderMenu | null = JSON.parse(
        localStorage.getItem("orders") || "null"
      );

      if (!ordersLS) {
        toast.info("Không có món nào để thêm vào order.");
        return;
      }

      const orderId = ordersLS.orderId;

      // Map cartItems chuẩn cho cả menu và combo
      const menuItems: UpdateMenuOrderRequest[] = ordersLS.cartItems
        .map((item: CartItem) => {
          if (item.type === "menu") {
            return {
              menuItemId: Number(item.id),
              comboId: undefined,
              quantityOnline: item.quantity ?? 1,
            };
          } else if (item.type === "combo") {
            return {
              menuItemId: undefined,
              comboId: Number(item.comboId),
              quantityOnline: item.quantity ?? 1,
            };
          } else {
            // Nếu không xác định type, bỏ qua
            return null;
          }
        })
        .filter(Boolean) as UpdateMenuOrderRequest[]; // loại bỏ null

      const selectedVoucher = JSON.parse(
        localStorage.getItem("selectedVoucher") || "null"
      );

      // Gọi API
      await selectMenuOrder({
        orderId,
        menuItem: menuItems,
        voucherId: selectedVoucher?.id ?? undefined,
      }).unwrap();

      clearCart();
      dispatch(clearCartForBookingMenu());
      dispatch(clearTableSelection());

      toast.success("Thông tin được lưu thành công!");
      localStorage.removeItem("selectedVoucher");
      navigate("/app/booking-history");
      dispatch(selectVoucherForOrder(null));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Cập nhật món thất bại, vui lòng thử lại!");
      }
      navigate("/app/booking-confirm");
    }
  };

  const [createOrderWithInfo] = useCreateOrderWithInfoMutation();
  const confirmBookingWithInfo = async () => {
    try {
      const bookingInfoLS = JSON.parse(
        localStorage.getItem("bookingInfo") || "{}"
      );
      const bookingTableLS = JSON.parse(
        localStorage.getItem("bookingTable") || "{}"
      );

      const orderData = {
        orderName: bookingInfoLS.orderName,
        phone: bookingInfoLS.phone,
        tableId: bookingTableLS.selectedTableAvailable.id,
        guestCount: bookingTableLS.tableFilter.guestCount ?? 1,
        reservationTime:
          bookingTableLS.tableFilter.reservationTime ??
          new Date().toISOString(),
        note: bookingInfoLS.note ?? "",
      };

      const response = await createOrderWithInfo(orderData).unwrap();

      dispatch(addToOrderId(response.data.orderId));
      toast.success("Đặt bàn thành công! Cảm ơn bạn đã sử dụng dịch vụ.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const error = err?.data?.message;
      const errorCode = err?.data?.code;
      if (error) {
        toast.error(error);
      }
      if (errorCode === 2000) {
        navigate("/app/booking-history");
        return
      }
      navigate("/app/booking-table-available");
    }
  };

  const handleConfirmOrder = async () => {
    try {
      if (!orders?.cartItems.length) {
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
        navigate("/app/booking-history");
      } else {
        navigate("/app/booking-menu");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đặt bàn thất bại, vui lòng thử lại!");
      navigate("/app/home");
    }
  };

  function formatDateTime(timestamp: string) {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) return "Vui lòng chọn đủ ngày và giờ";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng 0-11
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }
  const clearItemFromCart = (comboId: number) => {
    dispatch(
      clearOrdersByMenuId({
        comboId,
        type: "menu",
      })
    );
  };

  const updateItemPriceInCart = (menuId: number, newPrice: number) => {
    dispatch(updateMenuPrice({ menuId, newPrice }));
  };

  return {
    bookingInfo,
    orders,
    listIdIsNotActive,
    setBookingInfo: saveBookingInfo,
    addToCart,
    updateCartQuantity,
    clearMenuItemNotActive,
    clearCart,
    clearCartForBooking,
    continueChooseMenu,
    getTotalPrice,
    getTotalPriceWithoutVoucher,
    confirmBooking,
    confirmBookingWithInfo,
    updateTable,
    handleConfirmOrder,

    formatDateTime,
    clearItemFromCart,
    updateItemPriceInCart,
  };
}
