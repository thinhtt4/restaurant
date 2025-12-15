/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { comboApi } from "@/store/api/comboApi";
import type { Combo, ComboResponse } from "@/types/combo.type";
import { toast } from "sonner";


export function useComboManager(initialPage = 1, pageSize = 5) {

    
    // Pagination & filter
    const [page, setPage] = useState(initialPage);
    const [filter, setFilter] = useState<{ name: string; active: string }>({
        name: "",
        active: "",
    });

    // Modal & editing
    const [comboValue, setComboValue] = useState<Combo | null>(null);
    const [creatingCombo, setCreatingCombo] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    //const [expandedId, setExpandedId] = useState<number | null>(null);

    // Map active filter
    const activeFilter =
        filter.active === "true"
            ? true
            : filter.active === "false"
                ? false
                : undefined;

    // RTK Query
    const { data: comboData, isLoading, isError } =
        comboApi.useGetAllComboQuery({
            page: page - 1,
            pageSize,
            name: filter.name || undefined,
            active: activeFilter,
        }, {
             refetchOnMountOrArgChange: true 
        });

    const [createCombo] = comboApi.useCreateComboMutation();
    const [updateCombo] = comboApi.useUpdateComboMutation();
    const [deleteCombo] = comboApi.useDeleteComboMutation();
    const [toggleComboActive] = comboApi.useToggleComboActiveMutation();

    const combos: ComboResponse[] = comboData?.data.data ?? [];
    const totalPages = comboData?.data.totalPages ?? 1;

    // Filter update -> reset page
    const updateFilter = (field: string, value: string) => {
        setFilter(prev => ({ ...prev, [field]: value }));
        setPage(1);
    };

    // const pageFromBackend = comboData?.data.page ?? 1;
    // useEffect(() => {
    //      console.log("useEffect chạy, pageFromBackend =", pageFromBackend, "current page =", page);
    //     if (page !== pageFromBackend) {
    //         setPage(pageFromBackend);
    //     }
    // }, [pageFromBackend, page]);


    // DEFAULT FORM
    const createDefaultCombo = (): Combo => ({
        name: "",
        description: "",
        active: true,
        comboItems: [],
        imageUrl: "",
    });

    // FORM CHANGE
    const handleChange = (field: keyof Combo, value: any) => {
        if (!comboValue) return;
        setComboValue({ ...comboValue, [field]: value });
    };

    // CREATE
    const handleCreateCombo = async (combo?: Combo) => {
        if (!combo) return;

        try {
            await createCombo(combo).unwrap();
            toast.success("Tạo combo thành công!");
            setComboValue(null);
            setCreatingCombo(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Tạo combo thất bại!");
        }
    };

    // UPDATE
    const handleSaveEdit = async (combo?: Combo) => {
        if (!combo || !combo.comboId) return;

        try {
            await updateCombo(combo).unwrap();
            toast.success("Cập nhật combo thành công!");
            setComboValue(null);
            setIsEditing(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Cập nhật thất bại!");
        }
    };

    // DELETE
    const handleDeleteCombo = async (id: number) => {
        try {
            await deleteCombo(id).unwrap();
            toast.success("Xóa combo thành công!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Xóa combo thất bại!");
        }
    };

    // TOGGLE ACTIVE
    const handleToggleActive = async (id: number) => {
        try {
            const result = await toggleComboActive(id).unwrap();
            toast.success(
                `Combo đã ${result.data.active ? "kích hoạt" : "tạm dừng"}!`
            );
        } catch (err: any) {
            toast.error(err?.data?.message || "Cập nhật trạng thái thất bại!");
        }
    };

    return {
        combos,
        page,
        totalPages,
        comboValue,
        isEditing,
        creatingCombo,
        //expandedId,
        filter,
        isLoading,
        isError,

        setPage,
        setComboValue,
        setIsEditing,
        setCreatingCombo,
        handleChange,
        handleCreateCombo,
        handleSaveEdit,
        handleDeleteCombo,
        handleToggleActive,
        createDefaultCombo,
        // refetch,
        updateFilter,
    };
}
