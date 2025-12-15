import { useState } from "react";
import { toast } from "sonner";
import type { GetTableAreasParams, TableArea } from "@/types/table.type";
import {
    useGetTableAreasQuery,
    useCreateTableAreaMutation,
    useUpdateTableAreaMutation,
    useDeleteTableAreaMutation,
} from "@/store/api/tableAreaApi";

export function useTableAreas() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selected, setSelected] = useState<TableArea | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState<TableArea | null>(null);

    const [doCreate] = useCreateTableAreaMutation();
    const [doUpdate] = useUpdateTableAreaMutation();
    const [doDelete] = useDeleteTableAreaMutation();

    const openAdd = () => {
        setModalMode("add");
        setSelected(null);
        setModalOpen(true);
    };
    const openEdit = (area: TableArea) => {
        setModalMode("edit");
        setSelected(area);
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    const askDelete = (area: TableArea) => {
        setConfirmTarget(area);
        setConfirmOpen(true);
    };
    const cancelDelete = () => {
        setConfirmOpen(false);
        setConfirmTarget(null);
    };

    const handleSubmit = async (payload: { name: string }) => {
        try {
            if (modalMode === "add") {
                await doCreate(payload).unwrap();
                toast.success("Thêm khu vực bàn thành công");
            } else if (selected) {
                await doUpdate({ id: selected.areaId ?? 0, body: payload }).unwrap();
                toast.success("Cập nhật khu vực bàn thành công");
            }
            refetch();
            closeModal();
        } catch (err: unknown) {
            let msg = "Lỗi server";

            if (typeof err === "object" && err !== null) {
                if ("data" in err && typeof err.data === "object" && err.data !== null) {
                    const data = err.data as { message?: string };
                    if (data.message) msg = data.message;
                }

                if ("message" in err && typeof err.message === "string") {
                    msg = err.message;
                }
            }

            toast.error(msg);
        }

    };

    const handleConfirmDelete = async () => {
        if (!confirmTarget) return;
        try {
            await doDelete(confirmTarget.areaId ?? 0).unwrap();
            toast.success("Xóa khu vực bàn thành công");
            refetch();
            cancelDelete();
        } catch (err: unknown) {
            let msg = "Xóa thất bại";

            if (typeof err === "object" && err !== null) {
                if ("data" in err && typeof err.data === "object" && err.data !== null) {
                    const data = err.data as { message?: string };
                    if (data.message) msg = data.message;
                }

                if ("message" in err && typeof err.message === "string") {
                    msg = err.message;
                }
            }

            toast.error(msg);
        }
    };


    const [filters, setFilters] = useState<GetTableAreasParams>({
        page: 1,
        size: 5,
        search: ''
    });

    const {
        data: pageData,
        isLoading,
        isFetching,
        isError,
        refetch
    } = useGetTableAreasQuery(filters);

    const tableAreas: TableArea[] = pageData?.data || [];
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
        tableAreas,
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
