/**
 * Chat Constants
 * Centralized constants for chat functionality
 */
export const ADMIN_TOPIC = "admin_chat_topic";
export const WS_URL = "http://localhost:8080/ws-chat";

/**
 * WebSocket destinations
 */
export const WS_DESTINATIONS = {
  SEND_USER: "/app/chat.send.user",
  SEND_ADMIN: "/app/chat.send.admin",
  ADMIN_TOPIC: `/topic/${ADMIN_TOPIC}`,
  USER_QUEUE: (username: string) => `/user/${username}/queue/messages`,
} as const;

/**
 * Role names for chat authorization
 */
export const CHAT_ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
  USER: "USER",
} as const;

export type ChatRole = typeof CHAT_ROLES[keyof typeof CHAT_ROLES];

