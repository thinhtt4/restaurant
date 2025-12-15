/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { Voucher } from "@/types/voucher.type";
import {
  useGetAllVoucherQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useToggleVoucherActiveMutation,
  useDeleteVoucherMutation,
  useGetVoucherByUserQuery,
} from "@/store/api/voucherApi";
import { toast } from "sonner";

export function useVoucherManager(initialPage = 1, pageSize = 5) {
  const [page, setPage] = useState(initialPage);
  const [filter, setFilter] = useState<{
    type: string;
    active: string;
    code: string;
    applyType: string;
  }>({
    type: "",
    active: "",
    code: "",
    applyType: "",
  });

  // RTK Query
  const { data, isLoading, isError, refetch } = useGetAllVoucherQuery({
    page,
    pageSize,
    type: filter.type || undefined,
    active: filter.active === "" ? undefined : filter.active === "true",
    code: filter.code || undefined,
    applyType: filter.applyType || undefined,
  });

  const {data: voucherUser, refetch: refetchVoucher } = useGetVoucherByUserQuery()
  const voucherFilterOfUser = voucherUser || []

  // const handlerUpdateFilterVoucherByUser = (key: string, value: string) => {
  //   setFilterVoucherByUser((prev) => ({ ...prev, [key]: value }));
  //   setPage(1);
  // };

  const [createVoucher] = useCreateVoucherMutation();
  const [updateVoucher] = useUpdateVoucherMutation();
  const [toggleActive] = useToggleVoucherActiveMutation();
  const [deleteVoucher] = useDeleteVoucherMutation();

  const vouchers = data?.data?.data ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  const [voucherValue, setVoucherValue] = useState<Voucher | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [creatingVoucher, setCreatingVoucher] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const updateFilter = (field: string, value: string) => {
    setFilter((prev) => ({ ...prev, [field]: value, manager: true }));
    setPage(1);
  };

  // FORM CHANGE
  const handleChange = (field: keyof Voucher, value: any) => {
    if (!voucherValue) return;
    setVoucherValue({ ...voucherValue, [field]: value });
  };

  // UPDATE VOUCHER
  const handleSaveEdit = async (updatedVoucher?: Voucher) => {
    const voucherToUpdate = updatedVoucher || voucherValue;
    if (!voucherToUpdate) return;
    try {
      await updateVoucher(voucherToUpdate).unwrap();
      toast.success("Cập nhật voucher thành công!");

      setVoucherValue(null);
      setIsEditing(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Cập nhật voucher thất bại!");
    }
  };

  // CREATE VOUCHER
  const handleCreateVoucher = async (createToVoucher?: Voucher) => {
    const voucherToCreate = createToVoucher || voucherValue;
    if (!voucherToCreate) return;
    try {
      await createVoucher(voucherToCreate).unwrap();
      toast.success("Tạo voucher thành công!");

      setVoucherValue(null);
      setCreatingVoucher(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Tạo voucher thất bại!");
    }
  };

  // TOGGLE ACTIVE
  const handleToggleActive = async (id: number) => {
    try {
      const result = await toggleActive(id).unwrap();
      toast.success(
        `Voucher đã ${result.data.active ? "kích hoạt" : "tạm dừng"}`
      );

      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Cập nhật trạng thái thất bại!");
    }
  };

  // DELETE VOUCHER
  const handleDeleteVoucher = async (id: number) => {
    try {
      await deleteVoucher(id).unwrap();
      toast.success("Xóa voucher thành công!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Xóa voucher thất bại!");
    }
  };

  const handleToggleDetails = (id: number) =>
    setExpandedId(expandedId === id ? null : id);

  // DEFAULT FORM
  const createDefaultVoucher = (): Voucher => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isoTomorrow = tomorrow.toISOString().split("T")[0];

    return {
      code: "",
      description: "",
      discountType: "PERCENT",
      discountValue: 1,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      startAt: `${isoTomorrow}T00:00:00`,
      endAt: "",
      usageLimit: 0,
      usageLimitPerUser: 0,
      active: false,
      applyType: "ORDER"
    };
  };

  return {
    vouchers,
    page,
    totalPages,
    voucherValue,
    isEditing,
    creatingVoucher,
    expandedId,
    isLoading,
    isError,
    filter,

    setPage,
    setVoucherValue,
    setIsEditing,
    setCreatingVoucher,
    handleChange,
    handleSaveEdit,
    handleCreateVoucher,
    handleToggleActive,
    handleDeleteVoucher,
    handleToggleDetails,
    createDefaultVoucher,
    refetch,
    updateFilter,

    // handlerUpdateFilterVoucherByUser,
    voucherFilterOfUser,
    refetchVoucher,
  };
}
