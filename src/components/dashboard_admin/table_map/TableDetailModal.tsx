/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Table, TableAction } from "@/types/table.type";
import {
  ArrowRightLeft,
  Clock,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  X,
} from "lucide-react"; // Thêm icon Package
import { ActionButton } from "./ActionButton";
import { useEffect, useState } from "react";
import CreateOrderModal from "./CreateOrderModal";
import { useGetMenuItemsQuery } from "@/store/api/menuItemApi";
import type {
  CreateOrder,
  OrderResponse,
  UpdateMenuOrderRequest,
} from "@/types/booking.type"; // Import thêm UpdateComboOrderRequest
import { toast } from "sonner";
import {
  useCashPaymentMutation,
  useMomoPaymentMutation,
  usePaymentVnpayMutation,
} from "@/store/api/paymentApi";
import AddItemsModal from "./AddItemsModal";
import {
  useCanceledOrderMutation,
  useCreateNowOrderMutation,
  useGetCurrentOrderOfTableQuery,
  useMoveTableMutation,
  useOrderMoreFoodMutation,
} from "@/store/api/orderApi";
import { useNavigate } from "react-router-dom";
import ConfirmPayment from "@/components/booking/confirm/ConfirmPayment";
import { useGetAllComboQuery } from "@/store/api/comboApi";
import MoveTableModal from "./MoveTableModal";
import { socket } from "@/hooks/socket";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const statusConfig = {
  EMPTY: {
    label: "Trống",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
  },
  SERVING: {
    label: "Đang phục vụ",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
  },
  WAITING_PAYMENT: {
    label: "Chờ thanh toán",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
  },
  RESERVED: {
    label: "Đã đặt",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
  },
  OCCUPIED: {
    label: "Có khách",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
  },
};

interface Props {
  table: Table;
  onClose: () => void;
  onAction: (
    table: Table,
    action: TableAction,
    order?: OrderResponse
  ) => void | Promise<void>;
  tables: Table[];
}

type ActionType = "CANCEL_ORDER" | "PAY_CASH" | null;

export function TableDetailModal({ table, onClose, onAction, tables }: Props) {
  const config =
    statusConfig[table.status as keyof typeof statusConfig] ||
    statusConfig.EMPTY;
  const navigate = useNavigate();

  const { data: order, refetch } = useGetCurrentOrderOfTableQuery(
    table.id ?? 0
  );
  const { data: menuItemPage, refetch: refetchMenuItems } =
    useGetMenuItemsQuery({ active: true, page: 1, size: 1000 });

  const [paymentVnpay] = usePaymentVnpayMutation();
  const [momoPayment] = useMomoPaymentMutation();
  const [cashPayment] = useCashPaymentMutation();
  const [createOrderNow] = useCreateNowOrderMutation();
  const [orderMore] = useOrderMoreFoodMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isAddItemsOpen, setIsAddItemsOpen] = useState(false);
  const [isMoveTableOpen, setIsMoveTableOpen] = useState(false);
  const [cancelOrder] = useCanceledOrderMutation();
  const [moveTable] = useMoveTableMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");

  const menuItems = menuItemPage?.data;

  // Load Combos
  const { data: comboData, refetch: refetchCombos } = useGetAllComboQuery({
    page: 0,
    pageSize: 100,
    active: true,
  });
  const combos = comboData?.data.data;

  useEffect(() => {
    socket.on("update_menu", refetchMenuItems);
    socket.on("combo_update", refetchCombos);

    return () => {
      socket.off("update_menu", refetchMenuItems);
      socket.off("combo_update", refetchCombos);
    };
  }, [refetchMenuItems, refetchCombos]);

  // --- HANDLERS ---
  const handleCreateSubmit = async (orderData: CreateOrder) => {
    try {
      const response = await createOrderNow(orderData).unwrap();
      toast.success("Tạo order thành công!");
      await onAction(table, "CHECK_IN", response.data);
      onClose();
    } catch (error: unknown) {
      const err = error as FetchBaseQueryError & {
        data?: { message?: string };
      };
      const message = err.data?.message ?? "Có lỗi xảy ra khi tạo order";
      toast.error(message);
    }
  };

  // thanh toán VNPay
  const handleVnPay = async () => {
    if (!order) return;

    let amount = 0;
    if (order.status === "CHECK_IN") {
      amount =
        order.depositTable !== 0
          ? order.paidAmount - order.depositTable
          : order.paidAmount;
    } else {
      toast.error("Đơn hàng không thể thanh toán");
      return;
    }

    try {
      const res = await paymentVnpay({
        orderId: order.orderId.toString(),
        amount: amount,
      }).unwrap();

      if (res) {
        window.location.href = res;
      }
    } catch (err) {
      console.error("VNPAY error:", err);
      toast.error("Tạo thanh toán VNPay thất bại!");
    }
  };

  // thanh toán Momo
  const handleMomo = async () => {
    if (!order) return;

    let amount = 0;
    if (order.status === "CHECK_IN") {
      amount =
        order.depositTable !== 0
          ? order.paidAmount - order.depositTable
          : order.paidAmount;
    } else {
      toast.error("Đơn hàng không thể thanh toán");
      return;
    }

    try {
      const res = await momoPayment({
        orderId: order.orderId.toString(),
        amount: amount,
      }).unwrap();

      if (res && res.payUrl) {
        window.location.href = res.payUrl;
      } else {
        toast.error("Không nhận được link thanh toán từ MoMo!");
      }
    } catch (err) {
      console.error("MOMO error:", err);
      toast.error("Tạo thanh toán MoMo thất bại!");
    }
  };
  //Mở modal chọn phương thức thanh toán
  const openPaymentModal = () => {
    setPaymentType("full");
    setShowPaymentModal(true);
  };

  //Thanh toán tiền mặt
  const handleCheckoutCash = async () => {
    if (!order) return;
    if (order.status !== "CHECK_IN") {
      toast.error("Đơn hàng không thể thanh toán");
      return;
    }

    try {
      await cashPayment({ orderId: order.orderId.toString() }).unwrap();
      toast.success("Đơn hàng thanh toán thành công");
      navigate("/admin/booking");
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Thanh toán thất bại!");
    }
  };

  const handleConfirm = () => {
    switch (actionType) {
      case "CANCEL_ORDER":
        cancelOrder(order?.orderId || 0);
        break;
      case "PAY_CASH":
        handleCheckoutCash();
        break;
      default:
        break;
    }
    refetch?.();
    onClose();
    setConfirmOpen(false);
    setActionType(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setActionType(null);
  };

  const getDescription = () => {
    switch (actionType) {
      case "CANCEL_ORDER":
        return "Bạn có chắc chắn muốn hủy đặt bàn này không?";
      case "PAY_CASH":
        return "Bạn có chắc chắn muốn thanh toán bằng tiền mặt không?";
      default:
        return "";
    }
  };

  const handleAddItems = async (
    items: UpdateMenuOrderRequest[],
    newCombos: UpdateMenuOrderRequest[]
  ) => {
    try {
      const merged = [...items, ...newCombos];

      await orderMore({
        orderId: order?.orderId || 0,
        menuItem: merged,
      }).unwrap();

      await refetch();
      toast.success("Đã thêm món thành công!");
    } catch (error: any) {
      toast.error(error.data?.message ?? "Thêm món thất bại!");
    }
  };

  const handleMoveTable = async (newTableId: number) => {
    if (!order) return;
    try {
      await moveTable({
        orderId: order.orderId,
        targetTableId: newTableId,
      }).unwrap();

      toast.success(`Đã chuyển sang bàn mới thành công!`);

      onClose();
    } catch (error: unknown) {
      const err = error as FetchBaseQueryError & {
        data?: { message?: string };
      };
      toast.error(err.data?.message ?? "Chuyển bàn thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div
          className={`${config.bgColor} ${config.borderColor} relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative p-6 flex justify-between items-start">
            <div>
              <h2 className={`text-4xl font-bold ${config.color}`}>
                {table.code}
              </h2>
              <p className="text-gray-700 mt-2 text-lg font-medium">
                {table.areaName}
              </p>
              <span
                className={`inline-block text-sm px-4 py-1.5 rounded-full ${config.bgColor} ${config.color} font-semibold border-2 ${config.borderColor} mt-3`}
              >
                {config.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 bg-white/80 hover:bg-white p-2.5 rounded-xl transition-all shadow-md"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Quick Info Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white p-3 rounded-xl">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số khách</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {table.guestCount}
                  </p>
                </div>
              </div>
              {table.description && (
                <div className="text-right max-w-xs">
                  <p className="text-sm text-gray-500">Mô tả</p>
                  <p className="text-gray-800 font-medium">
                    {table.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ORDER INFO */}
          {order && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingBag className="text-blue-500" size={24} />
                Thông tin đơn hàng
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Tên đơn hàng</p>
                  <p className="text-gray-900 font-semibold">
                    {order.orderName}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                  <p className="text-gray-900 font-semibold">
                    {order.phone || "-"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Số khách</p>
                  <p className="text-gray-900 font-semibold">
                    {order.guestCount}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Thời gian đặt</p>
                  <p className="text-gray-900 font-semibold text-sm">
                    {new Date(order.reservationTime).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Thời gian kết thúc
                  </p>
                  <p className="text-gray-900 font-semibold text-sm">
                    {new Date(order.reservationEndTime).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                  <p className="text-xs text-blue-600 mb-1">Tổng tiền</p>
                  <p className="text-blue-600 font-bold text-lg">
                    {(order.totalAmount ?? "0").toLocaleString()} ₫
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border-2 border-green-200">
                  <p className="text-xs text-green-500 mb-1">Tiền cọc bàn</p>
                  <p className="text-green-900 font-semibold">
                    {(order.depositTable ?? "0").toLocaleString()} ₫
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border-2 border-green-200">
                  <p className="text-xs text-green-500 mb-1">Tiền cọc</p>
                  <p className="text-green-900 font-semibold">
                    {(order.depositAmount ?? "0").toLocaleString()} ₫
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg border-2 border-yellow-200">
                  <p className="text-xs text-yellow-600 mb-1">Còn Phải trả</p>
                  <p className="text-yellow-600 font-bold text-lg">
                    {(order.paidAmount ?? "0").toLocaleString()} ₫
                  </p>
                </div>
              </div>

              {/* Note */}
              {order.note && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg">
                  <p className="text-xs text-yellow-700 font-semibold mb-1">
                    Ghi chú:
                  </p>
                  <p className="text-gray-800">{order.note}</p>
                </div>
              )}

              {/* Danh sách món */}
              {order.orderItem.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Món đã đặt:
                  </p>
                  <div className="grid gap-2">
                    {order.orderItem.map((item, index) => {
                      const isCombo = !!item.combo;
                      return (
                        <div
                          // key={item.id}
                          key={`${item.id}-${isCombo ? "combo" : "menu"
                            }-${index}`}
                          className={`flex justify-between items-center p-3 rounded-lg ${isCombo
                            ? "bg-orange-50 border border-orange-100"
                            : "bg-gray-50"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`${isCombo ? "bg-orange-500" : "bg-blue-500"
                                } text-white text-xs font-bold px-2 py-1 rounded`}
                            >
                              x{item.quantityOnline}
                            </span>

                            {/* Icon Package nếu là Combo */}
                            {isCombo && (
                              <Package size={16} className="text-orange-600" />
                            )}

                            {/* Tên món hoặc Combo */}
                            <div className="flex flex-col">
                              <span
                                className={`font-medium ${isCombo ? "text-orange-900" : "text-gray-900"
                                  }`}
                              >
                                {isCombo
                                  ? item.combo?.name
                                  : item.menuItem?.name}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`font-semibold ${isCombo ? "text-orange-900" : "text-gray-900"
                              }`}
                          >
                            {item.priceOnline.toLocaleString()} ₫
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6">
            <p className="text-lg font-bold text-gray-800 mb-4">Chức năng</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* EMPTY */}
              {table.status === "EMPTY" && (
                <>
                  <ActionButton
                    icon={<Clock size={20} />}
                    label="Check In"
                    onClick={() => setIsOpen(true)}
                    variant="success"
                  />
                  <CreateOrderModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSubmit={handleCreateSubmit}
                    table={table}
                    menuItems={menuItems || []}
                    combos={combos || []}
                  />
                </>
              )}

              {/* RESERVED */}
              {table.status === "RESERVED" && (
                <>
                  <ActionButton
                    icon={<Clock size={20} />}
                    label="Check In"
                    onClick={() => {
                      onAction(table, "CHECK_IN", order);
                      onClose();
                    }}
                    variant="success"
                  />
                  <ActionButton
                    icon={<X size={20} />}
                    label="Hủy đặt bàn"
                    onClick={() => {
                      setActionType("CANCEL_ORDER");
                      setConfirmOpen(true);
                    }}
                    variant="danger"
                  />
                  <ConfirmDialog
                    open={confirmOpen}
                    title="Xác nhận hành động"
                    description={getDescription()}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                  />
                </>
              )}

              {/* SERVING */}
              {table.status === "SERVING" && (
                <>
                  <ActionButton
                    icon={<DollarSign size={20} />}
                    label="Thanh toán banking"
                    onClick={openPaymentModal}
                    variant="primary"
                  />
                  <ActionButton
                    icon={<DollarSign size={20} />}
                    label="Thanh toán cash"
                    onClick={() => {
                      setActionType("PAY_CASH");
                      setConfirmOpen(true);
                    }}
                    variant="warning"
                  />
                  <ConfirmDialog
                    open={confirmOpen}
                    title="Xác nhận hành động"
                    description={getDescription()}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                  />

                  <ActionButton
                    icon={<ShoppingBag size={20} />}
                    label="Gọi thêm món"
                    onClick={() => setIsAddItemsOpen(true)}
                    variant="success"
                  />

                  {/* --- NÚT MỚI: CHUYỂN BÀN --- */}
                  <ActionButton
                    icon={<ArrowRightLeft size={20} />}
                    label="Chuyển bàn"
                    onClick={() => setIsMoveTableOpen(true)}
                    variant="info"
                  />

                  <AddItemsModal
                    isOpen={isAddItemsOpen}
                    onClose={() => setIsAddItemsOpen(false)}
                    onSubmit={handleAddItems}
                  />

                  {/* Modal Chuyển bàn */}
                  <MoveTableModal
                    isOpen={isMoveTableOpen}
                    onClose={() => setIsMoveTableOpen(false)}
                    currentTable={table}
                    onConfirm={handleMoveTable}
                    tables={tables}
                  />
                </>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM PAYMENT COMPONENT */}
      {order && (
        <ConfirmPayment
          orderDetail={order}
          showPaymentModal={showPaymentModal}
          setShowPaymentModal={setShowPaymentModal}
          paymentType={paymentType}
          handlerBanking={handleVnPay}
          handlerMomo={handleMomo}
        />
      )}
    </div>
  );
}
