import { Edit, Trash2 } from "lucide-react";
import type { User } from "@/types/user.type";

interface Props {
  users: User[];
  onEdit: (u: User) => void;
  onDeleteAsk: (id: number) => void;
}

export default function UserTable({ users, onEdit, onDeleteAsk }: Props) {
  if (!users || users.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">Không có user nào</div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Họ tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => {
              
              const isAdminUser = (u.roles ?? []).some(
                (r) => r.name.toUpperCase() === "ADMIN"
              );

              return (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      {u.username}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {[u.firstName, u.lastName].filter(Boolean).join(" ") || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {(u.roles && u.roles.length > 0
                        ? u.roles
                        : [{ name: "USER" }]
                      ).map((r) => (
                        <span
                          key={r.name}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800"
                        >
                          {r.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        u.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.status ?? "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(u)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    
                      <button
                        onClick={() => onDeleteAsk(u.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isAdminUser}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}