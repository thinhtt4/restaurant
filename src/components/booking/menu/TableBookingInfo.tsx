import { useState } from "react";
import {
  Calendar,
  Users,
  Mail,
  Phone,
  User,
  FileText,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { BookingInfo } from "@/types/booking.type";
import { useAuth } from "@/hooks/useAuth";

interface TableBookingInfoForm {
  bookingInfo: BookingInfo | null;
  onCollapseChange?: (value: boolean) => void;
}

const TableBookingInfo = ({
  bookingInfo,
  onCollapseChange,
}: TableBookingInfoForm) => {
  const { user } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
  };

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
  }) => (
    <div className="flex items-start gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-300 hover:shadow-md group">
      <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-sm text-gray-800 font-semibold break-words">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed top-20 left-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 shadow-2xl transition-all duration-300 ease-in-out z-40 rounded-r-2xl ${
        isCollapsed ? "w-14" : "w-80 lg:w-96"
      }`}
      style={{ height: "calc(100vh - 5rem)" }}
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute right-0 top-8 translate-x-full bg-amber-400 text-white p-2 rounded-r-lg shadow-lg hover:bg-amber-500 transition-colors z-10"
        aria-label={isCollapsed ? "Mở thông tin" : "Thu gọn thông tin"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Content */}
      <div
        className={`h-full overflow-y-auto ${isCollapsed ? "hidden" : "block"}`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border-t-4 border-amber-400">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-800">
                Thông tin đặt bàn
              </h2>
              {/* <button
                onClick={() => console.log('Navigate to edit')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-white rounded-lg text-sm font-medium hover:bg-amber-500 transition-colors shadow-md hover:shadow-lg"
              >
                <Edit className="w-3.5 h-3.5" />
                Sửa
              </button> */}
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-2.5">
            <InfoItem
              icon={User}
              label="Họ và tên"
              // Thêm dấu ? trước .orderName
              value={bookingInfo?.orderName || ""}
            />

            <InfoItem
              icon={Mail}
              label="Email"
              value={user?.data.email || ""}
            />

            <InfoItem
              icon={Phone}
              label="Số điện thoại"
              value={bookingInfo?.phone || ""}
            />

            <InfoItem
              icon={Calendar}
              label="Thời gian"
              value={bookingInfo?.dateTime || ""}
            />

            <InfoItem
              icon={Users}
              label="Số khách"
              value={`${bookingInfo?.people || 0} người`}
            />

            {bookingInfo?.note && (
              <InfoItem
                icon={FileText}
                label="Ghi chú"
                value={bookingInfo.note}
              />
            )}
          </div>
        </div>
      </div>

      {/* Collapsed State - Vertical Text */}
      {isCollapsed && (
        <div className="h-full flex items-center justify-center">
          <div
            className="transform -rotate-90 whitespace-nowrap cursor-pointer"
            onClick={handleToggle}
          >
            <span className="text-amber-600 font-bold text-sm tracking-wider">
              ĐẶT BÀN
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableBookingInfo;
