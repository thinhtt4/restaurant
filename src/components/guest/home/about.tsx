import TableFilter from '@/components/booking/table/TableFilter';
import { useState } from 'react';
import type { RefObject } from "react";
interface AboutProps {
  tableFilterRef: RefObject<HTMLDivElement | null>;
}

export default function About({ tableFilterRef }: AboutProps) {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const images = [
    { src: '/restaurant-interior-warm-lighting.jpg', alt: 'Restaurant ambience', col: 0, row: 0 },
    { src: '/restaurant-dining-area-elegant.jpg', alt: 'Dining area', col: 1, row: 0 },
    { src: '/chef-preparing-vietnamese-dish.jpg', alt: 'Chef at work', col: 0, row: 1 },
    { src: '/2.jpg', alt: 'Food presentation', col: 1, row: 1 },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-slide-in-up" style={{ animationDelay: '0s' }}>
          <p className="text-amber-500 font-semibold mb-2">Giới thiệu</p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">CHÀO MỪNG ĐẾN VỚI</h2>
          <p className="text-amber-600 text-2xl md:text-3xl font-serif">Quê Lúa</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Images Grid with animations */}
          <div className="grid grid-cols-2 gap-4 group">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer opacity-0 animate-slide-in-up"
                style={{
                  animationDelay: `${idx * 100}ms`,
                  marginTop: (img.row === 1) ? '32px' : '0px',
                }}
                onMouseEnter={() => setHoveredImage(idx)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                {/* Image with zoom effect */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{
                    transform: hoveredImage === idx ? 'scale(1.15) rotate(2deg)' : 'scale(1)',
                  }}
                />

                {/* Overlay gradient on hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                ></div>

                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-lg border-2 border-amber-400 opacity-0 hover:opacity-100 transition-opacity duration-300 shadow-inner shadow-amber-500/20"></div>

                {/* Floating label on hover */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm bg-black/30"
                >
                  <span className="text-white font-semibold text-center px-4 text-sm">{img.alt}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            <div
              className="opacity-0 animate-slide-in-up"
              style={{ animationDelay: '200ms' }}
            >
              <p className="text-gray-700 text-base leading-relaxed hover:text-gray-900 transition-colors duration-300">
                Nhà hàng Quê Lúa - Hương vị ẩm thực Việt Nam dịch thực hiện. Với hơn 5 năm kinh nghiệm trong lĩnh vực ẩm
                thực, Quê Lúa tự hào mang đến cho thực khách những món ăn ngon, độc đáo và chất lượng.
              </p>
            </div>

            <div
              className="opacity-0 animate-slide-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <p className="text-gray-700 text-base leading-relaxed hover:text-gray-900 transition-colors duration-300">
                Đội ngũ đầu bếp tài năng của chúng tôi luôn không ngừng sáng tạo để mang đến những trải nghiệm ẩm thực mới
                lạ. Không gian nhà hàng ấm cúng, sang trọng, cùng với phong cách phục vụ chuyên nghiệp sẽ khiến quý khách
                hài lòng.
              </p>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2 gap-8 pt-4 opacity-0 animate-slide-in-up"
              style={{ animationDelay: '400ms' }}
            >
              {[
                { number: '>5', label: 'NĂM\nKINH NGHIỆM' },
                { number: '20', label: 'ĐẦU BẾP\nNHIỀU NĂM KINH NGHIỆM' }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="group relative p-4 rounded-lg border border-amber-200 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 bg-white hover:bg-amber-50"
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        animation: 'shimmer 2s infinite',
                      }}
                    ></div>
                  </div>

                  <div className="relative z-10">
                    <p className="text-3xl md:text-4xl font-bold text-amber-500 group-hover:text-amber-600 transition-colors duration-300">
                      {stat.number}
                    </p>
                    <p className="text-gray-700 text-sm font-semibold mt-2 group-hover:text-amber-700 transition-colors duration-300 whitespace-pre-line">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Button */}
            <div
              className="opacity-0 animate-slide-in-up"
              style={{ animationDelay: '500ms' }}
            >
              <button className="w-full relative group overflow-hidden bg-amber-500 text-white px-6 py-3 rounded font-bold transition-all duration-300 hover:bg-amber-600 active:scale-95 mt-6">
                {/* Background shine effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shimmer 2s infinite',
                  }}
                ></div>

                {/* Shadow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <span className="relative flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                  XEM THÊM TẠI ĐÂY
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div ref={tableFilterRef}>
          <TableFilter />
        </div>

      </div>
    </section>
  );
}