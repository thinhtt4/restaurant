interface ComboFilterProps {
    filter: {
        name: string;
        active: string;
    };
    updateFilter: (field: string, value: string) => void;
}

const ComboFilter = ({ filter, updateFilter }: ComboFilterProps) => {
    return (
        <div className="flex gap-4 mb-4">

            {/* Filter theo tên combo */}
            <input
                type="text"
                placeholder="Tìm theo tên combo"
                className="border px-3 py-2 rounded"
                value={filter.name}
                onChange={(e) => updateFilter("name", e.target.value || "")}
            />

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

        </div>
    );
};

export default ComboFilter;
