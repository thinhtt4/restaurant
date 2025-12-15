import TableStats from "@/components/dashboard_admin/table_map/TableStats";
import TableFilters from "@/components/dashboard_admin/table_map/TableFilters";
import TableGrid from "@/components/dashboard_admin/table_map/TableGrid";
import { useTableMap } from "@/hooks/useTableMap";
import { useEffect } from "react";
import { socket } from "@/hooks/socket";
import type { TableAlert } from "@/types/table.type";

export default function TableMap() {
    const {
        Tables,
        Areas,
        stats,
        searchTerm,
        selectedArea,
        selectedStatus,
        setSearch,
        setAreaFilter,
        setStatusFilter,
        refetch,
        handleTableAction,
        alerts,
        setAlerts
    } = useTableMap()

    useEffect(() => {
        // 1. Sự kiện cập nhật trạng thái cứng (Check-in, Thanh toán...) -> Refetch data gốc
        socket.on("table_update", (data: number) => {
            refetch();
            setAlerts(prev => {
                const newState = { ...prev };
                delete newState[data];
                return newState;
            });
        });

        // 2. Sự kiện KHẨN CẤP (Có khách sau + Sắp hết giờ) -> Viền Đỏ                                                                                                  
        socket.on("table_urgent_turnover", (data: TableAlert) => {
            setAlerts(prev => ({
                ...prev,
                [data.tableId]: { ...data, type: 'URGENT', hasNextBooking: true }
            }));
        });

        // 3. Sự kiện CẢNH BÁO (Sắp hết giờ nhưng không có khách sau) -> Icon Vàng
        socket.on("table_time_warning", (data: TableAlert) => {
            setAlerts(prev => ({
                ...prev,
                [data.tableId]: { ...data, type: 'WARNING', hasNextBooking: false }
            }));
        });

        // 4. Quá giờ + Có khách sau (Nguy hiểm nhất)
        socket.on("table_critical_overtime", (data: TableAlert) => {
            setAlerts(prev => ({
                ...prev,
                [data.tableId]: { ...data, type: 'CRITICAL', hasNextBooking: true }
            }));
        });

        // 5. Quá giờ + Không khách sau (Thư thả)
        socket.on("table_overtime_safe", (data: TableAlert) => {
            setAlerts(prev => ({
                ...prev,
                [data.tableId]: { ...data, type: 'OVERTIME', hasNextBooking: false }
            }));
        });

        return () => {
            socket.off("table_update");
            socket.off("table_urgent_turnover");
            socket.off("table_time_warning");
            socket.off("table_critical_overtime");
            socket.off("table_overtime_safe");

        };
    }, [refetch, setAlerts]);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Sơ đồ Bàn Nhà Hàng</h1>

            <TableStats stats={stats} />

            <TableFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearch}
                selectedArea={selectedArea}
                setSelectedArea={setAreaFilter}
                selectedStatus={selectedStatus}
                setSelectedStatus={setStatusFilter}
                Areas={Areas}
            />

            <div className="max-h-[600px] overflow-y-auto">
                <TableGrid
                    Areas={Areas}
                    Tables={Tables}
                    selectedArea={selectedArea}
                    onAction={handleTableAction}
                    alerts={alerts}
                />
            </div>
        </div>
    );
}
