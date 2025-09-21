"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  LogOut,
  User,
  Globe,
  Lock,
  Shield,
} from "lucide-react";
import { getRooms } from "@/services/room";
import { ChatRoom } from "@/types/chat";
import { LoadingPage } from "@/components/LoadingPage";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Load rooms when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadRooms();
    }
  }, [isAuthenticated, user]);

  const loadRooms = async () => {
    try {
      const roomsData = await getRooms();
      setRooms(roomsData);
    } catch (error) {
      console.error("Failed to load rooms:", error);
      toast.error("Failed to load chat rooms");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
    toast.success("Logged out successfully!");
  };

  if (isLoading) {
    return <LoadingPage message="Initializing your chat experience..." />;
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                ChatApp
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {user.username}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50">
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6">
                    Quick Actions
                  </h2>
                  <div className="space-y-4">
                    <Button
                      onClick={() => router.push("/chat")}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Chatting
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-slate-200 dark:border-slate-700"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Find People
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
                    Room Types
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        Public
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {rooms.filter((r) => r.type === "public").length}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        Group
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {rooms.filter((r) => r.type === "group").length}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4 text-red-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        Private
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {rooms.filter((r) => r.type === "private").length}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Start Chatting Section */}
              <div>
                <div className="text-center space-y-8">
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                      <MessageSquare className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                        Welcome to ChatApp
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto">
                        Start connecting with people around the world through
                        real-time conversations
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Button
                      onClick={() => router.push("/chat")}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-4 text-lg font-semibold"
                    >
                      <MessageSquare className="w-5 h-5 mr-3" />
                      Start Chatting
                    </Button>

                    <div className="flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Real-time messaging</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <span>Secure & private</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                          style={{ animationDelay: "1s" }}
                        ></div>
                        <span>Global community</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-200/50 dark:border-slate-700/50 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {rooms.length}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Active Rooms
                      </div>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-200/50 dark:border-slate-700/50 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        Live
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Real-time Chat
                      </div>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-200/50 dark:border-slate-700/50 text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        24/7
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Always Online
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
