/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useMemo } from "react";
import { useChat } from "@/hooks/useChat";
import { useGetChatHistoryQuery } from "@/store/api/chatApi";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { setChatHistory } from "@/store/chatSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageCircle, RotateCcw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { ChatMessage } from "@/types/chat";
import { ADMIN_TOPIC } from "@/constants/chat";
import { getConversationKey, formatChatTime, isMyMessage, sortMessagesByTime } from "@/utils/chatUtils";
import { hasAnyRequiredRole } from "@/utils/authUtils";

export default function UserChat() {
    const { user: userResponse } = useAuth();
    const user = userResponse?.data;
    const { sendMessage, isConnected, connect } = useChat();
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMessageIdRef = useRef<string | number | null>(null);
    
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    
    // Avatar mặc định cho admin/manager/staff
    const DEFAULT_ADMIN_AVATAR = "https://res.cloudinary.com/dig9xykia/image/upload/v1764347436/restaurant_app_images/wkd7okpxspgknkkfjt8q.png";
    const DEFAULT_USER_AVATAR = "https://aic.com.vn/wp-content/uploads/2024/10/avatar-vo-tri-cute.jpg";
    
    const getAvatarUrl = (avatar: string | null | undefined, userRoles?: any) => {
        // Kiểm tra nếu user là admin/manager/staff thì dùng avatar mặc định
        if (userRoles && hasAnyRequiredRole(userRoles, ["ADMIN", "MANAGER", "STAFF"])) {
            return DEFAULT_ADMIN_AVATAR;
        }
        
        if (!avatar) return null;
        if (avatar.startsWith("/storage")) {
            return `${backendUrl}${avatar}`;
        }
        return avatar;
    };
    
    const currentUserAvatar = getAvatarUrl(user?.avatar, user?.roles) || DEFAULT_USER_AVATAR;

    const { conversations } = useSelector((state: RootState) => state.chat);
    const { data: historyData, isLoading } = useGetChatHistoryQuery(ADMIN_TOPIC, {
        skip: !user,
    });

    const conversationKey = useMemo(
        () => user?.username ? getConversationKey(user.username, ADMIN_TOPIC) : null,
        [user?.username]
    );

    const conversationMessages = useMemo(
        () => conversationKey ? (conversations[conversationKey] || []) : [],
        [conversationKey, conversations]
    );

    const displayMessages = useMemo(() => {
        if (!conversationKey || !user?.username) return [];

        return sortMessagesByTime(
            conversationMessages.filter((msg: ChatMessage) => {
                const isFromUser = msg.senderUsername === user.username && msg.recipientUsername === ADMIN_TOPIC;
                const isFromAdmin = msg.senderUsername !== user.username && msg.recipientUsername === user.username;
                return isFromUser || isFromAdmin;
            })
        );
    }, [conversationKey, conversationMessages, user?.username]);

    useEffect(() => {
        if (historyData?.data) {
            dispatch(
                setChatHistory({
                    messages: historyData.data,
                    recipientUsername: ADMIN_TOPIC,
                })
            );
        }
    }, [historyData, dispatch]);

    useEffect(() => {
        if (displayMessages.length > 0 && messagesEndRef.current) {
            const lastMessage = displayMessages[displayMessages.length - 1];
            const lastMessageId = lastMessage?.id;

            if (lastMessageIdRef.current === null || lastMessageIdRef.current !== lastMessageId) {
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
                lastMessageIdRef.current = lastMessageId;
            }
        }
    }, [displayMessages]);

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <div className="text-gray-600 font-medium">Đang tải...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Chat với Quản lý</h2>
                            <p className="text-xs text-blue-100 mt-0.5">
                                Luôn sẵn sàng hỗ trợ bạn 24/7
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                            <span className="text-xs font-medium">
                                {isConnected ? 'Trực tuyến' : 'Ngoại tuyến'}
                            </span>
                        </div>
                        {!isConnected && (
                            <Button 
                                onClick={connect} 
                                size="sm" 
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 via-blue-50/30 to-gray-50">
                {displayMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-8 mb-6 shadow-lg">
                            <MessageCircle className="w-20 h-20 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            Bắt đầu cuộc trò chuyện
                        </h3>
                        <p className="text-gray-500 text-center max-w-sm">
                            Gửi tin nhắn đầu tiên để nhận được sự hỗ trợ từ đội ngũ quản lý
                        </p>
                    </div>
                ) : (
                    displayMessages.map((msg, index) => {
                        const isMine = isMyMessage(msg, user?.username);
                        return (
                            <div
                                key={`${msg.id}-${index}`} 
                                className={`flex ${isMine ? "justify-end" : "justify-start"} items-end gap-2 animate-fadeIn`}
                            >
                                {!isMine && (
                                    <Avatar className="w-8 h-8 flex-shrink-0">
                                        <AvatarImage src={DEFAULT_ADMIN_AVATAR} alt={msg.senderUsername} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-xs font-bold">
                                            {msg.senderUsername.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-md transition-all hover:shadow-lg ${
                                        isMine
                                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                                            : "bg-white text-gray-800 border border-gray-100"
                                    }`}
                                >
                                    {!isMine && (
                                        <div className="text-xs font-bold text-blue-600 mb-1">
                                            {msg.senderUsername}
                                        </div>
                                    )}
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                        {msg.content}
                                    </p>
                                    <div
                                        className={`text-xs mt-2 flex items-center gap-1 ${
                                            isMine ? "text-blue-100 justify-end" : "text-gray-400"
                                        }`}
                                    >
                                        <span>{formatChatTime(msg.timestamp)}</span>
                                    </div>
                                </div>
                                {isMine && (
                                    <Avatar className="w-8 h-8 flex-shrink-0">
                                        <AvatarImage src={currentUserAvatar} alt={user?.username || "You"} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                                            {user?.username?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-5 bg-white border-t border-gray-100">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn của bạn..."
                            className="w-full px-5 py-3.5 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 resize-none transition-all text-sm"
                            rows={1}
                            style={{ minHeight: '52px', maxHeight: '120px' }}
                        />
                    </div>
                    <Button
                        onClick={handleSend}
                        disabled={!message.trim() || !isConnected}
                        className={`h-[52px] w-[52px] rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                            message.trim() && isConnected
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:scale-105'
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        title={!isConnected ? "Đang kết nối đến server..." : "Gửi tin nhắn (Enter)"}
                    >
                        <Send className={`w-5 h-5 ${message.trim() && isConnected ? 'text-white' : 'text-gray-500'}`} />
                    </Button>
                </div>
             
            </div>
        </div>
    );
}