import { ChevronUp } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import TableBookingInfo from "@/components/booking/menu/TableBookingInfo";
import { OrderConfirm } from "@/components/booking/confirm/OrderConfirm";
import { socket } from "@/hooks/socket";
import { toast } from "sonner";
import { useEffect } from "react";
import type { MenuItem } from "@/types/menuItem.type";
import { useMenuItems } from "@/hooks/useMenuItems";

export default function ConfirmationBooking() {
  const { refetchMenuItems, menuItemRefetch } = useMenuItems();

  const { orders, bookingInfo, clearItemFromCart, updateItemPriceInCart } =
    useBooking();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket) return;

    const handlerUpdateMenu = async () => {
      console.log("Menu updated from manager");
      refetchMenuItems();

      const { data: menuItemdata } = await menuItemRefetch();

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

   if (!bookingInfo) {
    return <TableBookingInfo bookingInfo={bookingInfo}></TableBookingInfo>;
  }
  return (
    <div className="min-h-screen bg-gray-50  mt-18">
      <div className="flex flex-col lg:flex-row">
        {/* Menu Items */}
        {/* Sidebar */}
        
        <TableBookingInfo bookingInfo={bookingInfo}></TableBookingInfo>

        {/* Main Content */}
        <OrderConfirm />
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
}
