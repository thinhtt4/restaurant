/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
    setBookingInfo,
    addToOrder,
    updateQuantity,
    clearOrders,
    clearOrdersByMenuId,
    updateTableBooking,
    addToOrderId,
    updateComboPrice,
} from "@/store/bookingSlice";
import type {
    BookingInfo,
    CartItem,
    OrderMenu,
    UpdateTableLocalStorage,
} from "@/types/booking.type";
import {
    useCreateOrderWithInfoMutation,
    useSelectMenuOrderMutation,
} from "@/store/api/orderApi";
import { useCallback } from "react";
import { useGetAllComboQuery } from "@/store/api/comboApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useComboBooking(page = 1, pageSize = 10, searchTerm = "") {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const updateComboPriceInCart = (comboId: number, newPrice: number) => {
        dispatch(updateComboPrice({ comboId, newPrice }));
    };

    const bookingInfo = useSelector(
        (state: RootState) => state.booking.bookingInfo // Đúng
    );
    const orders = useSelector((state: RootState) => state.booking.orders); // Đúng

    // Fetch danh sách combo với search
    const {
        data: comboData,
        isLoading,
        isError,
        refetch
    } = useGetAllComboQuery({
        page: page - 1,
        pageSize,
        active: true,
        name: searchTerm || undefined, // Chỉ gửi name khi có searchTerm
    });

    const combos = comboData?.data.data ?? [];
    const totalPages = comboData?.data.totalPages ?? 1;

    // ===== ACTIONS =====

    const saveBookingInfo = (info: BookingInfo) => {
        dispatch(setBookingInfo(info));
    };

    // Thêm combo vào giỏ hàng
    const addComboToCart = (combo: any, quantity: number) => {
        const cartItem: CartItem = {
            id: combo.comboId,
            comboId: combo.comboId,
            name: combo.name,
            price: combo.finalPrice ?? 0,
            quantity: 1,
            imageUrl: combo.imageUrl,
            type: "combo",
            description: combo.description || "",
            categoryId: 0,
            categoryName: "",
            active: true,
            createdAt: combo.createdAt || new Date(),
            updatedAt: combo.updatedAt || new Date(),
        };
        console.log(quantity)
        dispatch(addToOrder(cartItem));
        toast.success(`Đã thêm combo "${combo.name}" vào giỏ hàng`);
    };

    const updateTable = (item: UpdateTableLocalStorage) => {
        dispatch(updateTableBooking(item));
    };

    // Cập nhật số lượng combo
    const updateComboCartQuantity = (comboId: number, quantity: number) => {
        dispatch(updateQuantity({
            itemId: comboId,
            quantity,
            type: "combo"
        }));
    };

    // Xóa combo khỏi giỏ hàng
    const clearComboFromCart = (comboId: number) => {
        dispatch(clearOrdersByMenuId({
            comboId,
            type: "combo"
        }));
    };

    const clearAllOrders = () => {
        dispatch(clearOrders());
    };

    // Tính tổng tiền
    const getTotalPrice = () => {
        return (orders?.cartItems || []).reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    // Lấy số lượng của combo trong giỏ
    const getComboQuantity = (comboId: number) => {
        const orderItem = orders?.cartItems.find(
            (item) => item.type === "combo" && item.comboId === comboId
        );
        return orderItem ? orderItem.quantity : 0;
    };

    // Kiểm tra combo bị inactive
    const listIdIsNotActive = useCallback(
        async (comboIds: number[]) => {
            const { data } = await refetch();
            const allCombos = data?.data.data ?? [];
            const inactiveCombos = allCombos.filter((c) => !c.active);

            return comboIds.filter((id) =>
                inactiveCombos.some((combo) => combo.comboId === id)
            );
        },
        [refetch]
    );

    // ===== API CALLS =====

    const [selectMenuOrder] = useSelectMenuOrderMutation();

    // Confirm booking chỉ combo
    const confirmComboBooking = async () => {
        try {
            const ordersLS: OrderMenu | null = JSON.parse(
                localStorage.getItem("orders") || "null"
            );

            if (!ordersLS || ordersLS.cartItems.length === 0) {
                toast.info("Không có combo nào để thêm vào order.");
                return;
            }

            const orderId = ordersLS.orderId;

            // Chỉ lấy combo items
            const comboItems = ordersLS.cartItems
                .filter((item: CartItem) => item.type === "combo" && item.comboId)
                .map((item: CartItem) => ({
                    comboId: Number(item.comboId),
                    quantityOnline: item.quantity ?? 1,
                }));

            // Lấy menu items (nếu có)
            const menuItems = ordersLS.cartItems
                .filter((item: CartItem) => item.type === "menu" || !item.type)
                .map((item: CartItem) => ({
                    menuItemId: Number(item.id),
                    quantityOnline: item.quantity ?? 1,
                }));

            if (comboItems.length === 0 && menuItems.length === 0) {
                toast.info("Không có món hoặc combo nào để thêm vào order.");
                return;
            }

            // Gửi request với cả combo và menu
            await selectMenuOrder({
                orderId,
                menuItem: menuItems,
                ...(comboItems.length > 0 ? { comboItem: comboItems } : {}),
            }).unwrap();

            toast.success("Thông tin đơn hàng được lưu thành công");

            // Clear giỏ hàng sau khi thành công
            clearAllOrders();
            navigate("/app/order-success");

        } catch (error: any) {
            console.error(error);

            toast.error("Cập nhật đơn hàng thất bại, vui lòng thử lại!");
        }
    };

    const [createOrderWithInfo] = useCreateOrderWithInfoMutation();

    // Confirm booking với thông tin bàn
    const confirmComboBookingWithInfo = async () => {
        try {
            const bookingInfoLS = JSON.parse(
                localStorage.getItem("bookingInfo") || "{}"
            );
            const bookingTableLS = JSON.parse(
                localStorage.getItem("bookingTable") || "{}"
            );

            const orderData = {
                orderName: bookingInfoLS.orderName,
                phone: bookingInfoLS.phone,
                tableId: bookingTableLS.selectedTableAvailable.id,
                guestCount: bookingTableLS.tableFilter.guestCount ?? 1,
                reservationTime:
                    bookingTableLS.tableFilter.reservationTime ??
                    new Date().toISOString(),
                note: bookingInfoLS.note ?? "",
            };

            const response = await createOrderWithInfo(orderData).unwrap();

            dispatch(addToOrderId(response.data.orderId));
            toast.success("Đặt bàn thành công! Cảm ơn bạn đã sử dụng dịch vụ.");

            return response.data.orderId;

        } catch (error) {
            toast.error("Đặt bàn thất bại, vui lòng thử lại!");
            navigate("/app/home");
            throw error;
        }
    };

    function formatDateTime(timestamp: string | number) {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "Vui lòng chọn đủ ngày và giờ";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }

    return {
        // Data
        bookingInfo,
        orders,
        combos,
        totalPages,
        isLoading,
        isError,

        // Actions
        setBookingInfo: saveBookingInfo,
        addComboToCart,
        updateComboCartQuantity,
        clearComboFromCart,
        clearAllOrders,
        getTotalPrice,
        getComboQuantity,
        listIdIsNotActive,
        confirmComboBooking,
        confirmComboBookingWithInfo,
        updateTable,
        formatDateTime,
        updateComboPriceInCart,

        // Refetch
        refetch,
    };
}