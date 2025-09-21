import axios from "axios";

import { LoginFormData, RegisterFormData } from "@/types/auth";

const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

// User data interface
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Local storage keys
const USER_KEY = "chat_user";
const TOKEN_KEY = "chat_token";

// Auth service functions
export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BaseUrl}/api/users/login`, data);
    const responseData = response.data;

    // Extract user and token from the nested response structure
    const user = responseData.data?.user;
    const token = responseData.data?.token;

    if (!user || !token) {
      throw new Error("Invalid response structure from server");
    }

    // Store user data and token in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);

    return { user, token };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerApi = async (
  data: RegisterFormData
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BaseUrl}/api/users/register`, data);
    const responseData = response.data;

    // Extract user and token from the nested response structure
    const user = responseData.data.user;
    const token = responseData.data.token;

    // Store user data and token in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);

    return { user, token };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Get stored user data
export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting stored user:", error);
    return null;
  }
};

// Get stored token
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting stored token:", error);
    return null;
  }
};

// Logout function
export const logout = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const user = getStoredUser();
  const token = getStoredToken();
  return !!(user && token);
};

// Update user data
export const updateStoredUser = (userData: Partial<User>): void => {
  if (typeof window === "undefined") return;

  try {
    const currentUser = getStoredUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.error("Error updating stored user:", error);
  }
};
