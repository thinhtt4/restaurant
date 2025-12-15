
import { Plus, Search } from "lucide-react";

interface RoleToolbarProps {
  value?: string;
  onSearch: (kw: string) => void;
  onAddClick: () => void;
}

export default function RoleToolbar({ value, onSearch, onAddClick }: RoleToolbarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 justify-between items-center">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            value={value}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded"
            placeholder="Tìm kiếm role..."
          />
        </div>

        <button
          onClick={onAddClick}
          className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <Plus className="w-4 h-4" /> Thêm Role
        </button>
      </div>
    </div>
  );
}
