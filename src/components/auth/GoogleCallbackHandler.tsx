import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/authSlice";
import { toast } from "sonner";

export default function GoogleCallbackHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleOAuth2Callback = () => {
      try {
        console.log("=== GOOGLE CALLBACK START ===");
        console.log("Current URL:", window.location.href);
        console.log("Location search:", location.search);
        
      
        const urlParams = new URLSearchParams(location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');
        
        console.log("Access token from URL:", accessToken);
        console.log("Refresh token from URL:", refreshToken);

        if (accessToken && refreshToken) {
          console.log("Tokens received successfully");
        
          dispatch(setAuth({
            accessToken: accessToken,
            refreshToken: refreshToken,
          }));
          
          toast.success("Đăng nhập Google thành công!");
          navigate("/");
        } else {
          console.error("Missing tokens - accessToken:", accessToken, "refreshToken:", refreshToken);
          toast.error("Không nhận được token từ Google");
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Có lỗi xảy ra khi đăng nhập bằng Google");
        navigate("/auth/login");
      } finally {
        setIsProcessing(false);
       
      }
    };

    handleOAuth2Callback();
  }, [navigate, dispatch, location]);

  if (isProcessing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang xử lý đăng nhập Google...</p>
        </div>
      </div>
    );
  }

  return null;
}