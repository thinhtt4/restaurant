/* eslint-disable @typescript-eslint/no-explicit-any */
import { createComboSchema, updateComboSchema } from "@/schemas/comboSchema";
import type { Combo } from "@/types/combo.type";
import { useEffect, useState } from "react";
import ImageUploader from "../../guest/blog/create_blog/image-uploader";
import JoditEditor from "jodit-react";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary"; // <- import mới

interface ComboModalProps {
  title: string;
  combo: Combo;
  onChange: (field: keyof Combo, value: any) => void;
  onSave: (updatedCombo?: Combo) => void;
  onClose: () => void;
  isUpdate?: boolean;
}

export default function ComboModal({ title, combo, onChange, onSave, onClose, isUpdate }: ComboModalProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(combo.description || "");

  useEffect(() => {
    setDescription(combo.description || "");
  }, [combo.description]);

  const handleSubmit = async () => {
    const schema = isUpdate ? updateComboSchema : createComboSchema;

    const comboToValidate = { ...combo, description: description };

    const result = schema.safeParse(comboToValidate);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
        const key = err.path[0]?.toString();
        if (key) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    let finalImageUrl = combo.imageUrl;

    // Nếu là base64 thì upload trước khi gửi lên backend
    if (combo.imageUrl && combo.imageUrl.startsWith("data:image")) {
      try {
        finalImageUrl = await uploadImageToCloudinary(combo.imageUrl);
        console.log("finalImageUrl:", finalImageUrl);
      } catch (e: any) {
        setErrors({ imageUrl: "Lỗi khi upload ảnh: " + (e?.message || "") });
        setLoading(false);
        return;
      }
    }

    setLoading(false);

    onSave({ ...combo, description: description, imageUrl: finalImageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Tên Combo</label>
            <input
              className="border px-3 py-2 rounded w-full"
              value={combo.name || ""}
              onChange={(e) => onChange("name", e.target.value)}
            />
            <p className="text-red-500 text-sm h-5 mt-1">{errors.name || ""}</p>
          </div>

          {/* Image */}
          <div>
            <label className="block mb-1 font-medium">Ảnh Combo</label>

            <ImageUploader
              coverImage={combo.imageUrl || null}
              onImageChange={(img) => onChange("imageUrl", img)}
            />

            <p className="text-red-500 text-sm h-5 mt-1">{errors.imageUrl || ""}</p>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <div className="border rounded-lg overflow-hidden">
              <JoditEditor
                value={description}
                onChange={(newContent) => {
                  setDescription(newContent);
                  onChange("description", newContent);
                }}
              />
            </div>
            <p className="text-red-500 text-sm h-5 mt-1">{errors.description || ""}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : title.includes("Tạo") ? "Tạo" : "Lưu"}
          </button>

          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
