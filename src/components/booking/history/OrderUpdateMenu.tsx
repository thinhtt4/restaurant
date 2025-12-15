/* eslint-disable @typescript-eslint/no-explicit-any */
import { useHistoryOrder } from "@/hooks/useHistoryOrder";
import { useMenuCategories } from "@/hooks/useMenuCategories";
import { useMenuItems } from "@/hooks/useMenuItems";
import type { OrderItem } from "@/types/booking.type";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetAllComboQuery } from "@/store/api/comboApi";
import { socket } from "@/hooks/socket";

const OrderUpdateMenu = () => {
  const {
    selectedOrder,
    closeModalUpdateMenu,
    showOrderUpdateMenu,
    orderItems,
    handlerUpdateQuantity,
    handlerAddMenuToOrder,
    handlerAddComboToOrder,
    handleRemoveOrderItem,
    handleRemoveComboItem,
    menuItemsIdAdded,
    comboIdAdded,
    handlerUpdateOrderItem,
  } = useHistoryOrder();
  // Fetch danh sách combo
  const { data: comboData, refetch } = useGetAllComboQuery({
    page: 0,
    pageSize: 100,
    active: true,
  });
  useEffect(() => {
    if (!socket) return;
    socket.on("combo_update", refetch);


    return () => {
      socket.off("combo_update", refetch);

    };
  }, [socket, refetch]);

  const [currentcategoryId, setCurrentCategoryId] = useState<number>(1);

  const { categories } = useMenuCategories();
  const { menuItemsState, setCategoryId } = useMenuItems();
  // const menuItemsAdd = menuItemsState.filter(
  //   (menuItem) =>
  //     !menuItemsIdAdded.some((added) => added?.id === menuItem.id) &&
  //     menuItem.active &&
  //     menuItem.categoryId === currentcategoryId
  // );
  const formatVND = (amount: number | undefined) => {
    if (amount == null) return "0₫";
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handlerClickCategory = (categoryId: number) => {
    setShowCombo(false); // quay lại chế độ menu
    setCategoryId(categoryId);
    setCurrentCategoryId(categoryId);
  };

  const handlerCloseModalUpdateMeny = () => {
    closeModalUpdateMenu();
    setCurrentCategoryId(1);
  };

  const getItemName = (item: OrderItem) => {
    return item.menuItem?.name || "N/A";
  };

  const getItemPrice = (item: OrderItem) => {
    return item.menuItem?.price;
  };

  // const getItemId = (item: OrderItem) => {
  //   return item.menuItem?.id || item.combo?.comboId;
  // };

  const isComboItem = (item: OrderItem) => {
    return item.menuItem === null || item.menuItem === undefined;
  };
  const [showCombo, setShowCombo] = useState(false);

  const renderComboItem = (item: OrderItem) => {
    if (!item.combo?.comboItems || item.combo?.comboItems.length === 0)
      return null;

    return (
      <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded border-l-4 border-orange-400">
        <p className="text-xs font-semibold text-orange-700 mb-2">
          Chi tiết combo:
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          {item.combo.comboItems.map((comboItem: any, idx: number) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>
                {comboItem.menuItem?.name ?? "Món"}{" "}
                {comboItem.quantity && comboItem.quantity >= 1
                  ? `x${comboItem.quantity}`
                  : ""}
                {comboItem.price && ` (${formatVND(comboItem.price)})`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      {showOrderUpdateMenu && (
        <>
          <div className="fixed inset-0 bg-slate-800/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
              <div className="bg-white border-b border-gray-200 p-6 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Yêu cầu thay đổi món ăn
                </h2>
                <button
                  onClick={() => handlerCloseModalUpdateMeny()}
                  className="hover:bg-gray-100 rounded-full p-2 transition"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Items List */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Món đã chọn
                  </h3>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Tổng số tiền hiện tại:{" "}
                    {formatVND(selectedOrder?.totalAmount)}
                  </h3>
                  <div className="space-y-3"></div>

                  {orderItems.map((item: OrderItem, index: number) => (
                    <div key={item.orderItemId ?? `orderItem-${index}`}>
                      {isComboItem(item) ? (
                        // Combo Item
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-l-4 border-orange-400">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                                  {item?.combo?.name || "Combo"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {formatVND(item.priceOnline)}
                              </p>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handlerUpdateQuantity(
                                    item.orderItemId ?? 0,
                                    item.quantityOnline - 1
                                  )
                                }
                                className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantityOnline}
                                onChange={(e) =>
                                  handlerUpdateQuantity(
                                    item.orderItemId ?? 0,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-12 h-8 text-center border border-gray-300 rounded"
                                min="1"
                              />
                              <button
                                onClick={() =>
                                  handlerUpdateQuantity(
                                    item.orderItemId ?? 0,
                                    item.quantityOnline + 1
                                  )
                                }
                                className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>

                            <div className="w-24 text-right">
                              <p className="font-semibold text-orange-600">
                                {formatVND(
                                  item.priceOnline * item.quantityOnline
                                )}
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                handleRemoveComboItem(item?.combo?.comboId)
                              }
                              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 whitespace-nowrap"
                            >
                              XÓA
                            </button>
                          </div>

                          {/* Combo Details */}
                          {renderComboItem(item)}
                        </div>
                      ) : (
                        // Regular Menu Item
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {getItemName(item)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatVND(getItemPrice(item))}
                              </p>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handlerUpdateQuantity(
                                    item.orderItemId ?? 0,
                                    item.quantityOnline - 1
                                  )
                                }
                                className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantityOnline}
                                onChange={(e) =>
                                  handlerUpdateQuantity(
                                    item.orderItemId ?? 0,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-12 h-8 text-center border border-gray-300 rounded"
                                min="1"
                              />
                              <button
                                onClick={() =>
                                  handlerUpdateQuantity(
                                    item.orderItemId ?? 0,
                                    item.quantityOnline + 1
                                  )
                                }
                                className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>

                            <div className="w-24 text-right">
                              <p className="font-semibold text-gray-800">
                                {formatVND(
                                  item.priceOnline * item.quantityOnline
                                )}
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                handleRemoveOrderItem(item?.menuItem?.id)
                              }
                              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                            >
                              XÓA
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Thêm món mới
                  </h3>

                  {/* Category Filter */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {categories.map((category) => (
                      <button
                        key={category.categoryId}
                        onClick={() => {
                          setShowCombo(false);
                          handlerClickCategory(category.categoryId ?? 0);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentcategoryId === category.categoryId &&
                          !showCombo
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                      >
                        {category.name}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setShowCombo(true);
                        setCategoryId(-1); // hoặc -1 đều được
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${showCombo
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      Combo
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                  {showCombo
                    ? comboData?.data.data
                      .filter(
                        (combo) =>
                          // Thêm filter này để ẩn combo đã được thêm
                          !comboIdAdded.some(
                            (added) => added?.comboId === combo.comboId
                          )
                      )
                      .map((combo) => (
                        <div
                          key={combo.comboId}
                          className="flex items-center gap-4 p-3 bg-white rounded border border-gray-200"
                        >
                          {/* Thông tin món */}
                          <div className="flex-1">
                            <h3 className="text-lg mb-1">
                              {combo.name}
                            </h3>
                            <p className="text-primary font-bold">
                              {formatVND(combo.finalPrice)}
                            </p>
                          </div>

                          {/* Ảnh món */}
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              src={combo.imageUrl}
                              alt={combo.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>

                          <button
                            onClick={() => handlerAddComboToOrder(combo)}
                            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm font-medium flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Thêm
                          </button>
                        </div>
                      ))
                    : menuItemsState
                      .filter(
                        (menuItem) =>
                          !menuItemsIdAdded.some(
                            (added) => added?.id === menuItem.id
                          ) &&
                          menuItem.active &&
                          menuItem.categoryId === currentcategoryId
                      )
                      .map((menuItem) => (
                        <div
                          key={menuItem.id}
                          className="flex items-center gap-4 p-3 bg-white rounded border border-gray-200"
                        >
                          {/* Thông tin món */}
                          <div className="flex-1">
                            <h3 className="f==text-lg mb-1">
                              {menuItem.name}
                            </h3>
                            <p className="text-primary font-bold">
                              {formatVND(menuItem.price)}
                            </p>
                          </div>

                          {/* Ảnh món */}
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              src={menuItem.imageUrl}
                              alt={menuItem.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>

                          <button
                            onClick={() => handlerAddMenuToOrder(menuItem)}
                            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm font-medium flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Thêm
                          </button>
                        </div>
                      ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
                <button
                  onClick={() => handlerCloseModalUpdateMeny()}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  ĐÓNG
                </button>
                <button
                  onClick={handlerUpdateOrderItem}
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
                >
                  GỬI YÊU CẦU
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderUpdateMenu;
