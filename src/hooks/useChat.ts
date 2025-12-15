import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { addRealtimeMessage } from "@/store/chatSlice";
import type { ChatMessage } from "@/types/chat"; 
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth"; 
import type { User } from "@/types/user.type";
import { StompClientService } from "../services/StompClientService";
import { ADMIN_TOPIC } from "@/constants/chat";

export function useChat() {
    const dispatch = useDispatch();
    const { accessToken } = useSelector((state: RootState) => state.auth);
   
    const { user: authUserResponse } = useAuth(); 
    const user = authUserResponse?.data as User | undefined; 
    
    const clientServiceRef = useRef<StompClientService | null>(null);
    const [isConnected, setIsConnected] = useState(false);

   
    const callbacks = useRef({
        onMessageReceived: (chatMessage: ChatMessage) => {
            dispatch(addRealtimeMessage(chatMessage));
        },
        onConnectSuccess: () => {
            setIsConnected(true);
            toast.success("Đã kết nối Chat Service!");
        },
        onConnectError: (error: string) => {
            setIsConnected(false);
            toast.error(error);
        },
        onDisconnect: () => {
            setIsConnected(false);
        },
    });

    const getClientService = useCallback(() => {
        if (!clientServiceRef.current) {
            clientServiceRef.current = new StompClientService(callbacks.current);
        }
        return clientServiceRef.current;
    }, []);

    const connect = useCallback(() => {
        if (!accessToken || !user?.username) return;

        const service = getClientService();
        if (service.isConnected()) return;

        service.connect(accessToken, user);
    }, [accessToken, user, getClientService]);

    const disconnect = useCallback(() => {
        getClientService().disconnect();
    }, [getClientService]);

    const sendMessage = useCallback(
        (content: string, recipientUsername?: string) => {
            if (!user) {
                toast.error("Chưa đăng nhập. Vui lòng đăng nhập lại.");
                return;
            }
            
            const service = getClientService();
            if (!service.isConnected()) {
                toast.error("WebSocket chưa kết nối. Đang thử kết nối lại...");
                if (accessToken && user) {
                    connect(); 
                }
                return;
            }
            
            if (!content.trim()) return;

            const optimisticMessage: ChatMessage = {
                id: Date.now(), 
                senderUsername: user.username,
                recipientUsername: recipientUsername || ADMIN_TOPIC,
                content: content.trim(),
                timestamp: new Date().toISOString(),
                isRead: true, 
            };
            dispatch(addRealtimeMessage(optimisticMessage));
            service.sendMessage(content, recipientUsername);
        },
        [user, accessToken, connect, dispatch, getClientService]
    );

    useEffect(() => {
        if (accessToken && user) {
            const timeoutId = setTimeout(connect, 500);
            return () => {
                clearTimeout(timeoutId);
                disconnect(); 
            };
        } else {
            disconnect();
        }
    }, [accessToken, user, connect, disconnect]);

    useEffect(() => {
        return () => {
            if (clientServiceRef.current) {
                clientServiceRef.current.disconnect();
                clientServiceRef.current = null;
            }
        };
    }, []);

    return {
        connect,
        disconnect,
        sendMessage,
        isConnected,
    };
}