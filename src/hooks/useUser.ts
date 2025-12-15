import { useCallback, useState } from "react";
import { useDebounce } from "./useDebounce";
import {
  useCreateUserByAdminMutation,
  useDeleteUserByAdminMutation,
  useGetUsersQuery,
  useUpdateUserByAdminMutation,
} from "@/store/api/userApi";
import type { User } from "@/types/user.type";

export interface UserCreateForm {
  username: string;
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  roles?: string[];
  status?: string | null;
}

export interface UserUpdateForm {
  id: number;
  email?:string |null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  status?: string | null;
  roles?: string[];
}

export function useUser(defaultPage = 1, defaultSize = 5) {
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 300);
  const [page, setPage] = useState(defaultPage);
  const [size] = useState<number>(defaultSize);
  const [sort] = useState<string>("id:asc");

  const query = useGetUsersQuery({
    page,
    size,
    sort,
    keyword: debouncedKeyword,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<User | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<number | null>(null);

  const [createUser] = useCreateUserByAdminMutation();
  const [updateUser] = useUpdateUserByAdminMutation();
  const [deleteUser] = useDeleteUserByAdminMutation();

  const openAdd = useCallback(() => {
    setModalMode("add");
    setSelected(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((u: User) => {
    setModalMode("edit");
    setSelected(u);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelected(null);
  }, []);

  const doCreate = useCallback(
    (payload: UserCreateForm) => createUser(payload).unwrap(),
    [createUser]
  );
  const doUpdate = useCallback(
    (payload: UserUpdateForm) => updateUser(payload).unwrap(),
    [updateUser]
  );

  const askDelete = useCallback((id: number) => {
    setConfirmTarget(id);
    setConfirmOpen(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setConfirmOpen(false);
    setConfirmTarget(null);
  }, []);

    const doDelete = useCallback(
    async (id?: number) => {
      const targetId = id ?? confirmTarget;
      if (!targetId) throw new Error("No target");
      const res = await deleteUser(targetId).unwrap();
      setConfirmOpen(false);
      setConfirmTarget(null);
      return res;
    },
    [confirmTarget, deleteUser]
  );

  const setSearch = useCallback((kw: string) => setKeyword(kw), []);
  const goToPage = useCallback((p: number) => setPage(p), []);

  return {
    page,
    size,
    keyword,
    debouncedKeyword,
    sort,
    modalOpen,
    modalMode,
    selected,
    confirmOpen,
    confirmTarget,

    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,

    openAdd,
    openEdit,
    closeModal,
    doCreate,
    doUpdate,
    askDelete,
    cancelDelete,
    doDelete,
    setSearch,
    goToPage,
  } as const;
}
