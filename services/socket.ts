import { io, Socket } from "socket.io-client";

// Socket event types matching backend
export interface IJoinData {
  userId: string;
  username: string;
  chatRoomId: string;
}

export interface ISendMessageData {
  content: string;
  chatRoomId: string;
  senderId: string;
}

export interface ITypingData {
  chatRoomId: string;
}

export interface IMessageResponse {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  timestamp: Date;
  messageType: string;
}

export interface IUserJoinedData {
  userId: string;
  username: string;
  timestamp: Date;
}

export interface IUserLeftData {
  userId: string;
  username: string;
  timestamp: Date;
}

export interface IUserTypingData {
  userId: string;
  username: string;
  isTyping: boolean;
}

class SocketService {
  private socket: Socket | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  }

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(this.baseUrl, {
        transports: ["websocket", "polling"],
        autoConnect: true,
      });

      this.socket.on("connect", () => {
        console.log("✅ Connected to socket server:", this.socket?.id);
      });

      this.socket.on("disconnect", () => {
        console.log("❌ Disconnected from socket server");
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(data: IJoinData): void {
    if (this.socket) {
      this.socket.emit("join", data);
    }
  }

  leaveRoom(data: { chatRoomId: string }): void {
    if (this.socket) {
      this.socket.emit("leave", data);
    }
  }

  sendMessage(data: ISendMessageData): void {
    if (this.socket) {
      this.socket.emit("send_message", data);
    }
  }

  startTyping(data: ITypingData): void {
    if (this.socket) {
      this.socket.emit("typing_start", data);
    }
  }

  stopTyping(data: ITypingData): void {
    if (this.socket) {
      this.socket.emit("typing_stop", data);
    }
  }

  // Event listeners
  onNewMessage(callback: (message: IMessageResponse) => void): void {
    if (this.socket) {
      this.socket.on("new_message", callback);
    }
  }

  onRecentMessages(callback: (messages: IMessageResponse[]) => void): void {
    if (this.socket) {
      this.socket.on("recent_messages", callback);
    }
  }

  onUserJoined(callback: (data: IUserJoinedData) => void): void {
    if (this.socket) {
      this.socket.on("user_joined", callback);
    }
  }

  onUserLeft(callback: (data: IUserLeftData) => void): void {
    if (this.socket) {
      this.socket.on("user_left", callback);
    }
  }

  onUserTyping(callback: (data: IUserTypingData) => void): void {
    if (this.socket) {
      this.socket.on("user_typing", callback);
    }
  }

  onError(callback: (error: { message: string }) => void): void {
    if (this.socket) {
      this.socket.on("error", callback);
    }
  }

  // Remove event listeners
  offNewMessage(): void {
    if (this.socket) {
      this.socket.off("new_message");
    }
  }

  offRecentMessages(): void {
    if (this.socket) {
      this.socket.off("recent_messages");
    }
  }

  offUserJoined(): void {
    if (this.socket) {
      this.socket.off("user_joined");
    }
  }

  offUserLeft(): void {
    if (this.socket) {
      this.socket.off("user_left");
    }
  }

  offUserTyping(): void {
    if (this.socket) {
      this.socket.off("user_typing");
    }
  }

  offError(): void {
    if (this.socket) {
      this.socket.off("error");
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
export const socketService = new SocketService();
export default socketService;
