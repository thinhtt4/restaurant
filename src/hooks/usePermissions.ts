// import {
//   useCreatePermissionMutation,
//   useDeletePermissionMutation,
//   useGetPermissionsQuery,
//   useUpdatePermissionMutation,
// } from "@/store/api/permissionApi";
// import type { PermissionResponse } from "@/types/permission.type";
// import { useCallback, useState } from "react";
// import { useDebounce } from "./useDebounce";

// export interface PermissionForm {
//   name: string;
//   description?: string | null;
// }

// export function usePermissions(defaultPage = 1, defaultSize = 5) {
//   const [keyword, setKeyword] = useState<string>("");
//   const debouncedKeyword = useDebounce(keyword, 300);

//   const [page, setPage] = useState<number>(defaultPage);
//   const [size] = useState<number>(defaultSize);
//   const [sort] = useState<string>("name:asc");

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<"add" | "edit">("add");
//   const [selected, setSelected] = useState<PermissionResponse | null>(null);

//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

//   const query = useGetPermissionsQuery({ keyword: debouncedKeyword, page, size, sort });

//   const [createPermission] = useCreatePermissionMutation();
//   const [updatePermission] = useUpdatePermissionMutation();
//   const [deletePermission] = useDeletePermissionMutation();

//   const openAdd = useCallback(() => {
//     setModalMode("add");
//     setSelected(null);
//     setModalOpen(true);
//   }, []);

//   const openEdit = useCallback((p: PermissionResponse) => {
//     setModalMode("edit");
//     setSelected(p);
//     setModalOpen(true);
//   }, []);

//   const closeModal = useCallback(() => {
//     setModalOpen(false);
//     setSelected(null);
//   }, []);

//   const doCreate = useCallback(
//     (payload: PermissionForm) => createPermission(payload).unwrap(),
//     [createPermission]
//   );

//   const doUpdate = useCallback(
//     (name: string, description: string | null) =>
//       updatePermission({
//         name,
//         body: { description },
//       }).unwrap(),
//     [updatePermission]
//   );

//   const askDelete = useCallback((name: string) => {
//     setConfirmTarget(name);
//     setConfirmOpen(true);
//   }, []);

//   const cancelDelete = useCallback(() => {
//     setConfirmOpen(false);
//     setConfirmTarget(null);
//   }, []);

//   const doDelete = useCallback(async () => {
//     if (!confirmTarget) throw new Error("No target");
//     const res = await deletePermission(confirmTarget).unwrap();
//     setConfirmOpen(false);
//     setConfirmTarget(null);
//     return res;
//   }, [confirmTarget, deletePermission]);

//   const setSearch = useCallback((kw: string) => setKeyword(kw), []);
//   const goToPage = useCallback((p: number) => setPage(p), []);

//   return {
    
//     // state
//     page,
//     size,
//     keyword,
//     debouncedKeyword,
//     sort,
//     modalOpen,
//     modalMode,
//     selected,
//     confirmOpen,
//     confirmTarget,


//     // data + flags
//     data: query.data,
//     isLoading: query.isLoading,
//     isFetching: query.isFetching,
//     isError: query.isError,
//     refetch: query.refetch,


//     // actions
//     openAdd,
//     openEdit,
//     closeModal,
//     doCreate,
//     doUpdate,
//     askDelete,
//     cancelDelete,
//     doDelete,
//     setSearch,
//     goToPage,
//   } as const;
// }
