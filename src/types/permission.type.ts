import type { PageResponseAbstract } from "./pageResponseAbstract";
import type { APIResponse } from "./response.type";

export interface PermissionResponse {
  name: string;
  description: string | null;
}

export interface PermissionPageData extends PageResponseAbstract{
  permissions: PermissionResponse[];
}

export type PermissionPageResponse = APIResponse<PermissionPageData>