// Chat room types
export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: "private" | "group" | "public";
  participants: Participant[];
  createdBy: string;
  isActive: boolean;
  lastMessage?: Message;
  lastActivity: Date;
  createdAt: Date;
}

export interface Participant {
  user: string;
  role: "admin" | "moderator" | "member";
  joinedAt: Date;
}

// Message types
export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  timestamp: Date;
  messageType: string;
  isEdited?: boolean;
  editedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
}

// User types for chat
export interface ChatUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

// Typing indicator types
export interface TypingUser {
  userId: string;
  username: string;
  isTyping: boolean;
}

// Chat state types
export interface ChatState {
  currentRoom: ChatRoom | null;
  messages: Message[];
  onlineUsers: ChatUser[];
  typingUsers: TypingUser[];
  isLoading: boolean;
  error: string | null;
}

// Chat room creation types
export interface CreateRoomData {
  name: string;
  description?: string;
  type: "private" | "group" | "public";
  participants?: string[];
}

// Join room types
export interface JoinRoomData {
  roomId: string;
  userId: string;
  username: string;
}

// Message sending types
export interface SendMessageData {
  content: string;
  roomId: string;
  senderId: string;
}

// Socket event types (re-exported from socket service)
export type {
  IJoinData,
  ISendMessageData,
  ITypingData,
  IMessageResponse,
  IUserJoinedData,
  IUserLeftData,
  IUserTypingData,
} from "../services/socket";
