export interface Table {
    id?: number;
    code: string;
    description?: string;
    guestCount: number;
    status: string;
    areaId: number;
    areaName?: string;
    createdAt?: string;
    updatedAt?: string;
}


export interface TableArea {
    areaId?: number;
    name: string;
}


export interface PaginatedResponse<T> {
    currentPage: number;
    totalPage: number;
    pageSize: number;
    totalElements: number;
    data: T[];
}

export interface GetTablesParams {
    page?: number;
    size?: number;
    search?: string;
    guestFrom?: number;
    guestTo?: number;
    areaId?: number;
    status?: string;
}

export interface GetTableAreasParams {
    page?: number;
    size?: number;
    search?: string;
}

export type TableAction =
    | "CHECK_IN"
    | "RESERVE"
    | "CANCEL_RESERVE"
    | "START_SERVING"
    | "CHECK_OUT"
    | "FINISH_PAYMENT"
    | "CALL_STAFF";

export type TableStatus = 'EMPTY' | 'OCCUPIED' | 'SERVING' | 'WAITING_PAYMENT' | 'RESERVED';


export interface TableAlert {
    tableId: number;
    minutesLeft: number;
    hasNextBooking: boolean;
    type: 'URGENT' | 'WARNING' | 'CRITICAL' | 'OVERTIME';
}

export interface AlertState {
    [key: number]: TableAlert;
}