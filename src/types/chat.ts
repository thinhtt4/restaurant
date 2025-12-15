export interface ChatMessage {
  id: number;
  senderUsername: string;
  recipientUsername: string;
  content: string;
  timestamp: string; 
  isRead: boolean;
}