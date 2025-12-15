import type { ChatMessage } from "@/types/chat";
import { ADMIN_TOPIC } from "@/constants/chat";

/**
 * Generate a consistent conversation key from two usernames
 * Ensures the same key regardless of parameter order
 */
export function getConversationKey(user1: string, user2: string): string {
  return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
}

/**
 * Normalize conversation key based on sender and recipient
 * Handles admin topic conversations consistently
 */
export function normalizeConversationKey(
  senderUsername: string,
  recipientUsername: string
): string {
  if (recipientUsername === ADMIN_TOPIC) {
    return getConversationKey(senderUsername, ADMIN_TOPIC);
  }
  
  if (senderUsername !== ADMIN_TOPIC && recipientUsername !== ADMIN_TOPIC) {
    return getConversationKey(recipientUsername, ADMIN_TOPIC);
  }
  
  return getConversationKey(senderUsername, recipientUsername);
}

/**
 * Format timestamp to localized time string
 */
export function formatChatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Check if a message belongs to the current user
 */
export function isMyMessage(message: ChatMessage, currentUsername?: string): boolean {
  return message.senderUsername === currentUsername;
}

/**
 * Remove duplicate messages based on ID or content similarity
 */
export function removeDuplicateMessages(messages: ChatMessage[]): ChatMessage[] {
  const seen = new Map<number | string, ChatMessage>();
  
  for (const msg of messages) {
    const key = msg.id || `${msg.senderUsername}-${msg.content}-${msg.timestamp}`;
    if (!seen.has(key)) {
      seen.set(key, msg);
    }
  }
  
  return Array.from(seen.values());
}

/**
 * Sort messages by timestamp
 */
export function sortMessagesByTime(messages: ChatMessage[]): ChatMessage[] {
  return [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

/**
 * Check if user has admin/manager/staff role
 */
export function hasAdminRole(roles?: Array<{ name: string }>): boolean {
  if (!roles) return false;
  
  return roles.some(
    (r) =>
      r.name.toUpperCase() === "ADMIN" ||
      r.name.toUpperCase() === "MANAGER" ||
      r.name.toUpperCase() === "STAFF"
  );
}

