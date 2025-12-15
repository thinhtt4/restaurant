import { useAutoCountdown } from "./useCountDown";

interface CountdownProps {
  duration: number; // giây
  onFinish?: () => void;
}

export default function CountdownTimer({ duration, onFinish }: CountdownProps) {
  const { formatTime } = useAutoCountdown(duration, onFinish);

  return (
    <div className="text-2xl font-bold text-center">
      {formatTime()}
    </div>
  );
}
