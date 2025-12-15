/* eslint-disable @typescript-eslint/no-explicit-any */
import { comboItemApi, useGetAllMenuItemQuery } from "@/store/api/comboItemMenuApi";
import type { ComboItem, ComboItemResponse } from "@/types/combo.type";
import { useState } from "react";
import { toast } from "sonner";

export function useComboItemSearchManager(comboId: number) {
  const [creatingItem, setCreatingItem] = useState(false);

  const { data: comboItemData, isLoading, isError, refetch } =
    comboItemApi.useGetComboItemsByComboIdQuery(comboId, { skip: !comboId });

  const { data: menuData } = useGetAllMenuItemQuery();
  const comboItems: ComboItemResponse[] = comboItemData?.data ?? [];
  const menuItems = menuData?.data ?? [];

  const storedCombo = localStorage.getItem("selectedComboForManager");
  const comboInfo = storedCombo ? JSON.parse(storedCombo) : null;

  const [addComboItem] = comboItemApi.useAddComboItemMutation();
  const [deleteComboItem] = comboItemApi.useDeleteComboItemMutation();
  const [deleteAllComboItems] = comboItemApi.useDeleteAllComboItemsMutation();
  const [updateComboItem] = comboItemApi.useUpdateComboItemMutation();

  // Lưu combo item (cập nhật + thêm mới)
  const handleCreateComboItem = async (items: ComboItem[]) => {
    if (!items || items.length === 0) return;

    try {
      await addComboItem(items).unwrap();
      toast.success("Cập nhật combo item thành công!");
      setCreatingItem(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Cập nhật combo item thất bại!");
    }
  };

  const handleDeleteComboItemById = async (id: number) => {
    try {
      await deleteComboItem(id).unwrap();
      toast.success("Xóa combo item thành công!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Xóa thất bại!");
    }
  };

  const handleDeleteAllComboItems = async () => {
    try {
      await deleteAllComboItems(comboId).unwrap();
      toast.success("Đã xóa toàn bộ món trong combo!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Xóa tất cả thất bại!");
    }
  };

  const handleUpdateComboItem = async (item: ComboItem) => {
    try {
      await updateComboItem(item).unwrap();
      toast.success("Cập nhật số lượng thành công!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Cập nhật thất bại!");
    }
  };


  return {
    comboItems,
    menuItems,
    creatingItem,
    isLoading,
    isError,
    comboInfo,

    setCreatingItem,
    handleCreateComboItem,
    handleDeleteComboItemById,
    handleDeleteAllComboItems,
    handleUpdateComboItem,
    refetch,
  };
}