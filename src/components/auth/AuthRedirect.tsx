import { useAuth } from '@/hooks/useAuth'
import { hasAnyRequiredRole } from '@/utils/authUtils';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function AuthRedirect() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (!user?.data) return;

  
  
    const hasAdminRole = hasAnyRequiredRole(user,["ADMIN","MANAGER","STAFF"]);

    if (hasAdminRole) {
      navigate("/admin/dashboard");
    } else {
      navigate("/app/home");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-gray-600 text-lg">Đang điều hướng...</div>
    </div>
  );
}
