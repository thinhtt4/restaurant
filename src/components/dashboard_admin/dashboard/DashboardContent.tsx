
import StatCard from "@/components/dashboard_admin/dashboard/StatCard"
import RevenueChart from "@/components/dashboard_admin/dashboard/RevenueChart"
import InvoiceChart from "@/components/dashboard_admin/dashboard/InvoiceChart"
import { Users, FileText, UtensilsCrossed, BarChart3 } from "lucide-react"
import { useDashboardStats } from "@/hooks/useDashboardStats"


export default function DashboardContent() {

    const db = useDashboardStats();
    const stats = [
        {
            title: "Số lượng tài khoản",
            value: db.statData?.data[0] ?? 0,
            icon: Users,
            bgColor: "bg-blue-500",
            link: "/admin/accounts",
        },
        {
            title: "Số lượng bài viết trong năm",
            value: db.statData?.data[1] ?? 0,
            icon: FileText,
            bgColor: "bg-green-500",
            link: "/admin/blog",
        },
        {
            title: "Số lượng món ăn",
            value: db.statData?.data[2] ?? 0,
            icon: UtensilsCrossed,
            bgColor: "bg-cyan-400",
            link: "/admin/menu-item",
        },
        {
            title: "Số bàn",
            value: db.statData?.data[3] ?? 0,
            icon: BarChart3,
            bgColor: "bg-orange-400",
            link: "/admin/table-crud",
        },
    ]

    return (
        <main className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {db.statLoading ? (
                        <p className="text-center py-10">Đang tải dữ liệu...</p>
                    ) : (
                        stats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))
                    )}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    {db.revenueLoading && <p>Đang tải...</p>}
                    {db.revenueError && <p>Lỗi khi tải dữ liệu</p>}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">Thống Kê Doanh Thu</h2>
                            <div className="flex items-center gap-2">
                                <label className="whitespace-nowrap">Năm:</label>
                                <input
                                    type="number"
                                    value={db.year}
                                    min={2000}
                                    max={db.now.getFullYear()}
                                    // onChange={e => setYear(Number(e.target.value))}
                                    onChange={e => {
                                        const y = Number(e.target.value);
                                        db.setYear(Math.min(y, db.now.getFullYear()));
                                    }}
                                    className="border px-2 py-1 rounded w-20"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="whitespace-nowrap">Tháng:</label>
                                <select
                                    value={db.month ?? ""}
                                    // onChange={e => setMonth(e.target.value ? Number(e.target.value) : null)}
                                    onChange={e => {
                                        let m = e.target.value ? Number(e.target.value) : null;
                                        // Nếu chọn năm hiện tại → khóa không cho vượt quá tháng hiện tại
                                        if (m && db.year === db.now.getFullYear()) {
                                            m = Math.min(m, db.now.getMonth() + 1);
                                        }
                                        db.setMonth(m);
                                    }}
                                    className="border px-2 py-1 rounded w-24"
                                >
                                    <option value="">Cả năm</option>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const disabled = db.year === db.now.getFullYear() && (i + 1) > db.now.getMonth() + 1;
                                        return (
                                            <option key={i + 1} value={i + 1} disabled={disabled}>
                                                {i + 1}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        {db.revenueLoading ? <p>Đang tải...</p> : db.revenueError ? <p>Lỗi khi tải dữ liệu</p> :
                            <RevenueChart
                                data={db.chartData}
                                totalRevenue={db.totalRevenue}
                                totalOrders={db.totalOrders}
                                startDate={db.startDate}
                                endDate={db.endDate} />
                        }
                    </div>

                    {/* Invoice Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">Thống Kê Hóa Đơn</h2>
                            <select
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                                value={db.selectedYear}
                                onChange={(e) => db.setSelectedYear(Number(e.target.value))}
                            >
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const y = db.now.getFullYear() - i;
                                    return <option key={y} value={y}>{y}</option>;
                                })}
                            </select>
                            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                                value={db.selectedQuarter}
                                onChange={(e) => db.setSelectedQuarter(e.target.value)}>
                                <option value="year">Cả năm</option>
                                <option value="q1">Quý 1</option>
                                <option value="q2">Quý 2</option>
                                <option value="q3">Quý 3</option>
                                <option value="q4">Quý 4</option>
                            </select>
                        </div>
                        {db.invoiceLoading ? (
                            <p className="text-center py-10">Đang tải dữ liệu...</p>
                        ) : (
                            <InvoiceChart data={db.invoiceData?.data || []} />
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
