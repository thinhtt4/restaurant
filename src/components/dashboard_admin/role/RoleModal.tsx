/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { RoleResponse } from "@/types/role.type";
import type { PermissionResponse } from "@/types/permission.type";

interface Props {
  mode: "add" | "edit";
  initial?: RoleResponse;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (payload: { name: string; description?: string | null; permissions?: string[] }) => void;
  availablePermissions?: Array<string | PermissionResponse>;
}

export default function RoleModal({
  mode,
  initial,
  open,
  onOpenChange,
  onSubmit,
  availablePermissions = [],
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string | null>(null);
  const [permissionsText, setPermissionsText] = useState("");
  const [error, setError] = useState<string | null>(null);

  
  const validPermissionNames = useMemo(() => {
    return new Set(
      (availablePermissions ?? []).map((p) => {
        const n = typeof p === "string" ? p : p.name;
        return n.trim().toLowerCase();
      })
    );
  }, [availablePermissions]);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? null);
      if (initial?.permissions) {
        const perms = (initial.permissions as any[]).map((p) => (typeof p === "string" ? p : p.name)).join(", ");
        setPermissionsText(perms);
      } else {
        setPermissionsText("");
      }
      setError(null);
    }
  }, [open, initial]);

  const close = () => onOpenChange(false);

  const parsePermissions = (text: string) =>
    Array.from(
      new Set(
        text
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      )
    );

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    const perms = parsePermissions(permissionsText);

   
    const invalid = perms.filter((p) => !validPermissionNames.has(p.trim().toLowerCase()));

    if (invalid.length > 0) {
      setError(`Các permission không tồn tại: ${invalid.join(", ")}`);
      return; 
    }

    
    onSubmit({ name: name.trim(), description: description ?? null, permissions: perms });
    close();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{mode === "add" ? "Thêm Role" : `Sửa Role: ${initial?.name}`}</h3>
          <button onClick={close} className="p-2 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên role</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="ví dụ: admin"
              required
              disabled={mode === "edit"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Mô tả role (tùy chọn)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Permissions</label>
            <input
              value={permissionsText}
              onChange={(e) => {
                setPermissionsText(e.target.value);
                if (error) setError(null); 
              }}
              className={`mt-1 block w-full border rounded px-3 py-2 ${error ? "border-red-500" : ""}`}
              placeholder="Nhập danh sách permission, ngăn cách bằng dấu phẩy (ví dụ: VIEW_INFO, PERM_CREATE)"
            />
            <p className="text-xs text-gray-500 mt-1">Bạn có thể nhập nhiều permission, phân tách bằng dấu phẩy.</p>

            {error ? <p className="text-xs text-red-600 mt-2">{error}</p> : null}

            {availablePermissions && (availablePermissions as any[]).length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                Một vài permission hợp lệ:{" "}
                {(availablePermissions as any[]).map((p) => (typeof p === "string" ? p : p.name)).slice(0, 50).join(", ")}
                {(availablePermissions as any[]).length > 12 ? "..." : ""}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={close} className="px-4 py-2 rounded border">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
              {mode === "add" ? "Tạo" : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
