import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetMyInfoQuery, useLogoutMutation } from "@/store/api/baseApi";
import { logout } from "@/store/authSlice";
import { toast } from "sonner";

export function useAuth() {
  const dispatch = useDispatch();
  

  const { isAuthenticated, accessToken ,} = useSelector(
    (state: RootState) => state.auth
  );

  const { data: user, isLoading } = useGetMyInfoQuery(undefined, {
    skip: !accessToken,

    refetchOnMountOrArgChange: true,
  });
  

  const [logoutApi] = useLogoutMutation();
  

  const handleLogout = async () => {
    try {
     const result = await logoutApi();
     toast.success(result.data?.message);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(logout());
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,

   handleLogout,
  };
}
