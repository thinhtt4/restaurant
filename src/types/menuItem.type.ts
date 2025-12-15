export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: number;
    categoryName: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MenuCategory {
    categoryId?: number;
    name: string;
    type: string;
}

export type MenuItemForm = {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    active: boolean;
};

export interface GetMenuItemsParams {
    page?: number;
    size?: number;
    search?: string;
    priceFrom?: number;
    priceTo?: number;
    categoryId?: number;
    active?: boolean;
}

export interface PaginatedResponse<T> {
    currentPage: number;
    totalPage: number;
    pageSize: number;
    totalElements: number;
    data: T[];
}

