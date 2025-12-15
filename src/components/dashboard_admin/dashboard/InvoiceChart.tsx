import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

// const data = [
//   { name: "Hủy đơn", value: 25 },
//   { name: "Chờ thanh toán cọc", value: 30 },
//   { name: "Hết hạn thanh toán cọc", value: 20 },
//   { name: "Đã thanh toán cọc", value: 15 },
//   { name: "Chờ thanh toán bộ đơn", value: 5 },
//   { name: "Hoàn thành đơn", value: 5 },
// ]

// const COLORS = ["#ef4444", "#22c55e", "#eab308", "#ff69b4", "#06b6d4", "#1f2937"]
const STATUS_COLORS: Record<string, string> = {
  ORDERING: "#eab308",           // vàng
  SUCCESS: "#22c55e",            // xanh lá
  FAILED: "#ef4444",             // đỏ
  CANCELLED: "#ff69b4",          // hồng
  DEPOSITED_SUCCESS: "#06b6d4",  // xanh cyan
  CHECK_IN: "#3b82f6",           // xanh dương
};

export type InvoiceChartData = {
  name: string;
  value: number; // % đã làm tròn
  count: number; // số lượng thật
}

export default function InvoiceChart({ data }: { data: InvoiceChartData[] }) {

  const filteredData = data.filter(item => item.value > 0);

  if (!filteredData || filteredData.length === 0 || filteredData.every(item => item.value === 0)) {
    return (
      <div className="text-center text-gray-500 py-10">
        Không có dữ liệu
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Chú thích:</h3>
        <div className="grid grid-cols-2 gap-3">
          {filteredData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.name] || "#1f2937" }}></div>
              <span className="text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.name] || "#1f2937"}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
               const count = props.payload.count;
              return [`${value}% (${count} đơn)`, name];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
