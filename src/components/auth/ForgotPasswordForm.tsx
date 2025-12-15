import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/input/Input";
import { useForgotPasswordMutation } from "../../store/api/baseApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";

export default function ForgotPasswordForm() {
  
  const {
    register,
    handleSubmit,
    formState:{errors}
    
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const onSubmit = async (formData: ForgotPasswordFormData)=> {

    try {
      await forgotPassword({ email:formData.email }).unwrap();
      toast.success("OTP đã được gửi đến email của bạn");
      navigate("/auth/reset-password", { state: { email:formData.email } });
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Gửi OTP thất bại";
      toast.error(errorMessage);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-black text-center text-[36px] font-semibold">Forgot password?</h1>
      <p className="text-gray-600 text-center text-sm mt-2 mb-6">    
      Enter your email to receive OTP code to reset password
      </p>

      <Input
        {...register("email")}
        type="email"
        name="email"
        placeholder="Email"
        autoComplete="email"
        icon={<Mail size={20} />}
        error={errors.email?.message}
        required
      />

      <button disabled={isLoading} type="submit" className="btn btn-blue mt-[25px]">
        {isLoading ? "Sending..." : "Sending OTP code"}
      </button>
    </form>
  );
}

