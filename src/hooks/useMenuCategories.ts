import { useState } from "react";
import { toast } from "sonner";
import type { MenuCategory } from "@/types/menuItem.type";
import {
    useGetMenuCategoriesQuery,
    useCreateMenuCategoryMutation,
    useUpdateMenuCategoryMutation,
    useDeleteMenuCategoryMutation,
} from "@/store/api/categoryApi";
import type { GetMenuCategoriesParams } from "@/types/menuCategory.type";

export function useMenuCategories() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selected, setSelected] = useState<MenuCategory | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState<MenuCategory | null>(null);

    const [doCreate] = useCreateMenuCategoryMutation();
    const [doUpdate] = useUpdateMenuCategoryMutation();
    const [doDelete] = useDeleteMenuCategoryMutation();

    const openAdd = () => {
        setModalMode("add");
        setSelected(null);
        setModalOpen(true);
    };
    const openEdit = (cate: MenuCategory) => {
        setModalMode("edit");
        setSelected(cate);
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    const askDelete = (cat: MenuCategory) => {
        setConfirmTarget(cat);
        setConfirmOpen(true);
    };
    const cancelDelete = () => {
        setConfirmOpen(false);
        setConfirmTarget(null);
    };

    const handleSubmit = async (payload: { name: string; type: string }) => {
        try {
            if (modalMode === "add") {
                await doCreate(payload).unwrap();
                toast.success("Thêm category thành công");
            } else if (selected) {
                await doUpdate({ id: selected.categoryId ?? 0, body: payload }).unwrap();
                toast.success("Cập nhật category thành công");
            }
            refetch();
            closeModal();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Lỗi server");
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirmTarget) return;
        try {
            await doDelete(confirmTarget.categoryId ?? 0).unwrap();
            toast.success("Xóa category thành công");
            refetch();
            cancelDelete();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Xóa thất bại");
        }
    };

    const [filters, setFilters] = useState<GetMenuCategoriesParams>({
        page: 1,
        size: 5,
        search: '',
        type: undefined,
    });

    const {
        data: pageData,
        isLoading,
        isFetching,
        isError,
        refetch
    } = useGetMenuCategoriesQuery(filters);

    const categories: MenuCategory[] = pageData?.data || [];
    const currentPage = pageData?.currentPage || 1;
    const totalPage = pageData?.totalPage || 1;
    const totalElements = pageData?.totalElements || 0;

    const handleSearch = (searchValue: string) => {
        setFilters(prev => ({
            ...prev,
            search: searchValue,
            page: 1
        }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    return {
        categories,
        isLoading,
        isFetching,
        isError,
        modalOpen,
        modalMode,
        selected,
        confirmOpen,
        confirmTarget,
        openAdd,
        openEdit,
        closeModal,
        askDelete,
        cancelDelete,
        handleSubmit,
        handleConfirmDelete,
        handleSearch,
        handlePageChange,
        currentPage,
        totalPage,
        totalElements,
    };
}
