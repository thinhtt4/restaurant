/* eslint-disable @typescript-eslint/no-explicit-any */
import { RectangleEllipsis, KeyRound } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/input/Input";
import { useResetPasswordMutation } from "../../store/api/baseApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";

interface ResetPasswordFormProps {
  email: string;
}

export default function ResetPasswordForm({ email: initialEmail }: ResetPasswordFormProps) {
  const {register,
    handleSubmit,
    formState:{errors},
    setValue
  } = useForm<ResetPasswordFormData>({
    resolver:zodResolver(resetPasswordSchema),
    defaultValues:{
        email: initialEmail || "",
    },
  });
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  useEffect(() =>{
    if(initialEmail) {
        setValue("email",initialEmail);
    }
  },[initialEmail, setValue]);

  const onSubmit= async(formData: ResetPasswordFormData)=>{
    try {
      await resetPassword({
        email:formData.email,
        otp:formData.otp,
        newPassword:formData.newPassword,
      }).unwrap();

      toast.success("Đặt lại mật khẩu thành công!");
      navigate("/auth/login");
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Đặt lại mật khẩu thất bại";
      toast.error(errorMessage);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-black text-center text-[36px] font-semibold">Reset Password</h1>
      <p className="text-gray-600 text-center text-sm mt-2 mb-6">
        Enter OTP code and new password
      </p>

      <Input
        {...register("email")}
        type="email"
        name="email"
        placeholder="Email"
        autoComplete="email"
        icon={<KeyRound size={20} />}
        error={errors.email?.message}
        required
      />

      <Input
       {...register("otp", {
          onChange: (e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setValue("otp", value);
          },
        })}
        type="text"
        name="otp"
        placeholder="OTP code (6 digits)"
        icon={<KeyRound size={20} />}
        error={errors.otp?.message}
        required
        maxLength={6}
      />

      <Input
        {...register("newPassword")}
        type="password"
        name="newPassword"
        placeholder="new password"
        autoComplete="new-password"
        icon={<RectangleEllipsis size={20} />}
        error={errors.newPassword?.message}
        required
      />

      <Input
        {...register("confirmPassword")}
        type="password"
        name="confirmPassword"
        placeholder="confirm password"
        autoComplete="new-password"
        icon={<RectangleEllipsis size={20} />}
        error={errors.confirmPassword?.message}
        required
      />

      <button disabled={isLoading} type="submit" className="btn btn-blue mt-[25px]">
        {isLoading ? "Loading..." : "Reset password"}
      </button>
    </form>
  );
}

