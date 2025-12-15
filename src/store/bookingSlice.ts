import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  BookingInfo,
  CartItem,
  OrderMenu,
  OrderResponse,
  UpdateTableLocalStorage,
} from "../types/booking.type";
import type { Voucher } from "@/types/voucher.type";

interface BookingState {
  bookingInfo: BookingInfo | null;
  orders: OrderMenu | null;
  ordersResponse: OrderResponse[];
  selectedVoucher?: Voucher | null;
}

const storedBookingInfo = localStorage.getItem("bookingInfo");
const storedOrders = localStorage.getItem("orders");
const storedSelectedVoucher = localStorage.getItem("selectedVoucher");

// Safely parse localStorage data with validation
const parseStoredOrders = (stored: string | null): OrderMenu | null => {
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    // Validate that parsed data is an object with expected structure
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      return parsed;
    }
    // If invalid, clear the corrupted data
    localStorage.removeItem("orders");
    return null;
  } catch (error) {
    console.log(error);
    
    // If parsing fails, clear the corrupted data
    localStorage.removeItem("orders");
    return null;
  }
};

const parseStoredBookingInfo = (stored: string | null): BookingInfo | null => {
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    }
    localStorage.removeItem("bookingInfo");
    return null;
  } catch (error) {
    console.log(error);
  
    localStorage.removeItem("bookingInfo");
    return null;
  }
};

const initialState: BookingState = {
  bookingInfo: parseStoredBookingInfo(storedBookingInfo),
  orders: parseStoredOrders(storedOrders),
  ordersResponse: [],
  selectedVoucher: storedSelectedVoucher
    ? JSON.parse(storedSelectedVoucher)
    : null,
};
const normalizeType = (type?: "menu" | "combo") => type ?? "menu";

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingInfo: (state, action: PayloadAction<BookingInfo>) => {
      state.bookingInfo = action.payload;
      localStorage.setItem("bookingInfo", JSON.stringify(action.payload));
    },
    addToOrder: (state, action: PayloadAction<CartItem>) => {
      // Nếu chưa có orders thì khởi tạo RỖNG
      if (!state.orders) {
        state.orders = {
          orderId: 0,       // chưa đặt bàn
          cartItems: [],
        };
      }

      const payload = action.payload;
      const payloadType = normalizeType(payload.type);

      const existing = state.orders.cartItems.find((item) => {
        const itemType = normalizeType(item.type);

        return payloadType === "combo"
          ? itemType === "combo" && item.comboId === payload.comboId
          : itemType === "menu" && item.id === payload.id;
      });

      if (existing) {
        existing.quantity += payload.quantity;
      } else {
        state.orders.cartItems.push({
          ...payload,
          type: payloadType,
        });
      }

      localStorage.setItem("orders", JSON.stringify(state.orders));
    },

    addToOrderId: (state, action: PayloadAction<number>) => {
      // Ensure state.orders is a valid object, not a string or other invalid type
      if (
        !state.orders ||
        typeof state.orders !== "object" ||
        Array.isArray(state.orders)
      ) {
        state.orders = {
          orderId: action.payload,
          cartItems: [],
        };
      } else {
        state.orders.orderId = action.payload;
      }
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
    updateTableBooking: (
      state,
      action: PayloadAction<UpdateTableLocalStorage>
    ) => {
      if (state.bookingInfo) {
        state.bookingInfo.people = action.payload.people;
        state.bookingInfo.dateTime = action.payload.dateTime;
        localStorage.setItem("bookingInfo", JSON.stringify(state.bookingInfo));
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        itemId: number;
        quantity: number;
        type?: "menu" | "combo";
      }>
    ) => {
      if (!state.orders) return;

      const { itemId, quantity } = action.payload;
      const type = normalizeType(action.payload.type);

      if (quantity <= 0) {
        state.orders.cartItems = state.orders.cartItems.filter((item) => {
          const itemType = normalizeType(item.type);

          return type === "combo"
            ? !(itemType === "combo" && item.comboId === itemId)
            : !(itemType === "menu" && item.id === itemId);
        });
      } else {
        const item = state.orders.cartItems.find((i) => {
          const itemType = normalizeType(i.type);

          return type === "combo"
            ? itemType === "combo" && i.comboId === itemId
            : itemType === "menu" && i.id === itemId;
        });

        if (item) item.quantity = quantity;
      }

      localStorage.setItem("orders", JSON.stringify(state.orders));
    },

    getListOrderByUser: (state, action: PayloadAction<OrderResponse[]>) => {
      state.ordersResponse = action.payload;
    },

    selectVoucherForOrder: (state, action: PayloadAction<Voucher | null>) => {
      state.selectedVoucher = action.payload;
      if (action.payload) {
        localStorage.setItem("selectedVoucher", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("selectedVoucher");
      }
    },

    clearOrdersByMenuId: (
      state,
      action: PayloadAction<{
        menuId?: number;
        comboId?: number;
        type?: "menu" | "combo";
      }>
    ) => {
      if (!state.orders) return;

      const { menuId, comboId } = action.payload;
      const type = normalizeType(action.payload.type);

      state.orders.cartItems = state.orders.cartItems.filter((item) => {
        const itemType = normalizeType(item.type);

        if (type === "combo" && comboId !== undefined) {
          return !(itemType === "combo" && item.comboId === comboId);
        }
        if (type === "menu" && menuId !== undefined) {
          return !(itemType === "menu" && item.id === menuId);
        }
        return true;
      });

      localStorage.setItem("orders", JSON.stringify(state.orders));
    },

    clearOrders: (state) => {
      state.orders = null;
      state.bookingInfo = null;
      localStorage.removeItem("orders");
      localStorage.removeItem("bookingInfo");
    },

    updateComboPrice: (
      state,
      action: PayloadAction<{ comboId: number; newPrice: number }>
    ) => {
      if (!state.orders) return;

      const { comboId, newPrice } = action.payload;

      // Tìm combo trong cart
      const comboItem = state.orders.cartItems.find(
        (item) =>
          normalizeType(item.type) === "combo" && item.comboId === comboId
      );

      // Cập nhật giá nếu tìm thấy
      if (comboItem) {
        comboItem.price = newPrice;
        localStorage.setItem("orders", JSON.stringify(state.orders));
      }
    },
     updateMenuPrice: (
      state,
      action: PayloadAction<{ menuId: number; newPrice: number }>
    ) => {
      if (!state.orders) return;

      const { menuId, newPrice } = action.payload;

      // Tìm combo trong cart
      const comboItem = state.orders.cartItems.find(
        (item) =>
          normalizeType(item.type) === "menu" && item.id === menuId
      );

      // Cập nhật giá nếu tìm thấy
      if (comboItem) {
        comboItem.price = newPrice;
        localStorage.setItem("orders", JSON.stringify(state.orders));
      }
    },

    clearCartForBookingMenu: (state) => {
      if (state.orders) {
        state.orders.cartItems = [];
        localStorage.setItem("orders", JSON.stringify(state.orders));
      }
    },

    // dùng cho nút TIẾP TỤC CHỌN MÓN
    selecteMenuByOrderId: (state, action: PayloadAction<number>) => {
      state.orders = {
        orderId: action.payload,
        cartItems: [],
      };
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
  },
});

export const {
  setBookingInfo,
  addToOrder,
  addToOrderId,
  updateQuantity,
  clearOrdersByMenuId,
  clearOrders,
  getListOrderByUser,
  updateTableBooking,
  selectVoucherForOrder,
  updateComboPrice,
  clearCartForBookingMenu,
  selecteMenuByOrderId,
  updateMenuPrice
} = bookingSlice.actions;
export default bookingSlice.reducer;
