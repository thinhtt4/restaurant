import { useState } from "react";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { hasAnyRequiredRole } from "@/utils/authUtils";

import { Menu, UserRoundCog, LogOut, X, History, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const { isAuthenticated, handleLogout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  
  // Avatar mặc định cho admin/manager/staff
  const DEFAULT_ADMIN_AVATAR = "https://res.cloudinary.com/dig9xykia/image/upload/v1764347436/restaurant_app_images/wkd7okpxspgknkkfjt8q.png";
  const DEFAULT_USER_AVATAR = "https://aic.com.vn/wp-content/uploads/2024/10/avatar-vo-tri-cute.jpg";
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAvatarUrl = (avatar: string | null | undefined, userRoles?: any) => {
    // Kiểm tra nếu user là admin/manager/staff thì dùng avatar mặc định
    if (userRoles && hasAnyRequiredRole(userRoles, ["ADMIN", "MANAGER", "STAFF"])) {
      return DEFAULT_ADMIN_AVATAR;
    }
    
    if (!avatar) return null;
    if (avatar.startsWith("/storage")) {
      return `${backendUrl}${avatar}`;
    }
    return avatar;
  };

  const fullAvatarUrl = getAvatarUrl(user?.data?.avatar, user?.data?.roles) || DEFAULT_USER_AVATAR;

  const navItems = [
    { label: "TRANG CHỦ", href: "/app/home" },
    { label: "THỰC ĐƠN", href: "/app/menu" },
    { label: "DỊCH VỤ", href: "#services" },
    { label: "TIN TỨC & MẸO HAY", href: "/app/blog" },
    { label: "KHÁC", href: "#more" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-black/40">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl md:text-2xl"
          >
            <img
              src={logo}
              alt="Logo Quê Lúa"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-bold text-lg text-accent">Quê Lúa</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-semibold text-white hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

            {/* Đăng nhập */}
            {!isAuthenticated && (
              <Link
                to="/auth/login"
                className="hidden md:inline-block bg-accent text-accent-foreground px-6 py-2 rounded font-bold text-sm hover:bg-opacity-90 transition-all"
              >
                ĐĂNG NHẬP
              </Link>
            )}

            {/* User Dropdown */}
            {isAuthenticated && (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center space-x-2 focus:outline-none"
                    >
                      <img
                        src={fullAvatarUrl}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="hidden md:inline text-sm font-medium text-accent">
                        {user?.data.username || "User"}
                      </span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent 
                    align="end"
                    className="w-50 bg-white rounded-lg shadow-lg border p-2"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        to="/app/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                      >
                        <UserRoundCog className="h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        to="/app/booking-history"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                      >
                        <History className="h-4 w-4" /> Booking history
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        to="/app/chat"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                      >
                        <MessageCircle className="h-4 w-4" /> Chat
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white"
              type="button"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
       
        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-semibold text-white hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <Link
              to={isAuthenticated ? "/app/booking-table" : "/auth/login"}
              className="bg-accent text-accent-foreground px-6 py-2 rounded font-bold text-sm hover:bg-opacity-90 transition-all w-full text-center"
            >
              ĐẶT BÀN
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
