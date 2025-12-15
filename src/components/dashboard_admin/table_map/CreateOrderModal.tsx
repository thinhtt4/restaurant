import { useState } from 'react';
import { X, Plus, Trash2, Package } from 'lucide-react';
import type { CreateOrder, UpdateMenuOrderRequest } from '@/types/booking.type';
import type { MenuItem } from '@/types/menuItem.type';
import type { ComboResponse } from '@/types/combo.type';
import type { Table } from '@/types/table.type';
import AddItemsModal from './AddItemsModal';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (order: CreateOrder) => void;
    menuItems: MenuItem[];
    combos: ComboResponse[];
    table: Table;
}

export default function CreateOrderModal({
    isOpen,
    onClose,
    onSubmit,
    menuItems,
    combos,
    table,
}: CreateOrderModalProps) {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset();

    const [showAddModal, setShowAddModal] = useState(false);

    const [formData, setFormData] = useState<CreateOrder>({
        tableId: table.id ?? 0,
        phone: '',
        depositAmount: 0,
        items: [],
        paidAmount: 0,
        totalAmount: 0,
        note: '',
        guestCount: table.guestCount,
        reservationTime: new Date(now.getTime() - tzOffset * 60 * 1000).toISOString().slice(0, 16),
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('Amount') || name.includes('Count') ? Number(value) : value,
        }));
    };

    // --- LOGIC XỬ LÝ NHẬN DATA TỪ MODAL ---
    const handleAddItemsFromModal = (
        newItems: UpdateMenuOrderRequest[],
        newCombos: UpdateMenuOrderRequest[] = []
    ) => {
        setFormData((prev) => {
            const currentOrderItems = [...prev.items ?? []];

            // Xử lý Món Lẻ (Items)
            newItems.forEach((newItemRequest) => {
                const existingItemIndex = currentOrderItems.findIndex(
                    (oi) => oi.menuItemId === newItemRequest.menuItemId && !oi.comboId
                );

                if (existingItemIndex !== -1) {
                    currentOrderItems[existingItemIndex].quantityOnline += newItemRequest.quantityOnline;
                } else {
                    const foundMenuItem = menuItems.find(m => m.id === newItemRequest.menuItemId);
                    if (foundMenuItem) {
                        const newOrderItem: UpdateMenuOrderRequest = {
                            menuItemId: foundMenuItem.id,
                            quantityOnline: newItemRequest.quantityOnline,
                            menuItem: foundMenuItem
                        };
                        currentOrderItems.push(newOrderItem);
                    }
                }
            });

            // Xử lý Combo
            newCombos.forEach((newComboRequest) => {
                const existingComboIndex = currentOrderItems.findIndex(
                    (oi) => oi.comboId === newComboRequest.comboId
                );

                if (existingComboIndex !== -1) {
                    currentOrderItems[existingComboIndex].quantityOnline += newComboRequest.quantityOnline;
                } else {
                    const foundCombo = combos.find(c => c.comboId === newComboRequest.comboId);
                    if (foundCombo) {
                        const newComboItem: UpdateMenuOrderRequest = {
                            quantityOnline: newComboRequest.quantityOnline,
                            comboId: foundCombo.comboId,
                            combo: foundCombo
                        };
                        currentOrderItems.push(newComboItem);
                    }
                }
            });

            return { ...prev, items: currentOrderItems };
        });

        setShowAddModal(false);
    };

    const handleRemoveOrderItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items?.filter((_, i) => i !== index),
        }));
    };

    const handleQuantityChange = (index: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setFormData(prev => ({
            ...prev,
            items: prev.items?.map((item, i) =>
                i === index ? { ...item, quantityOnline: newQuantity } : item
            ),
        }));
    };
    // --- TÍNH TỔNG TIỀN ---
    const calculateTotal = () => {
        return formData.items?.reduce((sum, item) => {
            const price = item.combo
                ? item.combo.comboPrice
                : item.menuItem?.price ?? 0;
            return sum + (price * item.quantityOnline);
        }, 0);
    };

    const handleSubmit = () => {
        const total = calculateTotal();
        const orderData: CreateOrder = {
            ...formData,
            paidAmount: total,
            totalAmount: total,
        };
        onSubmit(orderData);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setFormData({
            tableId: table.id ?? 0,
            phone: '',
            depositAmount: 0,
            items: [],
            paidAmount: 0,
            totalAmount: 0,
            note: '',
            guestCount: table.guestCount,
            reservationTime: new Date(now.getTime() - tzOffset * 60 * 1000).toISOString().slice(0, 16),
        });
        onClose();
    };

    const total = calculateTotal();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold">Tạo Order Mới</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Thông tin bàn & khách */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Bàn</label>
                            <input type="text" value={`Bàn ${formData.tableId}`} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Số Khách</label>
                            <input type="number" value={formData.guestCount} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Thời Gian</label>
                            <input type="datetime-local" value={formData.reservationTime} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Số Điện Thoại</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0123456789" className="w-full border rounded px-3 py-2" />
                    </div>

                    {/* --- LIST ORDER ITEMS (Chung 1 list) --- */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Danh sách món</h3>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                                <Plus size={16} /> Chọn món
                            </button>
                        </div>

                        <div className="space-y-2">
                            {formData.items?.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">Chưa có món nào được chọn</p>
                            ) : (
                                formData.items?.map((item, idx) => {
                                    const isCombo = !!item.combo;

                                    return (
                                        <div
                                            key={idx}
                                            className={`flex gap-2 items-center p-2 rounded shadow-sm border ${isCombo ? 'bg-orange-50 border-orange-100' : 'bg-white border-gray-100'
                                                }`}
                                        >
                                            <div className="flex-1 font-medium text-sm flex items-center gap-2">
                                                {isCombo && <Package size={16} className="text-orange-600" />}
                                                <div>
                                                    <span className={isCombo ? "text-orange-800" : "text-gray-900"}>
                                                        {isCombo ? item.combo?.name : item.menuItem?.name}
                                                    </span>
                                                    <span className={`text-xs block ${isCombo ? "text-orange-600" : "text-gray-500"}`}>
                                                        {isCombo
                                                            ? item.combo?.comboPrice.toLocaleString()
                                                            : item.menuItem?.price.toLocaleString()
                                                        }đ
                                                    </span>
                                                </div>
                                            </div>

                                            <input
                                                type="number"
                                                value={item.quantityOnline}
                                                onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                                                min="1"
                                                className={`w-20 border rounded px-2 py-1 text-sm text-center ${isCombo ? 'border-orange-200 focus:ring-orange-500' : 'border-gray-200'
                                                    }`}
                                            />

                                            <button
                                                onClick={() => handleRemoveOrderItem(idx)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tổng Tiền</label>
                            <input type="number" value={total} disabled className="w-full border rounded px-3 py-2 bg-gray-100 text-lg font-semibold" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ghi Chú</label>
                        <textarea name="note" value={formData.note} onChange={handleInputChange} placeholder="Ghi chú thêm..." className="w-full border rounded px-3 py-2 resize-none h-20" />
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-2">
                    <button onClick={handleClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">Hủy</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Tạo Order</button>
                </div>
            </div>

            {/* INTEGRATE AddItemsModal */}
            <AddItemsModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddItemsFromModal}
            />
        </div>
    );
}