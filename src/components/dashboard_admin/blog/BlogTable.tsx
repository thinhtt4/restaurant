import { Edit, Trash2 } from "lucide-react";
import type { BlogResponse } from "@/types/blog.type";

interface Props {
    blogs: BlogResponse[];
    onEdit: (blog: BlogResponse) => void;
    onDeleteAsk: (id: number) => void;
}

export default function BlogTable({ blogs, onEdit, onDeleteAsk }: Props) {
    if (!blogs || blogs.length === 0) {
        return <div className="p-6 text-center text-gray-500">Không có blog nào</div>;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Tác giả</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Tiêu đề</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Ngày tạo</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Cập nhật</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {blogs.map((blog) => (
                            <tr key={blog.blogId} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                                        {blog.authorName}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                    {blog.title}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {formatDate(blog.createdAt)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {formatDate(blog.updatedAt)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => onEdit(blog)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDeleteAsk(blog.blogId)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            title="Xóa"
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