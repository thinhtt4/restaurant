import Sidebar from "./admin/SiberBar";
import HeaderAdmin from "./admin/HeaderAdmin";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import NotificationPanel from "../dashboard_admin/notification/NotificationPanel";
import { useNotification } from "@/hooks/useNotification";


export default function DashboardLayout() {
 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Lấy thông báo từ API

  // Hook lấy số lượng chưa đọc
  const { unreadCount, allNotifications } = useNotification();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <HeaderAdmin
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          unreadCount={unreadCount ?? 0}
        />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {showNotifications && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setShowNotifications(false)}
            />
            <NotificationPanel notifications={allNotifications ?? []} isLoading={false} />
          </>
        )}
      </div>
    </div>
  );
}
