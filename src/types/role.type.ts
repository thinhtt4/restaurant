import type { PermissionResponse } from "./permission.type";

export interface RoleResponse {
  name: string;
  description: string | null;
  permissions?: PermissionResponse[];
}