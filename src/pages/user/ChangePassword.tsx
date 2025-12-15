/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { RootState } from "@/store/store";
import { useChangePasswordMutation } from "@/store/api/userProfileApi";
import type { User } from "@/types/user.type";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/schemas/profileSchema";

interface ChangePasswordFormProps {
  user?: User | null;
}

export default function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const profileUser = useSelector((state: RootState) => state.profile.profile);
  const currentUser = user || profileUser;

  // State hiển thị mật khẩu (UI state vẫn dùng useState)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [changePassword, { isLoading: isUpdating }] = useChangePasswordMutation();

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Kiểm tra nếu user login bằng Google
  const isGoogleUser = currentUser?.provider === "GOOGLE";

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (isGoogleUser) {
      toast.error("Tài khoản Google không thể đổi mật khẩu tại đây");
      return;
    }

    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Đổi mật khẩu thành công!");
      reset(); // Reset form về rỗng sau khi thành công
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Đổi mật khẩu thất bại!";
      toast.error(errorMessage);
    }
  };

  // Helper render input để code gọn hơn
  const renderPasswordInput = (
    fieldName: keyof ChangePasswordFormData,
    label: string,
    show: boolean,
    setShow: (val: boolean) => void,
    placeholder: string
  ) => (
    <div className="relative">
      <label className="block text-gray-400 text-sm font-semibold mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          {...register(fieldName)}
          type={show ? "text" : "password"}
          className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 text-white placeholder-gray-500 pr-10 transition-colors
            ${
              errors[fieldName]
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-700 focus:ring-blue-500"
            }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {/* Hiển thị lỗi từ Zod */}
      {errors[fieldName] && (
        <p className="text-red-500 text-xs mt-1 italic">
          {errors[fieldName]?.message}
        </p>
      )}
    </div>
  );

  // UI cho Google User
  if (isGoogleUser) {
    return (
      <div className="space-y-6 max-w-md">
        <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-6">
          <p className="text-yellow-400 font-semibold text-lg">
            Không thể đổi mật khẩu
          </p>
          <p className="text-gray-300 mt-2 text-sm">
            Tài khoản của bạn được đăng nhập thông qua Google. Vui lòng quản lý
            mật khẩu tại cài đặt tài khoản Google của bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6 max-w-md"
    >
      {renderPasswordInput(
        "oldPassword",
        "Mật khẩu hiện tại",
        showCurrent,
        setShowCurrent,
        "Nhập mật khẩu hiện tại"
      )}

      {renderPasswordInput(
        "newPassword",
        "Mật khẩu mới",
        showNew,
        setShowNew,
        "Nhập mật khẩu mới (tối thiểu 6 ký tự)"
      )}

      {renderPasswordInput(
        "confirmPassword",
        "Xác nhận mật khẩu mới",
        showConfirm,
        setShowConfirm,
        "Nhập lại mật khẩu mới"
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          {isUpdating ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </button>
        
        <button
          type="button"
          onClick={() => reset()}
          disabled={isUpdating}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}