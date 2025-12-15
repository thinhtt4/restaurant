import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import AuthLayout from "@/components/layouts/AuthLayout";
import RegisterPage from "@/pages/auth/RegisterPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/auth/NotFound";
import PublicRoute from "./components/auth/PublicRoute";
import GoogleCallbackHandler from "./components/auth/GoogleCallbackHandler";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Home from "./pages/guest/Home";
import HomeLayout from "./components/layouts/HomeLayout";
import MenuPage from "./components/guest/menu";
import Profile from "./pages/user/Profile";
import AuthRedirect from "./components/auth/AuthRedirect";
import TableCrud from "./pages/admin/TableCrud";
import MenuItemCrud from "./pages/admin/MenuItemCrud";
import TableMap from "./pages/admin/TableMap";
import TableAreaPage from "./pages/admin/TableAreaPage";
import CategoryPage from "./pages/admin/CategoryPage";
import DashboardContent from "./components/dashboard_admin/dashboard/DashboardContent";
// import PermissionPage from "./pages/admin/PermissionPage";
import ComboItemTable from "./components/dashboard_admin/combo/comboItemMenu.tsx/comboItemMenuTable";
import BookingMenu from "./pages/booking/BookingMenu";
import BookingTable from "./pages/booking/BookingTable";
import ConfirmationBooking from "./pages/booking/BookingConfirm";
import BookingHistory from "./pages/booking/BookingHistory";
import RestaurantInvoice from "./pages/booking/Invoice";
import BlogDetail from "./components/guest/blog/BlogDetail";
// import RolePage from "./pages/admin/RolePage";
import BlogPage from "./pages/admin/BlogPage";
import UserPage from "./pages/admin/UserPage";
import ComboPage from "./pages/admin/comboPage";
import VoucherPage from "./pages/admin/VoucherPage";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
import Forbidden from "./pages/auth/Forbidden";
import BookingTableAvailable from "./pages/booking/BookingTableAvailable";
import PaymentResult from "./pages/paymentResult";
import { BlogWrapper } from "./components/guest/blog/BlogWrapper";
import { BlogHome } from "./pages/guest/BlogHome";
import BookingPage from "./pages/admin/BookingPage";
import BookingDetail from "./components/dashboard_admin/booking/BookingDetail";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ForgotPasswordPage from "./pages/auth/ForgetPasswordPage";
import AdminChatPage from "./pages/admin/AdminChatPage";
import UserChatPage from "./pages/user/UserChatPage";

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={"/app/home"} />;
  return <Navigate to={"/auth/redirect"} />;
}

const ADMIN_ROLES = ["ADMIN", "MANAGER", "STAFF"];
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/auth/redirect",
    element: <AuthRedirect />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
          { path: "google/callback", element: <GoogleCallbackHandler /> },
          { path: "forgot-password", element: <ForgotPasswordPage /> },
          { path: "reset-password", element: <ResetPasswordPage /> },

        ],
      },
    ],
  },

  {
    path: "/app",
    children: [
      {
        element: <HomeLayout />,
        children: [
          { path: "home", element: <Home /> },
          { path: "menu", element: <MenuPage /> },
          {
            path: "blog",
            element: <BlogWrapper />,
            children: [
              { index: true, element: <BlogHome /> },
              { path: ":id", element: <BlogDetail /> },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: <HomeLayout />,
        children: [
          { path: "profile", element: <Profile /> },
          //           { path: "change-pwd", element: <ChangePassword /> },
          {
            path: "booking-table",
            element: <BookingTable />,
          },

          {
            path: "booking-menu",
            element: <BookingMenu />,
          },

          {
            path: "booking-confirm",
            element: <ConfirmationBooking />,
          },
          {
            path: "booking-history",
            element: <BookingHistory />,
          }, {
            path: "booking-table-available",
            element: <BookingTableAvailable />,
          },
          {
            path: "chat",
            element: <UserChatPage />,
          },
        ],
      },
      {
        path: "invoice/:orderId",
        element: <RestaurantInvoice />,
      },
    ],
  },

  {
    path: "/admin",
    element: <RoleProtectedRoute allowedRoles={ADMIN_ROLES} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <DashboardContent /> },
          { path: "table-crud", element: <TableCrud /> },
          { path: "menu-item", element: <MenuItemCrud /> },

          { path: "voucher", element: <VoucherPage /> },
          // { path: "permissions", element: <PermissionPage /> },
          { path: "combo", element: <ComboPage /> },
          { path: "comboItem/:comboId", element: <ComboItemTable /> },
          { path: "table-map", element: <TableMap /> },
          { path: "blog", element: <BlogPage /> },
          // { path: "roles", element: <RolePage /> },
          { path: "table-area", element: <TableAreaPage /> },
          { path: "menu-category", element: <CategoryPage /> },
          { path: "accounts", element: <UserPage /> },
          { path: "chat", element: <AdminChatPage /> },
          { path: "booking", element: <BookingPage /> },
          { path: "booking/:id", element: <BookingDetail /> },
        ],
      },
    ],
  },

  {
    path: "/forbidden",
    element: <Forbidden />,
  },

  {
    path: "/payment-result",
    element: <PaymentResult />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router}/>;
}
export default App;
