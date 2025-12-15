import { useMemo, useState } from "react";
import type { AlertState, Table, TableAction, TableArea } from "@/types/table.type";
import { useGetTablesQuery, useUpdateTableMutation } from "@/store/api/tableApi";
import { useGetTableAreasQuery } from "@/store/api/tableAreaApi";
import type { OrderResponse } from "@/types/booking.type";
import { useCheckInOrderMutation, useUpdateOrderStatusMutation } from "@/store/api/orderApi";
import { toast } from "sonner";


type ApiError = {
    status?: number;
    data?: { message?: string };
    error?: string;
    message?: string;
};

export function useTableMap() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedArea, setSelectedArea] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const { data: tableAreaPage } = useGetTableAreasQuery({});
    const [updateTable] = useUpdateTableMutation();



    const Areas: TableArea[] = tableAreaPage?.data ?? [];

    const { data: tablePage, isLoading, isFetching, isError, refetch } = useGetTablesQuery({
        search: searchTerm || undefined,
        areaId: selectedArea || undefined,
        status: selectedStatus || undefined,
        page: 1,
        size: 100,
    });
    const Tables = useMemo<Table[]>(() => {
        return tablePage?.data ?? [];
    }, [tablePage]);


    const [alerts, setAlerts] = useState<AlertState>({});



    const stats = useMemo(() => ({
        total: Tables.length,
        empty: Tables.filter(t => t.status === "EMPTY").length,
        serving: Tables.filter(t => t.status === "SERVING").length,
        occupied: Tables.filter(t => t.status === "OCCUPIED").length,
        reserved: Tables.filter(t => t.status === "RESERVED").length,
        waitingPayment: Tables.filter(t => t.status === "WAITING_PAYMENT").length,
    }), [Tables]);

    const setAreaFilter = (areaId?: number | null) => setSelectedArea(areaId ?? null);
    const setStatusFilter = (status?: string | null) => setSelectedStatus(status ?? null);
    const setSearch = (value: string) => setSearchTerm(value);
    const [checkInTable] = useCheckInOrderMutation();

    const [changeOrderStatus] = useUpdateOrderStatusMutation();

    const handleTableAction = async (table: Table, action: TableAction, order?: OrderResponse) => {
        switch (action) {
            case "CHECK_IN":
                if (table.status === "EMPTY" || table.status === "RESERVED") {
                    try {
                        if (!table.id) {
                            toast.error("Bàn này không có ID hợp lệ");
                            return;
                        }

                        await checkInTable(order?.orderId ?? 0).unwrap();

                        updateTable({
                            id: table.id,
                            body: {
                                ...table,
                                status: "SERVING",
                            },
                        });
                    } catch (err: unknown) {
                        const error = err as ApiError;
                        toast.error(
                            error?.data?.message ||
                            error?.message ||
                            error?.error ||
                            "Không thể Check In bàn này"
                        );
                    }
                    return;
                }
                throw new Error("Không thể Check In bàn này");

            case "RESERVE":
                if (table.status === "EMPTY") {
                    if (!table.id) {
                        toast.error("Bàn này không có ID hợp lệ");
                        return;
                    }

                    return updateTable({
                        id: table.id,
                        body: { ...table, status: "RESERVED" },
                    });
                }
                throw new Error("Bàn không thể đặt");

            case "CANCEL_RESERVE":
                if (table.status === "RESERVED") {
                    try {
                        if (!table.id) {
                            toast.error("Bàn này không có ID hợp lệ");
                            return;
                        }
                        updateTable({
                            id: table.id,
                            body: { ...table, status: "EMPTY" },
                        });
                    } catch (err: unknown) {
                        const error = err as ApiError;

                        toast.error(
                            error?.data?.message ||
                            error?.message ||
                            error?.error ||
                            "Không thể CANCEL_RESERVE bàn này"
                        );
                    }
                }
                throw new Error("Bàn chưa được đặt");

            case "START_SERVING":
                if (table.status === "OCCUPIED") {

                    if (!table.id) {
                        toast.error("Bàn này không có ID hợp lệ");
                        return;
                    }

                    return updateTable({
                        id: table.id,
                        body: { ...table, status: "SERVING" },
                    });
                }
                throw new Error("Bàn chưa có khách");

            case "CHECK_OUT":
                if (table.status === "SERVING" || table.status === "WAITING_PAYMENT") {
                    try {

                        if (!table.id) {
                            toast.error("Bàn này không có ID hợp lệ");
                            return;
                        }

                        await changeOrderStatus({ orderId: order?.orderId || 0, status: "SUCCESS" }).unwrap();

                        updateTable({
                            id: table.id,
                            body: { ...table, status: "EMPTY" },
                        });

                    } catch (err: unknown) {
                        const error = err as ApiError;

                        toast.error(
                            error?.data?.message ||
                            error?.message ||
                            error?.error ||
                            "Không thể CHECK_OUT bàn này"
                        );
                    }
                    return;
                }
                throw new Error("Bàn chưa phục vụ");

            case "FINISH_PAYMENT":
                if (table.status === "WAITING_PAYMENT") {

                    if (!table.id) {
                        toast.error("Bàn này không có ID hợp lệ");
                        return;
                    }

                    return updateTable({
                        id: table.id,
                        body: { ...table, status: "EMPTY" },
                    });
                }
                throw new Error("Bàn chưa chờ thanh toán");

            // case "CALL_STAFF":
            //     await fetch(`/api/tables/${table.id}/call`, { method: "POST" });
            //     return "CALLED";

            default:
                throw new Error("Hành động không hợp lệ");
        }
    };


    return {
        Tables,
        Areas,
        stats,
        searchTerm,
        selectedArea,
        selectedStatus,
        setSearch,
        setAreaFilter,
        setStatusFilter,
        isLoading,
        isFetching,
        isError,
        refetch,
        handleTableAction,
        alerts,
        setAlerts,
    };
}
