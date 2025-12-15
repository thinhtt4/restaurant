import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { MenuItem, MenuCategory } from "@/types/menuItem.type";
import { useUpload } from "@/hooks/useUpload";
import { toast } from "sonner";

interface Props {
    mode: "add" | "edit";
    initial?: MenuItem | null;
    categories?: MenuCategory[];
    open: boolean;
    onOpenChange: (o: boolean) => void;
    onSubmit: (data: {
        name: string;
        description?: string;
        price: number;
        categoryId: number;
        active: boolean;
        imageUrl?: string;
    }) => Promise<void> | void;
}

export default function MenuItemModal({ mode, initial, categories, open, onOpenChange, onSubmit }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<number>(0);
    const [active, setActive] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");

    const { uploadImage, isUploading } = useUpload();

    useEffect(() => {
        if (open) {
            if (mode === "edit" && initial) {
                setName(initial.name);
                setDescription(initial.description ?? "");
                setPrice(initial.price);
                setCategoryId(initial.categoryId);
                setActive(initial.active);
                setImageUrl(initial.imageUrl);
                setImageFile(null);
            } else {
                setName("");
                setDescription("");
                setPrice(1);
                setCategoryId(categories?.[0]?.categoryId ?? 0);
                setActive(true);
                setImageUrl("");
                setImageFile(null);
            }
        }
    }, [open, mode, initial, categories]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);
        setImageUrl("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Vui lòng nhập tên");
            return;
        }

        if (price <= 0) {
            toast.error("Giá phải lớn hơn 0");
            return;
        }

        let finalImageUrl = imageUrl;

        if (imageFile && !imageUrl) {
            try {
                finalImageUrl = await uploadImage(imageFile);
                setImageUrl(finalImageUrl);
            } catch (error) {
                console.error("Image upload error:", error);
                toast.error("Upload ảnh thất bại");
                return;
            }

        }
        const payload = {
            name: name.trim(),
            description: description.trim() || undefined,
            price,
            categoryId,
            active,
            imageUrl: finalImageUrl,
        };

        await onSubmit(payload);
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="fixed inset-0 bg-black/20 pointer-events-auto" onClick={() => onOpenChange(false)} />
            <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl p-5 space-y-4 z-10 pointer-events-auto border-2 border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{mode === "add" ? "Thêm Menu Item" : "Chỉnh sửa Menu Item"}</h3>
                    <button type="button" onClick={() => onOpenChange(false)} className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên <span className="text-red-500">*</span></label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên menu item" required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Mô tả..." className="w-full px-3 py-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá<span className="text-red-500">*</span></label>
                        <input type="number" min={1} value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục<span className="text-red-500">*</span></label>
                        <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {categories?.map((c) => (
                                <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kích hoạt <span className="text-red-500">*</span></label>
                        <select value={active ? "true" : "false"} onChange={(e) => setActive(e.target.value === "true")} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="true">true</option>
                            <option value="false">false</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ảnh {mode === "add"}
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg, image/jpg, image/png, image/webp"
                            onChange={handleImageChange}
                            disabled={isUploading}
                        />
                        {isUploading && <p className="text-sm text-blue-600">Đang upload ảnh...</p>}
                        {(imageUrl || initial?.imageUrl) && (
                            <div className="mt-2">
                                <img
                                    src={imageUrl || initial?.imageUrl}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <p className="text-sm text-green-600 mt-1">✓ Ảnh đã sẵn sàng</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            disabled={isUploading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={isUploading}
                        >
                            {isUploading ? "Đang upload..." : mode === "add" ? "Thêm" : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
