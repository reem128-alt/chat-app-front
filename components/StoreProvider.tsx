"use client";

import { useEffect, useState } from "react";
import {
  useAuthStore,
  useChatStore,
  setupChatSocketHandlers,
  cleanupChatSocketHandlers,
} from "@/stores";
import { socketService } from "@/services/socket";
import { getStoredToken, getStoredUser } from "@/services/auth";

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const { user, setUser, setLoading } = useAuthStore();
  const { loadUserRooms } = useChatStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state and socket connection
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getStoredToken();
        const storedUser = getStoredUser();
        
        if (token && storedUser) {
          setUser(storedUser);
          // Initialize socket connection if needed
          socketService.connect();
          await loadUserRooms();
          setupChatSocketHandlers();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      cleanupChatSocketHandlers();
      socketService.disconnect();
    };
  }, [setLoading, setUser, loadUserRooms]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
