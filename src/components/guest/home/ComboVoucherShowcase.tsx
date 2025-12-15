import { useState, useEffect } from 'react';
import { Sparkles, Clock, Users, Gift, TrendingUp, Flame } from 'lucide-react';
import type { ComboResponse } from '@/types/combo.type';
import { useGetAllComboQuery } from '@/store/api/comboApi';
import { useNavigate } from 'react-router-dom';
import { useComboBooking } from '@/hooks/useComboBooking';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function ComboVoucherShowcase() {
    const { isAuthenticated } = useAuth();
    const [activeCombo, setActiveCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });


    const { data: comboApiData, isLoading } = useGetAllComboQuery(
        {
            page: 0,
            pageSize: 1000,
            name: undefined,
            active: true,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    // Mapping data
    const combos = comboApiData?.data?.data?.map((c: ComboResponse) => {
        const discount = Math.round(((c.comboPrice - c.finalPrice) / c.comboPrice) * 100);

        return {
            id: c.comboId,
            name: c.name,
            description: (c.description ?? '').replace(/<[^>]*>/g, ''),
            originalPrice: c.comboPrice,
            discountedPrice: c.finalPrice,
            discount,
            image: c.imageUrl,
            items: c.comboItems?.map(item => item.menuItem?.name ?? "") ?? [],
            serves: `${c.comboItems.length} món`,
            isHot: c.vouchers?.length ? c.vouchers.length > 0 : false,
            tag: c.vouchers?.length ? 'Ưu đãi' : 'Bình thường',

        };
    }) || [];
    const { addComboToCart } = useComboBooking();
    const rawCombos = comboApiData?.data?.data || [];
    const navigate = useNavigate();

    const handleAddActiveCombo = () => {
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để đặt combo!");
            navigate("/auth/login");
            return;
        }

        const selected = rawCombos[activeCombo];
        if (!selected) return;

        addComboToCart(selected, 1);
        navigate("/app/booking-table-available");
    };


    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;

                if (hours === 0 && minutes === 0 && seconds === 0)
                    return { hours: 24, minutes: 0, seconds: 0 };

                if (seconds > 0) seconds--;
                else if (minutes > 0) { minutes--; seconds = 59; }
                else if (hours > 0) { hours--; minutes = 59; seconds = 59; }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Auto rotate
    useEffect(() => {
        if (!combos.length) return;

        const interval = setInterval(() => {
            setActiveCombo(prev => (prev + 1) % combos.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [combos.length]);

    // UI
    if (isLoading) return <div>Loading...</div>;
    if (!combos.length) return <div>Không có combo nào</div>;

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
            <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.5); }
          50% { box-shadow: 0 0 40px rgba(251, 146, 60, 0.8); }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }
      `}</style>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-orange-300/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-amber-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Header with countdown */}
                <div className="text-center mb-12 opacity-0 animate-slide-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full mb-4 animate-pulse-glow">
                        <Flame className="w-5 h-5 animate-shake" />
                        <span className="font-bold text-sm">ƯU ĐÃI CÓ HẠN</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                        <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                            COMBO ĐẶC BIỆT
                        </span>
                    </h2>

                    <p className="text-gray-600 text-lg mb-6">Giảm giá lên đến 30% - Đặt ngay hôm nay!</p>

                    {/* Countdown Timer */}
                    <div className="flex justify-center gap-4 mb-8">
                        {[
                            { value: timeLeft.hours, label: 'Giờ' },
                            { value: timeLeft.minutes, label: 'Phút' },
                            { value: timeLeft.seconds, label: 'Giây' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white rounded-lg shadow-lg p-4 min-w-[80px]">
                                <div className="text-3xl font-bold text-orange-600">{String(item.value).padStart(2, '0')}</div>
                                <div className="text-xs text-gray-500 uppercase">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Featured Combo */}
                <div className="mb-12 opacity-0 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Image Section */}
                            <div className="relative h-[400px] md:h-auto overflow-hidden">
                                <img
                                    src={combos[activeCombo].image}
                                    alt={combos[activeCombo].name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Hot Badge */}
                                {combos[activeCombo].isHot && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 animate-pulse-glow">
                                        <Flame className="w-4 h-4 animate-shake" />
                                        HOT
                                    </div>
                                )}

                                {/* Tag Badge */}
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                                    {combos[activeCombo].tag}
                                </div>

                                {/* Discount Badge */}
                                <div className="absolute bottom-4 right-4 bg-gradient-to-br from-red-600 to-pink-600 text-white rounded-2xl p-4 shadow-2xl animate-float">
                                    <div className="text-4xl font-bold">-{combos[activeCombo].discount}%</div>
                                    <div className="text-sm">GIẢM GIÁ</div>
                                </div>

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            {/* Content Section */}
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 text-orange-600 font-semibold mb-4">
                                    <Gift className="w-5 h-5" />
                                    <span>COMBO ĐẶC BIỆT</span>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                                    {combos[activeCombo].name}
                                </h3>

                                <p className="text-gray-600 text-lg mb-6">
                                    {combos[activeCombo].description}
                                </p>

                                {/* Serves */}
                                <div className="flex items-center gap-2 text-gray-700 mb-6">
                                    <Users className="w-5 h-5 text-orange-500" />
                                    <span className="font-semibold">{combos[activeCombo].serves}</span>
                                </div>

                                {/* Items included */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-amber-500" />
                                        Bao gồm:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {combos[activeCombo].items.map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="mb-8">
                                    <div className="flex items-baseline gap-4 mb-2">
                                        <span className="text-4xl font-bold text-orange-600">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(combos[activeCombo].discountedPrice)}
                                        </span>
                                        <span className="text-xl text-gray-400 line-through">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(combos[activeCombo].originalPrice)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-green-600 font-semibold flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        Tiết kiệm {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(combos[activeCombo].originalPrice - combos[activeCombo].discountedPrice)}
                                    </p>
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={handleAddActiveCombo}
                                    className="group/btn relative w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    <Gift className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                                    ĐẶT COMBO NGAY
                                </button>



                                <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Ưu đãi kết thúc trong {timeLeft.hours}h {timeLeft.minutes}p
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Combos Grid */}
                <div className="grid md:grid-cols-3 gap-6 opacity-0 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
                    {combos.filter((_, idx) => idx !== activeCombo).slice(0, 3).map((combo) => (
                        <div
                            key={combo.id}
                            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            onClick={() => setActiveCombo(combos.findIndex(c => c.id === combo.id))}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={combo.image}
                                    alt={combo.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                                    -{combo.discount}%
                                </div>

                                {combo.isHot && (
                                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1">
                                        <Flame className="w-3 h-3" />
                                        HOT
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>

                            <div className="p-6">
                                <div className="text-xs text-orange-600 font-semibold mb-2">{combo.tag}</div>
                                <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                                    {combo.name}
                                </h4>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                    <Users className="w-4 h-4 text-orange-500" />
                                    <span>{combo.serves}</span>
                                </div>

                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-2xl font-bold text-orange-600">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(combo.discountedPrice)}
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(combo.originalPrice)}
                                    </span>
                                </div>

                                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carousel indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {combos.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveCombo(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === activeCombo
                                ? 'w-8 bg-gradient-to-r from-orange-500 to-red-500'
                                : 'w-2 bg-gray-300 hover:bg-orange-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}