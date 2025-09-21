import { ChatRoom } from "@/types/chat";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
console.log("API_BASE_URL:", API_BASE_URL);

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("chat_token");
  }
  return null;
};

// Make authenticated API request
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// Get user's rooms
export const getRooms = async (): Promise<ChatRoom[]> => {
  const response = await apiRequest("/api/rooms");
  return response.data;
};

// Create a new room
export const createRoom = async (roomData: {
  name: string;
  description?: string;
  type?: string;
}): Promise<ChatRoom> => {
  const response = await apiRequest("/api/rooms", {
    method: "POST",
    body: JSON.stringify(roomData),
  });
  return response.data;
};

// Get room by ID
export const getRoom = async (roomId: string): Promise<ChatRoom> => {
  const response = await apiRequest(`/api/rooms/${roomId}`);
  return response.data;
};

// Join a room
export const joinRoom = async (roomId: string): Promise<ChatRoom> => {
  const response = await apiRequest(`/api/rooms/${roomId}/join`, {
    method: "POST",
  });
  return response.data;
};

// Leave a room
export const leaveRoom = async (roomId: string): Promise<void> => {
  await apiRequest(`/api/rooms/${roomId}/leave`, {
    method: "POST",
  });
};

// Add participant to room
export const addParticipant = async (
  roomId: string,
  userId: string,
  role: string = "member"
): Promise<ChatRoom> => {
  const response = await apiRequest(`/api/rooms/${roomId}/participants`, {
    method: "POST",
    body: JSON.stringify({ userId, role }),
  });
  return response.data;
};

// Get room messages
export const getRoomMessages = async (
  roomId: string,
  page: number = 1,
  limit: number = 50
) => {
  const response = await apiRequest(
    `/api/rooms/${roomId}/messages?page=${page}&limit=${limit}`
  );
  return response.data;
};
