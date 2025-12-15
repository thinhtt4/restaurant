import type { ComboResponse } from "./combo.type";
import type { MenuItem } from "./menuItem.type";
import type { User } from "./user.type";
import type { Voucher } from "./voucher.type";

export interface CartItem extends MenuItem {
  quantity: number;
  type?: "menu" | "combo";
  comboId?: number;
}
export interface CartComboItem {
  comboId: number;
  comboName: string;
  comboPrice: number;
  quantity: number;
  items?: MenuItem[]; // Danh sách món trong combo
  imageUrl?: string;
  description?: string;
  type?: "menu" | "combo";
}

// Thông tin nhập đặt bàn
export interface BookingInfo {
  orderName: string;
  email: string;
  phone: string;
  dateTime: string;
  people: number;
  note?: string;
}

export interface UpdateTableLocalStorage {
  people: number;
  dateTime: string;
}
// Chưa dùng
export interface OrderState {
  cart: CartItem[];
  bookingInfo: BookingInfo | null;
}

export interface CreateOrder {
  tableId: number;
  phone: string;
  depositAmount?: number;
  items?: UpdateMenuOrderRequest[];
  paidAmount?: number;
  totalAmount?: number;
  note: string;
  guestCount: number;
  reservationTime: string;
}
// Table để tạm
export interface Table {
  id: number;
  code: string;
  name: string;
  guestCount: number;
  status: string;
  areaId: number;
  areaName: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  [x: string]: string | number | boolean | object | null | undefined;
  orderItemId?: number;
  orderId?: number;
  menuItem?: MenuItem;
  quantityOnline: number;
  priceOnline: number;
  quantityOffline: number;
  priceOffline: number | null;
  combo?: ComboResponse;
}

export interface OrderResponse {
  orderId: number;
  orderName: string;
  phone?: string;
  table: Table;
  user: User;
  orderItem: OrderItem[];
  guestCount: number;
  depositTable: number;
  depositAmount: number;
  paidAmount: number;
  totalAmount: number;
  paidAt: string | null;
  reservationTime: string;
  reservationEndTime: string;
  note: string;
  status: string;
  createdAt: string | null;
  voucher: Voucher | null;
}

export interface ListOrderPageResponse {
  data: OrderResponse[];
  totalElement: number;
  totalPage: number;
  size: number;
}

export interface UpdateMenuOrderRequest {
  menuItemId?: number;
  quantityOnline: number;
  comboId?: number;
  combo?: ComboResponse;
  menuItem?: MenuItem;
}

export interface UpdateComboOrderRequest {
  menuItemId: number;
  quantityOnline: number;
  comboId?: number;
}

//
export interface TableFilter {
  page?: number;
  size?: number;
  keyword?: string;
  guestFrom?: number;
  guestTo?: number;
  areaId?: number;
  status?: string;
  guestCount: number;
  reservationTime?: string;
}

export interface TableHoldRequest {
  tableId: number;
  reservationTime: string;
  guestCount: number;
  userId: number;
}

export interface TableHoldResponse {
  holdId: string;
  reservationTime: string;
  tableId: number;
  guestCount: number;
  holdExpire: number;
}

export interface OrderMenu {
  orderId: number;
  cartItems: CartItem[];
}

export interface TableFlag {
  table: Table;
  guestCount: number;
  reservationTime: string;
  reservationEndTime: string;
}
