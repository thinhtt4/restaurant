import { useState, useEffect, useRef } from "react"
import { useGetMenuItemsQuery } from "@/store/api/menuItemApi"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

export default function MenuShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollInterval = useRef<ReturnType<typeof setInterval> | null>(null)


  // Fetch menu items from API
  const { data, isLoading, isError } = useGetMenuItemsQuery({
    page: 1,
    size: 20,
    active: true,
  })

  const dishes = data?.data || []
  const itemsToShow = 4

  // Auto scroll function
  const startAutoScroll = () => {
    autoScrollInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.max(0, dishes.length - itemsToShow)
        return prevIndex >= maxIndex ? 0 : prevIndex + 1
      })
    }, 3000)
  }

  // Stop auto scroll
  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current)
      autoScrollInterval.current = null
    }
  }

  // Start auto scroll when component mounts and data is loaded
  useEffect(() => {
    if (dishes.length > itemsToShow) {
      startAutoScroll()
    }

    return () => stopAutoScroll()
  }, [dishes.length])

  // Scroll to current index
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.scrollWidth / dishes.length
      container.scrollTo({
        left: currentIndex * itemWidth,
        behavior: 'smooth'
      })
    }
  }, [currentIndex, dishes.length])

  // Handle manual navigation
  const handlePrev = () => {
    stopAutoScroll()
    setCurrentIndex((prev) => Math.max(0, prev - 1))
    setTimeout(startAutoScroll, 5000)
  }

  const handleNext = () => {
    stopAutoScroll()
    const maxIndex = Math.max(0, dishes.length - itemsToShow)
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
    setTimeout(startAutoScroll, 5000)
  }

  // Pause on hover
  const handleMouseEnter = () => {
    stopAutoScroll()
  }

  const handleMouseLeave = () => {
    if (dishes.length > itemsToShow) {
      startAutoScroll()
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <section id="menu" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
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
            .animate-slide-in-up {
              animation: slideInUp 0.6s ease-out forwards;
            }
          `}</style>
          <div className="text-center mb-16 opacity-0 animate-slide-in-up" style={{ animationDelay: '0s' }}>
            <p className="text-amber-500 font-semibold mb-2">Nhà Hàng Quê Lúa</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Món ăn mới</h2>
          </div>

          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (isError || !data) {
    return (
      <section id="menu" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
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
            .animate-slide-in-up {
              animation: slideInUp 0.6s ease-out forwards;
            }
          `}</style>
          <div className="text-center opacity-0 animate-slide-in-up" style={{ animationDelay: '0s' }}>
            <p className="text-red-500 font-semibold">Không thể tải danh sách món ăn. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </section>
    )
  }

  const maxIndex = Math.max(0, dishes.length - itemsToShow)

  return (
    <section id="menu" className="py-16 md:py-24 bg-white">
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
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-slide-in-up" style={{ animationDelay: '0s' }}>
          <p className="text-amber-500 font-semibold mb-2">Nhà Hàng Quê Lúa</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Món ăn mới</h2>
        </div>

        {/* Carousel Container */}
        {dishes.length > 0 ? (
          <div
            className="relative opacity-0 animate-slide-in-up"
            style={{ animationDelay: '200ms' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Navigation Buttons */}
            {dishes.length > itemsToShow && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white shadow-lg transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white shadow-lg transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Scrollable Menu Grid */}
            <div className="overflow-hidden px-12">
              <div
                ref={scrollContainerRef}
                className="flex gap-8 overflow-x-hidden scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="group cursor-pointer flex-shrink-0 transition-all duration-300 transform hover:scale-105"
                    style={{ width: 'calc(25% - 1.5rem)' }}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300">
                      <img
                        src={dish.imageUrl || "/placeholder.svg"}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Border glow on hover */}
                      <div className="absolute inset-0 rounded-lg border-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-inner shadow-amber-500/20"></div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
                        {dish.name}
                      </h3>
                      <p className="text-amber-500 font-bold text-lg group-hover:text-amber-600 transition-colors duration-300">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(dish.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            {dishes.length > itemsToShow && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      stopAutoScroll()
                      setCurrentIndex(index)
                      setTimeout(startAutoScroll, 5000)
                    }}
                    className={`h-3 rounded-full transition-all duration-300 hover:scale-125 ${index === currentIndex
                      ? 'w-8 bg-amber-500 shadow-lg'
                      : 'w-3 bg-amber-200 hover:bg-amber-300'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12 opacity-0 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <p className="text-lg">Hiện chưa có món ăn nào.</p>
          </div>
        )}
      </div>
    </section>
  )
}