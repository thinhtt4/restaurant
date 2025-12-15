/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  user: any;
  register: any;
  errors: any;
  handleSubmit: any;
  onSubmit: any;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  updating: boolean;
}

export default function ProfileContent({
  user,
  register,
  errors,
  handleSubmit,
  onSubmit,
  isEditing,
  setIsEditing,
  updating,
}: Props) {
  const genderMap: Record<string, string> = { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa thông tin</h2>

        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Họ <span className="text-red-500">*</span>
              </label>
              <input
                {...register("lastName")}
                placeholder="Nhập họ"
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1 font-medium">{errors.lastName.message}</p>
              )}
            </div>

            {/* Tên */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Tên <span className="text-red-500">*</span>
              </label>
              <input
                {...register("firstName")}
                placeholder="Nhập tên"
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1 font-medium">{errors.firstName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Số điện thoại */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Số điện thoại
              </label>
              <input
                {...register("phone")}
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 font-medium"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 font-medium">{errors.phone.message}</p>
              )}
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Giới tính
              </label>
              <select
                {...register("gender")}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1 font-medium">{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={updating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
            >
              {updating ? "Đang cập nhật..." : "Lưu thay đổi"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Thông tin tài khoản</h2>
      <p className="text-gray-600 text-sm mb-6">Quản lý thông tin cá nhân của bạn</p>

      <div className="max-w-3xl">
        {/* Card chính - Thông tin cơ bản */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
            Thông tin cơ bản
          </h3>

          <div className="space-y-4">
            {/* Họ tên */}
            <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
              <div className="w-40 flex-shrink-0">
                <p className="text-gray-600 text-sm font-semibold">Họ và tên</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-base font-bold">
                  {user?.lastName || user?.firstName ? `${user?.lastName ?? ""} ${user?.firstName ?? ""}` : "không có"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
              <div className="w-40 flex-shrink-0">
                <p className="text-gray-600 text-sm font-semibold">Email</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-base font-bold">{user?.email}</p>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
              <div className="w-40 flex-shrink-0">
                <p className="text-gray-600 text-sm font-semibold">Tên đăng nhập</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-base font-bold">{user?.username}</p>
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
              <div className="w-40 flex-shrink-0">
                <p className="text-gray-600 text-sm font-semibold">Số điện thoại</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-base font-bold">
                  {user?.phone || <span className="text-gray-400 font-normal italic">Chưa cập nhật</span>}
                </p>
              </div>
            </div>

            {/* Giới tính */}
            <div className="flex items-start py-3">
              <div className="w-40 flex-shrink-0">
                <p className="text-gray-600 text-sm font-semibold">Giới tính</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-base font-bold">
                  {genderMap[user?.gender || "OTHER"]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Button cập nhật */}
        <div className="flex gap-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  );
}