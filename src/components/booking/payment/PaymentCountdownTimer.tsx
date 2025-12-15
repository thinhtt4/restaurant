import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface PaymentCountdownTimerProps {
  createdAt: string; 
  expiryMinutes?: number;
  onExpired?: () => void;
}

export const PaymentCountdownTimer: React.FC<PaymentCountdownTimerProps> = ({
  createdAt,
  expiryMinutes = 15,
  onExpired,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const created = new Date(createdAt).getTime();
      const now = Date.now();
      const expiryTime = created + expiryMinutes * 60 * 1000;
      const remaining = Math.max(0, expiryTime - now);

      return Math.floor(remaining / 1000); 
    };

 
    const initial = calculateTimeLeft();
    setTimeLeft(initial);

    if (initial === 0) {
      setIsExpired(true);
      onExpired?.();
      return;
    }

   
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining === 0) {
        setIsExpired(true);
        onExpired?.();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, expiryMinutes, onExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = expiryMinutes * 60;
    return (timeLeft / totalSeconds) * 100;
  };

  const isWarning = timeLeft <= 5 * 60; 
  const isCritical = timeLeft <= 2 * 60; 

  if (isExpired) {
    return (
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 mb-6 animate-pulse">
        <div className="flex items-center justify-center gap-3 text-red-700">
          <AlertTriangle className="w-8 h-8" />
          <div className="text-center">
            <h3 className="text-xl font-bold mb-1">Đã hết thời gian thanh toán</h3>
            <p className="text-sm">
              Vui lòng tạo mã QR mới để tiếp tục thanh toán
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-6 mb-6 border-2 transition-all duration-300 ${
        isCritical
          ? "bg-red-50 border-red-500 animate-pulse"
          : isWarning
          ? "bg-yellow-50 border-yellow-500"
          : "bg-blue-50 border-blue-500"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock
            className={`w-6 h-6 ${
              isCritical
                ? "text-red-600"
                : isWarning
                ? "text-yellow-600"
                : "text-blue-600"
            }`}
          />
          <div>
            <h3
              className={`text-lg font-bold ${
                isCritical
                  ? "text-red-700"
                  : isWarning
                  ? "text-yellow-700"
                  : "text-blue-700"
              }`}
            >
              Thời gian thanh toán còn lại
            </h3>
            <p
              className={`text-sm ${
                isCritical
                  ? "text-red-600"
                  : isWarning
                  ? "text-yellow-600"
                  : "text-blue-600"
              }`}
            >
              {isCritical
                ? " Vui lòng thanh toán ngay!"
                : isWarning
                ? " Sắp hết thời gian"
                : "Vui lòng hoàn tất thanh toán trong thời gian quy định"}
            </p>
          </div>
        </div>
        <div
          className={`text-4xl font-mono font-bold ${
            isCritical
              ? "text-red-700"
              : isWarning
              ? "text-yellow-700"
              : "text-blue-700"
          }`}
        >
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isCritical
              ? "bg-red-600"
              : isWarning
              ? "bg-yellow-500"
              : "bg-blue-600"
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>
    </div>
  );
};
