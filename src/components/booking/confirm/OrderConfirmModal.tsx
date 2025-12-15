/* eslint-disable @typescript-eslint/no-explicit-any */
import { useBooking } from "@/hooks/useBooking";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OrderConfirmForm {
  setShowModalConfirmModal: (value: boolean) => void;
}
const OrderConfirmModal = ({ setShowModalConfirmModal }: OrderConfirmForm) => {
  const navigate = useNavigate();
  const { orders, confirmBooking } = useBooking();
  const handlerConfirmDepositTable = async () => {
    try {
      if (!orders?.cartItems) {
        return;
      }
      if (orders.cartItems.length === 0) {
        setShowModalConfirmModal(true);
      }

      if (orders.cartItems.length === 0) {
        await confirmBooking();
        navigate("/app/booking-history");
      } else {
        setShowModalConfirmModal(false);
      }
    } catch (err: any) {
      const error = err?.response?.message;

      if (error?.code) {
        toast.error(error);
      } else {
        toast.error("Đặt bàn thất bại, vui lòng thử lại!");
      }
      navigate("/app/home");
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-700/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Xác nhận</h2>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn tiếp tục không?
          Nếu chỉ đặt bàn thì sẽ không được chọn món sau khi thanh toán!!!
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setShowModalConfirmModal(false)}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handlerConfirmDepositTable}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmModal;
