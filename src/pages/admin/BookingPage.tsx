import BookingToolbar from "@/components/dashboard_admin/booking/BookingToolbar";
import BookingTable from "@/components/dashboard_admin/booking/BookingTable";
import PaginationControls from "@/components/ui/PaginationControls";
import { useGetListAllOrderQuery } from "@/store/api/orderApi";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { ListOrderPageResponse } from "@/types/booking.type";

const VALID_STATUSES = [
    "ORDERING",
    "SUCCESS",
    "FAILED",
    "CANCELLED",
    "DEPOSITED_SUCCESS",
    "CHECK_IN",
] as const;
type StatusType = (typeof VALID_STATUSES)[number];

// Helper function để convert date filter sang ISO string
const getDateRange = (dateFilter: string): { from?: string; to?: string } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateFilter) {
        case "yesterday": {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return {
                from: yesterday.toISOString(),
                to: new Date(
                    yesterday.getTime() + 24 * 60 * 60 * 1000 - 1
                ).toISOString(),
            };
        }
        case "today": {
            return {
                from: today.toISOString(),
                to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(),
            };
        }
        case "tomorrow": {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return {
                from: tomorrow.toISOString(),
                to: new Date(
                    tomorrow.getTime() + 24 * 60 * 60 * 1000 - 1
                ).toISOString(),
            };
        }
        case "week": {
            const weekEnd = new Date(today);
            weekEnd.setDate(weekEnd.getDate() + 7);
            return {
                from: today.toISOString(),
                to: weekEnd.toISOString(),
            };
        }
        default:
            return {};
    }
};

// Helper function để convert time filter sang giờ cụ thể
const getTimeRange = (
    timeFilter: string,
    baseDate: Date = new Date()
): { from?: string; to?: string } => {
    const date = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate()
    );

    switch (timeFilter) {
        case "morning": {
            const from = new Date(date);
            from.setHours(8, 0, 0, 0);
            const to = new Date(date);
            to.setHours(11, 59, 59, 999);
            return {
                from: from.toISOString(),
                to: to.toISOString(),
            };
        }
        case "afternoon": {
            const from = new Date(date);
            from.setHours(12, 0, 0, 0);
            const to = new Date(date);
            to.setHours(16, 59, 59, 999);
            return {
                from: from.toISOString(),
                to: to.toISOString(),
            };
        }
        case "evening": {
            const from = new Date(date);
            from.setHours(17, 0, 0, 0);
            const to = new Date(date);
            to.setHours(23, 59, 59, 999);
            return {
                from: from.toISOString(),
                to: to.toISOString(),
            };
        }
        default:
            return {};
    }
};

export default function BookingPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const statusParam = searchParams.get("status");
    const activeStatus = VALID_STATUSES.includes(statusParam as StatusType)
        ? (statusParam as StatusType)
        : undefined;

    const dateFilter = searchParams.get("date") || "";
    const timeFilter = searchParams.get("time") || "";
    const searchQuery = searchParams.get("keyword") || "";
    const currentPage = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("size")) || 10;

    // Tính toán time range dựa trên date và time filter
    const dateRange = getDateRange(dateFilter);
    const timeRange = timeFilter && dateFilter ? getTimeRange(timeFilter) : {};

    // Kết hợp date và time range
    let fromReservationTime = dateRange.from;
    let toReservationTime = dateRange.to;

    if (timeRange.from && timeRange.to) {
        // Nếu có time filter, override time trong date range
        if (fromReservationTime) {
            const fromDate = new Date(fromReservationTime);
            const timeFrom = new Date(timeRange.from);
            fromDate.setHours(timeFrom.getHours(), timeFrom.getMinutes(), 0, 0);
            fromReservationTime = fromDate.toISOString();
        }
        if (toReservationTime) {
            const toDate = new Date(toReservationTime);
            const timeTo = new Date(timeRange.to);
            toDate.setHours(timeTo.getHours(), timeTo.getMinutes(), 59, 999);
            toReservationTime = toDate.toISOString();
        }
    }

    const { data, isLoading, isFetching, error, refetch } =
        useGetListAllOrderQuery({
            keyword: searchQuery || undefined,
            status: activeStatus,
            fromReservationTime,
            toReservationTime,
            page: currentPage,
            size: pageSize,
            sort: "createdAt,desc",
        });

    const orders = Array.isArray(data?.data) ? data.data : [];
    // ép kiểu để dùng đúng dữ liệu thực tế
    const pageData = (data ?? {}) as ListOrderPageResponse;
    const totalPages = pageData.totalPage ?? 1;

    const updateParams = (updates: Record<string, string | undefined>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });
        setSearchParams(newParams);
    };

    const handlePageChange = (page: number) => {
        updateParams({ page: String(page) });
    };

    const handleSearch = (query: string) => {
        updateParams({ keyword: query || undefined, page: "1" });
    };

    const handleDateChange = (date: string) => {
        updateParams({ date: date || undefined, page: "1" });
    };

    const handleTimeChange = (time: string) => {
        updateParams({ time: time || undefined, page: "1" });
    };

    const handleStatusChange = (status: string | undefined) => {
        updateParams({ status: status, page: "1" });
    };

    const handleAddBooking = () => {
        navigate("/admin/booking/create");
    };

    const handleSelectBooking = (id: number) => {
        navigate(`/admin/booking/${id}`);
    };

    return (
        <main className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <BookingToolbar
                    activeStatus={activeStatus}
                    onStatusChange={handleStatusChange}
                    dateFilter={dateFilter}
                    timeFilter={timeFilter}
                    onDateChange={handleDateChange}
                    onTimeChange={handleTimeChange}
                    onSearch={handleSearch}
                    onAdd={handleAddBooking}
                    searchValue={searchQuery}
                />

                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
                        <button
                            onClick={() => refetch()}
                            className="ml-2 underline hover:no-underline"
                        >
                            Tải lại
                        </button>
                    </div>
                ) : (
                    <BookingTable
                        orders={orders}
                        isLoading={isLoading || isFetching}
                        selectedId={null}
                        onSelectBooking={handleSelectBooking}
                    />
                )}

                {!isLoading && !error && totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <PaginationControls
                            page={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
