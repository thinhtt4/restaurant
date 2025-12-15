import { Package, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import type { ComboResponse } from "@/types/combo.type";
import { useComboBooking } from "@/hooks/useComboBooking";


// Component hiển thị combo card
const ComboCard = ({ combo }: { combo: ComboResponse }) => {
    const { addComboToCart, updateComboCartQuantity, getComboQuantity, listIdIsNotActive } = useComboBooking();
    const [quantity, setQuantity] = useState(0);
    const [isInactive, setIsInactive] = useState(false);

    // Lấy số lượng combo từ cart
    useEffect(() => {
        const currentQuantity = getComboQuantity(combo.comboId);
        setQuantity(currentQuantity);
    }, [combo.comboId, getComboQuantity]);

    // Check nếu combo bị inactive
    useEffect(() => {
        const checkInactive = async () => {
            const inactiveIds = await listIdIsNotActive([combo.comboId]);
            setIsInactive(inactiveIds.includes(combo.comboId));
        };
        checkInactive();
    }, [combo.comboId, listIdIsNotActive]);

    const discount = combo.totalSavings
        ? Math.round((combo.totalSavings / combo.comboPrice) * 100)
        : 0;

    const handleIncrease = () => {
        if (!isInactive) {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            addComboToCart(combo, newQuantity);
        }
    };

    const handleDecrease = () => {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            updateComboCartQuantity(combo.comboId, newQuantity);
        }
    };

    const isSelected = quantity > 0;

    if (isInactive) {
        return (
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden opacity-60 cursor-not-allowed">
                <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center">
                    <p className="text-white font-bold text-center">Combo không còn khả dụng</p>
                </div>

                <div className="relative">
                    <img
                        src={combo.imageUrl}
                        alt={combo.name}
                        className="w-full h-48 object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="text-orange-600" size={20} />
                        <h3 className="font-bold text-lg text-gray-800">{combo.name}</h3>
                    </div>

                    <div className="mb-3 space-y-1">
                        {combo.comboItems.map((item, idx) => (
                            <p key={idx} className="text-xs text-gray-600">
                                • {item.quantity}x {item?.menuItem?.name}
                            </p>
                        ))}
                    </div>

                    <p className="text-orange-600 font-bold text-xl">
                        {combo.comboPrice.toLocaleString("vi-VN")} ₫
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 ${isSelected ? "ring-4 ring-orange-500" : ""
                }`}
        >
            {/* Discount Badge */}
            {discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                    Giảm {discount}%
                </div>
            )}

            {/* HOT Badge */}
            <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                HOT
            </div>

            <div className="relative">
                <img
                    src={combo.imageUrl}
                    alt={combo.name}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                    <Package className="text-orange-600" size={20} />
                    <h3 className="font-bold text-lg text-gray-800">{combo.name}</h3>
                </div>

                {/* Combo Items */}
                <div className="mb-3 space-y-1">
                    {combo.comboItems.map((item, idx) => (
                        <p key={idx} className="text-xs text-gray-600">
                            • {item.quantity}x {item?.menuItem?.name}
                        </p>
                    ))}
                </div>

                {/* Vouchers */}
                {combo.vouchers && combo.vouchers.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                        {combo.vouchers.map((voucher, idx) => (
                            <span
                                key={idx}
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                            >
                                {voucher.code}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-orange-600 font-bold text-xl">
                            {combo.finalPrice.toLocaleString("vi-VN")} ₫
                        </p>
                        {combo.finalPrice && combo.finalPrice < combo.comboPrice && (
                            <p className="text-gray-400 line-through text-sm">
                                {combo.comboPrice.toLocaleString("vi-VN")} ₫
                            </p>
                        )}
                    </div>
                    {combo.totalSavings > 0 && (
                        <div className="text-right">
                            <p className="text-green-600 font-semibold text-sm flex items-center gap-1">
                                <TrendingUp size={16} />
                                Tiết kiệm {combo.totalSavings.toLocaleString("vi-VN")} ₫
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={handleDecrease}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={quantity === 0}
                        >
                            -
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300 min-w-[60px] text-center font-semibold">
                            {quantity}
                        </span>
                        <button
                            onClick={handleIncrease}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComboCard;