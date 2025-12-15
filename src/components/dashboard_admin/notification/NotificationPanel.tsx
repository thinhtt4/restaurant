import { MoreVertical } from "lucide-react";
import { useState } from "react";
import type { NotificationResponse } from "@/types/notification.type";
import { NotificationItem } from "./NotificationItem";

interface NotificationPanelProps {
    notifications: NotificationResponse[];
    isLoading: boolean;
}

export default function NotificationPanel({ notifications, isLoading }: NotificationPanelProps) {
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

    const filtered = activeTab === "all"
        ? notifications
        : notifications.filter(n => !n.isRead);

    return (
        <div className="fixed right-0 top-[73px] w-80 md:w-96 h-[calc(100vh-73px)] bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-50">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Thông báo</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical size={20} className="text-gray-600" />
                </button>
            </div>

            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors 
                        ${activeTab === "all"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:bg-gray-50"}`}
                >
                    Tất cả
                </button>
                <button
                    onClick={() => setActiveTab("unread")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors 
                        ${activeTab === "unread"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:bg-gray-50"}`}
                >
                    Chưa đọc
                </button>
            </div>

            {isLoading ? (
                <div className="p-6 text-center text-gray-500">Đang tải...</div>
            ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Không có thông báo nào</div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {filtered.map((n) => (
                        <NotificationItem key={n.id} notification={n} />
                    ))}
                </div>
            )}
        </div>
    );
}
