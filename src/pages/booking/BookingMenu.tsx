import { ChevronUp, Search, Sparkles } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import TableBookingInfo from "@/components/booking/menu/TableBookingInfo";
import CategoryFilter from "@/components/booking/menu/CategoryFilter";
import BookingMenuItems from "@/components/booking/menu/BookingMenuItems";
import ChooseMenuItems from "@/components/booking/menu/ChooseMenuItems";
import { useEffect, useState } from "react";
import { useMenuCategories } from "@/hooks/useMenuCategories";
import { useMenuItems } from "@/hooks/useMenuItems";
import PaginationControls from "@/components/ui/PaginationControls";
import { useComboBooking } from "@/hooks/useComboBooking";
import ComboCard from "@/components/booking/combo/ComboCard";
import { socket } from "@/hooks/socket";
import { toast } from "sonner";
import type { Combo } from "@/types/combo.type";
import type { MenuItem } from "@/types/menuItem.type";

export default function BookingMenu() {
  const { bookingInfo, clearItemFromCart, updateItemPriceInCart } =
    useBooking();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { categories: listCategory } = useMenuCategories();
  const {
    menuItemsState,
    // categories,
    setSearch,
    setCategoryId,
    setActive,
    handlePageChange,
    refetchMenuItems,
    menuItemRefetch,
    handlePriceFilter,
    currentPage,
    totalPages,
    isLoading,
  } = useMenuItems();

  useEffect(() => {
    setActive(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handlerUpdateMenu = async () => {
      refetchMenuItems();

      const { data: menuItemdata } = await menuItemRefetch();
      toast.info(`Danh sách món ăn đã được cập nhật!!`, { duration: 5000 });

      if (!menuItemdata?.data) return;

      const activeMenuItems = menuItemdata.data;

      // Lọc các món đang có trong giỏ
      const itemsInCart =
        orders?.cartItems?.filter((item) => item.type === "menu") || [];

      itemsInCart.forEach((cartItem) => {
        const itemId = cartItem.id;

        // Tìm món mới nhất
        const updatedItem = activeMenuItems.find(
          (item: MenuItem) => item.id === itemId
        );

        if (!updatedItem) {
          clearItemFromCart(itemId!);
          toast.warning(
            `Món "${cartItem.name}" đã bị xóa khỏi giỏ hàng do không còn khả dụng`
          );
        } else {
          const newPrice = updatedItem.price ?? 0;
          const oldPrice = cartItem.price;

          // Nếu giá thay đổi → update + thông báo
          if (newPrice !== oldPrice) {
            updateItemPriceInCart(itemId!, newPrice);

            toast.info(
              `Giá món "${
                cartItem.name
              }" đã được cập nhật từ ${oldPrice.toLocaleString()}đ sang ${newPrice.toLocaleString()}đ`,
              { duration: 5000 }
            );
          }
        }
      });
    };

    socket.on("update_menu", handlerUpdateMenu);

    return () => {
      socket.off("update_menu", handlerUpdateMenu);
    };
  }, [
    socket,
    menuItemRefetch,
    refetchMenuItems,
    clearItemFromCart,
    updateItemPriceInCart,
  ]);

  const [comboPage, setComboPage] = useState(1);
  const [comboSearchTerm, setComboSearchTerm] = useState("");

  const {
    combos,
    orders,
    isLoading: isLoadingCombos,
    totalPages: comboPotalPages,
    refetch: refetchCombos,
    clearComboFromCart,
    updateComboPriceInCart,
  } = useComboBooking(comboPage, 6, comboSearchTerm);

  // Combo update socket listener với auto-remove inactive combos và update price
  useEffect(() => {
    if (!socket) return;

    const handlerUpdateCombo = async () => {
      console.log("Combo updated from manager");

      // Refetch để lấy danh sách combo mới nhất
      const { data } = await refetchCombos();

      if (!data?.data?.data) return;

      const activeCombos = data.data.data;
      // const activeComboIds = activeCombos.map((combo: any) => combo.comboId);

      // Kiểm tra các combo trong giỏ hàng
      const comboItemsInCart =
        orders?.cartItems?.filter((item) => item.type === "combo") || [];

      comboItemsInCart.forEach((cartItem) => {
        const comboId = cartItem.comboId;

        // Tìm combo mới nhất từ API
        const updatedCombo = activeCombos.find(
          (combo: Combo) => combo.comboId === comboId
        );

        if (!updatedCombo) {
          clearComboFromCart(comboId!);
          toast.warning(
            `Combo "${cartItem.name}" đã bị xóa khỏi giỏ hàng do không còn khả dụng`
          );
        } else {
          const newPrice = updatedCombo.finalPrice ?? 0;
          const oldPrice = cartItem.price;

          if (newPrice !== oldPrice) {
            updateComboPriceInCart(comboId!, newPrice);

            toast.info(
              `Giá combo "${
                cartItem.name
              }" đã được cập nhật từ ${oldPrice.toLocaleString()}đ sang ${newPrice.toLocaleString()}đ`,
              { duration: 5000 }
            );
          }
        }
      });
    };

    socket.on("combo_update", handlerUpdateCombo);

    return () => {
      socket.off("combo_update", handlerUpdateCombo);
    };
  }, [
    socket,
    orders,
    refetchCombos,
    orders,
    clearComboFromCart,
    updateComboPriceInCart,
  ]);

  // Scroll lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [viewMode, setViewMode] = useState("items");

  return (
    <div className="min-h-screen bg-gray-50 mt-18">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        {bookingInfo && (
          <TableBookingInfo
            bookingInfo={bookingInfo}
            onCollapseChange={setIsSidebarCollapsed}
          />
        )}

        {/* Main Content với margin-left động */}
        <div
          className={`flex-1 p-6 transition-all duration-300 ${
            isSidebarCollapsed ? "lg:ml-14" : "lg:ml-80 xl:ml-96"
          }`}
        >
          <div className="mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex gap-2">
              <button
                onClick={() => setViewMode("items")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  viewMode === "items"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Chọn món lẻ
              </button>
              <button
                onClick={() => setViewMode("combos")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  viewMode === "combos"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Sparkles size={20} />
                Combo tiết kiệm
              </button>
            </div>
          </div>

          {/* Content based on view mode */}
          {viewMode === "items" ? (
            <div>
              <div className="flex-1">
                {/* Filter Tabs */}
                <CategoryFilter
                  handlePriceFilter={handlePriceFilter}
                  setSearch={setSearch}
                  categories={listCategory}
                  setCategoryId={setCategoryId}
                />

                {/* Menu Items */}
                <BookingMenuItems filteredItems={menuItemsState} />

                {!isLoading && (
                  <div className="flex justify-center mt-4">
                    <PaginationControls
                      page={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Sparkles size={24} className="text-orange-500" />
                Combo Tiết Kiệm
              </h2>
              {/* Combo Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm combo..."
                    value={comboSearchTerm}
                    onChange={(e) => {
                      setComboSearchTerm(e.target.value);
                      setComboPage(1); // Reset về trang 1 khi search
                    }}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {isLoadingCombos ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
              ) : combos.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {combos.map((combo) => (
                      <ComboCard key={combo.comboId} combo={combo} />
                    ))}
                  </div>

                  {comboPotalPages > 1 && (
                    <div className="flex justify-center mt-4">
                      <PaginationControls
                        page={comboPage}
                        totalPages={comboPotalPages}
                        onPageChange={(newPage) => {
                          setComboPage(newPage);
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Không có combo nào khả dụng
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Selected Items */}
          <ChooseMenuItems />
        </div>
      </div>

      {/* Scroll to Top Button - điều chỉnh vị trí */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300 ${
          isSidebarCollapsed ? "left-20" : "left-[22rem] xl:left-[26rem]"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
}
