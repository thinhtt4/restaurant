/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAvatarManager.ts
import { useEffect, useState, type ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { updateAvatarUser } from "@/store/profileSlice";
import { useUpdateAvatarMutation } from "@/store/api/userProfileApi";
import { toast } from "sonner";

// Upload ảnh base64 lên backend → Cloudinary → trả về URL
async function uploadImageToCloudinary(base64: string): Promise<string> {
    const resBase64 = await fetch(base64);
    const blob = await resBase64.blob();
    const file = new File([blob], "avatar.jpg", { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload thất bại");

    const data = await res.json();
    if (!data.url) throw new Error("Không nhận được URL từ backend");
    return data.url;
}

export function useAvatarManager(initialAvatar: string | null) {
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(initialAvatar);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [avatarSaving, setAvatarSaving] = useState(false);

    const [updateAvatar] = useUpdateAvatarMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (initialAvatar) {
            setPreviewAvatar(initialAvatar);
        }
    }, [initialAvatar]);

    // Chọn file → preview base64
    const handleAvatarSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            if (!base64) return;
            setSelectedAvatar(base64);
            setPreviewAvatar(base64);
        };
        reader.readAsDataURL(file);
    };

    // Lưu avatar lên backend + Cloudinary
    const handleAvatarSave = async () => {
        if (!selectedAvatar) return;
        setAvatarSaving(true);
        try {
            const avatarUrl = await uploadImageToCloudinary(selectedAvatar);
            const res: any = await updateAvatar({ avatarUrl });
            if (res?.data) {
                dispatch(updateAvatarUser({ avatar: res.data.avatar }));
                toast.success("Cập nhật avatar thành công!");
                setSelectedAvatar(null);
            }
        } catch (err) {
            console.error("Upload avatar failed", err);
            toast.error("Lưu avatar thất bại!");
        } finally {
            setAvatarSaving(false);
        }
    };

    const handleAvatarCancel = () => {
        setPreviewAvatar(initialAvatar);
        setSelectedAvatar(null);
    };

    return {
        previewAvatar,
        selectedAvatar,
        avatarSaving,
        handleAvatarSelect,
        handleAvatarSave,
        handleAvatarCancel,
    };
}
