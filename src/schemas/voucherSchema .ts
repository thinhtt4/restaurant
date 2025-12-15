import { z } from "zod";

const baseVoucherSchema = z.object({
  code: z.string().min(3, "Mã voucher phải có ít nhất 3 ký tự"),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.number().min(1, "Giá trị phải lớn hơn 0").default(0),
  minOrderAmount: z.number().min(0, "Tối thiểu phải >= 0").default(0),
  maxDiscountAmount: z.number().min(0, "Giảm tối đa >= 0").default(0),
  startAt: z.string().min(1, "Chọn ngày bắt đầu"),
  endAt: z.string().min(1, "Chọn ngày kết thúc"),
  usageLimit: z.number().min(0, "Giới hạn tổng phải >= 0, vô hạn nếu là 0").default(0),
  usageLimitPerUser: z.number().min(0, "Giới hạn user phải >= 1, vô hạn nếu là 0").default(0),
  description: z.string().optional(),
})
  .refine((data) => {
    // Nếu 1 trong 2 giá trị không có thì không check
    if (data.usageLimit === null || data.usageLimitPerUser === null) return true;

    // Nếu tổng là 0 (vô hạn) thì người dùng luôn hợp lệ
    if (data.usageLimit === 0) return true;

    // Check: perUser <= total
    return data.usageLimitPerUser <= data.usageLimit;
  }, {
    message: "Giới hạn mỗi người không được lớn hơn giới hạn tổng",
    path: ["usageLimitPerUser"],
  });;

// Refine chung: startAt < endAt
const dateOrderSchema = baseVoucherSchema.refine((data) => {
  if (!data.startAt || !data.endAt) return true;
  return new Date(data.startAt) < new Date(data.endAt);
}, {
  message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
  path: ["startAt"],
});

// Schema cho tạo mới: check thêm startAt > now
export const createVoucherSchema = dateOrderSchema.refine((data) => {
  if (!data.startAt) return true;
  return new Date(data.startAt) > new Date();
}, {
  message: "Ngày và giờ bắt đầu phải lớn hơn ngày giờ hiện tại",
  path: ["startAt"],
});

// Schema cho update: bỏ qua check startAt > now
export const updateVoucherSchema = createVoucherSchema;

// Type inference
export type CreateVoucherSchemaType = z.infer<typeof createVoucherSchema>;
export type UpdateVoucherSchemaType = z.infer<typeof updateVoucherSchema>;
