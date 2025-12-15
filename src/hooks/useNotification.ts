/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useMemo } from "react";
import {
  useGetAllNotificationsQuery,
  useGetUnreadCountQuery,
  useGetUnreadQuery,
  useMarkAsReadMutation,
} from "@/store/api/notificationApi";
import { useAuth } from "./useAuth";
import { websocketService } from "../service/websocket";
import { toast } from "sonner";
import { skipToken } from "@reduxjs/toolkit/query/react";

export const useNotification = () => {
  const { user } = useAuth();

  // extract userId (may be undefined)
  const userId = user?.data?.id;

  // Fetch all notifications — pass userId (may be undefined) and skip when falsy
  const { data: allNotifications, refetch: refetchAll } =
    useGetAllNotificationsQuery(userId ?? skipToken);

  // Fetch unread notifications
  const { data: unreadList, refetch: refetchUnread } = useGetUnreadQuery(
    userId ?? skipToken
  );

  // Fetch unread count
  const { data: unreadCount, refetch: refetchCount } = useGetUnreadCountQuery(
    userId ?? skipToken
  );

  const [markAsRead] = useMarkAsReadMutation();

  // Handle marking notification as read
  const handleMarkAsRead = useCallback(
    async (id: number) => {
      try {
        await markAsRead(id).unwrap();
        refetchAll();
        refetchUnread();
        refetchCount();
      } catch (error) {
        console.error("Failed to mark as read:", error);
        toast.error("Không thể đánh dấu đã đọc");
      }
    },
    [markAsRead, refetchAll, refetchUnread, refetchCount]
  );

  // Handle incoming WebSocket notifications
  const handleNewNotification = useCallback(
    (notification: any) => {
      console.log("New notification received:", notification);

      // Refetch all data to update UI
      refetchAll();
      refetchUnread();
      refetchCount();

      // Show toast notification
      toast.info(`${notification.title}: ${notification.message}`, {
        className: "my-toast",
        action: notification.targetUrl
          ? {
              label: "Xem",
              onClick: async () => {
                if (notification.id) {
                  await handleMarkAsRead(notification.id);
                }
                window.location.href = notification.targetUrl;
              },
            }
          : undefined,
      });
    },
    [refetchAll, refetchUnread, refetchCount, handleMarkAsRead]
  );

  // Connect WebSocket when userId becomes available; always clean up on unmount
  useEffect(() => {
    if (!userId) return;

    websocketService.connect(userId);

    // Subscribe to notifications
    const unsubscribe = websocketService.subscribe(
      "notifications",
      handleNewNotification
    );

    return () => {
      // unsubscribe and disconnect when leaving
      try {
        unsubscribe();
      } catch (e) {
        console.log(e);

        // ignore
      }
      websocketService.disconnect();
    };
  }, [userId, handleNewNotification]);

  // Optional: if you want to disconnect whenever userId becomes falsy:
  useEffect(() => {
    if (userId) return; // nothing to do when userId exists

    // if userId becomes undefined (logout), ensure disconnect
    websocketService.disconnect();
  }, [userId]);

  const isConnected = useMemo(() => websocketService.isConnected(), []);

  return {
    allNotifications,
    unreadList,
    unreadCount,
    markAsRead: handleMarkAsRead,
    isConnected,
    hasUnread: (unreadCount ?? 0) > 0,
    totalNotifications: allNotifications?.length ?? 0,
  };
};
