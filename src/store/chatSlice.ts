import type { ChatMessage } from "@/types/chat";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import { normalizeConversationKey, getConversationKey } from "@/utils/chatUtils";
import { ADMIN_TOPIC } from "@/constants/chat";

interface ChatState {
    messages: ChatMessage[];
    selectedUser: string | null;
    conversations: Record<string, ChatMessage[]>;
    unreadCounts: Record<string, number>;
}

const initialState: ChatState = {
    messages: [], 
    selectedUser: null,
    conversations: {},
    unreadCounts: {},
};

function isDuplicateMessage(existing: ChatMessage, newMsg: ChatMessage): boolean {
    if (existing.id && newMsg.id && existing.id === newMsg.id) {
        return true;
    }
    
    const timeDiff = Math.abs(
        new Date(existing.timestamp).getTime() - new Date(newMsg.timestamp).getTime()
    );
    
    return (
        existing.senderUsername === newMsg.senderUsername &&
        existing.content === newMsg.content &&
        existing.recipientUsername === newMsg.recipientUsername &&
        timeDiff < 5000
    );
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addRealtimeMessage: (state, action: PayloadAction<ChatMessage>) => {
            const message = action.payload;
            const conversationKey = normalizeConversationKey(message.senderUsername, message.recipientUsername);
            
            if (!state.conversations[conversationKey]) {
                state.conversations[conversationKey] = [];
            }
            
          
            if (!state.unreadCounts) {
                state.unreadCounts = {};
            }
            
            const existingMessages = state.conversations[conversationKey];
            
            const existingIndex = existingMessages.findIndex(m => 
                isDuplicateMessage(m, message)
            );
            
            if (existingIndex >= 0) {
                if (existingMessages[existingIndex].id !== message.id) {
                    existingMessages[existingIndex] = message;
                }
            } else {
                existingMessages.push(message);
            }

            existingMessages.sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            
            const isCurrentlyViewing = state.selectedUser === message.senderUsername;
            const isMessageToAdmin = message.recipientUsername === ADMIN_TOPIC;
            
            // Nếu staff đang xem cuộc trò chuyện với user này, đánh dấu tin nhắn là đã đọc
            if (isCurrentlyViewing && isMessageToAdmin) {
                message.isRead = true;
            }

            // Tính lại unread count cho conversation này
            // Chỉ đếm tin nhắn chưa đọc từ user đến admin
            // Và chỉ khi staff KHÔNG đang trong cuộc trò chuyện với user đó
            const unreadMessages = existingMessages.filter(msg => {
                const isUnread = !msg.isRead && msg.recipientUsername === ADMIN_TOPIC;
                const isViewingThisConversation = state.selectedUser === msg.senderUsername;
                
                // Chỉ đếm nếu:
                // 1. Tin nhắn chưa đọc
                // 2. Tin nhắn từ user đến admin
                // 3. Staff KHÔNG đang xem cuộc trò chuyện với user này
                return isUnread && !isViewingThisConversation;
            });
            
            if (unreadMessages.length > 0) {
                state.unreadCounts[conversationKey] = unreadMessages.length;
            } else {
                delete state.unreadCounts[conversationKey];
            }
        },
        
        setChatHistory: (state, action: PayloadAction<{ messages: ChatMessage[]; recipientUsername: string }>) => {
            const { messages } = action.payload; 
            
            if (!messages || messages.length === 0) {
                return;
            }
            
            
            if (!state.unreadCounts) {
                state.unreadCounts = {};
            }
            
            const conversationKeys = new Set<string>();
            
            messages.forEach(msg => {
                const key = normalizeConversationKey(msg.senderUsername, msg.recipientUsername);
                conversationKeys.add(key);
            });
            
            conversationKeys.forEach(key => {
                const existingMessages = state.conversations[key] || [];
                const newMessages = messages.filter(msg => 
                    normalizeConversationKey(msg.senderUsername, msg.recipientUsername) === key
                );
                
                const merged = [...existingMessages];
                newMessages.forEach(newMsg => {
                    const existingIndex = merged.findIndex(m => isDuplicateMessage(m, newMsg));
                    
                    if (existingIndex >= 0) {
                        merged[existingIndex] = newMsg;
                    } else {
                        merged.push(newMsg);
                    }
                });
                
                state.conversations[key] = merged.sort(
                    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );

                // Tính lại unread count cho conversation này (chỉ tin nhắn từ user đến admin)
                const unreadCount = merged.filter(msg => 
                    !msg.isRead && msg.recipientUsername === ADMIN_TOPIC
                ).length;
                if (unreadCount > 0) {
                    state.unreadCounts[key] = unreadCount;
                } else {
                    delete state.unreadCounts[key];
                }
            });
        },
    
        clearChatState: (state) => {
            state.messages = [];
            state.selectedUser = null;
            state.conversations = {};
            state.unreadCounts = {};
        },
        
        setSelectedUser: (state, action: PayloadAction<string | null>) => {
            const previousSelectedUser = state.selectedUser;
            state.selectedUser = action.payload;
            
            // Đảm bảo unreadCounts được khởi tạo
            if (!state.unreadCounts) {
                state.unreadCounts = {};
            }
            
            // Đánh dấu conversation trước đó là đã đọc khi chuyển sang user khác
            if (previousSelectedUser && previousSelectedUser !== action.payload) {
                const prevKey = getConversationKey(previousSelectedUser, ADMIN_TOPIC);
                const prevMessages = state.conversations[prevKey];
                if (prevMessages) {
                    prevMessages.forEach(msg => {
                        if (msg.recipientUsername === ADMIN_TOPIC) {
                            msg.isRead = true;
                        }
                    });
                    delete state.unreadCounts[prevKey];
                }
            }
            
            // Đánh dấu conversation hiện tại là đã đọc và cập nhật unread count
            if (action.payload) {
                const currentKey = getConversationKey(action.payload, ADMIN_TOPIC);
                const currentMessages = state.conversations[currentKey];
                if (currentMessages) {
                    currentMessages.forEach(msg => {
                        if (msg.recipientUsername === ADMIN_TOPIC) {
                            msg.isRead = true;
                        }
                    });
                    delete state.unreadCounts[currentKey];
                }
            }
        },

        markConversationAsRead: (state, action: PayloadAction<string>) => {
            // Đảm bảo unreadCounts được khởi tạo
            if (!state.unreadCounts) {
                state.unreadCounts = {};
            }
            
            const conversationKey = action.payload;
            const messages = state.conversations[conversationKey];
            
            if (messages) {
                messages.forEach(msg => {
                    msg.isRead = true;
                });
                delete state.unreadCounts[conversationKey];
            }
        },
    },
    extraReducers: (builder) => {
        // Handle REHYDRATE để đảm bảo unreadCounts luôn được khởi tạo
        builder.addCase(REHYDRATE, (state, action: any) => {
            // Đảm bảo state hiện tại luôn có unreadCounts
            if (!state.unreadCounts) {
                state.unreadCounts = {};
            }
            
            // Nếu có persisted state và không có unreadCounts, khởi tạo nó
            if (action.payload?.chat && !action.payload.chat.unreadCounts) {
                action.payload.chat.unreadCounts = {};
            }
        });
    },
});

export const { 
    addRealtimeMessage, 
    setChatHistory, 
    clearChatState, 
    setSelectedUser,
    markConversationAsRead,
} = chatSlice.actions;

export default chatSlice.reducer;