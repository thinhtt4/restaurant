import { AlertCircle, Hourglass, Users } from "lucide-react";
import type { Table, TableAlert } from "@/types/table.type";

interface Props {
    table: Table
    onClick: () => void
    alert?: TableAlert;
}

const statusConfig = {
    EMPTY: { label: 'Trống', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-300' },
    SERVING: { label: 'Đang phục vụ SERVING', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-300' },
    WAITING_PAYMENT: { label: 'Chờ thanh toán', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-300' },
    RESERVED: { label: 'Đã đặt', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-300' },
    OCCUPIED: { label: 'Có khách OCCUPIED', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-300' },
};


export default function TableCard({ table, onClick, alert }: Props) {
    const config = statusConfig[table.status as keyof typeof statusConfig] || statusConfig.EMPTY;

    // Xử lý logic hiển thị cảnh báo đè lên giao diện cũ
    let containerClass = `${config.bgColor} ${config.borderColor} border-2`;
    let tooltipText = "";

    // Nếu có báo động ĐỎ (GẤP)
    if (alert?.type === 'URGENT') {
        // Ghi đè class border bằng màu đỏ và thêm hiệu ứng nhấp nháy
        containerClass = "bg-red-50 border-2 border-red-600 animate-pulse shadow-lg shadow-red-200";
        tooltipText = ` KHÁCH SAU SẮP ĐẾN! Còn ${alert.minutesLeft} phút.`;
    }
    // Nếu có báo động VÀNG (WARNING)
    else if (alert?.type === 'WARNING') {
        tooltipText = `Sắp hết giờ (${alert.minutesLeft}p), chưa có khách sau.`;
    }
    // TRƯỜNG HỢP: QUÁ GIỜ - AN TOÀN (CRITICAL)
    else if (alert?.type === 'CRITICAL') {
        // Màu nền đen hoặc đỏ đậm, viền nháy mạnh hơn
        containerClass = "bg-red-900 text-white border-4 border-red-500 animate-pulse";
        tooltipText = `SOS: QUÁ GIỜ ${Math.abs(alert.minutesLeft)}p! KHÁCH SAU ĐANG ĐỢI!`;
    }

    // TRƯỜNG HỢP: QUÁ GIỜ - AN TOÀN (OVERTIME)
    else if (alert?.type === 'OVERTIME') {
        // Màu xám hoặc tím, không cần nhấp nháy, chỉ báo hiệu là đang ngồi lố giờ
        containerClass = "bg-gray-100 border-2 border-gray-400";
        tooltipText = `Đã ngồi quá ${Math.abs(alert.minutesLeft)} phút (Không có khách sau).`;
    }

    return (
        <div
            onClick={onClick}
            title={tooltipText}
            className={`relative rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer ${containerClass}`}
        >
            {/* --- CÁC ICON CẢNH BÁO (Overlay) --- */}

            {/* 1. Icon GẤP (Góc phải trên) */}
            {alert?.type === 'URGENT' && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-md z-10 animate-bounce">
                    <AlertCircle size={20} />
                </div>
            )}

            {/* 2. Icon Cảnh báo (Góc phải trên) */}
            {alert?.type === 'WARNING' && (
                <div className="absolute top-2 right-2 text-yellow-600 z-10">
                    <Hourglass size={20} className="animate-spin-slow" />
                </div>
            )}

            {/* --- NỘI DUNG --- */}
            <div className="flex justify-between mb-2">
                <h3 className={`text-xl font-bold ${config.color}`}>{table.code}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.color} border ${config.borderColor}`}>
                    {config.label}
                </span>
            </div>

            {/* Hiển thị dòng thông báo khẩn cấp ngay trong card */}
            <p className="text-xs font-bold text-red-600 mb-1">
                {tooltipText}
            </p>

            <p className="text-sm text-gray-600 mb-2 truncate">{table.description}</p>

            <div className="flex items-center text-sm text-gray-700">
                <Users size={16} className="mr-1" />
                <span>{table.guestCount} người</span>
            </div>
        </div>
    );
}
