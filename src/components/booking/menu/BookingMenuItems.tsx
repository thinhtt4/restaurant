import { useBooking } from "@/hooks/useBooking";
import type { MenuItem } from "@/types/menuItem.type";

interface BookingMenuItemForm {
  filteredItems: MenuItem[];
}
const BookingMenuItems = ({ filteredItems }: BookingMenuItemForm) => {
  const { orders, addToCart, updateCartQuantity } = useBooking();

  const getItemQuantity = (id: number, type: "menu" | "combo") => {
    const orderItem = orders?.cartItems.find(
      (item) =>
        item.type === type &&
        (type === "menu" ? item.id === id : item.comboId === id)
    );
    return orderItem ? orderItem.quantity : 0;
  };

  // Thêm món vào giỏ
  const handleIncrease = (item: MenuItem) => {
    addToCart({
      ...item,
      quantity: 1,
      type: "menu",
    });
  };

  // Giảm số lượng món trong giỏ
  const handleDecrease = (id: number) => {
    const quantity = getItemQuantity(id, "menu");
    updateCartQuantity(id, quantity - 1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {filteredItems.map((item: MenuItem) => {
        const quantity = getItemQuantity(item.id, "menu");

        return (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {item.name}
              </h3>
              <p className="text-amber-500 font-bold mb-3">
                {item.price.toLocaleString("vi-VN")} ₫
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleDecrease(item.id)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    disabled={quantity === 0}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(item)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingMenuItems;
