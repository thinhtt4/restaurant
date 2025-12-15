import type { MenuItem } from "./menuItem.type";
import type { Voucher } from "./voucher.type";

export interface ComboItemResponse {
  comboItemId: number;
  comboId: number;
  menuItemId: number;
  quantity: number;
  menuItem?: MenuItem;
  combo?: Combo;
}

export interface ComboItem {
  comboItemId?: number;
  comboId: number;
  menuItemId: number;
  quantity: number;
  // menuItem?: MenuItem;
  // combo?: Combo;
}

export interface Combo {
  comboId?: number;
  name: string;
  description?: string;
  imageUrl?: string;
  active?: boolean;
  comboItems?: ComboItemResponse[];
}

export interface ComboResponse {
  comboId: number;
  name: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  comboPrice: number;
  comboItems: ComboItemResponse[];
  createdAt?: string;
  updatedAt?: string;
  vouchers?: Voucher[];
  finalPrice: number;
  totalSavings: number;
}
