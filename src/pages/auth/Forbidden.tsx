
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-50 p-6">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-10 text-center">
        {/* Icon cảnh báo */}
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-red-50 mb-6 shadow-sm">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-red-500"
          >
            <path
              d="M12 9v4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 17h.01"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Mã lỗi */}
        <h2 className="text-6xl font-extrabold text-red-600 tracking-tight">
          403
        </h2>

        {/* Tiêu đề */}
        <p className="mt-3 text-2xl font-semibold text-slate-800">
          Cấm truy cập
        </p>

        {/* Mô tả */}
        <p className="mt-3 text-sm text-slate-500 max-w-[42ch] mx-auto">
          Rất tiếc — bạn không có quyền truy cập vào tài nguyên này.
        </p>

        {/* Nút quay lại trang chủ */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/app/home")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 active:translate-y-0.5 text-white font-medium shadow-lg transition-transform"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
