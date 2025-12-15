// src/components/dashboard_admin/permissions/PermissionModal.tsx
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { PermissionResponse } from "@/types/permission.type";

interface Props {
  mode: "add" | "edit";
  initial?: PermissionResponse | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (data: {
    name: string;
    description?: string | null;
  }) => Promise<void> | void;
}

export default function PermissionModal({
  mode,
  initial = null,
  open,
  onOpenChange,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initial) {
        setName(initial.name);
        setDescription(initial.description ?? "");
      } else {
        setName("");
        setDescription("");
      }
    }
  }, [open, mode, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit({
      name: name.trim(),
      description: description.trim() || null,
    });
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop - cho phép nhìn thấy nội dung phía sau */}
      <div
        className="fixed inset-0 bg-opacity-3 pointer-events-auto"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl p-5 space-y-4 z-10 pointer-events-auto border-2 border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {mode === "add" ? "Thêm Permission" : "Chỉnh sửa Permission"}
          </h3>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Permission <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mode === "edit"}
              placeholder="VD: PERMISSION_READ"
              required
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                mode === "edit" 
                  ? "bg-gray-100 cursor-not-allowed" 
                  : "bg-white"
              }`}
            />
            {mode === "edit" && (
              <p className="text-xs text-gray-500 mt-1">
                Tên là khóa chính, không thể chỉnh sửa
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Nhập mô tả cho permission..."
              className="w-full px-3 py-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!name.trim()}
            >
              {mode === "add" ? "Thêm" : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}