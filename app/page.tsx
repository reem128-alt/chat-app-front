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
import { GradientBackground } from "@/components/GradientBackground";
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
    <GradientBackground>
      {/* Header */}
      <header className="bg-white/10 border border-white/10 backdrop-blur-md sticky top-0 z-50 rounded-b-3xl mx-4 sm:mx-8 lg:mx-16 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
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
                className="bg-white/10  hover:border-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl text-white">
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6">
                    Quick Actions
                  </h2>
                  <div className="space-y-4">
                    <Button
                      onClick={() => router.push("/chat")}
                      className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-900 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Chatting
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-black "
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Find People
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-200 mb-4">
                    Room Types
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Globe className="w-4 h-4 text-emerald-300" />
                      <span>
                        Public
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {rooms.filter((r) => r.type === "public").length}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Shield className="w-4 h-4 text-cyan-300" />
                      <span>
                        Group
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {rooms.filter((r) => r.type === "group").length}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Lock className="w-4 h-4 text-rose-300" />
                      <span>
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
          <div className="lg:col-span-3 text-white">
            <div className="space-y-8">
              {/* Start Chatting Section */}
              <div>
                <div className="text-center space-y-8">
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto shadow-[0_30px_120px_rgba(16,185,129,0.45)]">
                      <MessageSquare className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-3xl font-bold text-white drop-shadow-xl">
                        Welcome to ChatApp
                      </h2>
                      <p className="text-slate-200/80 text-lg max-w-md mx-auto">
                        Start connecting with people around the world through
                        real-time conversations
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Button
                      onClick={() => router.push("/chat")}
                      size="lg"
                      className="bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-900 font-semibold shadow-emerald-500/50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-4 text-lg"
                    >
                      <MessageSquare className="w-5 h-5 mr-3" />
                      Start Chatting
                    </Button>

                    <div className="flex items-center justify-center gap-8 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span>Real-time messaging</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <span>Secure & private</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                          style={{ animationDelay: "1s" }}
                        ></div>
                        <span>Global community</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                      <div className="text-2xl font-bold text-emerald-300 mb-2">
                        {rooms.length}
                      </div>
                      <div className="text-sm text-slate-300">
                        Active Rooms
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                      <div className="text-2xl font-bold text-cyan-300 mb-2">
                        Live
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Real-time Chat
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                      <div className="text-2xl font-bold text-blue-300 mb-2">
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
      </section>
    </GradientBackground>
  );
}
