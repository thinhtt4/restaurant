/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { X, ShoppingBag, Package, Plus, Minus, Trash2, Search, UtensilsCrossed, ChevronLeft, ChevronRight, Image as ImageIcon, Loader2 } from "lucide-react";
import type { UpdateMenuOrderRequest } from "@/types/booking.type";
import type { MenuItem } from "@/types/menuItem.type";
import type { ComboResponse } from "@/types/combo.type";
import { useGetMenuItemsQuery } from "@/store/api/menuItemApi";
import { useGetAllComboQuery } from "@/store/api/comboApi";
import { socket } from "@/hooks/socket";

const OptimizedImage = ({ src, alt, className = "" }: { src?: string, alt: string, className?: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    return (
        <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <ImageIcon className="text-gray-400 opacity-50" size={20} />
                </div>
            )}
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
            )}
        </div>
    );
};

// --- INTERFACE CHO GIỎ HÀNG LOCAL ---
interface CartItem extends MenuItem {
    quantity: number;
}
interface CartCombo extends ComboResponse {
    quantity: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (items: UpdateMenuOrderRequest[], combos: UpdateMenuOrderRequest[]) => void;
}

const ITEMS_PER_PAGE = 8;

export default function AddItemsModal({
    isOpen,
    onClose,
    onSubmit,
}: Props) {
    const [activeTab, setActiveTab] = useState<"items" | "combos">("items");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    // --- STATE GIỎ HÀNG LOCAL ---
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartCombos, setCartCombos] = useState<CartCombo[]>([]);

    // API Items
    const { data: itemData, isFetching: isItemLoading, refetch: refetchMenuItems } = useGetMenuItemsQuery({
        page: page,
        size: ITEMS_PER_PAGE,
        active: true,
        search: searchTerm
    }, { skip: !isOpen || activeTab !== "items" });

    // API Combo
    const { data: comboData, isFetching: isComboLoading, refetch: refetchCombos } = useGetAllComboQuery({
        page: page - 1,
        pageSize: ITEMS_PER_PAGE,
        active: true,
        name: searchTerm
    }, { skip: !isOpen || activeTab !== "combos" });

    useEffect(() => {
        setPage(1);
    }, [activeTab, searchTerm]);


    useEffect(() => {
        if (!socket) return;
        socket.on("combo_update", refetchCombos);
        socket.on("update_menu", refetchMenuItems);


        return () => {
            socket.off("combo_update", refetchCombos);
            socket.off("update_menu", refetchMenuItems);

        };
    }, [socket, refetchCombos, refetchMenuItems]);

    if (!isOpen) return null;

    const menuList: MenuItem[] = itemData?.data || [];
    const comboList: ComboResponse[] = comboData?.data?.data || [];

    const totalPages = activeTab === "items"
        ? itemData?.totalPage || 1
        : comboData?.data?.totalPages || 1;

    const isLoading = activeTab === "items" ? isItemLoading : isComboLoading;

    // --- HANDLERS ---

    const handleAddItem = (item: MenuItem) => {
        setCartItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const handleAddCombo = (combo: ComboResponse) => {
        setCartCombos(prev => {
            const exists = prev.find(c => c.comboId === combo.comboId);
            if (exists) {
                return prev.map(c => c.comboId === combo.comboId ? { ...c, quantity: c.quantity + 1 } : c);
            }
            return [...prev, { ...combo, quantity: 1 }];
        });
    };

    const updateQuantity = (type: 'item' | 'combo', id: number, delta: number) => {
        if (type === 'item') {
            setCartItems(prev => prev.map(i => {
                if (i.id === id) {
                    const newQ = i.quantity + delta;
                    return newQ > 0 ? { ...i, quantity: newQ } : null;
                }
                return i;
            }).filter(Boolean) as CartItem[]);
        } else {
            setCartCombos(prev => prev.map(c => {
                if (c.comboId === id) {
                    const newQ = c.quantity + delta;
                    return newQ > 0 ? { ...c, quantity: newQ } : null;
                }
                return c;
            }).filter(Boolean) as CartCombo[]);
        }
    };

    const handleRemove = (type: 'item' | 'combo', id: number) => {
        if (type === 'item') setCartItems(prev => prev.filter(i => i.id !== id));
        else setCartCombos(prev => prev.filter(c => c.comboId !== id));
    };

    const handleSubmit = () => {
        if (cartItems.length === 0 && cartCombos.length === 0) {
            alert("Vui lòng chọn món!");
            return;
        }

        const itemsPayload: UpdateMenuOrderRequest[] = cartItems.map(i => ({
            menuItemId: i.id,
            quantityOnline: i.quantity
        }));

        const combosPayload: any[] = cartCombos.map(c => ({
            comboId: c.comboId,
            quantityOnline: c.quantity
        }));

        onSubmit(itemsPayload, combosPayload);

        // Reset
        setCartItems([]);
        setCartCombos([]);
        setSearchTerm("");
        onClose();
    };

    const totalCount = cartItems.length + cartCombos.length;

    const totalPrice =
        cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0) +
        cartCombos.reduce((sum, c) => sum + c.finalPrice * c.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden flex flex-col">

                {/* HEADER */}
                <div className="px-6 py-4 border-b flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Gọi món</h2>
                        <p className="text-sm text-gray-500">Tìm kiếm và thêm món vào đơn</p>
                    </div>

                    <div className="relative mx-4 flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Nhập tên món..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white border focus:border-green-500 rounded-lg outline-none transition-all"
                        />
                    </div>

                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 overflow-hidden bg-gray-50">

                    {/* CENTER: GRID + PAGINATION */}
                    <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 bg-white relative">

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
                            <button
                                onClick={() => setActiveTab("items")}
                                className={`flex-1 py-3 font-semibold text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "items" ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                <UtensilsCrossed size={16} /> Món lẻ
                            </button>
                            <button
                                onClick={() => setActiveTab("combos")}
                                className={`flex-1 py-3 font-semibold text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "combos" ? "border-orange-500 text-orange-700" : "border-transparent text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                <Package size={16} /> Combo
                            </button>
                        </div>

                        {/* Grid Content */}
                        <div className="p-4 flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="h-full flex items-center justify-center text-gray-400 gap-2">
                                    <Loader2 className="animate-spin" /> Đang tải dữ liệu...
                                </div>
                            ) : (
                                <>
                                    {/* MÓN LẺ GRID */}
                                    {activeTab === "items" && (
                                        menuList.length === 0 ? (
                                            <div className="text-center text-gray-400 mt-10">Không tìm thấy món nào</div>
                                        ) : (
                                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                {menuList.map((item) => (
                                                    <div key={item.id} onClick={() => handleAddItem(item)}
                                                        className="group border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white flex flex-col gap-2 relative overflow-hidden"
                                                    >
                                                        <div className="h-32 w-full rounded-lg overflow-hidden">
                                                            <OptimizedImage src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-1" title={item.name}>{item.name}</h3>
                                                            <p className="text-green-600 font-bold text-sm mt-1">{item.price.toLocaleString()}đ</p>
                                                        </div>
                                                        <button className="absolute bottom-3 right-3 bg-green-100 text-green-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Plus size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    )}

                                    {/* COMBO GRID */}
                                    {activeTab === "combos" && (
                                        comboList.length === 0 ? (
                                            <div className="text-center text-gray-400 mt-10">Không tìm thấy combo nào</div>
                                        ) : (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                                {comboList.map((combo) => (
                                                    <div key={combo.comboId} onClick={() => handleAddCombo(combo)}
                                                        className="border border-orange-200 bg-orange-50/30 rounded-xl p-3 cursor-pointer hover:border-orange-500 hover:shadow-md transition-all flex gap-3"
                                                    >
                                                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                                            <OptimizedImage src={combo.imageUrl} alt={combo.name} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-gray-800 text-sm">{combo.name}</h3>
                                                            <p className="text-orange-600 font-bold text-sm">{combo.finalPrice.toLocaleString()}đ</p>
                                                            {/* Render thành phần combo */}
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {combo.comboItems?.slice(0, 4).map((ci, idx) => (
                                                                    <span key={idx} className="text-[10px] bg-white border border-orange-100 text-gray-600 px-1.5 py-0.5 rounded-md">
                                                                        {ci.menuItem?.name} x{ci.quantity}
                                                                    </span>
                                                                ))}
                                                                {(combo.comboItems?.length || 0) > 4 && <span className="text-[10px] text-gray-500 self-center">...</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    )}
                                </>
                            )}
                        </div>

                        {/* Pagination Bar */}
                        <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
                            <span className="text-xs text-gray-500">Trang {page} / {totalPages}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || isLoading}
                                    className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages || isLoading}
                                    className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: CART (LOCAL STATE) */}
                    <div className="w-80 bg-gray-50 flex flex-col shrink-0 border-l border-gray-200">
                        <div className="p-4 border-b border-gray-200 bg-white shrink-0">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingBag size={20} className="text-green-600" />
                                Đã chọn <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{totalCount}</span>
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {totalCount === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <ShoppingBag size={48} className="opacity-10 mb-2" />
                                    <p className="text-sm">Chưa chọn món nào</p>
                                </div>
                            )}

                            {/* Render Combos */}
                            {cartCombos.map(item => (
                                <div key={item.comboId} className="bg-white p-3 rounded-lg shadow-sm border border-orange-200">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-gray-800 text-sm flex gap-1">
                                            <Package size={14} className="text-orange-500 mt-0.5" /> {item.name}
                                        </span>
                                        <button onClick={() => handleRemove('combo', item.comboId!)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="text-orange-600 font-medium text-sm">{(item.finalPrice * item.quantity).toLocaleString()}đ</div>
                                        <div className="flex items-center bg-gray-100 rounded-md">
                                            <button onClick={() => updateQuantity('combo', item.comboId!, -1)} className="p-1 hover:bg-gray-200 rounded-l-md"><Minus size={12} /></button>
                                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity('combo', item.comboId!, 1)} className="p-1 hover:bg-gray-200 rounded-r-md"><Plus size={12} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Render Items */}
                            {cartItems.map(item => (
                                <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-gray-800 text-sm">{item.name}</span>
                                        <button onClick={() => handleRemove('item', item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="text-gray-600 font-medium text-sm">{(item.price * item.quantity).toLocaleString()}đ</div>
                                        <div className="flex items-center bg-gray-100 rounded-md">
                                            <button onClick={() => updateQuantity('item', item.id, -1)} className="p-1 hover:bg-gray-200 rounded-l-md"><Minus size={12} /></button>
                                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity('item', item.id, 1)} className="p-1 hover:bg-gray-200 rounded-r-md"><Plus size={12} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-white border-t space-y-3">

                            {/* Tổng tiền */}
                            <div className="flex justify-between text-gray-700 font-semibold text-lg">
                                <span>Tổng tiền:</span>
                                <span className="text-green-600">{totalPrice.toLocaleString()}đ</span>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={totalCount === 0}
                                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${totalCount > 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
                                    }`}
                            >
                                Xác nhận thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}