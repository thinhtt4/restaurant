export type DiscountType = "PERCENT" | "FIXED";
export type ApplyType = "ORDER" | "COMBO";

export interface Voucher {
  id?: number;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startAt?: string;
  endAt?: string;
  usageLimit?: number;
  usageLimitPerUser?: number;
  usedCount?: number;
  active?: boolean;
  applyType?: ApplyType;  

  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface VoucherFilter {
  page: number;
  pageSize: number;
  code?: string;
  type?: DiscountType | null;
  active?: boolean | null;

  isUsed?: boolean | null;
  startAt?: string;
  endAt?: string;
}
