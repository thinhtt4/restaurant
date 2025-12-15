import type { MenuItem } from "./menuItem.type";

export interface MenuCategory {
    categoryId: number;
    name: string;
    type?: "FOOD" | "DRINK" | "OTHER";
    items?: MenuItem[];
}

export interface PaginatedResponse<T> {
    currentPage: number;
    totalPage: number;
    pageSize: number;
    totalElements: number;
    data: T[];
}

export interface GetMenuCategoriesParams {
    page?: number;
    size?: number;
    search?: string;
    type?: string;
}