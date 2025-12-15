import { z } from "zod";

export const profileSchema = z.object({
    firstName: z.string().min(1, "Tên không được để trống"),
    lastName: z.string().min(1, "Họ không được để trống"),
    phone: z
        .string()
        .min(10, "Số điện thoại quá ngắn")
        .max(15, "Số điện thoại quá dài")
        .regex(/^[0-9]+$/, "SĐT chỉ chứa số"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], "Vui lòng chọn giới tính"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;


export const changePasswordSchema = z.object({

    oldPassword: z
        .string()
        .min(1,"Vui lòng không được bỏ trống")
        .min(6,"Password phải 6 ký tự"),

    newPassword: z
        .string()
        .min(1, "Password không được bỏ trống")
        .min(6, "Password phải 6 ký tự"),

    confirmPassword: z
        .string()
        .min(1, "Password không được bỏ trống")
        .min(6, "Password phải 6 ký tụ"),


}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password không khớp",
  path: ["confirmPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;