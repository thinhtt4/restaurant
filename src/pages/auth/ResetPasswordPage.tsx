import { Link, useLocation } from "react-router-dom";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  const location = useLocation();
  const email = location.state?.email || "";

  return (
    <div className="bg-color-primary flex justify-center items-center h-screen p-10 z-10">
      <div className="container relative w-[880px] h-[600px] bg-white rounded-[30px] overflow-hidden flex">
        <div className="w-1/2 bg-color-banner rounded-r-[150px] flex justify-center items-center text-center">
          <div>
            <h1 className="text-[36px]">Reset Password</h1>
            <p className="mt-[5px] mb-10 mx-0 text-white">Enter OTP code and new password</p>
            <Link to={"/auth/login"} data-discover="true">
              <button className="btn register-btn btn-white">Login</button>
            </Link>
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <div className="w-full p-[25px]">
            <ResetPasswordForm email={email} />
          </div>
        </div>
      </div>
    </div>
  );
}

