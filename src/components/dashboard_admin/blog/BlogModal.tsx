import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import JoditEditor from 'jodit-react';
import ImageUploader from "@/components/guest/blog/create_blog/image-uploader";

interface BlogResponse {
    blogId: number;
    title: string;
    content: string;
    imageUrl?: string | null;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface Props {
    mode: "add" | "edit";
    initial?: BlogResponse;
    open: boolean;
    onOpenChange: (o: boolean) => void;
    onSubmit: (payload: {
        title: string;
        content: string;
        imageUrl?: string;
        active?: boolean;
    }) => void;
    isLoading?: boolean;
}

// Hàm upload ảnh lên Cloudinary
const uploadImageToCloudinary = async (base64Image: string): Promise<string> => {
    // Chuyển base64 thành File
    const response = await fetch(base64Image);
    const blob = await response.blob();
    const file = new File([blob], "cover-image.jpg", { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Upload failed");
    }

    const data = await res.json();
    return data.url; // URL từ Cloudinary
};

export default function BlogModal({
    mode,
    initial,
    open,
    onOpenChange,
    onSubmit,
    isLoading = false,
}: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    useEffect(() => {
        if (open) {
            setTitle(initial?.title ?? "");
            setContent(initial?.content ?? "");
            setCoverImage(initial?.imageUrl ?? null);
            setError(null);
        }
    }, [open, initial]);

    const close = () => onOpenChange(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);

        // Validation
        if (!title.trim()) {
            setError("Vui lòng nhập tiêu đề");
            return;
        }

        if (!content.trim()) {
            setError("Vui lòng nhập nội dung");
            return;
        }

        try {
            let finalImageUrl: string | undefined = undefined;

            // Nếu có ảnh và là base64 (ảnh mới), upload lên Cloudinary
            if (coverImage && coverImage.startsWith("data:image")) {
                setIsUploadingImage(true);
                finalImageUrl = await uploadImageToCloudinary(coverImage);
            } else if (coverImage) {
                // Nếu đã là URL (edit mode), giữ nguyên
                finalImageUrl = coverImage;
            }

            // Gọi onSubmit với URL từ Cloudinary
            onSubmit({
                title: title.trim(),
                content: content.trim(),
                imageUrl: finalImageUrl,
            });

        } catch (uploadError) {
            console.log(uploadError);           
            setError("Không thể tải ảnh lên. Vui lòng thử lại.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const isSaving = isLoading || isUploadingImage;

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">
                        {mode === "add" ? "Thêm Blog" : `Sửa Blog: ${initial?.title}`}
                    </h3>
                    <button
                        onClick={close}
                        className="p-2 rounded hover:bg-gray-100"
                        disabled={isSaving}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (error) setError(null);
                                }}
                                className="w-full border rounded-lg px-3 py-2 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                disabled={isSaving}
                            />
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ảnh bìa
                            </label>
                            <ImageUploader
                                coverImage={coverImage}
                                onImageChange={setCoverImage}
                            />
                        </div>

                        {/* Content Editor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung <span className="text-red-500">*</span>
                            </label>
                            <div className="border rounded-lg overflow-hidden">
                                <JoditEditor
                                    value={content}
                                    onChange={(newContent) => {
                                        setContent(newContent);
                                        if (error) setError(null);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={close}
                        className="px-4 py-2 rounded border hover:bg-gray-100"
                        disabled={isSaving}
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving || !title || !content}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isUploadingImage
                            ? "Đang tải ảnh..."
                            : isLoading
                                ? "Đang lưu..."
                                : mode === "add"
                                    ? "Tạo"
                                    : "Lưu"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}