/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "sonner";
import type { ChatMessage } from "@/types/chat"; 
import type { User } from "@/types/user.type";
import { ADMIN_TOPIC, WS_URL, WS_DESTINATIONS } from "@/constants/chat";
import { hasAdminRole } from "@/utils/chatUtils";

interface StompClientCallbacks {
    onMessageReceived: (message: ChatMessage) => void;
    onConnectSuccess: () => void;
    onConnectError: (error: string) => void;
    onDisconnect: () => void;
}

export class StompClientService {
    private client: Client | null = null;
    private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    private callbacks: StompClientCallbacks;
    private user: User | null = null;

    constructor(callbacks: StompClientCallbacks) {
        this.callbacks = callbacks;
    }

    private setupWebSocketFactory(accessToken: string) {
        return () => {
            const sock = new SockJS(WS_URL); 
            
            sock.onclose = () => {
                this.callbacks.onDisconnect();
                // Tự động kết nối lại nếu bị ngắt kết nối đột ngột
                if (this.user && accessToken && !this.reconnectTimeout) {
                    this.reconnectTimeout = setTimeout(() => {
                        this.reconnectTimeout = null;
                        if (!this.client?.connected) {
                            this.connect(accessToken, this.user as User); 
                        }
                    }, 5000);
                }
            };
            
            sock.onerror = () => {
                this.callbacks.onConnectError("Lỗi kết nối SockJS. Kiểm tra backend có đang chạy không.");
            };
            
            return sock as any;
        };
    }

    private setupConnectHandlers(user: User) {
        if (!this.client) return;

        const isAdmin = hasAdminRole(user.roles);
        const messageHandler = (message: IMessage) => {
            try {
                const chatMessage: ChatMessage = JSON.parse(message.body);
                this.callbacks.onMessageReceived(chatMessage);
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        if (isAdmin) {
            this.client.subscribe(WS_DESTINATIONS.ADMIN_TOPIC, (message: IMessage) => {
                try {
                    const chatMessage: ChatMessage = JSON.parse(message.body);
                    const isToAdmin = chatMessage.recipientUsername === ADMIN_TOPIC;
                    const isFromCurrentAdmin = chatMessage.senderUsername === user.username;
                    
                    if (isToAdmin || isFromCurrentAdmin) {
                        messageHandler(message);
                    }
                } catch (error) {
                    console.error("Error parsing admin topic message:", error);
                }
            });
        } else {
            this.client.subscribe(WS_DESTINATIONS.USER_QUEUE(user.username), messageHandler);
        }
    }

    public connect(accessToken: string, user: User): void {
        if (this.client?.connected) return;
        
        this.user = user;
        
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.client) {
            try {
                this.client.onWebSocketClose = () => { /* no-op */ }; 
                this.client.deactivate();
            } catch (e) { /* Ignore */ 
                console.log(e);
                
            }
        }

        const client = new Client({
            webSocketFactory: this.setupWebSocketFactory(accessToken),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            //Gửi JWT token trong header
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            onConnect: () => {
                this.callbacks.onConnectSuccess();
                this.setupConnectHandlers(user); 
            },
            onStompError: (frame) => {
                // Tránh gọi callback disconnect liên tục nếu lỗi auth
                const errorMsg = frame.headers?.["message"] || frame.command || "Unknown error";
                
                if (frame.headers?.["message"]?.includes("401") || frame.body?.includes("No Bearer Token")) {
                    this.callbacks.onConnectError("Lỗi xác thực. Vui lòng đăng nhập lại.");
                    this.disconnect(); // Ngắt hẳn kết nối nếu sai token
                } else {
                    this.callbacks.onConnectError("Lỗi STOMP: " + errorMsg);
                    this.callbacks.onDisconnect(); 
                }
            },
            onWebSocketError: () => {
                this.callbacks.onConnectError("Lỗi kết nối WebSocket. Vui lòng kiểm tra server và thử lại.");
            },
            onDisconnect: () => {
                this.callbacks.onDisconnect();
            },
        });

        try {
            client.activate();
            this.client = client;
        } catch (error) {
            console.log(error);
        
            this.callbacks.onConnectError("Không thể khởi tạo WebSocket");
        }
    }

    public disconnect(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        
        if (this.client) {
            this.client.onWebSocketClose = () => { /* no-op */ }; 
            this.client.deactivate();
            this.client = null;
            this.callbacks.onDisconnect();
            this.user = null; 
        }
    }

    public sendMessage(content: string, recipientUsername?: string): void {
        if (!this.client?.connected || !this.user) {
            toast.error("Chưa kết nối hoặc chưa đăng nhập.");
            return;
        }

        const isAdmin = hasAdminRole(this.user.roles);
        const message = {
            recipientUsername: recipientUsername || ADMIN_TOPIC,
            content: content.trim(),
        };
        
        const destination = isAdmin && recipientUsername 
            ? WS_DESTINATIONS.SEND_ADMIN 
            : WS_DESTINATIONS.SEND_USER;
        
        try {
            this.client.publish({
                destination,
                body: JSON.stringify(message),
            });
        } catch (error) {
            console.log(error);
            toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
        }
    }
    
    public isConnected(): boolean {
        return this.client?.connected ?? false;
    }
}