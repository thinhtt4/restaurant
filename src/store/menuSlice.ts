import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuItem } from "@/types/menuItem.type";

interface MenuState {
    categories: string[]; // ["Món chính", "Món khai vị", ...]
    menuItems: MenuItem[];
    selectedCategory: string;
    filteredMenuItems: MenuItem[];
    isLoading: boolean;
}

const initialState: MenuState = {
    categories: [],
    menuItems: [],
    selectedCategory: "Xem tất cả",
    filteredMenuItems: [],
    isLoading: false,
};

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<string[]>) => {
            const uniqueCategories = Array.from(new Set(action.payload));
            state.categories = ["Xem tất cả", ...uniqueCategories];
        },


        setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
            state.menuItems = action.payload;
            // Mặc định hiển thị tất cả
            state.filteredMenuItems = action.payload;
        },

        selectCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;

            if (action.payload === "Xem tất cả") {
                state.filteredMenuItems = state.menuItems;
            } else {
                state.filteredMenuItems = state.menuItems.filter(
                    (item) => item.categoryName === action.payload
                );
            }
        },

        clearMenu: (state) => {
            state.categories = [];
            state.menuItems = [];
            state.selectedCategory = "Xem tất cả";
            state.filteredMenuItems = [];
        },
    },
});

export const { setCategories, setMenuItems, selectCategory, clearMenu } =
    menuSlice.actions;

export default menuSlice.reducer;