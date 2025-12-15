interface TableStatsData {
    total: number;
    empty: number;
    serving: number;
    occupied: number;
    reserved: number;
    waitingPayment: number;
}

interface Props {
    stats: TableStatsData;
}

export default function TableStats({ stats }: Props) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Tổng số</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-600">Trống</p>
                <p className="text-2xl font-bold text-green-700">{stats.empty}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-600">Phục vụ serving</p>
                <p className="text-2xl font-bold text-blue-700">{stats.serving}</p>
            </div>
            {/* <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-600">Có khách occupied</p>
                <p className="text-2xl font-bold text-red-700">{stats.occupied}</p>
            </div> */}
            <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-600">Đã đặt</p>
                <p className="text-2xl font-bold text-purple-700">{stats.reserved}</p>
            </div>
            {/* <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-orange-600">Chờ thanh toán</p>
                <p className="text-2xl font-bold text-orange-700">{stats.waitingPayment}</p>
            </div> */}
        </div>
    );
}
