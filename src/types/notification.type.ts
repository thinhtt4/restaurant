export interface NotificationResponse {
    id: number;
    type: string;
    title: string;
    message: string;
    targetUrl: string | null;

    isRead: boolean;
    createdAt: string;

    receiverId: number;

    senderId: number | null;
    senderName: string | null;
    senderEmail: string | null;
    senderAvatar: string | null;
}

export interface NotificationRequest {
    receiverId?: number | null;
    senderId?: number | null;
    type: string;
    title?: string;
    message?: string;
    targetUrl?: string;
}