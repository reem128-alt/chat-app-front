import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  User,
  getStoredToken,
  logout as authLogout,
} from "@/services/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        const isAuthenticated = !!(user && getStoredToken());
        set({ user, isAuthenticated, isLoading: false });
      },

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => {
        authLogout();
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
