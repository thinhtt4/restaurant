/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { useState } from "react"
import { ChevronUp, ChevronDown, ArrowLeft, Loader2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useGetOrderDetailQuery, useCanceledOrderMutation, useCheckInOrderMutation } from "@/store/api/orderApi"
import type { OrderItem } from "@/types/booking.type"
import { toast } from "sonner"
import ConfirmDialog from "@/components/ui/ConfirmDialog"

// Helper format date
const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-"
    const date = new Date(dateStr)
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "-"
    const date = new Date(dateStr)
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

// Status display helpers
const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
        ORDERING: { text: "Chờ đặt cọc", className: "text-amber-600" },
        DEPOSITED_SUCCESS: { text: "Chờ nhận bàn", className: "text-purple-600" },
        CHECK_IN: { text: "Đã nhận bàn", className: "text-blue-600" },
        SUCCESS: { text: "Đã hoàn thành", className: "text-emerald-600" },
        CANCELLED: { text: "Đã hủy", className: "text-red-600" },
        FAILED: {
            text: "Thanh toán cọc thất bại",
            className: "bg-orange-100 text-orange-700"
        },
    }

    const { text, className } =
        statusMap[status] || { text: status, className: "text-slate-600" }

    return <span className={`${className} font-medium`}>{text}</span>
}

const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
        ORDERING: { text: "Chờ đặt cọc", className: "bg-amber-50 text-amber-700" },
        DEPOSITED_SUCCESS: { text: "Chờ nhận bàn", className: "bg-purple-50 text-purple-700" },
        CHECK_IN: { text: "Đã nhận bàn", className: "bg-blue-50 text-blue-700" },
        SUCCESS: { text: "Đã hoàn thành", className: "bg-emerald-50 text-emerald-700" },
        CANCELLED: { text: "Đã hủy", className: "bg-red-50 text-red-700" },
        FAILED: {
            text: "Thanh toán cọc thất bại",
            className: "bg-orange-100 text-orange-700"
        },
    }

    const { text, className } =
        statusMap[status] || { text: status, className: "bg-slate-100 text-slate-800" }

    return (
        <span className={`${className} px-4 py-2 rounded-lg text-sm font-medium`}>
            {text}
        </span>
    )
}

export default function BookingDetail() {
    const { id } = useParams<{ id: string }>();
    const orderId = Number(id)

    const [expandedSection, setExpandedSection] = useState<string | null>("booking-info")
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [showCheckInDialog, setShowCheckInDialog] = useState(false)

    // Gọi API lấy chi tiết order
    const { data, isLoading, error, refetch } = useGetOrderDetailQuery(orderId, {
        skip: !orderId || isNaN(orderId),
    })

    // Mutation hủy order
    const [cancelOrder, { isLoading: isCancelling }] = useCanceledOrderMutation()

    // Mutation check-in order
    const [checkInOrder, { isLoading: isCheckingIn }] = useCheckInOrderMutation()

    const booking = data?.data

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section)
    }

    const handleCancelBooking = async () => {
        try {
            await cancelOrder(orderId).unwrap()
            toast.success("Đặt bàn đã được hủy thành công")
            setShowCancelDialog(false)
            refetch() // Refresh data
        } catch (err) {
            console.log(err);
            toast.error("Có lỗi xảy ra khi hủy đặt bàn. Vui lòng thử lại.")
        }
    }

    const handleCheckInBooking = async () => {
        try {
            await checkInOrder(orderId).unwrap()
            toast.success("Nhận bàn thành công")
            setShowCheckInDialog(false)
            refetch() // Refresh data
        } catch (err: any) {
            console.error("Check-in error:", err?.data?.message)
            toast.error(err?.data?.message);
        }
    }

    const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="flex justify-between items-start py-3 border-b border-slate-100 last:border-b-0">
            <span className="text-slate-700 font-medium min-w-[140px]">{label}</span>
            <span className="text-slate-600 text-right flex-1 ml-4">{value}</span>
        </div>
    )

    // Loading state
    if (isLoading) {
        return (
            <main className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
                <div className="flex items-center gap-2 text-slate-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang tải...</span>
                </div>
            </main>
        )
    }

    // Error state
    if (error || !booking) {
        return (
            <main className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <Link to="/admin/booking" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại
                    </Link>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-700 mb-4">Không tìm thấy thông tin đặt bàn hoặc có lỗi xảy ra.</p>
                        <button onClick={() => refetch()} className="text-blue-600 underline hover:no-underline">
                            Thử lại
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    const canCancel =
        booking.status === "ORDERING" ||
        booking.status === "DEPOSITED_SUCCESS";
    const canCheckIn = booking.status === "DEPOSITED_SUCCESS"

    return (
        <main className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/admin/booking" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại
                    </Link>
                </div>

                {/* Title and Status */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Chi tiết đặt bàn</h1>
                        <p className="text-slate-500 text-sm mt-1">Mã đơn: #{booking.orderId}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                </div>

                {/* Action Buttons */}
                <div className="mb-6 flex gap-3">
                    {canCheckIn && (
                        <button
                            onClick={() => setShowCheckInDialog(true)}
                            disabled={isCheckingIn}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isCheckingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isCheckingIn ? "Đang xử lý..." : "Nhận bàn"}
                        </button>
                    )}

                    {canCancel && (
                        <button
                            onClick={() => setShowCancelDialog(true)}
                            disabled={isCancelling}
                            className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isCancelling && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isCancelling ? "Đang hủy..." : "Hủy đặt bàn"}
                        </button>
                    )}
                </div>

                {/* Booking Information Section */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-4">
                    <button onClick={() => toggleSection("booking-info")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                        <h2 className="text-lg font-semibold text-slate-900">Thông tin đặt bàn</h2>
                        {expandedSection === "booking-info" ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                    </button>
                    {expandedSection === "booking-info" && (
                        <div className="px-6 py-4 bg-slate-50">
                            <DetailRow label="Tên đơn hàng" value={booking.orderName || "-"} />
                            <DetailRow label="Ngày tạo đơn" value={`${formatDate(booking.createdAt)} - ${formatTime(booking.createdAt)}`} />
                            <DetailRow label="Ngày nhận bàn" value={formatDate(booking.reservationTime)} />
                            <DetailRow label="Giờ nhận bàn" value={formatTime(booking.reservationTime)} />
                            <DetailRow label="Giờ trả bàn" value={formatTime(booking.reservationEndTime)} />
                            <DetailRow label="Số khách" value={`${booking.guestCount} người`} />
                            <DetailRow label="Ghi chú" value={booking.note || "-"} />
                            <DetailRow label="Trạng thái" value={getStatusDisplay(booking.status)} />
                        </div>
                    )}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-4">
                    <button onClick={() => toggleSection("table-info")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                        <h2 className="text-lg font-semibold text-slate-900">Bàn và khu vực</h2>
                        {expandedSection === "table-info" ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                    </button>
                    {expandedSection === "table-info" && (
                        <div className="px-6 py-4 bg-slate-50">
                            <DetailRow label="Khu vực" value={booking.table?.areaName || "-"} />
                            <DetailRow label="Mã bàn" value={booking.table?.code || "-"} />
                            <DetailRow label="Sức chứa" value={`${booking.table?.guestCount || 0} người`} />
                        </div>
                    )}
                </div>

                {/* Order Items Section */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-4">
                    <button onClick={() => toggleSection("order-items")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                        <h2 className="text-lg font-semibold text-slate-900">Món đã đặt ({booking.orderItem?.length || 0})</h2>
                        {expandedSection === "order-items" ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                    </button>
                    {expandedSection === "order-items" && (
                        <div className="px-6 py-4 bg-slate-50">
                            {booking.orderItem?.length > 0 ? (
                                <div className="space-y-3">
                                    {booking.orderItem.map((item: OrderItem) => (
                                        <div key={item.orderItemId} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                                            <div>
                                                <p className="font-medium text-slate-800">{item.menuItem?.name || item.combo?.name}</p>
                                                <p className="text-sm text-slate-500">SL: {item.quantityOnline}</p>
                                            </div>
                                            <p className="font-medium text-slate-700">{formatCurrency(item.priceOnline * item.quantityOnline)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-center py-4">Chưa có món nào được đặt</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Payment Section */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-4">
                    <button onClick={() => toggleSection("payment-info")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                        <h2 className="text-lg font-semibold text-slate-900">Thanh toán</h2>
                        {expandedSection === "payment-info" ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                    </button>

                    {expandedSection === "payment-info" && (
                        <div className="px-6 py-4 bg-slate-50">
                            <DetailRow label="Tổng tiền" value={formatCurrency(booking.depositAmount + booking.paidAmount)} />
                            <DetailRow label="Tổng tiền online (nếu có)" value={formatCurrency(booking.totalAmount)} />
                            <DetailRow label="Tiền cọc đã thanh toán" value={formatCurrency(booking.depositAmount)} />
                            <DetailRow label="Tiền cọc bàn đã thanh toán (nếu có)" value={formatCurrency(booking.depositTable)} />

                            {booking.voucher && (
                                <div className="bg-red-20 border border-red-300 p-4 rounded-lg mb-3 shadow-sm">
                                    <h2 className="flex items-center gap-2 text-red-700 text-sm font-semibold mb-2">
                                        Chỉ áp dụng cho tổng tiền online
                                    </h2>


                                    <DetailRow label="Mã giảm giá" value={booking.voucher.code} />
                                    <DetailRow label="Loại giảm giá" value={booking.voucher.discountType} />
                                    <DetailRow
                                        label="Giá trị giảm"
                                        value={
                                            booking.voucher.discountType === "PERCENT"
                                                ? `${booking.voucher.discountValue}%`
                                                : `${booking.voucher.discountValue.toLocaleString()} đ`
                                        }
                                    />
                                    <DetailRow
                                        label="Giá trị giảm tối đa"
                                        value={
                                            booking.voucher.maxDiscountAmount === 0
                                                ? "Không giới hạn"
                                                : `${booking.voucher.maxDiscountAmount?.toLocaleString()} đ`
                                        }
                                    />

                                </div>
                            )}

                            <DetailRow
                                label={booking.status === "SUCCESS" ? "Đã thanh toán" : "Còn lại"}
                                value={
                                    booking.status === "SUCCESS"
                                        ? <span className="font-semibold text-green-600">{formatCurrency(booking.paidAmount)}</span>
                                        : <span className="font-semibold text-red-600">{formatCurrency(booking.paidAmount)}</span>
                                }
                            />


                            {booking.paidAt && <DetailRow label="Ngày thanh toán" value={formatDate(booking.paidAt)} />}
                        </div>
                    )}
                </div>

                {/* Customer Section */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button onClick={() => toggleSection("customer-info")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                        <h2 className="text-lg font-semibold text-slate-900">Thông tin khách hàng</h2>
                        {expandedSection === "customer-info" ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                    </button>
                    {expandedSection === "customer-info" && (
                        <div className="px-6 py-4 bg-slate-50">
                            <DetailRow label="Tên khách hàng" value={booking.orderName || booking.user?.username} />
                            <DetailRow label="Email" value={booking.user?.email || "-"} />
                            <DetailRow label="Số điện thoại" value={booking.user?.phone || "-"} />
                        </div>
                    )}
                </div>

                {/* Cancel Dialog */}
                <ConfirmDialog
                    open={showCancelDialog}
                    title="Hủy đặt bàn"
                    description="Bạn có chắc chắn muốn hủy đặt bàn này?"
                    onConfirm={handleCancelBooking}
                    onCancel={() => setShowCancelDialog(false)}
                />

                {/* Check-in Dialog */}
                <ConfirmDialog
                    open={showCheckInDialog}
                    title="Nhận bàn"
                    description="Bạn có chắc chắn muốn nhận bàn?"
                    onConfirm={handleCheckInBooking}
                    onCancel={() => setShowCheckInDialog(false)}
                />
            </div>
        </main>
    )
}