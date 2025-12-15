import type { ComboItem, ComboItemResponse } from "@/types/combo.type";
import type { MenuItem } from "@/types/menuItem.type";
import { useState, useEffect } from "react";

interface ComboItemModalProps {
  title: string;
  comboItems: ComboItemResponse[];  // từ backend
  menuItems: MenuItem[];            // danh sách menu
  comboId: number;                  // thêm comboId để khi gửi request chuẩn hơn
  onSave: (items: ComboItem[]) => void;
  onClose: () => void;
}

export default function ComboItemModal({
  title,
  comboItems,
  menuItems,
  comboId,
  onSave,
  onClose
}: ComboItemModalProps) {
  const [localItems, setLocalItems] = useState<ComboItem[]>([]);

  // Lấy danh sách category có món active
  const categories = Array.from(
    //   new Set(menuItems.filter(m => m.isActive).map(m => m.categoryName))
    new Set(menuItems.map(m => m.categoryName))
  ).sort((a, b) => a.localeCompare(b));

  const [activeCategory, setActiveCategory] = useState(categories[0] || "");

  useEffect(() => {
    const merged: ComboItem[] = menuItems.map(menu => {
      const exist = comboItems.find(ci => ci.menuItemId === menu.id);

      return {
        comboItemId: exist?.comboItemId,
        comboId: comboId,
        menuItemId: menu.id,
        quantity: exist?.quantity ?? 0
      };
    });

    setLocalItems(merged);
  }, [comboItems, menuItems, comboId]);


  const handleQuantityChange = (menuItemId: number, qty: number) => {
    setLocalItems(prev =>
      prev.map(ci =>
        ci.menuItemId === menuItemId
          ? { ...ci, quantity: qty }
          : ci
      )
    );
  };

  const handleSave = () => {
    // const itemsToSave = localItems.filter(ci => ci.quantity > 0);
    const itemsToSave = localItems;
    onSave(itemsToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[80%] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {/* Tabs category */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-3 py-1 rounded ${activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
                }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bảng món */}
        <table className="w-full table-fixed border ">

          <colgroup>
            <col className="w-2/6" />  {/* Tên món */}
            <col className="w-2/12" /> {/* Giá */}
            <col className="w-2/12" /> {/* Ảnh */}
            <col className="w-2/12" /> {/* Trạng thái */}
            <col className="w-2/12" /> {/* Danh mục */}
            <col className="w-2/12" /> {/* Số lượng */}
          </colgroup>

          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">Tên món</th>
              <th className="px-3 py-2">Giá</th>
              <th className="px-3 py-2">Ảnh</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Danh mục</th>
              <th className="px-3 py-2">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {localItems
              .filter(ci => {
                const menu = menuItems.find(m => m.id === ci.menuItemId);
                // return menu?.isActive && menu.categoryName === activeCategory;
                return menu?.categoryName === activeCategory;
              })
              .map(ci => {
                const menu = menuItems.find(m => m.id === ci.menuItemId)!;
                return (
                  <tr key={ci.menuItemId} className="border-b">
                    <td className="px-3 py-2 text-center align-middle">{menu.name}</td>
                    <td className="px-3 py-2 text-center align-middle">{menu.price}</td>
                    <td className="px-3 py-2 text-center align-middle">
                      <img src={menu.imageUrl} className="w-12 h-12 object-cover mx-auto" />
                    </td>
                    <td className={`px-3 py-2 text-center align-middle ${menu.active ? "text-green-600" : "text-red-600"}`}>
                      {menu.active ? "Hoạt động" : "Tạm dừng"}
                    </td>
                    <td className="px-3 py-2 text-center align-middle">{menu.categoryName}</td>
                    <td className="px-3 py-2 text-center align-middle">
                      <input
                        type="number"
                        min={0}
                        value={ci.quantity}
                        onChange={(e) =>
                          handleQuantityChange(ci.menuItemId, Number(e.target.value))
                        }
                        className="border px-2 py-1 w-16"
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">Lưu</button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Hủy</button>
        </div>
      </div>
    </div>
  );
}