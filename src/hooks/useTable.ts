import { useState } from "react";
import { toast } from "sonner";
import type { GetTablesParams, Table } from "@/types/table.type";
import {
    useGetTablesQuery,
    useCreateTableMutation,
    useUpdateTableMutation,
    useDeleteTableMutation,
} from "@/store/api/tableApi";
import { useGetTableAreasQuery } from "@/store/api/tableAreaApi";



export function useTables() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selected, setSelected] = useState<Table | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState<Table | null>(null);

    const { data: tableAreaList } = useGetTableAreasQuery({});
    const tableArea = tableAreaList?.data;

    const [doCreate] = useCreateTableMutation();
    const [doUpdate] = useUpdateTableMutation();
    const [doDelete] = useDeleteTableMutation();

    const openAdd = () => {
        setModalMode("add");
        setSelected(null);
        setModalOpen(true);
    };
    const openEdit = (table: Table) => {
        setModalMode("edit");
        setSelected(table);
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    const askDelete = (table: Table) => {
        setConfirmTarget(table);
        setConfirmOpen(true);
    };
    const cancelDelete = () => {
        setConfirmOpen(false);
        setConfirmTarget(null);
    };

    const handleSubmit = async (payload: {
        code: string;
        description?: string;
        guestCount: number;
        status: string;
        areaId: number;
    }) => {
        try {
            if (modalMode === "add") {
                await doCreate(payload).unwrap();
                toast.success("Thêm bàn thành công");
            } else if (selected) {
                await doUpdate({ id: selected.id ?? 0, body: payload }).unwrap();
                toast.success("Cập nhật bàn thành công");
            }
            refetch();
            closeModal();
        } catch (err: unknown) {
            const msg = extractErrorMessage(err);
            toast.error(msg);
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirmTarget) return;
        try {
            await doDelete(confirmTarget.id ?? 0).unwrap();
            toast.success("Xóa bàn thành công");
            refetch();
            cancelDelete();
        } catch (err: unknown) {
            const msg = extractErrorMessage(err);
            toast.error(msg);
        }
    };

    const extractErrorMessage = (err: unknown): string => {
        if (typeof err === "object" && err !== null) {
            // RTK Query error: { data: { message } }
            if ("data" in err && typeof err.data === "object" && err.data !== null) {
                const data = err.data as { message?: string };
                if (data.message) return data.message;
            }

            // JS Error: { message }
            if ("message" in err && typeof err.message === "string") {
                return err.message;
            }
        }

        return "Lỗi server";
    };



    const [filters, setFilters] = useState<GetTablesParams>({
        page: 1,
        size: 5,
        search: '',
    });

    const { data: pageData, isLoading, isFetching, isError, refetch, } = useGetTablesQuery(filters);

    const {
        data: tables = [],
        currentPage = 1,
        totalPage = 1,
        totalElements = 0
    } = pageData || {};

    const setSearch = (searchValue: string) => {
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

    const handleGuestFilter = (from?: number, to?: number) => {
        setFilters(prev => ({
            ...prev,
            guestFrom: from,
            guestTo: to,
            page: 1
        }));
    };

    const handleAreaFilter = (areaId?: number) => {
        setFilters(prev => ({
            ...prev,
            areaId: areaId,
            page: 1
        }));
    };

    const handleStatusFilter = (status?: string) => {
        setFilters(prev => ({
            ...prev,
            status: status,
            page: 1
        }));
    };

    return {
        tables,
        tableArea,
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
        handlePageChange,
        setSearch,
        handleGuestFilter,
        handleAreaFilter,
        handleStatusFilter,
        currentPage,
        totalPage,
        totalElements
    };
}
