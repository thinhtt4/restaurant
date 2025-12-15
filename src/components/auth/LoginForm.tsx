import { Mail, RectangleEllipsis } from "lucide-react";
import Input from "../ui/input/Input";
import SocialAuth from "../ui/input/SocialAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { loginSchema, type LoginFormData } from "../../schemas/auth";
import { useLoginMutation } from "../../store/api/baseApi";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (formData: LoginFormData) => {
    try {
      const result = await login(formData).unwrap();

      dispatch(setAuth({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      })
      );
      navigate("/");

      console.log(formData);
      toast.success(result.message || "Đăng Nhập Thành Công")

    } catch (error) {
      console.log(error);
      toast.error("Hãy Kích Hoạt Tài Khoản")
    }

  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="text-black text-center text-[36px] font-semibold">Login</h1>
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

      <Input
        {...register("password")}
        type="password"
        placeholder="Password"
        autoComplete="password"
        icon={<RectangleEllipsis size={20} />}
        error={errors.password?.message}
        required
      />

      <div className="text-right mt-2">
        <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </div>

      <button disabled={isLoading} type="submit" className="btn btn-blue mt-[25px]">

        {isLoading ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-black text-center">or login with socical platforms</p>
      <SocialAuth />
    </form>
  );
}
