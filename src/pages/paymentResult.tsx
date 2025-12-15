import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function PaymentResult() {
  const [params] = useSearchParams();
  
  
  const orderId = params.get("orderId");
  const success = params.get("success") === "true";
  const code = params.get("code");
  const message = params.get("message");
  const redirectUrl = params.get("redirectUrl");
  const method = params.get("method"); 

 
  const getMethodName = () => {
      if (method === 'momo') return 'MoMo';
      if (method === 'vnpay') return 'VNPAY';
      return 'Cổng thanh toán'; 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          {success ? (
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          ) : (
            <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
          )}
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-bold mb-4 ${success ? "text-green-600" : "text-red-600"}`}>
          {success ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h1>

        {/* Info */}
        <div className="text-left space-y-2 mb-6">
          {orderId && (
            <p className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-600">Mã đơn hàng:</span> 
              <span className="font-bold">#{orderId}</span>
            </p>
          )}
          
          {code && (
            <p className="flex justify-between border-b pb-2 pt-2">
              <span className="font-semibold text-gray-600">Mã giao dịch {getMethodName()}:</span> 
              <span className="truncate ml-2 max-w-[150px]">{code}</span>
            </p>
          )}

          {message && !success && (
            <p className="text-red-500 pt-2">
              <span className="font-semibold">Lý do:</span> {message}
            </p>
          )}
        </div>

        {/* Button */}
        <div>
          <button
            onClick={() => {
                 if (redirectUrl) {
                    window.location.href = redirectUrl;
                } else {
                    window.location.href = "/app/home";
                }
            }}
            className={`w-full inline-block px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              success ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {success ? "Hoàn tất" : "Quay lại trang chủ"}
          </button>
        </div>
      </div>
    </div>
  );
}