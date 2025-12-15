/* eslint-disable @typescript-eslint/no-explicit-any */

import { Edit, Trash2 } from "lucide-react";
import type { RoleResponse } from "@/types/role.type";
import type { PermissionResponse } from "@/types/permission.type";

interface Props {
  roles: RoleResponse[];
  onEdit: (p: RoleResponse) => void;
  onDeleteAsk: (name: string) => void;
}

export default function RoleTable({ roles, onEdit, onDeleteAsk }: Props) {
  if (!roles || roles.length === 0) {
    return <div className="p-6 text-center text-gray-500">Không có role nào</div>;
  }

  const renderPermissions = (perms?: string[] | PermissionResponse[]) => {
    if (!perms || perms.length === 0) return <span className="text-sm text-gray-400">-</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {perms.map((p, i) => {
          const name = typeof p === "string" ? p : p.name;
          return (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800"
            >
              {name}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Tên Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Permissions</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {roles.map((role) => (
              <tr key={role.name} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {role.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{role.description || "-"}</td>
                <td className="px-6 py-4">{renderPermissions(role.permissions as any)}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onEdit(role)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDeleteAsk(role.name)} className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={role.name.toUpperCase() === "ADMIN"}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
