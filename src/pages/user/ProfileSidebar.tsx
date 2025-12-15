/* eslint-disable @typescript-eslint/no-explicit-any */

import { User, Lock, Settings, LogOut } from "lucide-react";

interface Props {
    user: any;
    fullAvatarUrl: string;
    avatarSaving: boolean;
    selectedAvatar: string | null;
    handleAvatarSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAvatarSave: () => void;
    handleAvatarCancel: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function ProfileSidebar({
    user,
    fullAvatarUrl,
    avatarSaving,
    selectedAvatar,
    handleAvatarSelect,
    handleAvatarSave,
    handleAvatarCancel,
    activeTab,
    setActiveTab,
}: Props) {
    return (
        <div className="w-full md:w-80 bg-gray-850 border-b md:border-b-0 md:border-r border-gray-700 p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
                <img
                    src={fullAvatarUrl}
                    alt="avatar"
                    className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow-md mb-2"
                />
                <h3 className="text-white font-semibold text-lg">
                    {user?.lastName} {user?.firstName}
                </h3>
                <p className="text-gray-400 text-sm">@{user?.username}</p>

                <label className="mt-2 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all">
                    Chọn ảnh mới
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarSelect}
                        className="hidden"
                    />
                </label>

                {selectedAvatar && (
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleAvatarSave}
                            disabled={avatarSaving}
                            className={`mt-2 px-4 py-2 rounded text-white font-semibold transition-all ${avatarSaving
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {avatarSaving ? "Đang lưu..." : "Lưu ảnh"}
                        </button>

                        <button
                            onClick={handleAvatarCancel}
                            className="px-4 py-2 rounded text-white font-semibold bg-red-600 hover:bg-red-700 transition-all"
                        >
                            Hủy
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="space-y-2">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === "profile"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:bg-gray-750 hover:text-white"
                        }`}
                >
                    <User className="w-5 h-5" />
                    <span>Thông tin cá nhân</span>
                </button>
                <button
                    onClick={() => setActiveTab("password")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === "password"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:bg-gray-750 hover:text-white"
                        }`}
                >
                    <Lock className="w-5 h-5" />
                    <span>Đổi mật khẩu</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-750 hover:text-white transition-all">
                    <Settings className="w-5 h-5" />
                    <span>Cài đặt</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all mt-4">
                    <LogOut className="w-5 h-5" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
}
