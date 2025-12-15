import { useEffect, useState, useRef } from "react";

export function useAutoCountdown(initialSeconds: number, onFinish?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<number| null>(null);
  const expireAtRef = useRef<number>(Date.now() + initialSeconds * 1000);

  useEffect(() => {
    // nếu muốn reset countdown thực sự, uncomment dòng dưới
    // expireAtRef.current = Date.now() + initialSeconds * 1000;

    const tick = () => {
      const remaining = Math.max(Math.ceil((expireAtRef.current - Date.now()) / 1000), 0);
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        if (onFinish) onFinish();
      }
    };

    tick(); // chạy ngay để không delay 1s
    intervalRef.current = setInterval(tick, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [onFinish]); // chỉ chạy khi mount, không phụ thuộc initialSeconds

  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    if (minutes === 0 && seconds === 0)
      return "Bàn không còn được giữ nữa(Yêu cầu chọn lại bàn)!!!";
    return `Bàn đang được giữ trong ${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return { secondsLeft, formatTime };
}
