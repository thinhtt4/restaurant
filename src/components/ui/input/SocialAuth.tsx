
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { toast } from "sonner";
export default function SocialAuth() {
  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const googleAuthUrl = `${backendUrl}/oauth2/authorization/google?prompt=select_account`;
    console.log("Redirecting to Google OAuth2:", googleAuthUrl);
    
   
    try {
      window.location.assign(googleAuthUrl);
    } catch (error) {
      console.error("Failed to redirect to Google OAuth2:", error);
      toast.error("Không thể chuyển hướng đến Google login. Vui lòng kiểm tra popup không bị chặn.");
    }
  };

 

  return (
    <div className="flex justify-center items-center gap-6">
        <button 
          onClick={handleGoogleLogin}
          className="transition-transform hover:scale-110"
          type="button"
        >
          <FcGoogle className="text-4xl" />
        </button>
        <button 
          className="transition-transform hover:scale-110"
          type="button"
        >
          <FaFacebook className="text-blue-600 text-4xl" />
        </button>
        <button 
          className="transition-transform hover:scale-110"
          type="button"
        >
          <IoIosLink className="text-blue-600 text-4xl" />
        </button>
      </div>
  )
}
