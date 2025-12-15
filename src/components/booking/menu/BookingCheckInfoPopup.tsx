import { X, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingConfirmPopUp {
  setBookingConfirmInfoOpen: (value: boolean) => void;
}

const BookingConfirmPopUp = ({
  setBookingConfirmInfoOpen,
}: BookingConfirmPopUp) => {
  const navigate = useNavigate()
  const handleConfirm = () => {
    setBookingConfirmInfoOpen(false);
    navigate("/app/booking-table-available")
  };

  const handleCancel = () => {
    setBookingConfirmInfoOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-600/50 bg-opacity-50 transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={40} className="text-orange-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Bạn chưa điền thông tin 
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 mb-6">
            Nếu không chọn bàn hoặc điền thông tin như là SĐT hoặc tên thì không thể đặt!!!
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
            >
              Xác Nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmPopUp;
