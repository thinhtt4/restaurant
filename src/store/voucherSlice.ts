// import type { Voucher } from "@/types/voucher.type";
// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// interface VoucherState {
//     vouchers: Voucher[];
//     selectedVoucher: Voucher | null;
//     totalPages: number;
// }

// const initialState: VoucherState = {
//     vouchers: [],
//     selectedVoucher: null,
//     totalPages: 1,
// };

// const voucherSlice = createSlice({
//     name: "voucher",
//     initialState,
//     reducers: {

//         // Lưu toàn bộ danh sách voucher vào store
//         setVouchers(state, action: PayloadAction<{ vouchers: Voucher[]; totalPages: number }>) {
//             state.vouchers = action.payload.vouchers;
//             state.totalPages = action.payload.totalPages;
//         },

//         // Lưu voucher đang được chọn (ví dụ khi update)
//         setSelectedVoucher(state, action: PayloadAction<Voucher | null>) {
//             state.selectedVoucher = action.payload;
//         },

//         // Thêm voucher mới vào danh sách (sau khi create)
//         addVoucher(state, action: PayloadAction<Voucher>) {
//             state.vouchers.unshift(action.payload); // thêm đầu lists
//         },
//         // Cập nhật voucher đã có (sau khi update)
//         updateVoucherInList(state, action: PayloadAction<Voucher>) {
//             const index = state.vouchers.findIndex(v => v.id === action.payload.id);
//             if (index !== -1) {
//                 state.vouchers[index] = action.payload;
//             }
//         },

//         // Xóa 1 voucher khỏi danh sách (sau khi delete)
//         removeVoucher(state, action: PayloadAction<number>) {
//             state.vouchers = state.vouchers.filter(v => v.id !== action.payload);
//         },

//     }
// })


// export const {
//     setVouchers,
//     setSelectedVoucher,
//     removeVoucher,
//     addVoucher,
//     updateVoucherInList,
// } = voucherSlice.actions;

// export const selectAllVouchers = (state: { voucher: VoucherState }) => state.voucher.vouchers;

// export default voucherSlice.reducer;