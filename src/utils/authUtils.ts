

/**
 * Kiểu dữ liệu có thể chứa roles của user.
 * Có thể đến từ:
 * - string[]                       → ["ADMIN", "MANAGER"]
 * - object[]                       → [{ name: "ADMIN" }, ...]
 * - response API với user trong data → { data: { roles: [...] } }
 */
export type MaybeUserRoles =
  | string[]
  | { name: string }[]
  | { data?: { roles?: any[] } }
  | undefined
  | null;

/**
 * normalizeRoles:
 * Chuẩn hoá mọi kiểu dữ liệu roles về dạng string[]:
 *   ["ADMIN", "MANAGER"]
 *
 * → Giúp Sidebar không cần quan tâm user.roles ở dạng nào.
 */
export function normalizeRoles(input: MaybeUserRoles): string[] {
  if (!input) return [];

  // Nếu input là response API có dạng { data: { roles: [...] } }
  if (typeof input === "object" && !Array.isArray(input)) {
    const roles = (input as any).data?.roles;
    if (Array.isArray(roles)) return normalizeRoles(roles);
    return [];
  }

  const arr = input as any[];
  if (arr.length === 0) return [];

  // roles dạng string[]
  if (typeof arr[0] === "string") return arr as string[];

  // roles dạng object: [{ name: "ADMIN" }, ...]
  return arr
    .map((r: any) => r?.name)
    .filter(Boolean) as string[];
}

/**
 * hasAnyRequiredRole:
 * Kiểm tra user có ÍT NHẤT MỘT role trong danh sách requiredRoles hay không.
 *
 * → Nếu requiredRoles rỗng hoặc không có → coi như public → trả true.
 */
export function hasAnyRequiredRole(
  userRoles: MaybeUserRoles,
  required?: string[]
): boolean {
  if (!required || required.length === 0) return true;

  const roles = normalizeRoles(userRoles).map(r => r.toUpperCase());
  if (roles.length === 0) return false;

  const normalizedRequired = required.map(r => r.toUpperCase());

  return normalizedRequired.some((r) => roles.includes(r));
}

/**
 * hasAnyRoleForSubmenu:
 * Kiểm tra user có quyền xem ÍT NHẤT MỘT submenu trong danh sách không.
 *
 * → Dùng để quyết định mục cha có hiển thị hay không.
 */
export function hasAnyRoleForSubmenu(
  userRoles: MaybeUserRoles,
  submenu?: { requiredRoles?: string[] }[]
): boolean {
  if (!submenu || submenu.length === 0) return true;

  return submenu.some((item) =>
    hasAnyRequiredRole(userRoles, item.requiredRoles)
  );
}
