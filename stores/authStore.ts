import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  User,
  getStoredUser,
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
        set({ user, isAuthenticated });
      },

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => {
        authLogout();
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser });
        } else {
          // If no user exists, set the new user data
          set({ user: userData as User });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check for stored user data on rehydration
          const storedUser = getStoredUser();
          if (storedUser) {
            state.setUser(storedUser);
          }
          state.setLoading(false);
        }
      },
    }
  )
);

// Initialize auth state on app start
export const initializeAuth = () => {
  const storedUser = getStoredUser();
  if (storedUser) {
    useAuthStore.getState().setUser(storedUser);
  }
  useAuthStore.getState().setLoading(false);
};
