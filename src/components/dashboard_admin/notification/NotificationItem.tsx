import { useNotification } from "@/hooks/useNotification";
import type { NotificationResponse } from "@/types/notification.type";

export function NotificationItem({ notification }: { notification: NotificationResponse }) {

    const { markAsRead } = useNotification();

    const handleClick = () => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Nếu có targetUrl → chuyển trang
        if (notification.targetUrl) {
            window.location.href = notification.targetUrl;
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors 
                ${notification.isRead ? "" : "bg-blue-50"}`}
        >
            <div className="flex gap-3">
                <img
                    src={notification.senderAvatar || "/placeholder.svg"}
                    alt={notification.senderName || "User"}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                        <strong>{notification.senderName}</strong>{" "}
                        {notification.message}
                    </p>
                    <p className="text-sm font-semibold text-red-600 mt-1">
                        {notification.title}
                    </p>

                    <p className="text-xs text-blue-600 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                    </p>
                </div>

                {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                )}
            </div>
        </div>
    );
}
