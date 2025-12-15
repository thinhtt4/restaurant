/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/BlogPage.tsx
import  { useCallback, useState } from "react";
import BlogToolbar from "@/components/dashboard_admin/blog/BlogToolbar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PaginationControls from "@/components/ui/PaginationControls";
import { useBlog } from "@/hooks/useBlog";
import { useGetBlogsQuery } from "@/store/api/blogApi";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import BlogTable from "@/components/dashboard_admin/blog/BlogTable";
import BlogModal from "@/components/dashboard_admin/blog/BlogModal";

export default function BlogPage() {
    const {
        modalOpen,
        modalMode,
        selected,
        confirmOpen,
        confirmTarget,
        openAdd,
        openEdit,
        closeModal,
        doCreate,
        doUpdate,
        askDelete,
        cancelDelete,
        doDelete,
    } = useBlog();

    const [keyword, setKeyword] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const debouncedKeyword = useDebounce(keyword, 300);

    const blogsListQuery = useGetBlogsQuery({
        keyword: debouncedKeyword,
        page,
        size: 5,
    });

    const pageData = blogsListQuery.data?.data;
    const blogs = pageData?.blogs ?? [];
    const isLoading = blogsListQuery.isLoading;
    const isFetching = blogsListQuery.isFetching;
    const isError = blogsListQuery.isError;
    const refetch = blogsListQuery.refetch;

    const handleSearch = useCallback((kw: string) => {
        setKeyword(kw);
        setPage(1);
    }, []);

    const goToPage = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handleSubmit = async (payload: {
        title: string;
        content: string;
        imageUrl?: string;
        active?: boolean;
    }) => {
        try {
            if (modalMode === "add") {
                // Tạo blog mới
                await doCreate({
                    title: payload.title,
                    content: payload.content,
                    imageUrl: payload.imageUrl,
                    active: payload.active ?? true,
                } as any);

                toast.success("Tạo blog thành công");


            } else {
                // Cập nhật blog
                if (!selected) throw new Error("No selected blog");

                await doUpdate(selected.blogId, {
                    title: payload.title,
                    content: payload.content,
                    imageUrl: payload.imageUrl,
                    active: payload.active ?? true,
                });

                toast.success("Cập nhật blog thành công");

            }

            closeModal();
            refetch();
        } catch (err: any) {
            const msg = err?.data?.message || err?.message || "Lỗi server";
            toast.error(msg);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await doDelete();

            toast.success("Xóa blog thành công");

            refetch();
        } catch (err: any) {
            const msg = err?.data?.message || err?.message || "Xóa thất bại";
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold">Quản lý Blog</h2>
                    <p className="text-gray-600 mt-1">
                        Quản lý các bài viết blog trong hệ thống
                    </p>
                </div>

                <BlogToolbar
                    value={keyword}
                    onSearch={handleSearch}
                    onAddClick={openAdd}
                />

                {isLoading || isFetching ? (
                    <div className="p-6 text-center">Đang tải...</div>
                ) : isError ? (
                    <div className="p-6 text-center text-red-500">
                        Lấy danh sách thất bại
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <BlogTable
                                blogs={blogs}
                                onEdit={openEdit}
                                onDeleteAsk={askDelete}
                            />
                        </div>

                        {pageData && pageData.totalPages > 1 && (
                            <div className="flex justify-center mt-4">
                                <PaginationControls
                                    page={page}
                                    totalPages={pageData.totalPages}
                                    onPageChange={goToPage}
                                />
                            </div>
                        )}
                    </>
                )}

                <BlogModal
                    mode={modalMode}
                    initial={selected ?? undefined}
                    open={modalOpen}
                    onOpenChange={(o) => (o ? null : closeModal())}
                    onSubmit={handleSubmit}
                />

                <ConfirmDialog
                    open={confirmOpen}
                    title="Xác nhận xóa"
                    description={`Bạn có chắc muốn xóa blog "${confirmTarget}" không?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={cancelDelete}
                />
            </div>
        </div>
    );
}