import type { Table } from "@/types/table.type";
import { Trash2, Edit } from "lucide-react";

interface Props {
    data?: Table[];
    onEdit: (item: Table) => void;
    onDelete: (item: Table) => void;
}

const statusLabels: Record<string, string> = {
    EMPTY: "Trống",
    SERVING: "Phục vụ",
    WAITING_PAYMENT: "Chờ thanh toán",
    RESERVED: "Đã đặt",
    OCCUPIED: "Đang sử dụng",
};

const TableTable = ({ data, onEdit, onDelete }: Props) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Mô tả</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Số khách</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Khu vực</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Trạng thái</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {data?.length ? (
                            data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.code}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.description}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.guestCount}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.areaName}</td>

                                    {/* Badge trạng thái */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`
                    px-3 py-1 rounded-full text-sm
                    ${item.status === 'AVAILABLE'
                                                    ? 'bg-green-100 text-green-700'
                                                    : item.status === 'OCCUPIED'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-gray-200 text-gray-700'
                                                }
                  `}
                                        >
                                            {statusLabels[item.status]}
                                        </span>
                                    </td>

                                    {/* Action */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>

                                            <button
                                                onClick={() => onDelete(item)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-4 text-center text-gray-500"
                                >
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default TableTable;
