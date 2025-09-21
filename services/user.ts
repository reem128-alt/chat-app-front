import axios from "axios";

const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
}

// Get all users
export const getAllUsers = async (
  search?: string,
  limit?: number
): Promise<User[]> => {
  try {
    const token = localStorage.getItem("chat_token");
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (limit) params.append("limit", limit.toString());

    const response = await axios.get(`${BaseUrl}/api/users/all?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};
