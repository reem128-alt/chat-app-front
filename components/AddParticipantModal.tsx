"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Search,
  UserPlus,
  Users,
  Crown,
  Shield,
  User as UserIcon,
  MessageSquare,
} from "lucide-react";
import { getAllUsers, User } from "@/services/user";
import { addParticipant } from "@/services/room";
import { ChatRoom, Participant } from "@/types/chat";
import toast from "react-hot-toast";

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: ChatRoom;
  onParticipantAdded: (updatedRoom: ChatRoom) => void;
  currentUserId: string;
}

export const AddParticipantModal: React.FC<AddParticipantModalProps> = ({
  isOpen,
  onClose,
  room,
  onParticipantAdded,
  currentUserId,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "participants">(
    "available"
  );

  // Get existing participant IDs
  const existingParticipantIds = room.participants.map(
    (p: Participant) => p.user
  );

  // Filter out current user and existing participants
  const availableUsers = filteredUsers.filter(
    (user) =>
      user.id !== currentUserId && !existingParticipantIds.includes(user.id)
  );

  // Get current participants with their user details
  const currentParticipants = room.participants
    .map((participant: Participant) => {
      const user = users.find((u) => u.id === participant.user);
      return {
        ...participant,
        userDetails: user,
      };
    })
    .filter((p: { userDetails: User | undefined }) => p.userDetails); // Only include participants whose user details we have

  // Helper function to get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-3 h-3 text-yellow-500" />;
      case "moderator":
        return <Shield className="w-3 h-3 text-blue-500" />;
      default:
        return <UserIcon className="w-3 h-3 text-gray-500" />;
    }
  };

  // Helper function to get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700";
      case "moderator":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700";
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddParticipants = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    try {
      setIsAdding(true);
      let successCount = 0;
      const errors: string[] = [];

      // Add each selected user to the room
      let updatedRoom = room;
      for (const userId of selectedUsers) {
        try {
          updatedRoom = await addParticipant(room.id, userId, "member");
          successCount++;
        } catch (error: unknown) {
          console.error(`Error adding user ${userId}:`, error);
          const userName =
            users.find((u) => u.id === userId)?.username || "User";
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to add participant";
          errors.push(`${userName}: ${errorMessage}`);
        }
      }

      // Show success/error messages
      if (successCount > 0) {
        toast.success(
          `Successfully added ${successCount} participant(s) to the room`
        );
      }

      if (errors.length > 0) {
        const errorMessage = `Failed to add ${
          errors.length
        } participant(s):\n${errors.join("\n")}`;
        toast.error(errorMessage, { duration: 5000 });
      }

      // Only close if all operations were successful
      if (errors.length === 0) {
        onParticipantAdded(updatedRoom);
        onClose();
        setSelectedUsers([]);
        setSearchTerm("");
      }
    } catch (error: unknown) {
      console.error("Unexpected error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  Room Management
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700"
                  >
                    {room.name}
                  </Badge>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {room.participants.length} member(s)
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("available")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "available"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Add Users ({availableUsers.length})
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "participants"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Users className="w-4 h-4" />
              Current Members ({currentParticipants.length})
            </button>
          </div>
        </div>

        {/* Search */}
        {activeTab === "available" && (
          <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search users by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>
        )}

        {/* Selected Users */}
        {activeTab === "available" && selectedUsers.length > 0 && (
          <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20 flex-shrink-0">
            <Label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">
              Selected Users ({selectedUsers.length})
            </Label>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto custom-scrollbar">
              {selectedUsers.map((userId) => {
                const user = users.find((u) => u.id === userId);
                return user ? (
                  <Badge
                    key={userId}
                    variant="default"
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-3 py-1 text-sm"
                  >
                    <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {user.username}
                    <button
                      onClick={() => handleUserSelect(userId)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Loading users...
              </p>
            </div>
          ) : activeTab === "available" ? (
            // Available Users Tab
            availableUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {searchTerm ? "No users found" : "No available users"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "All users are already members of this room"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedUsers.includes(user.id)
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 ring-2 ring-blue-500/20"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                    }`}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.username}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {user.username}
                          </p>
                          {user.isOnline && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            ✓
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : // Current Participants Tab
          currentParticipants.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No participants found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                User details are still loading...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {currentParticipants.map((participant) => {
                const user = participant.userDetails!;
                return (
                  <div
                    key={participant.user}
                    className="p-3 rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.username}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {user.username}
                          </p>
                          {user.isOnline && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate mb-2">
                          {user.email}
                        </p>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getRoleColor(
                            participant.role
                          )}`}
                        >
                          <div className="flex items-center gap-1">
                            {getRoleIcon(participant.role)}
                            {participant.role.charAt(0).toUpperCase() +
                              participant.role.slice(1)}
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-blue-50/30 dark:from-slate-800/30 dark:to-slate-700/20 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {activeTab === "available" ? (
                selectedUsers.length > 0 ? (
                  <span>
                    Ready to add {selectedUsers.length} participant(s)
                  </span>
                ) : (
                  <span>Select users to add to the room</span>
                )
              ) : (
                <span>
                  Viewing {currentParticipants.length} current member(s)
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
              {activeTab === "available" && (
                <Button
                  onClick={handleAddParticipants}
                  disabled={selectedUsers.length === 0 || isAdding}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isAdding ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </div>
                  ) : (
                    `Add ${selectedUsers.length} Participant(s)`
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
