import { Edit, Trash2 } from "lucide-react";
import type { PermissionResponse } from "@/types/permission.type";

interface Props {
  permissions: PermissionResponse[];
  onEdit: (p: PermissionResponse) => void;
  onDeleteAsk: (name: string) => void;
}

export default function PermissionTable({
  permissions,
  onEdit,
  onDeleteAsk,
}: Props) {
  if (!permissions || permissions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Không tìm thấy permission nào
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Tên Permission
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Mô tả
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {permissions.map((p) => (
              <tr key={p.name} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {p.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {p.description || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDeleteAsk(p.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
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
