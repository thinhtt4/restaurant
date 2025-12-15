/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    private client: Client | null = null;
    private subscribers: Map<string, Set<(data: any) => void>> = new Map();
    private subscriptions: Map<string, any> = new Map();
    private userId: number | null = null;

    connect(userIdAuth: number) {
        if (this.client?.connected) return;

        this.userId = userIdAuth;

        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {

                // Subscribe to user-specific notifications
                const notifSub = this.client?.subscribe(
                    `/topic/notifications/${this.userId}`,
                    (message) => {
                        const data = JSON.parse(message.body);
                        this.notifySubscribers('notifications', data);
                    }
                );
                if (notifSub) this.subscriptions.set('notifications', notifSub);

                // Subscribe to blog updates
                const blogSub = this.client?.subscribe('/topic/blog-updates', (message) => {
                    const data = JSON.parse(message.body);
                    this.notifySubscribers('blog-updates', data);
                });
                if (blogSub) this.subscriptions.set('blog-updates', blogSub);
            },

            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.subscriptions.clear();
            this.subscribers.clear();
            this.userId = null;
        }
    }

    subscribe(topic: string, callback: (data: any) => void) {
        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, new Set());
        }
        this.subscribers.get(topic)?.add(callback);

        return () => {
            this.subscribers.get(topic)?.delete(callback);
        };
    }

    private notifySubscribers(topic: string, data: any) {
        this.subscribers.get(topic)?.forEach(callback => callback(data));
    }

    isConnected(): boolean {
        return this.client?.connected ?? false;
    }
}

export const websocketService = new WebSocketService();