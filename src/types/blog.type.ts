// blog.type.ts
import type { PageResponseAbstract } from "./pageResponseAbstract";
import type { APIResponse } from "./response.type";

export interface BlogResponse {
  blogId: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  authorName: string;
  // Thêm thông tin like và comment
  countLike?: number;
  commentCount?: number;
}

export interface BlogRequest {
  title: string;
  content: string;
  imageUrl?: string;
  active: boolean;
}

export interface BlogPageData extends PageResponseAbstract {
  blogs: BlogResponse[];
}

export type BlogPageResponse = APIResponse<BlogPageData>;
