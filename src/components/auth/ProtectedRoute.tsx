import { useAuth } from "@/hooks/useAuth";
import { setUserProfile } from "@/store/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const dispatch = useDispatch();

  const { isAuthenticated, user, isLoading } = useAuth();


  useEffect(() => {
      if (user?.data) {
      dispatch(
        setUserProfile(user.data)
      );
    }
  }, [user, dispatch]);


  if (!isAuthenticated) {
    return <Navigate to={"/app/home"} replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-lg">Đang tải...</div>
      </div>
    );
  }

  return <Outlet />;
}
