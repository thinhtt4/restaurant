import { useState } from "react";
import TableCard from "./TableCard";
import type { TableArea, Table, TableAction, AlertState } from "@/types/table.type";
import { TableDetailModal } from "./TableDetailModal";
interface Props {
    Areas: TableArea[];
    Tables: Table[];
    selectedArea: number | null;
    onAction: (table: Table, action: TableAction) => void;
    alerts: AlertState;
}

export default function TableGrid({ Areas, Tables, selectedArea, onAction, alerts }: Props) {

    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const handleSelectTable = (table: Table) => {
        setSelectedTable(table);
        setShowDetailModal(true);
    };

    const tablesToShow = selectedArea
        ? Tables.filter(table => table.areaId === selectedArea)
        : Tables;

    if (tablesToShow.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 text-center py-12 text-gray-500">
                Không tìm thấy bàn nào phù hợp
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {Areas.filter(area => !selectedArea || area.areaId === selectedArea).map(area => {
                const areaTables = tablesToShow.filter(t => t.areaId === area.areaId);
                if (areaTables.length === 0) return null;

                return (
                    <div key={area.areaId} className="mb-8">
                        <h3 className="text-xl font-bold mb-4 pb-2 border-b">{area.name}</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {areaTables.map(table => (
                                <TableCard key={table.id} table={table} onClick={() => handleSelectTable(table)} alert={alerts[table.id ?? 0]} />
                            ))}
                        </div>
                    </div>
                );
            })}

            {showDetailModal && selectedTable && (
                <TableDetailModal
                    table={selectedTable}
                    onClose={() => setShowDetailModal(false)}
                    onAction={onAction}
                    tables={Tables}
                />
            )}
        </div>
    );
}