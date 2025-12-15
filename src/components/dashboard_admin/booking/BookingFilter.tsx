import { useState, useRef, useEffect } from "react"

interface FilterPopoverProps {
    dateFilter: string
    timeFilter: string
    onDateChange: (value: string) => void
    onTimeChange: (value: string) => void
}

export default function BookingFilter({ dateFilter, timeFilter, onDateChange, onTimeChange }: FilterPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const hasActiveFilters = dateFilter !== "all" || timeFilter !== "all"

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${hasActiveFilters
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                </svg>
                Bộ lọc
                {hasActiveFilters && (
                    <span className="ml-1 flex items-center justify-center w-5 h-5 rounded-full bg-white text-blue-500 text-xs font-bold">
                        {(dateFilter !== "all" ? 1 : 0) + (timeFilter !== "all" ? 1 : 0)}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 z-50 p-6 min-w-max">
                    <div className="flex items-center justify-between gap-8">
                        {/* Date Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">Lọc theo ngày</label>
                            <div className="flex gap-2">
                                {[
                                    { value: "all", label: "Tất cả" },
                                    { value: "yesterday", label: "Hôm qua" },
                                    { value: "today", label: "Hôm nay" },
                                    { value: "tomorrow", label: "Ngày mai" },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onDateChange(option.value)
                                        }}
                                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${dateFilter === option.value
                                            ? "bg-blue-500 text-white"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">Lọc theo khung giờ</label>
                            <div className="flex gap-2">
                                {[
                                    { value: "all", label: "Tất cả" },
                                    { value: "morning", label: "Sáng (8:00 - 12:00)" },
                                    { value: "afternoon", label: "Chiều (12:00 - 17:00)" },
                                    { value: "evening", label: "Tối (17:00 - 21:00)" },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onTimeChange(option.value)
                                        }}
                                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${timeFilter === option.value
                                            ? "bg-blue-500 text-white"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reset Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={() => {
                                    onDateChange("all")
                                    onTimeChange("all")
                                }}
                                className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors h-fit"
                            >
                                Xóa tất cả
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
