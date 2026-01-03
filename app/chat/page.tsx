"use client";

import React, { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoomList } from "@/components/RoomList";
import { GradientBackground } from "@/components/GradientBackground";
import { LoadingPage } from "@/components/LoadingPage";
import { useState } from "react";
import { Plus, MessageSquare, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { AddParticipantModal } from "@/components/AddParticipantModal";

export default function ChatPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const {
    currentRoom,
    rooms,
    messages,
    isLoading,
    joinRoom,
    enterRoom,
    createRoom,
    sendMessage,
    startTyping,
    stopTyping,
    setCurrentRoom,
    loadUserRooms,
  } = useChatStore();
  const router = useRouter();

  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [localMessages, setLocalMessages] = useState<typeof messages>([]);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync local messages with context messages
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [localMessages, currentRoom?.id]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <LoadingPage message="Loading your chat workspace..." />
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <GradientBackground>
        <div className="min-h-screen flex items-center justify-center px-6">
          <Card className="p-10 max-w-md w-full bg-white/5 border-white/10 backdrop-blur-xl text-center text-white">
            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-[0_20px_80px_rgba(16,185,129,0.35)]">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Please log in</h1>
            <p className="text-slate-200/80 mb-6">
              You need to be authenticated to access the chat interface.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-900 font-semibold hover:from-emerald-300 hover:to-cyan-400"
            >
              Go to Login
            </Button>
          </Card>
        </div>
      </GradientBackground>
    );
  }

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    createRoom(newRoomName.trim(), newRoomDescription.trim() || undefined);
    setNewRoomName("");
    setNewRoomDescription("");
    setShowCreateRoom(false);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    sendMessage(messageInput.trim());
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (e.target.value.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleParticipantAdded = (updatedRoom: typeof currentRoom) => {
    // Refresh the current room data
    setCurrentRoom(updatedRoom);
    // Also refresh the room list to show the updated room
    loadUserRooms();
  };

  // Check if current user can add participants (admin or moderator)
  // const canAddParticipants =
  //   currentRoom &&
  //   user &&
  //   currentRoom.participants.some(
  //     (p) => p.user === user.id && ["admin", "moderator"].includes(p.role)
  //   );

  // Alternative: Allow all participants to add people (uncomment the line below and comment the above)
  const canAddParticipants = currentRoom && user;

  return (
    <GradientBackground>
      {/* Header */}
      <header className="bg-white/10 border border-white/10 backdrop-blur-md rounded-b-3xl mx-4 sm:mx-8 lg:mx-16 mt-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 text-white">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-[0_10px_40px_rgba(16,185,129,0.35)]">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold">ChatApp</h1>
              </div>
              {currentRoom && (
                <div className="ml-6 flex items-center gap-2 text-sm text-emerald-200">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>{currentRoom.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-slate-900 text-sm font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-200">
                  {user.username}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/login")}
                className="bg-white/30 text-white hover:border-red-300 hover:bg-red-500/10 transition-colors"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
          {/* Room List Sidebar */}
          <div className="lg:col-span-1 h-full min-h-0">
            <Card className="h-full flex flex-col bg-white/5 border-white/10 backdrop-blur-xl text-white shadow-2xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-[0_15px_50px_rgba(16,185,129,0.35)]">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    Chat Rooms
                  </h2>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateRoom(!showCreateRoom)}
                    className="bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Room
                  </Button>
                </div>

                {showCreateRoom && (
                  <div className="space-y-6 p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-xl">
                    <div>
                      <Label
                        htmlFor="roomName"
                        className="text-sm font-medium text-white/80"
                      >
                        Room Name
                      </Label>
                      <Input
                        id="roomName"
                        placeholder="Enter room name"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        className="mt-2 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="roomDescription"
                        className="text-sm font-medium text-white/80"
                      >
                        Description (Optional)
                      </Label>
                      <Input
                        id="roomDescription"
                        placeholder="Enter room description"
                        value={newRoomDescription}
                        onChange={(e) => setNewRoomDescription(e.target.value)}
                        className="mt-2 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-emerald-400"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleCreateRoom}
                        className="flex-1 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={!newRoomName.trim() || isLoading}
                      >
                        {isLoading ? "Creating..." : "Create Room"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreateRoom(false);
                          setNewRoomName("");
                          setNewRoomDescription("");
                        }}
                        className="bg-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <RoomList
                  rooms={rooms}
                  currentRoomId={currentRoom?.id}
                  currentUserId={user?.id}
                  onJoinRoom={joinRoom}
                  onEnterRoom={enterRoom}
                  onLeaveRoom={() => {
                    setCurrentRoom(null);
                    setLocalMessages([]);
                  }}
                  isLoading={isLoading}
                />
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 h-full min-h-0">
            {!currentRoom ? (
              <Card className="h-full flex items-center justify-center bg-white/5 border-white/10 backdrop-blur-xl text-white shadow-2xl">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_20px_80px_rgba(16,185,129,0.45)]">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Welcome to ChatApp</h3>
                  <p className="text-slate-200/80 text-lg mb-6 max-w-md mx-auto">
                    Choose a room from the sidebar to start chatting with your
                    team in real time.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>Ready to connect</span>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex flex-col bg-white/5 border-white/10 backdrop-blur-xl text-white shadow-2xl">
                {/* Chat Header */}
                <div className="p-6 border-b border-white/10 bg-white/5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_15px_60px_rgba(16,185,129,0.4)]">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">
                          {currentRoom.name}
                        </h3>
                        {currentRoom.description && (
                          <p className="text-sm text-slate-200/80 mt-1">
                            {currentRoom.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-slate-300">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <span>
                              {currentRoom.participants.length} online
                            </span>
                          </div>
                          <div className="text-xs text-slate-300">
                            {currentRoom.participants.length} participant(s)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {canAddParticipants && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddParticipant(true)}
                          className="border-white/20 bg-white/10"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Add People
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentRoom(null);
                          setLocalMessages([]);
                        }}
                         className="border-white/20 bg-white/10"
                      >
                        Leave Room
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/5 via-transparent to-transparent custom-scrollbar"
                >
                  {localMessages.length === 0 ? (
                    <div className="text-center mt-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400/30 to-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-emerald-300" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        No messages yet
                      </h4>
                      <p className="text-slate-300">
                        Start the conversation by sending your first message!
                      </p>
                    </div>
                  ) : (
                    localMessages.map((message) => {
                      const rawTimestamp = message.createdAt ?? message.timestamp;
                      const parsedDate = rawTimestamp
                        ? new Date(rawTimestamp)
                        : null;
                      const formattedTime =
                        parsedDate && !Number.isNaN(parsedDate.getTime())
                          ? parsedDate.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—";

                      return (
                      <div
                        key={message.id}
                        className={`flex gap-3 message-enter animate-fade-in ${
                          message.sender.id === user.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.sender.id !== user.id && (
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-slate-900 text-sm font-semibold flex-shrink-0">
                            {message.sender.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col max-w-xs lg:max-w-md">
                          {message.sender.id !== user.id && (
                            <div className="text-xs font-medium text-slate-200 mb-1 px-1">
                              {message.sender.username}
                            </div>
                          )}
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-lg ${
                              message.sender.id === user.id
                                ? "bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-900 rounded-br-md"
                                : "bg-white/10 text-white border border-white/10 rounded-bl-md backdrop-blur-md"
                            }`}
                          >
                            <div className="text-sm leading-relaxed">
                              {message.content}
                            </div>
                          </div>
                          <span className="text-xs text-slate-300 mt-1 text-right">
                            {formattedTime}
                          </span>
                        </div>
                        {message.sender.id === user.id && (
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-xl">
                  <div className="space-y-4">
                    {/* Message Input */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          value={messageInput}
                          onChange={handleTyping}
                          onKeyDown={handleKeyPress}
                          placeholder="Type your message..."
                          className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-emerald-400"
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "Send"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Add Participant Modal */}
      {currentRoom && user && (
        <AddParticipantModal
          isOpen={showAddParticipant}
          onClose={() => setShowAddParticipant(false)}
          room={currentRoom}
          onParticipantAdded={handleParticipantAdded}
          currentUserId={user.id}
        />
      )}
    </GradientBackground>
  );
}
