import type { TableArea } from "@/types/table.type";
import { X, Edit } from "lucide-react";

interface Props {
    data?: TableArea[];
    onEdit: (area: TableArea) => void;
    onDelete: (area: TableArea) => void;
}

export default function TableAreaTable({ data, onEdit, onDelete }: Props) {
    if (!data || data.length === 0) {
        return <div>Không có khu vực nào.</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Tên khu vực</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {data.map((area) => (
                            <tr key={area.areaId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-700">{area.areaId}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{area.name}</td>

                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">

                                        <button
                                            onClick={() => onEdit(area)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>

                                        <button
                                            onClick={() => onDelete(area)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <X className="w-5 h-5" />
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
