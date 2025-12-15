
interface VoucherFilterProps {
    filter: {
        code: string;
        type: string;
        active: string;
        applyType: string;
    };
    updateFilter: (field: string, value: string) => void;
}

const VoucherFilter = ({ filter, updateFilter }: VoucherFilterProps) => {
    return (
        <div className="flex gap-4 mb-4">

            {/* Filter theo mã */}
            <input
                type="text"
                placeholder="Tìm theo mã"
                className="border px-3 py-2 rounded"
                value={filter.code}
                onChange={(e) => updateFilter("code", e.target.value)}
            />

            {/* Filter theo loại */}
            <select
                className="border px-3 py-2 rounded"
                value={filter.type}
                onChange={(e) => updateFilter("type", e.target.value)}
            >
                <option value="">-- Loại --</option>
                <option value="PERCENT">PERCENT</option>
                <option value="AMOUNT">AMOUNT</option>
            </select>

            {/* Filter theo trạng thái */}
            <select
                className="border px-3 py-2 rounded"
                value={filter.active}
                onChange={(e) => updateFilter("active", e.target.value)}
            >
                <option value="">-- Trạng thái --</option>
                <option value="true">Hoạt động</option>
                <option value="false">Tạm dừng</option>
            </select>

              {/* Filter theo applyType */}
            <select
                className="border px-3 py-2 rounded"
                value={filter.applyType}
                onChange={(e) => updateFilter("applyType", e.target.value)}
            >
                <option value="">-- Loại áp dụng --</option>
                <option value="ORDER">ORDER</option>
                <option value="COMBO">COMBO</option>
            </select>

        </div>
    );
};

export default VoucherFilter;
