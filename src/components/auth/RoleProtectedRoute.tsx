import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { hasAnyRequiredRole } from "@/utils/authUtils";

type Props ={
    allowedRoles?: string[];
    redirectToUnauthenticated?: string;
    redirectToForbidden?: string;

}

export default function RoleProtectedRoute({
    allowedRoles ,
    redirectToUnauthenticated ="/auth/login",
    redirectToForbidden ="/forbidden",
    
} :Props) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if(!isAuthenticated){
    return <Navigate to={redirectToUnauthenticated} replace/>
  }

  if (isLoading || !user || !user?.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-lg">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  const hasRequiredRole = hasAnyRequiredRole(user, allowedRoles);

  if(hasRequiredRole){
    return <Outlet/>;
  }else{
    return <Navigate to={redirectToForbidden} replace />
  }

}
