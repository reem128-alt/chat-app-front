"use client";

import { useEffect } from "react";
import {
  useAuthStore,
  useChatStore,
  setupChatSocketHandlers,
  cleanupChatSocketHandlers,
} from "@/stores";
import { socketService } from "@/services/socket";

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const { user, setLoading } = useAuthStore();
  const { loadUserRooms } = useChatStore();

  useEffect(() => {
    // Initialize auth state
    const storedUser = localStorage.getItem("auth-storage");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.state?.user) {
          useAuthStore.getState().setUser(parsed.state.user);
        }
      } catch (error) {
        console.error("Error parsing stored auth data:", error);
      }
    }
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    if (user) {
      // Initialize socket connection and load rooms
      socketService.connect();
      loadUserRooms();

      // Set up socket event handlers
      setupChatSocketHandlers();

      return () => {
        // Clean up socket handlers and disconnect
        cleanupChatSocketHandlers();
        socketService.disconnect();
      };
    }
  }, [user, loadUserRooms]);

  return <>{children}</>;
};
