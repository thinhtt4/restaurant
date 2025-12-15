import { Mail, Phone, RectangleEllipsis, User } from "lucide-react";
import Input from "../ui/input/Input";
import SocialAuth from "../ui/input/SocialAuth";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterFormData } from "../../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { useRegisterMutation } from "@/store/api/baseApi";
import { toast } from "sonner";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";


export default function RegisterForm() {
  const [registerApi,{isLoading}]= useRegisterMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (formData:RegisterFormData) =>{
    const {confirmPassword,...registerData} = formData;
    console.log(confirmPassword);
    
    try {
      const result =await registerApi(registerData);

      toast.success(result.data?.message|| "ĐĂNG KÍ THÀNH CÔNG!");
      navigate("/auth/login")

      
    } catch (error) {
      console.log(error);
      const err = error as FetchBaseQueryError
      toast.error((err.data as {message?:string} ).message || "Đăng Kí Thất Bại!")
    }
      
    }

  return (
    <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="text-black text-center text-[36px] font-semibold">Register</h1>

      <Input
        {...register("username")}
        type="text"
        placeholder="username"
        autoComplete="username"
        icon={<User size={20} />}
        error={errors.username?.message}
        required
      />

      <Input
        {...register("phone")}
        type="text"
        placeholder="Phone"
        autoComplete="tel"
        icon={<Phone size={20} />}
        error={errors.phone?.message}
        required
      />
      <Input
       {...register("email")}
        type="email"
        placeholder="Email"
        autoComplete="email"
        icon={<Mail size={20} />}
        error={errors.email?.message}
        required
      />
      <Input
        {...register("password")}
        type="password"
        placeholder="Password"
        autoComplete="new-password"
        icon={<RectangleEllipsis size={20} />}
        error={errors.password?.message}
        required
      />
      <Input
        {...register("confirmPassword")}
        type="password"
        placeholder="Confirm Password"
        autoComplete="new-password"
        icon={<RectangleEllipsis size={20} />}
        error={errors.confirmPassword?.message}
        required
      />

      <button
      disabled={isLoading}
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700  text-white py-3 rounded-lg font-medium mt-[15px] transition-colors"
      >
        {isLoading ? ' Creating Account' : "Create Account"}
        Create Account
      </button>
      <p className="text-center text-gray-500 mt-5 mb-3">Or register with</p>
      <SocialAuth />
    </form>
  );
}
