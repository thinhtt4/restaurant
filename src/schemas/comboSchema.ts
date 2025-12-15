import { z } from "zod";

// Schema cho 1 item trong combo
export const comboItemSchema = z.object({
    menuItemId: z.number().min(1, "Vui lòng chọn món ăn"),
    quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
});

// Schema tạo combo mới
export const createComboSchema = z.object({
    name: z.string().nonempty("Tên combo không được để trống"),
    description: z.string().optional(),
    imageUrl: z.string().url("URL hình ảnh không hợp lệ").optional(),
    comboItems: z.array(comboItemSchema).optional(),
});

// Schema cập nhật combo (có thể có comboId)
export const updateComboSchema = createComboSchema.extend({
    comboId: z.number().min(1, "ID combo không hợp lệ"),
});