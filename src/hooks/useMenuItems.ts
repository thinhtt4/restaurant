import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { MenuItem } from "@/types/menuItem.type";
import {
    useGetMenuItemsQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
} from "@/store/api/menuItemApi";
import { useGetMenuCategoriesQuery } from "@/store/api/categoryApi";

export function useMenuItems() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selected, setSelected] = useState<MenuItem | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState<MenuItem | null>(null);

    const { data: categoryList } = useGetMenuCategoriesQuery({});

    const categories = categoryList?.data;

    const [doCreate] = useCreateMenuItemMutation();
    const [doUpdate] = useUpdateMenuItemMutation();
    const [doDelete] = useDeleteMenuItemMutation();

    const openAdd = () => {
        setModalMode("add");
        setSelected(null);
        setModalOpen(true);
    };
    const openEdit = (item: MenuItem) => {
        setModalMode("edit");
        setSelected(item);
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    const askDelete = (item: MenuItem) => {
        setConfirmTarget(item);
        setConfirmOpen(true);
    };
    const cancelDelete = () => {
        setConfirmOpen(false);
        setConfirmTarget(null);
    };

    const extractErrorMessage = (err: unknown): string => {
        if (typeof err === "object" && err !== null) {
            // RTK Query error: { data: { message } }
            if ("data" in err && typeof err.data === "object" && err.data !== null) {
                const data = err.data as { message?: string };
                if (data.message) return data.message;
            }

            // JS native Error
            if ("message" in err && typeof err.message === "string") {
                return err.message;
            }
        }

        return "Lỗi server";
    };

    const handleSubmit = async (payload: {
        name: string;
        description?: string;
        price: number;
        categoryId: number;
        active: boolean;
        imageUrl?: string;
    }) => {
        try {

            if (modalMode === "add") {
                await doCreate(payload).unwrap();
                toast.success("Thêm menu item thành công");
            } else if (selected) {
                await doUpdate({ id: selected.id, data: payload }).unwrap();
                toast.success("Cập nhật menu item thành công");
            }
            closeModal();
        } catch (err: unknown) {
            const msg = extractErrorMessage(err);
            toast.error(msg);
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirmTarget) return;
        try {
            await doDelete(confirmTarget.id).unwrap();
            toast.success("Xóa menu item thành công");
            cancelDelete();
        } catch (err: unknown) {
            const msg = extractErrorMessage(err);
            toast.error(msg);
        }
    };

    type FilterState = {
        page: number;
        size: number;
        search: string;
        categoryId?: number;
        active?: boolean;
    };

    const [filters, setFilters] = useState<FilterState>({
        page: 1,
        size: 5,
        search: "",
        categoryId: undefined as number | undefined,
        active: undefined,
    });

    // const [filters, setFilters] = useState({
    //       page: 1,
    //       size: 5,
    //       search: '',
    //       categoryId: undefined as number | undefined,
    //       active: undefined as boolean | undefined
    //   });

    const {
        data: pagemenuItems,
        isLoading,
        isFetching,
        isError,
        refetch: menuItemRefetch,
    } = useGetMenuItemsQuery(filters);

    const menuItems = pagemenuItems?.data || [];
    const currentPage = pagemenuItems?.currentPage || 1;
    const totalPages = pagemenuItems?.totalPage || 1;
    const totalElements = pagemenuItems?.totalElements || 0;

    const setSearch = (searchValue: string) => {
        setFilters((prev) => ({
            ...prev,
            search: searchValue,
            page: 1,
        }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    // Hieu
    const setCategoryId = (id: number) => {
        setFilters((prev) => ({
            ...prev,
            categoryId: id,
        }));
    };


    const setActive = (active: boolean) => {
        setFilters((prev) => ({
            ...prev,
            active: active,
        }));
    };

    const [menuItemsState, setMenuItemsState] = useState<MenuItem[]>(
        pagemenuItems?.data || []
    );

    useEffect(() => {
        if (pagemenuItems?.data) {
            setMenuItemsState(pagemenuItems.data);
        }
    }, [pagemenuItems?.data]);

    const refetchMenuItems = async () => {
        const result = await menuItemRefetch();
        if (result.data?.data) {
            setMenuItemsState(result.data.data);
        }
    };


    const handlePriceFilter = (priceFrom?: number, priceTo?: number) => {
        setFilters(prev => ({
            ...prev,
            priceFrom,
            priceTo,
            page: 1
        }));
    };

    const handleCategoryFilter = (categoryId?: number) => {
        setFilters(prev => ({
            ...prev,
            categoryId,
            page: 1
        }));
    };

    const handleActiveFilter = (active?: boolean) => {
        setFilters(prev => ({
            ...prev,
            active,
            page: 1
        }));
    };

    return {
        menuItems,
        categories,
        isLoading,
        isFetching,
        isError,
        modalOpen,
        modalMode,
        selected,
        confirmOpen,
        confirmTarget,
        menuItemsState,
        refetchMenuItems,
        setActive,
        openAdd,
        openEdit,
        closeModal,
        askDelete,
        cancelDelete,
        handleSubmit,
        handleConfirmDelete,
        setSearch,
        handlePriceFilter,
        handleCategoryFilter,
        handleActiveFilter,
        currentPage,
        totalPages,
        totalElements,
        handlePageChange,
        setCategoryId,

        menuItemRefetch
    };

}
