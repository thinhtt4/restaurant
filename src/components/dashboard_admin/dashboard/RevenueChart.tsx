// RevenueChart.tsx
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import type { RevenueItem } from "@/store/api/statisticalApi";

interface Props {
  data: RevenueItem[];
  totalRevenue: number;
  totalOrders: number;
  startDate: string;
  endDate: string
}

export default function RevenueChart({ data, totalRevenue, totalOrders, startDate, endDate }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <label className="whitespace-nowrap">Khoảng thời gian:</label>
        <input
          type="text"
          value={`${startDate} → ${endDate}`}
          readOnly
          className="border px-2 py-1 rounded bg-gray-100 w-52"
        />
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="label" />
          <YAxis width={80} domain={[0, 'dataMax']} tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip />
          <Bar dataKey="revenue" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">$</div>
          <div>
            <p className="text-sm text-gray-600">Tổng Doanh Thu</p>
            <p className="text-2xl font-bold text-gray-800">{totalRevenue.toLocaleString()} đ</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">🛒</div>
          <div>
            <p className="text-sm text-gray-600">Số Lượng Đơn Hàng</p>
            <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
