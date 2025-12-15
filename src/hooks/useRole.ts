/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PermissionResponse } from "./../types/permission.type";
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} from "@/store/api/roleApi";

import type { RoleResponse } from "@/types/role.type";
import { useCallback, useState } from "react";

export interface RoleFormData {
  name: string;
  description?: string | null;
  permissions?: PermissionResponse[];
}
export function useRole() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<RoleResponse | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  // const [getRoleName] = useGetRoleByNameQuery();

  const openAdd = useCallback(() => {
    setModalMode("add");
    setSelected(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((p: RoleResponse) => {
    setModalMode("edit");
    setSelected(p);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelected(null);
  }, []);

  const mapPermissionsToPayload = (
    perms?: Array<PermissionResponse | string>
  ) => {
    if (!perms) return [];
    return perms.map((p) => (typeof p === "string" ? p : p.name));
  };

  const doCreate = useCallback(
    (payload: RoleFormData) => {
      const body = {
        name: payload.name,
        description: payload.description ?? null,
        permissions: mapPermissionsToPayload(payload.permissions),
      };
      return createRole(body).unwrap();
    },
    [createRole]
  );

  const doUpdate = useCallback(
    (
      name: string,
      payload: {
        description?: string | null;
        permissions?: Array<PermissionResponse | string>;
      }
    ) => {
      const body = {
        description: payload.description,
        permissions: mapPermissionsToPayload(payload.permissions as any),
      };
      return updateRole({ name, body }).unwrap();
    },
    [updateRole]
  );

  const askDelete = useCallback((name: string) => {
    setConfirmTarget(name);
    setConfirmOpen(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setConfirmOpen(false);
    setConfirmTarget(null);
  }, []);

  const doDelete = useCallback(async () => {
    if (!confirmTarget) throw new Error("No target");
    const res = await deleteRole(confirmTarget).unwrap();
    setConfirmOpen(false);
    setConfirmTarget(null);
    return res;
  }, [confirmTarget, deleteRole]);

  return {
    modalOpen,
    modalMode,
    selected,
    confirmOpen,
    confirmTarget,

    openAdd,
    openEdit,
    closeModal,
    doCreate,
    doUpdate,
    askDelete,
    cancelDelete,
    doDelete,
  } as const;
}
