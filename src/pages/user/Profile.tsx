import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useAvatarManager } from "@/hooks/userProfile/useAvatarManager";
import { useProfileManager } from "@/hooks/userProfile/useProfileManager";
import ProfileSidebar from "./ProfileSidebar";
import ProfileContent from "./ProfileContent";
import ChangePasswordForm from "./ChangePassword";
import Footer from "@/components/layouts/guest/Footer";




export default function Profile() {
    const user = useSelector((state: RootState) => state.profile.profile);

    const {
        previewAvatar,
        avatarSaving,
        selectedAvatar,
        handleAvatarSelect,
        handleAvatarSave,
        handleAvatarCancel,
    } = useAvatarManager(user?.avatar || null);

    const {
        isLoading,
        isEditing,
        setIsEditing,
        updating,
        register,
        handleSubmit,
        errors,
        onSubmit,
    } = useProfileManager(user);

    const [activeTab, setActiveTab] = useState("profile");

    const fullAvatarUrl =
        previewAvatar ||
        "https://aic.com.vn/wp-content/uploads/2024/10/avatar-vo-tri-cute.jpg";

    if (isLoading) return <p className="text-center text-white py-10">Đang tải...</p>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-400 overflow-hidden">
            <div className="flex-1 py-16 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto mt-8 mb-2 h-full">
                    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row h-full">
                        <ProfileSidebar
                            user={user}
                            fullAvatarUrl={fullAvatarUrl}
                            avatarSaving={avatarSaving}
                            selectedAvatar={selectedAvatar}
                            handleAvatarSelect={handleAvatarSelect}
                            handleAvatarSave={handleAvatarSave}
                            handleAvatarCancel={handleAvatarCancel}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />

                        <div className="flex-1 p-8 bg-gray-300 overflow-hidden">
                            {activeTab === "profile" ? (
                                <ProfileContent
                                    user={user}
                                    register={register}
                                    errors={errors}
                                    handleSubmit={handleSubmit}
                                    onSubmit={onSubmit}
                                    isEditing={isEditing}
                                    setIsEditing={setIsEditing}
                                    updating={updating}
                                />
                            ) : (
                                <ChangePasswordForm user={user} />
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}
