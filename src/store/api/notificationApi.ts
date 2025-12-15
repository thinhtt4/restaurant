import { baseApi } from "./baseApi";
import type {
    NotificationRequest,
    NotificationResponse,
} from "@/types/notification.type";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllNotifications: builder.query<NotificationResponse[], number>({
            query: (userId) => `/notifications?userId=${userId}`,
            transformResponse: (response: { data: NotificationResponse[] }) => response.data,
        }),


        getUnread: builder.query<NotificationResponse[], number>({
            query: (userId) => `/notifications/unread?userId=${userId}`,
            transformResponse: (response: { data: NotificationResponse[] }) => response.data,
        }),

        getUnreadCount: builder.query<number, number>({
            query: (userId) => `/notifications/unread/count?userId=${userId}`,
            transformResponse: (response: { data: number }) => response.data,

        }),

        broadcastNotification: builder.mutation<NotificationResponse[], NotificationRequest>({
            query: (body) => ({
                url: `/notifications/broadcast`,
                method: "POST",
                body
            })
        }),

        markAsRead: builder.mutation<void, number>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PUT"
            })
        }),
    }),
});

export const {
    useGetAllNotificationsQuery,
    useGetUnreadQuery,
    useGetUnreadCountQuery,
    useBroadcastNotificationMutation,
    useMarkAsReadMutation,
} = notificationApi;
