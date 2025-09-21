"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoomList } from "@/components/RoomList";
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

  // Sync local messages with context messages
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Please Login</h1>
          <p className="text-center text-gray-600 mb-6">
            You need to be logged in to access the chat.
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Go to Login
          </Button>
        </Card>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  ChatApp
                </h1>
              </div>
              {currentRoom && (
                <div className="ml-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {currentRoom.name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user.username}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Add logout functionality here
                  router.push("/login");
                }}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-140px)]">
          {/* Room List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-3 text-slate-800 dark:text-slate-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    Chat Rooms
                  </h2>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateRoom(!showCreateRoom)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Room
                  </Button>
                </div>

                {showCreateRoom && (
                  <div className="space-y-6 p-6 border border-slate-200/50 dark:border-slate-700/50 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm">
                    <div>
                      <Label
                        htmlFor="roomName"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Room Name
                      </Label>
                      <Input
                        id="roomName"
                        placeholder="Enter room name"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        className="mt-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="roomDescription"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Description (Optional)
                      </Label>
                      <Input
                        id="roomDescription"
                        placeholder="Enter room description"
                        value={newRoomDescription}
                        onChange={(e) => setNewRoomDescription(e.target.value)}
                        className="mt-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleCreateRoom}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
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
                        className="border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
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
          <div className="lg:col-span-3">
            {!currentRoom ? (
              <Card className="h-full flex items-center justify-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                    Welcome to ChatApp
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-md">
                    Choose a room from the sidebar to start chatting with your
                    friends and colleagues
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Ready to connect</span>
                  </div>
                </div>
              </Card>
            ) : (
              /* Chat Interface */
              <Card className="h-full flex flex-col bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                          {currentRoom.name}
                        </h3>
                        {currentRoom.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {currentRoom.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>
                              {currentRoom.participants.length} online
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-500">
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
                          className="border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600"
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
                        className="border-slate-200 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400"
                      >
                        Leave Room
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-800/30 dark:to-transparent custom-scrollbar">
                  {localMessages.length === 0 ? (
                    <div className="text-center mt-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        No messages yet
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400">
                        Start the conversation by sending your first message!
                      </p>
                    </div>
                  ) : (
                    localMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 message-enter animate-fade-in ${
                          message.sender.id === user.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.sender.id !== user.id && (
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {message.sender.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col max-w-xs lg:max-w-md">
                          {message.sender.id !== user.id && (
                            <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 px-1">
                              {message.sender.username}
                            </div>
                          )}
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                              message.sender.id === user.id
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                                : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-bl-md"
                            }`}
                          >
                            <div className="text-sm leading-relaxed">
                              {message.content}
                            </div>
                          </div>
                          <div
                            className={`text-xs text-slate-500 dark:text-slate-400 mt-1 px-1 ${
                              message.sender.id === user.id
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                        {message.sender.id === user.id && (
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-blue-50/30 dark:from-slate-800/30 dark:to-slate-700/20">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={handleTyping}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="pr-12 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-full bg-white dark:bg-slate-700 shadow-sm"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || isLoading}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-full px-6"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Send"
                      )}
                    </Button>
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
    </div>
  );
}
