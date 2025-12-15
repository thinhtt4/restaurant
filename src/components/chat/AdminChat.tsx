/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useMemo } from "react";
import { useChat } from "@/hooks/useChat";
import { useGetChatHistoryQuery, useGetUserWhoHaveChattedQuery } from "@/store/api/chatApi";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { setChatHistory, setSelectedUser, markConversationAsRead } from "@/store/chatSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageCircle, Users, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ADMIN_TOPIC } from "@/constants/chat";
import { getConversationKey, formatChatTime, isMyMessage, sortMessagesByTime, removeDuplicateMessages } from "@/utils/chatUtils";
import { hasAnyRequiredRole } from "@/utils/authUtils";

export default function AdminChat() {
    const { user: userResponse } = useAuth();
    const user = userResponse?.data;
    const { sendMessage } = useChat();
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
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
    
    const currentUserAvatar = getAvatarUrl(user?.avatar, user?.roles) || DEFAULT_ADMIN_AVATAR;
    
    const { selectedUser, conversations, unreadCounts = {} } = useSelector((state: RootState) => state.chat);
    const { data: usersData, isLoading: isLoadingUsers } = useGetUserWhoHaveChattedQuery();
    const { data: historyData, isLoading: isLoadingHistory } = useGetChatHistoryQuery(
        selectedUser || ADMIN_TOPIC,
        { skip: !selectedUser }
    );

    const conversationKey = useMemo(
        () => selectedUser ? getConversationKey(selectedUser, ADMIN_TOPIC) : null,
        [selectedUser]
    );
    
    const conversationMessages = useMemo(
        () => conversationKey ? (conversations[conversationKey] || []) : [],
        [conversationKey, conversations]
    );
    
    const displayMessages = useMemo(() => {
        if (!selectedUser || !conversationKey) return [];
        
        const uniqueMessages = removeDuplicateMessages(conversationMessages);
        return sortMessagesByTime(uniqueMessages);
    }, [selectedUser, conversationKey, conversationMessages]);

    useEffect(() => {
        if (selectedUser && historyData?.data && historyData.data.length > 0) {
            dispatch(
                setChatHistory({
                    messages: historyData.data,
                    recipientUsername: selectedUser,
                })
            );
            
            // Đánh dấu conversation đã đọc khi load history
            const key = getConversationKey(selectedUser, ADMIN_TOPIC);
            dispatch(markConversationAsRead(key));
        }
    }, [historyData, selectedUser, dispatch]);

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
    
    useEffect(() => {
        lastMessageIdRef.current = null;
    }, [selectedUser]);

    const handleSelectUser = (username: string) => {
        dispatch(setSelectedUser(username));
        setMessage("");
        
        // Đánh dấu conversation đã đọc
        const key = getConversationKey(username, ADMIN_TOPIC);
        dispatch(markConversationAsRead(key));
    };

    const handleSend = () => {
        if (!selectedUser) {
            toast.error("Vui lòng chọn người dùng để gửi tin nhắn");
            return;
        }
        
        if (!message.trim() || !user) {
            return;
        }
        
        sendMessage(message, selectedUser);
        setMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };


    const filteredUsers = useMemo(
        () => (usersData?.data || []).filter((user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [usersData?.data, searchTerm]
    );

    return (
        <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Sidebar - User List */}
            <div className="w-80 border-r bg-gray-50 flex flex-col">
                <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">Danh sách người dùng</h2>
                    </div>
                </div>

                {/* Search */}
                <div className="p-3 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoadingUsers ? (
                        <div className="p-4 text-center text-gray-500">Đang tải...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            {searchTerm ? "Không tìm thấy người dùng" : "Chưa có người dùng nào"}
                        </div>
                    ) : (
                        filteredUsers.map((user) => {
                            const conversationKey = getConversationKey(user.username, ADMIN_TOPIC);
                            const unreadCount = (unreadCounts && unreadCounts[conversationKey]) || 0;
                            const hasUnread = unreadCount > 0;
                            const userAvatarUrl = getAvatarUrl(user.avatar, user.roles) || DEFAULT_USER_AVATAR;
                            
                            return (
                                <button
                                    key={user.username}
                                    onClick={() => handleSelectUser(user.username)}
                                    className={`w-full p-4 text-left border-b hover:bg-gray-100 transition-colors ${
                                        selectedUser === user.username ? "bg-blue-50 border-blue-200" : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10 flex-shrink-0">
                                            <AvatarImage src={userAvatarUrl} alt={user.username} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`font-medium truncate ${hasUnread ? "font-bold text-gray-900" : "text-gray-800"}`}>
                                                    {user.username}
                                                </p>
                                                {hasUnread && (
                                                    <span className="flex-shrink-0 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-2 flex items-center justify-center">
                                                        {unreadCount > 99 ? "99+" : unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">Nhấn để xem tin nhắn</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">Chat với {selectedUser}</h2>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {isLoadingHistory ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-gray-500">Đang tải tin nhắn...</div>
                                </div>
                            ) : displayMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                                    <p>Chưa có tin nhắn nào với người dùng này.</p>
                                </div>
                            ) : (
                                displayMessages.map((msg, index) => {
                                    const isMine = isMyMessage(msg, user?.username);
                                    // Tìm user object từ danh sách để lấy avatar
                                    const messageUser = usersData?.data?.find(u => u.username === msg.senderUsername);
                                    const messageUserAvatar = messageUser 
                                        ? (getAvatarUrl(messageUser.avatar, messageUser.roles) || DEFAULT_USER_AVATAR)
                                        : DEFAULT_USER_AVATAR;
                                    
                                    return (
                                        <div
                                            key={`${msg.id}-${index}-${msg.timestamp}`}
                                            className={`flex ${isMine ? "justify-end" : "justify-start"} items-end gap-2`}
                                        >
                                            {!isMine && (
                                                <Avatar className="w-8 h-8 flex-shrink-0">
                                                    <AvatarImage src={messageUserAvatar} alt={msg.senderUsername} />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs font-bold">
                                                        {msg.senderUsername.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div
                                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                                    isMine
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-white text-gray-800 border border-gray-200"
                                                }`}
                                            >
                                                {!isMine && (
                                                    <div className="text-xs font-semibold mb-1 text-gray-600">
                                                        {msg.senderUsername}
                                                    </div>
                                                )}
                                                <p className="text-sm whitespace-pre-wrap break-words">
                                                    {msg.content}
                                                </p>
                                                <div
                                                    className={`text-xs mt-1 ${
                                                        isMine ? "text-blue-100" : "text-gray-500"
                                                    }`}
                                                >
                                                    {formatChatTime(msg.timestamp)}
                                                </div>
                                            </div>
                                            {isMine && (
                                                <Avatar className="w-8 h-8 flex-shrink-0">
                                                    <AvatarImage src={currentUserAvatar} alt={user?.username || "Admin"} />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                                                        {user?.username?.charAt(0).toUpperCase() || "A"}
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
                        <div className="p-4 border-t bg-white">
                            <div className="flex gap-2">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows={2}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!message.trim()}
                                    className="px-6"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center text-gray-400">
                            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Chọn một người dùng để bắt đầu chat</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
