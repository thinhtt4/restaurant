import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import {
  useCanceledOrderMutation,
  useGetListOrderQuery,
  useUpdateMenuOrderMutation,
} from "@/store/api/orderApi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  closeModal,
  closeUpdateMenu,
  selectOrder,
  selectUpdateMenu,
  setOrders,
  updateOrderStatus,
} from "@/store/bookingHistorySlice";
import type {
  OrderItem,
  OrderResponse,
  UpdateMenuOrderRequest,
} from "@/types/booking.type";
import type { MenuItem } from "@/types/menuItem.type";
import { toast } from "sonner";
import type { Combo, ComboResponse } from "@/types/combo.type";

export function useHistoryOrder(defaultPage = 1, defaultSize = 5) {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, showModalDetail, showOrderUpdateMenu, selectedOrder } =
    useSelector((state: RootState) => state.bookingHistory);
  // History booking
  const { data: listOrders, refetch: listOrderRefetch } =
    useGetListOrderQuery();

  //cãi này gán giá trị cho orders
  useEffect(() => {
    if (listOrders?.data.data) dispatch(setOrders(listOrders?.data.data));
  }, [listOrders]);

  useEffect(() => {
    listOrderRefetch();
  }, [listOrderRefetch]);

  const [status, setStatus] = useState<string>("All");
  const [keyword, setKeyword] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("0");
  const [maxPrice, setMaxPrice] = useState<string>("100000000");
  const debouncedKeyword = useDebounce(keyword, 300);

  const [size] = useState<number>(defaultSize);
  const [page, setPage] = useState<number>(defaultPage);
  const [sort] = useState<string>("");

  const query = useGetListOrderQuery({
    keyword: debouncedKeyword,
    status,
    minPrice,
    maxPrice,
    page,
    size,
    sort,
  });

  const searchKeyword = useCallback((key: string) => setKeyword(key), []);
  const goToPage = useCallback((page: number) => setPage(page), []);
  const searchStatus = useCallback((s: string) => setStatus(s), []);
  const searchMinPrice = useCallback((d: string) => setMinPrice(d), []);
  const searchMaxPrice = useCallback((d: string) => setMaxPrice(d), []);

  const [canceledOrder] = useCanceledOrderMutation();

  const handleCancel = async (orderId: number) => {
    try {
      const res = await canceledOrder(orderId).unwrap(); // Gọi API
      toast.success(res.message || "Hủy order thành công");

      if (selectedOrder) {
        console.log("asflasfhashf ");
        dispatch(
          updateOrderStatus({
            orderId: selectedOrder.orderId,
            status: "CANCELLED",
          })
        );
      }

      dispatch(closeModal());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // err.data chứa thông tin lỗi từ backend (thường là JSON)
      const message = err?.data?.message || err?.error || "Hủy order thất bại";
      toast.error(message);
      console.error("Backend error:", err);
    }
  };


  const closeModalDetail = () => {
    dispatch(closeModal());
  };

  // BẬT - LƯU
  const selectedOrderDetail = (order: OrderResponse) => {
    dispatch(selectOrder(order));
  };

  const closeModalUpdateMenu = () => {
    dispatch(closeUpdateMenu());
  };

  //BẬT menu update
  const showUpdateOrderMenu = (order: OrderResponse) => {
    dispatch(selectUpdateMenu(order));
  };

  // UPDATE MENU TRONG MODEL
  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    selectedOrder?.orderItem || []
  );

  // Gán những cái thằng mà được thêm vào order
  const [menuItemsIdAdded, setMenuItemsIdAdded] = useState<MenuItem[]>([]);
  const [comboIdAdded, setComboIdAdded] = useState<Combo[]>([]);
  // Phải render lại vì lần đầu cái orderItems có thể là []

  const [updateMenuOrder] = useUpdateMenuOrderMutation();

  useEffect(() => {
    if (!selectedOrder?.orderItem?.length) return;

    const menuItems = selectedOrder.orderItem
      .map((item) => item.menuItem)
      .filter((m): m is MenuItem => m !== undefined);

    const combos = selectedOrder.orderItem
      .map((item) => item.combo)
      .filter((c): c is ComboResponse => c !== undefined);

    setMenuItemsIdAdded(menuItems);
    setComboIdAdded(combos);

    const orderItemsWithSelected = selectedOrder.orderItem.map((item) => ({
      ...item,
      selected: true,
    }));

    setOrderItems(orderItemsWithSelected);
  }, [selectedOrder?.orderItem]); // chỉ phụ thuộc orderItem

  // Chỉnh số lượng mớn hiện tại trong order
  const handlerUpdateQuantity = (
    orderItemId: number,
    quantityOnline: number
  ) => {
    setOrderItems((prev) =>
      (prev ?? []).map((item) =>
        item.orderItemId === orderItemId && item.selected
          ? { ...item, quantityOnline: Math.max(quantityOnline, 1) }
          : item
      )
    );
  };

  //THÊM món vào order hiện tại
  const handlerAddMenuToOrder = (menuItem: MenuItem) => {
    if (!menuItem) {
      return;
    }
    const existingItem = menuItemsIdAdded.find(
      (item) => item && item.id === menuItem.id
    );

    if (existingItem) {
      setOrderItems((prev) =>
        prev.map((item) =>
          item.menuItem?.id === menuItem.id
            ? { ...item, quantityOnline: item.quantityOnline + 1 }
            : item
        )
      );
    } else {
      setMenuItemsIdAdded((prev) => [...prev, menuItem]);
      const newOrderItem: OrderItem = {
        orderItemId: Date.now(),
        orderId: selectedOrder?.orderId ?? 0,
        menuItem: menuItem,
        quantityOnline: 1,
        priceOnline: menuItem.price,
        quantityOffline: 0,
        priceOffline: null,
        selected: true,
      };
      setOrderItems((prev) => [...prev, newOrderItem]);
    }
  };
  //THÊM combo vào order hiện tại
  const handlerAddComboToOrder = (combo: ComboResponse) => {
    if (!combo) {
      return;
    }

    const existingCombo = comboIdAdded.find(
      (item) => item && item.comboId === combo.comboId
    );

    if (existingCombo) {
      setOrderItems((prev) =>
        prev.map((item) =>
          item.combo?.comboId === combo.comboId
            ? { ...item, quantityOnline: item.quantityOnline + 1 }
            : item
        )
      );
    } else {
      setComboIdAdded((prev) => [...prev, combo]);
      const newOrderItem: OrderItem = {
        orderItemId: Date.now(),
        orderId: selectedOrder?.orderId ?? 0,
        combo: combo,
        quantityOnline: 1,
        priceOnline: combo.finalPrice,
        quantityOffline: 0,
        priceOffline: null,
        selected: true,
      };
      setOrderItems((prev) => [...prev, newOrderItem]);
    }
  };

  const handleRemoveOrderItem = (menuItemId: number | undefined) => {
    // Xóa khỏi cái order cần update (khung ở trên)
    setOrderItems((prev) =>
      prev.filter((orderItem) => orderItem?.menuItem?.id !== menuItemId)
    );
    setMenuItemsIdAdded((prev) =>
      prev.filter((menuItem) => menuItem && menuItem.id !== menuItemId)
    );
  };

  const handleRemoveComboItem = (comboItemId: number | undefined) => {
    // Xóa khỏi cái order cần update (khung ở trên)
    setOrderItems((prev) =>
      prev.filter((orderItem) => {
        return orderItem?.combo?.comboId !== comboItemId;
      })
    );

    setComboIdAdded((prev) =>
      prev.filter((combo) => combo && combo.comboId != comboItemId)
    );
  };

  const handlerUpdateOrderItem = async () => {
    try {
      if (!selectedOrder) return;

      // map payload ngay lúc gửi, dùng orderItems hiện tại
      const menuItemPayload: UpdateMenuOrderRequest[] = orderItems.map(
        (orderItem) => ({
          menuItemId: orderItem?.menuItem?.id,
          quantityOnline: orderItem.quantityOnline || 0,
          comboId: orderItem?.combo?.comboId,
        })
      );

      const response = await updateMenuOrder({
        orderId: selectedOrder.orderId,
        menuItem: menuItemPayload,
      }).unwrap();

      toast.success("Cập nhật order thành công!");
      query.refetch();
      dispatch(selectOrder(response.data));
      closeModalUpdateMenu();
      closeModalDetail();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const code = err?.data?.code ?? err?.code ?? err?.status ?? null;
      const message =
        err?.data?.message ?? err?.error ?? "Cập nhật order thất bại";

      if (String(code) === "1111") {
        toast.error(
          `Tổng giá trị món thay đổi không được vượt quá 50% giá hiện tại ${selectedOrder?.totalAmount} đ`
        );
      } else if (String(code) === "1112") {
        toast.error(
          `Không được giảm giá với tiền ban đầu ${selectedOrder?.totalAmount} đ`
        );
      } else {
        toast.error(message);
      }

      const originalItems = (selectedOrder?.orderItem ?? []).map((it) => ({
        ...it,
        selected: true,
      }));
      setOrderItems(originalItems);

      setMenuItemsIdAdded(
        (selectedOrder?.orderItem ?? [])
          .map((it) => it.menuItem)
          .filter((m): m is MenuItem => m !== undefined)
      );
    }
  };

  return {
    page,
    size,
    keyword,
    sort,
    status,
    minPrice,
    maxPrice,
    orders,
    showModalDetail,
    showOrderUpdateMenu,
    selectedOrder,

    data: query.data,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,

    searchKeyword,
    goToPage,
    searchStatus,
    searchMinPrice,
    searchMaxPrice,
    handleCancel,

    //Modal
    closeModalDetail,
    selectedOrderDetail,

    showUpdateOrderMenu,
    closeModalUpdateMenu,

    //UPDATE ORDER MENU
    orderItems, // Cái item đang được chọn để thay đổi ấ
    handlerUpdateQuantity,
    handlerAddMenuToOrder,
    handlerAddComboToOrder,

    menuItemsIdAdded, // Lưu để filter
    comboIdAdded,
    handleRemoveOrderItem,
    handleRemoveComboItem,
    handlerUpdateOrderItem,
  };
}
