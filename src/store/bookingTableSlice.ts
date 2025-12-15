import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Table } from "@/types/table.type";
import type { TableFilter } from "@/types/booking.type";

interface BookingTableState {
  tables: Table[];
  tableFilter: TableFilter;
  selectedTableAvailable: Table | null;
  tableHold: Table | null;
}

const storedTable = localStorage.getItem("bookingTable");

const initialState: BookingTableState = storedTable
  ? {
      ...JSON.parse(storedTable),
      tables: [],
      tableFilter: { page: 1, size: 6, guestCount: 2 },
    }
  : {
      tables: [],
      tableFilter: { page: 1, size: 6, guestCount: 2 },
      selectedTableAvailable: null,
      tableHold: null,
    };

const bookingTableSlice = createSlice({
  name: "bookingTable",
  initialState,
  reducers: {
    // chỉ lưu tableHold
    setTableHold: (state, action: PayloadAction<Table>) => {
      state.tableHold = action.payload;
      localStorage.setItem(
        "bookingTable",
        JSON.stringify({
          selectedTableAvailable: state.selectedTableAvailable,
          tableHold: state.tableHold,
          tableFilter: state.tableFilter,
        })
      );
    },

    // không lưu vào localStorage
    setListTablAvailable: (state, action: PayloadAction<Table[]>) => {
      state.tables = action.payload;
    },

    // không lưu vào localStorage
    setTableFilter: (state, action: PayloadAction<TableFilter>) => {
      state.tableFilter = action.payload;
      localStorage.setItem(
        "bookingTable",
        JSON.stringify({
          selectedTableAvailable: state.selectedTableAvailable,
          tableHold: state.tableHold,
          tableFilter: state.tableFilter,
        })
      );
    },

    // chỉ lưu selectedTableAvailable
    setSelectedTableAvailable: (state, action: PayloadAction<Table>) => {
      state.selectedTableAvailable = action.payload;
      localStorage.setItem(
        "bookingTable",
        JSON.stringify({
          selectedTableAvailable: state.selectedTableAvailable,
          tableHold: state.tableHold,
        })
      );
    },

    clearTableSelection: (state) => {
      state.tableFilter = { guestCount: 1 };
      state.selectedTableAvailable = null;
      state.tableHold = null;
      localStorage.removeItem("bookingTable");
    },

    clearHoldTableAndSelectedTable: (state) => {
      state.selectedTableAvailable = null;
      state.tableHold = null;
      localStorage.setItem(
        "bookingTable",
        JSON.stringify({
          selectedTableAvailable: null,
          tableHold: null,
          tableFilter: state.tableFilter,
        })
      );
    },
  },
});

export const {
  setTableHold,
  setListTablAvailable,
  setTableFilter,
  setSelectedTableAvailable,
  clearTableSelection,
  clearHoldTableAndSelectedTable,
} = bookingTableSlice.actions;

export default bookingTableSlice.reducer;
