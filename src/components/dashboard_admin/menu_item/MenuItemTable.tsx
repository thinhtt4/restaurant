import type { MenuItem } from "@/types/menuItem.type";
import { Trash2, Edit } from "lucide-react";

interface Props {
    data?: MenuItem[];
    onEdit: (item: MenuItem) => void;
    onDelete: (item: MenuItem) => void;
}

const MenuItemTable = ({ data, onEdit, onDelete }: Props) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <table className="w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Tên</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Ảnh</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Mô tả</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Giá</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Danh mục</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Active</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Hành động</th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {data?.length ? (
                        data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                        {item.name}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                    ) : (
                                        <span className="text-gray-400">No image</span>
                                    )}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">{item.description}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.price}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.categoryName}</td>

                                <td className="px-6 py-4">
                                    {item.active ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                            Inactive
                                        </span>
                                    )}
                                </td>

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
                                colSpan={7}
                                className="px-6 py-4 text-center text-gray-500"
                            >
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MenuItemTable;
