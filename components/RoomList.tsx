"use client";

import React from "react";
import { ChatRoom } from "@/types/chat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import { MessageSquare, Users, Clock } from "lucide-react";
import { CompactLoading } from "./LoadingPage";

interface RoomListProps {
  rooms: ChatRoom[];
  currentRoomId?: string;
  currentUserId?: string;
  onJoinRoom: (roomId: string) => void;
  onEnterRoom: (roomId: string) => void;
  onLeaveRoom: (roomId: string) => void;
  isLoading?: boolean;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  currentRoomId,
  currentUserId,
  onJoinRoom,
  onEnterRoom,
  onLeaveRoom,
  isLoading = false,
}) => {
  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Check if current user is a participant in the room
  const isUserParticipant = (room: ChatRoom) => {
    if (!currentUserId) return false;
    return room.participants.some(
      (participant) => participant.user === currentUserId
    );
  };

  // Handle room click - join if not participant, enter if already participant
  const handleRoomClick = (room: ChatRoom) => {
    if (isUserParticipant(room)) {
      // User is already a participant, just enter the room
      onEnterRoom(room.id);
    } else {
      // User is not a participant, join the room
      onJoinRoom(room.id);
    }
  };

  if (isLoading) {
    return <CompactLoading message="Loading chat rooms..." />;
  }

  if (rooms.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 border-slate-200/50 dark:border-slate-700/50">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-8 h-8 text-blue-500 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
          No Rooms Yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Create your first room to start chatting with friends and colleagues!
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Ready to create</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {rooms.map((room) => (
        <Card
          key={room.id}
          className={`p-4 cursor-pointer transition-all duration-200 hover-lift animate-fade-in ${
            currentRoomId === room.id
              ? "ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700"
              : "hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30 dark:hover:from-slate-700/50 dark:hover:to-slate-600/30 border-slate-200 dark:border-slate-700"
          }`}
          onClick={() => handleRoomClick(room)}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate text-sm">
                    {room.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
                  >
                    {room.type}
                  </Badge>
                </div>
                {room.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                    {room.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{room.participants.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatLastActivity(room.lastActivity)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="flex gap-2">
                {currentRoomId === room.id ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLeaveRoom(room.id);
                    }}
                    className="border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 text-xs px-2"
                  >
                    Leave
                  </Button>
                ) : isUserParticipant(room) ? (
                  // User is already a participant, show "Enter" button
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEnterRoom(room.id);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg text-xs px-2"
                  >
                    Enter
                  </Button>
                ) : (
                  // User is not a participant, show "Join" button
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onJoinRoom(room.id);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg text-xs px-2"
                  >
                    Join
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
