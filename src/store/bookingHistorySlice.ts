import type { OrderResponse } from "@/types/booking.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  orders: OrderResponse[];
  selectedOrder?: OrderResponse | null;
  showModalDetail: boolean;
  showOrderUpdateMenu: boolean;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  showModalDetail: false,
  showOrderUpdateMenu: false,
};
export const bookingHistorySlice = createSlice({
  name: "bookingHistory",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<OrderResponse[]>) => {
      state.orders = action.payload;
    },

    selectOrder: (state, action: PayloadAction<OrderResponse>) => {
      state.selectedOrder = action.payload;
      state.showModalDetail = true;
    },
    closeModal: (state) => {
      state.showModalDetail = false;
      state.selectedOrder = null;
    },
    selectUpdateMenu: (state, action: PayloadAction<OrderResponse>) => {
      state.selectedOrder = action.payload;
      state.showOrderUpdateMenu = true;
    },
    closeUpdateMenu: (state) => {
      state.showOrderUpdateMenu = false;
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: number; status: string }>
    ) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((order) => order.orderId === orderId);
      if (order) order.status = status;

      if (state.selectedOrder?.orderId === orderId) {
        state.selectedOrder.status = status;
      }
    },
  },
});

export const {
  setOrders,
  selectOrder,
  closeModal,
  updateOrderStatus,
  selectUpdateMenu,
  closeUpdateMenu,
} = bookingHistorySlice.actions;
export default bookingHistorySlice.reducer;
