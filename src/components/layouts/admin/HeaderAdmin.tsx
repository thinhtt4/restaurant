import { Bell, UserRoundCog, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { hasAnyRequiredRole } from "@/utils/authUtils";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  unreadCount: number;
}

export default function HeaderAdmin({
  // onMenuClick,
  showNotifications,
  setShowNotifications,
  unreadCount,
}: HeaderProps) {
  const { handleLogout, user } = useAuth();

  // Avatar mặc định cho admin/manager/staff
  const DEFAULT_ADMIN_AVATAR =
    "https://res.cloudinary.com/dig9xykia/image/upload/v1764347436/restaurant_app_images/wkd7okpxspgknkkfjt8q.png";

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAvatarUrl = (avatar: string | null | undefined, userRoles?: any) => {
    // Kiểm tra nếu user là admin/manager/staff thì dùng avatar mặc định
    if (
      userRoles &&
      hasAnyRequiredRole(userRoles, ["ADMIN", "MANAGER", "STAFF"])
    ) {
      return DEFAULT_ADMIN_AVATAR;
    }

    if (!avatar) return DEFAULT_ADMIN_AVATAR;
    if (avatar.startsWith("/storage")) {
      return `${backendUrl}${avatar}`;
    }
    return avatar;
  };

  const userAvatar = getAvatarUrl(user?.data?.avatar, user?.data?.roles);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Middle: search */}
      <div className="hidden md:flex flex-1 justify-center px-6">
        <div className="relative w-full max-w-md">
          {/* <input
                        type="text"
                        placeholder="Search..."
                        className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" /> */}
        </div>
      </div>

      {/* Right: notification + user */}
      <div className="flex items-center space-x-4">
        {/* Notification */}
        <button
          className={`relative p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            showNotifications ? "bg-gray-100" : ""
          }`}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={20} className="text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 focus:outline-none">
              <img
                src={userAvatar || DEFAULT_ADMIN_AVATAR}
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {user?.data.username || "User"}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 bg-white rounded-lg shadow-lg border p-2"
          >
            <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
              <UserRoundCog className="h-4 w-4" />
              <Link to={"/admin/profile"}>Profile</Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
