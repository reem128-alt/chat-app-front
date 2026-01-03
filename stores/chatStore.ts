import { create } from "zustand";
import { ChatRoom, Message, ChatUser, TypingUser } from "@/types/chat";
import { socketService } from "@/services/socket";
import {
  createRoom as createRoomAPI,
  getRooms as getUserRooms,
  joinRoom as joinRoomAPI,
  getRoom as enterRoomAPI,
} from "@/services/room";
import { useAuthStore } from "./authStore";
import toast from "react-hot-toast";

interface ChatState {
  currentRoom: ChatRoom | null;
  rooms: ChatRoom[];
  messages: Message[];
  onlineUsers: ChatUser[];
  typingUsers: TypingUser[];
  isLoading: boolean;
  error: string | null;
}

interface ChatActions {
  // Room actions
  joinRoom: (roomId: string) => Promise<void>;
  enterRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => void;
  createRoom: (name: string, description?: string) => Promise<void>;
  setCurrentRoom: (room: ChatRoom | null) => void;
  loadUserRooms: () => Promise<void>;

  // Message actions
  sendMessage: (content: string) => void;
  startTyping: () => void;
  stopTyping: () => void;

  // State setters
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setTypingUsers: (users: TypingUser[]) => void;
  addTypingUser: (user: TypingUser) => void;
  removeTypingUser: (userId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRooms: (rooms: ChatRoom[]) => void;
  addRoom: (room: ChatRoom) => void;
  updateRoom: (roomId: string, room: ChatRoom) => void;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  currentRoom: null,
  rooms: [],
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  isLoading: false,
  error: null,

  // State setters
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setTypingUsers: (typingUsers) => set({ typingUsers }),
  addTypingUser: (user) =>
    set((state) => {
      const filtered = state.typingUsers.filter(
        (u) => u.userId !== user.userId
      );
      return { typingUsers: [...filtered, user] };
    }),
  removeTypingUser: (userId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u.userId !== userId),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  updateRoom: (roomId, room) =>
    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === roomId ? room : r)),
    })),

  // Room actions
  setCurrentRoom: (room) => set({ currentRoom: room }),

  loadUserRooms: async () => {
    try {
      set({ isLoading: true });
      const userRooms = await getUserRooms();
      set({ rooms: userRooms });
    } catch (error) {
      console.error("Failed to load rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      set({ isLoading: false });
    }
  },

  joinRoom: async (roomId: string) => {
    const { user } = useAuthStore.getState();

    console.log("🔄 Attempting to join room:", roomId);
    console.log("👤 User:", user);
    console.log("🔌 Socket connected:", socketService.isConnected());

    if (!user) {
      console.error("❌ No user found");
      toast.error("Please log in to join rooms");
      return;
    }

    if (!socketService.isConnected()) {
      console.error("❌ Socket not connected");
      toast.error("Connection lost. Please refresh the page.");
      return;
    }

    try {
      set({ isLoading: true, error: null });

      console.log("📡 Calling joinRoom API...");
      const joinedRoom = await joinRoomAPI(roomId);
      console.log("✅ Room joined successfully:", joinedRoom);

      set({ currentRoom: joinedRoom });
      get().updateRoom(roomId, joinedRoom);

      console.log("🔌 Joining room via socket...");
      socketService.joinRoom({
        userId: user.id,
        username: user.username,
        chatRoomId: roomId,
      });

      set({ isLoading: false });
      console.log("✅ Join room process completed");
    } catch (error) {
      console.error("❌ Failed to join room:", error);
      toast.error("Failed to join room");
      set({ isLoading: false });
    }
  },

  enterRoom: async (roomId: string) => {
    const { user } = useAuthStore.getState();

    console.log("🔄 Attempting to enter room:", roomId);

    if (!user) {
      console.error("❌ No user found");
      toast.error("Please log in to enter rooms");
      return;
    }

    if (!socketService.isConnected()) {
      console.error("❌ Socket not connected");
      toast.error("Connection lost. Please refresh the page.");
      return;
    }

    try {
      set({ isLoading: true, error: null });

      console.log("📡 Getting room data...");
      const roomData = await enterRoomAPI(roomId);
      console.log("✅ Room data retrieved:", roomData);

      set({ currentRoom: roomData });

      console.log("🔌 Joining room via socket...");
      socketService.joinRoom({
        chatRoomId: roomId,
        userId: user.id,
        username: user.username,
      });

      console.log("✅ Successfully entered room");
    } catch (error) {
      console.error("❌ Error entering room:", error);
      set({ error: "Failed to enter room" });
      toast.error("Failed to enter room");
    } finally {
      set({ isLoading: false });
    }
  },

  leaveRoom: () => {
    const { currentRoom } = get();
    if (!currentRoom || !socketService.isConnected()) return;

    socketService.leaveRoom({ chatRoomId: currentRoom.id });
    set({ currentRoom: null, messages: [], typingUsers: [] });
  },

  createRoom: async (name: string, description?: string) => {
    const { user } = useAuthStore.getState();

    if (!user) return;

    try {
      set({ isLoading: true });

      const roomData = {
        name,
        description,
        type: "group" as const,
      };

      const newRoom = await createRoomAPI(roomData);

      get().addRoom(newRoom);
      set({ currentRoom: newRoom });

      socketService.joinRoom({
        userId: user.id,
        username: user.username,
        chatRoomId: newRoom.id,
      });

      toast.success("Room created successfully!");
      set({ isLoading: false });
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room");
      set({ isLoading: false });
    }
  },

  // Message actions
  sendMessage: (content: string) => {
    const { user } = useAuthStore.getState();
    const { currentRoom } = get();

    if (!user || !currentRoom || !socketService.isConnected()) return;

    socketService.sendMessage({
      content,
      chatRoomId: currentRoom.id,
      senderId: user.id,
    });
  },

  startTyping: () => {
    const { currentRoom } = get();
    if (!currentRoom || !socketService.isConnected()) return;

    socketService.startTyping({ chatRoomId: currentRoom.id });
  },

  stopTyping: () => {
    const { currentRoom } = get();
    if (!currentRoom || !socketService.isConnected()) return;

    socketService.stopTyping({ chatRoomId: currentRoom.id });
  },
}));

// Socket event handlers
export const setupChatSocketHandlers = () => {
  const store = useChatStore.getState();

  // Message handlers
  socketService.onNewMessage((message) => {
    store.addMessage({
      id: message.id,
      content: message.content,
      sender: message.sender,
      timestamp: new Date(message.timestamp),
      createdAt: message.createdAt ?? message.timestamp,
      messageType: message.messageType,
    });
  });

  socketService.onRecentMessages((messages) => {
    store.setMessages(
      messages.map((message) => ({
        id: message.id,
        content: message.content,
        sender: message.sender,
        timestamp: new Date(message.timestamp),
        createdAt: message.createdAt ?? message.timestamp,
        messageType: message.messageType,
      }))
    );
  });

  // User event handlers
  socketService.onUserJoined(
    (data: { userId: string; username: string; timestamp: Date }) => {
      toast.success(`${data.username} joined the chat`);
    }
  );

  socketService.onUserLeft(
    (data: { userId: string; username: string; timestamp: Date }) => {
      toast(`${data.username} left the chat`);
    }
  );

  socketService.onUserTyping(
    (data: { userId: string; username: string; isTyping: boolean }) => {
      if (data.isTyping) {
        store.addTypingUser({
          userId: data.userId,
          username: data.username,
          isTyping: true,
        });
      } else {
        store.removeTypingUser(data.userId);
      }
    }
  );

  socketService.onError((error: { message: string }) => {
    store.setError(error.message);
    toast.error(error.message);
  });
};

// Cleanup socket handlers
export const cleanupChatSocketHandlers = () => {
  socketService.offNewMessage();
  socketService.offRecentMessages();
  socketService.offUserJoined();
  socketService.offUserLeft();
  socketService.offUserTyping();
  socketService.offError();
};
