import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng không được bỏ trống")
    .email("Email không hợp lệ"),

  password: z
    .string()
    .min(1, "Password không được bỏ trống")
    .min(6, "Password phải 6 ký tụ"),
});

export type LoginFormData = z.infer<typeof loginSchema>;


export const registerSchema = z.object({
  username: z.string().min(2, "Vui lòng không bỏ trống"),

  phone: z
    .string()
    .min(10, "Vui lòng nhập đúng SĐT")
    .max(15, "SĐT quá dài")
    .regex(/^[0-9]+$/, "SĐT chỉ chứa số"),  

  email: z
    .string()
    .min(1, "Vui lòng không được bỏ trống")
    .email("Email không hợp lệ"),

  password: z
    .string()
    .min(1, "Password không được bỏ trống")
    .min(6, "Password phải 6 ký tụ"),

  confirmPassword: z
    .string()
    .min(1, "Password không được bỏ trống")
    .min(6, "Password phải 6 ký tụ"),
}).refine((data) => data.password === data.confirmPassword, {
    message:"Password không khớp",
    path:["confirmPassword"]
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng không được bỏ trống")
    .email("Email không hợp lệ"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng không được bỏ trống")
    .email("Email không hợp lệ"),
  otp: z
    .string()
    .min(1, "Vui lòng không được bỏ trống")
    .length(6, "Mã OTP phải có 6 số"),
  newPassword: z
    .string()
    .min(1, "Password không được bỏ trống")
    .min(6, "Password phải 6 ký tự"),
  confirmPassword: z
    .string()
    .min(1, "Password không được bỏ trống")
    .min(6, "Password phải 6 ký tự"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password không khớp",
  path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;