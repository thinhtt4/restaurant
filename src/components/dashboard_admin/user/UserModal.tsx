/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
// [CẬP NHẬT] Thêm 'useMemo'
import { useEffect, useMemo, useState } from "react";
import { useGetRolesQuery } from "@/store/api/roleApi";
import type { UserAdminCreateForm, UserAdminUpdateForm } from "@/store/api/userApi";
import type { User } from "@/types/user.type";

interface Props {
  mode: "add" | "edit";
  initial?: User | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (data: UserAdminCreateForm | UserAdminUpdateForm) => Promise<void> | void;
}

export default function UserModal({ mode, initial = null, open, onOpenChange, onSubmit }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: rolesData } = useGetRolesQuery();

  
  const isEditingAdmin = useMemo(() => {
    if (mode === "edit" && initial) {
      return (initial.roles ?? []).some(
        (r) => r.name.toUpperCase() === "ADMIN"
      );
    }
    return false;
  }, [mode, initial]);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initial) {
        setUsername(initial.username);
        setEmail(initial.email);
        setPassword("");
        setFirstName(initial.firstName ?? "");
        setLastName(initial.lastName ?? "");
        setSelectedRoles((initial.roles ?? []).map((r) => r.name));
        setStatus(initial.status ?? null);
      } else {
        setUsername("");
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setSelectedRoles([]);
        setStatus(null);
      }
      setError(null);
    }
  }, [open, mode, initial]);

  const availableRoleNames = useMemo(() => (rolesData?.data ?? []).map((r: any) => r.name), [rolesData]);

  const toggleRole = (name: string) => {
    setSelectedRoles((prev) => (prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    const invalid = selectedRoles.filter((r) => !availableRoleNames.includes(r));
    if (invalid.length > 0) {
      setError(`Role không tồn tại: ${invalid.join(", ")}`);
      return;
    }

    if (mode === "add") {
      if (!username.trim() || !email.trim() || !password) {
        setError("Username, email và password là bắt buộc");
        return;
      }
      const payload: UserAdminCreateForm = {
        username: username.trim(),
        email: email.trim(),
        password,
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        roles: selectedRoles,
        status: status || null,
      };
      await onSubmit(payload);
    } else {
      const payload: UserAdminUpdateForm = {
        id: initial?.id as number,
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        email: email?.trim() || null,
        phone: initial?.phone ?? null,
        status: status || null,
        roles: selectedRoles,
      };
      await onSubmit(payload);
    }

    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="fixed inset-0 bg-black/10 pointer-events-auto" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl p-5 space-y-4 z-10 pointer-events-auto border-2 border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{mode === "add" ? "Tạo Account" : "Chỉnh sửa Account"}</h3>
          <button type="button" onClick={() => onOpenChange(false)} className="h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled={mode === "edit"} className={`w-full px-3 py-2 border rounded ${mode === "edit" ? "bg-gray-100" : ""}`} />
            {mode === "edit" && <p className="text-xs text-gray-500 mt-1">Username là khóa chính, không thể chỉnh sửa</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>

          {mode === "add" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>

       
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status ?? ""}
              onChange={(e) => setStatus(e.target.value || null)}
              className="w-full px-3 py-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isEditingAdmin}
            >
              <option value="">-- Chọn --</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="NONE">NONE</option>
            </select>
            {isEditingAdmin && (
              <p className="text-xs text-gray-500 mt-1">
                Không thể thay đổi status của Admin.
              </p>
            )}
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Roles</label>
            <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-auto">
              {availableRoleNames.map((r) => {
                const isAdminRole = r.toUpperCase() === "ADMIN";
                return (
                  <label
                    key={r}
                    className={`inline-flex items-center gap-2 p-1 border rounded ${
                      isEditingAdmin && isAdminRole
                        ? "opacity-60 cursor-not-allowed bg-gray-50"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(r)}
                      onChange={() => toggleRole(r)}
                      disabled={isEditingAdmin && isAdminRole}
                    />
                    <span className="text-sm">{r}</span>
                  </label>
                );
              })}
            </div>
            {isEditingAdmin && (
              <p className="text-xs text-gray-500 mt-1">
                Không thể gỡ vai trò ADMIN.
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">Nếu không chọn role, backend sẽ gán USER mặc định.</p>
          </div>

          {error && <div className="text-xs text-red-600">{error}</div>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 bg-gray-100 rounded">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{mode === "add" ? "Tạo" : "Lưu"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}