import {
  useDeleteHoldTableMutation,
  useGetListTableEmptyQuery,
  useHoldTableMutation,
} from "@/store/api/orderApi";
import {
  clearHoldTableAndSelectedTable,
  clearTableSelection,
  setListTablAvailable,
  setSelectedTableAvailable,
  setTableFilter,
  setTableHold,
} from "@/store/bookingTableSlice";
import type { RootState } from "@/store/store";
import type { Table } from "@/types/table.type";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useBookingTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tables, tableFilter, selectedTableAvailable, tableHold } =
    useSelector((state: RootState) => state.bookingTable);

  const { user } = useAuth();

  // const [selectedDate, setSelectedDate] = useState("");
  // const [selectedTime, setSelectedTime] = useState("");
  // const [guestCount, setGuestCount] = useState(2);
  // const [selectedArea, setSelectedArea] = useState<TableArea>();
  // const [bookingSuccess, setBookingSuccess] = useState(false);

  // const now = new Date();

  // const pad = (num: number) => num.toString().padStart(2, "0");

  // const nowFormatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
  //   now.getDate()
  // )}T${pad(now.getHours())}:${pad(now.getMinutes())}:00`;

  // -------------------------------------------gọi lại api bàn trống--------------------------------------------------
  const {
    data: tableEmptyResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetListTableEmptyQuery({
    ...tableFilter,
    page: tableFilter.page && tableFilter.page > 0 ? tableFilter.page - 1 : 0,
  });
  const [holdTable] = useHoldTableMutation();

  const tableEmpty = tableEmptyResponse?.data || [];

  // Lấy tổng số trang
  const totalPages = tableEmptyResponse?.totalPage || 1;

  // Lấy trang hiện tại

  const handlerAreaFilter = (areaId: number) => {
    if (areaId === -1) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { areaId: tmp, ...rest } = tableFilter;

      dispatch(
        setTableFilter({
          ...rest,
          page: 1,
        })
      );
    } else {
      dispatch(
        setTableFilter({
          ...tableFilter,
          areaId,
          page: 1,
        })
      );
    }
  };

  const handlerGuestFromToFilter = (from: number, to: number) => {
    dispatch(
      setTableFilter({
        ...tableFilter,
        guestFrom: from,
        guestTo: to,
        page: 1,
      })
    );
  };
  const handlerGuestCountFilter = (guestCount: number) => {
    dispatch(
      setTableFilter({
        ...tableFilter,
        guestCount: guestCount,
        page: 1,
      })
    );
  };
  const handlerReservationTimeFilter = (reservationTime: string) => {
    dispatch(
      setTableFilter({
        ...tableFilter,
        reservationTime: reservationTime,
        page: 1,
      })
    );
  };

  const handlerPageChange = (page: number) => {
    dispatch(
      setTableFilter({
        ...tableFilter,
        page: page,
      })
    );
  };

  const handlerSelectedAvailable = (tableId: Table) => {
    dispatch(setSelectedTableAvailable(tableId));
  };

  // useEffect(() => {
  //   if (selectedDate) {
  //     const reservationTime = `${selectedDate}T${selectedTime || "00:00"}:00`;

  //     dispatch(
  //       setTableFilter({
  //         ...tableFilter,
  //         page: 1,
  //         reservationTime,
  //       })
  //     );
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedDate, selectedTime]);

  const handlerStatusFilter = (status: string) => {
    dispatch(
      setTableFilter({
        ...tableFilter,
        page: 1,
        status,
      })
    );
  };
  const prevDataRef = useRef<Table[]>([]);

  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(tableEmpty)) {
      prevDataRef.current = tableEmpty;
      dispatch(setListTablAvailable(tableEmpty));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableEmpty]);

  const handlerUpdateTableLS = (tableEmpty: Table[]) => {
    dispatch(setListTablAvailable(tableEmpty));
  };

  const handlerHoldTable = async () => {
    if (!user) return toast.error("Bạn cần đăng nhập");
    if (!tableFilter.reservationTime) {
      toast.error("Vui lòng chọn ngày và giờ đặt bàn");
      return;
    }
    if (
      selectedTableAvailable === null ||
      selectedTableAvailable.id === undefined
    ) {
      toast.error("Vui lòng chọn bàn trước");
      return;
    }

    try {
      const payload = {
        tableId: selectedTableAvailable?.id,
        userId: user.data.id,
        reservationTime: tableFilter.reservationTime,
        guestCount: tableFilter.guestCount,
      };

      const response = await holdTable(payload).unwrap();
      refetch();
      dispatch(setTableHold(selectedTableAvailable));
      // nếu thành công
      navigate("/app/booking-table", { state: { holdData: response.data } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const error = err?.data?.message;
      const errorCode = err?.data?.code;
      console.log(error);
      if (error) {
        toast.error(error);
        if (errorCode === 2000) {
          navigate("/app/booking-history");
          return;
        }
      } else {
        toast.error("Lỗi mạng, vui lòng thử lại");
      }
      navigate("/app/booking-table-available");
    }
  };

  const [deleteHoldTable] = useDeleteHoldTableMutation();

  const handleDeleteHoldTable = async (holdId: string) => {
    if (!holdId) return; // tránh gọi API với giá trị null/undefined

    try {
      await deleteHoldTable(holdId).unwrap();
      navigate("/app/booking-table-available");
      toast.info("Hủy thành công");

      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      navigate("/app/booking-table-available");
      toast.error(error?.data?.message || "Không thể hủy bàn");
    }
  };

  const handlerClearBookingTableLS = () => {
    dispatch(clearTableSelection());
  };

  const handlerClearTableHoldAndSelectedTable = () => {
    dispatch(clearHoldTableAndSelectedTable());
  };

  return {
    tableEmpty,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    tables,
    tableFilter,
    selectedTableAvailable,
    tableHold,

    handlerAreaFilter,
    handlerGuestFromToFilter,
    handlerGuestCountFilter,
    handlerReservationTimeFilter,
    handlerStatusFilter,
    handlerSelectedAvailable,
    handlerHoldTable,
    handlerUpdateTableLS,
    handlerClearBookingTableLS,
    handlerClearTableHoldAndSelectedTable,

    handleDeleteHoldTable, // Hủy hodl table
    handlerPageChange,
  };
}
