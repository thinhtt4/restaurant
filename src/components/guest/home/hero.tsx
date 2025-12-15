import { useState, useEffect } from "react";
import { ChevronDown, Utensils, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  onBookTableClick: () => void;
}
export default function Hero({ onBookTableClick }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 animate-gradient"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Dark overlay with animated opacity */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content with staggered animations */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-20"
            }`}
          >
            {/* Badge with pulse animation */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full backdrop-blur-sm animate-pulse-slow">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-sm font-medium">
                Ẩm Thực Quê Lúa
              </span>
            </div>

            {/* Main heading with gradient text */}
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="block text-white mb-2 hover:scale-105 transition-transform duration-300">
                NHỮNG MÓN ĂN
              </span>
              <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                NGON SẴN SÀNG
              </span>
              <span className="block text-white mt-2 hover:scale-105 transition-transform duration-300">
                PHỤC VỤ THỰC KHÁCH
              </span>
            </h1>

            {/* Description with delay */}
            <p
              className={`text-gray-300 text-lg leading-relaxed max-w-xl transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Khám phá hành trình ẩm thực Quê Lúa đầy màu sắc. Với menu phong
              phú, từ những món ăn truyền thống đến những biến tấu mới lạ, chúng
              tôi mang đến cho thực khách những trải nghiệm ẩm thực độc đáo.
            </p>

            {/* CTA Button with hover effects */}
            <div
              className={`transition-all duration-1000 delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBookTableClick();
                }}
                className="group relative inline-block"
              >
                <button className="relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    <Utensils className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    ĐẶT BÀN NGAY
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-orange-500 to-red-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
            </div>

            {/* Stats with hover effects */}
            <div
              className={`flex gap-8 pt-4 transition-all duration-1000 delay-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {[
                { number: "500+", label: "Món ăn" },
                { number: "50K+", label: "Khách hàng" },
                { number: "4.9★", label: "Đánh giá" },
              ].map((stat, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="text-3xl font-bold text-orange-400 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image with animations */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
          >
            <div className="relative group">
              {/* Animated border glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-2xl transition-opacity duration-500 animate-pulse-slow"></div>

              {/* Image container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=1000&fit=crop"
                  alt="Delicious Asian Cuisine"
                  className="w-full h-[600px] object-cover"
                />
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">
                      Đặc biệt hôm nay
                    </div>
                    <div className="font-bold text-gray-900">-30% Off</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer group">
          <span className="text-sm font-medium">Cuộn xuống</span>
          <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(-10px) translateX(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
