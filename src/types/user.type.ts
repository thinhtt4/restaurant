import type { PageResponseAbstract } from "./pageResponseAbstract";
import type { APIResponse } from "./response.type";
import type { RoleResponse } from "./role.type";

export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  gender: string | null;
  username: string;
  phone: string | null;
  email: string;
  provider: string;
  status: string;
  roles?: RoleResponse[];
}


export interface UserPageData extends PageResponseAbstract {
  users: User[];
}

export type UserPageResponse = APIResponse<UserPageData>;
export type UserSingleResponse = APIResponse<User>;