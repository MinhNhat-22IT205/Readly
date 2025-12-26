import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { User } from "@features/user/api/user.api";
import { validateImageUri } from "@shared-utils/validate-image-uri";

interface UserCardProps {
  user: User;
  onPress: (user: User) => void;
  onToggleActive?: (user: User) => void;
}

export const UserCard = ({ user, onPress, onToggleActive }: UserCardProps) => {
  const avatarUri = validateImageUri(
    user.profile_image,
    "https://velle.vn/wp-content/uploads/2025/04/avatar-mac-dinh-4-2.jpg"
  );
  console.log("user.role", user.role_id);

  // Normalize role: handle undefined/null, convert to lowercase, trim whitespace
  const normalizedRole = (user.role_id ==1? "admin" : user.role_id ==2? "reader" : "writer")


  const getRoleBadgeColor = (role: "reader" | "writer" | "admin") => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 border-red-500/50";
      case "writer":
        return "bg-blue-500/20 border-blue-500/50";
      case "reader":
      default:
        return "bg-gray-500/20 border-gray-500/50";
    }
  };

  const getRoleLabel = (role: "reader" | "writer" | "admin") => {
    console.log("role", role);
    switch (role) {
      case "admin":
        return "Admin";
      case "writer":
        return "Writer";
      case "reader":
      default:
        return "Reader";
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(user)}
      className="bg-gray-800/90 border border-gray-700 rounded-xl p-4 mb-3 flex-row items-center active:opacity-80"
      activeOpacity={0.8}
    >
      {/* Avatar */}
      <View className="relative">
        <Image
          source={{ uri: avatarUri }}
          className="w-16 h-16 rounded-full bg-gray-700"
          resizeMode="cover"
        />
        {!user.is_active && (
          <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-gray-800" />
        )}
      </View>

      {/* User Info */}
      <View className="flex-1 ml-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-white font-bold text-base flex-1" numberOfLines={1}>
            {user.username}
          </Text>
          {onToggleActive && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onToggleActive(user);
              }}
              className="ml-2 p-2"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={user.is_active ? "checkmark-circle" : "close-circle"}
                size={24}
                color={user.is_active ? "#10b981" : "#ef4444"}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-gray-400 text-sm mb-2" numberOfLines={1}>
          {user.email}
        </Text>

        <View className="flex-row items-center gap-2 flex-wrap">
          <View
            className={`px-2 py-1 rounded-full border ${getRoleBadgeColor(
              normalizedRole
            )}`}
          >
            <Text className="text-xs text-gray-300 font-semibold">
              {getRoleLabel(normalizedRole)}
            </Text>
          </View>

          {user.phone && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="call-outline" size={12} color="#9CA3AF" />
              <Text className="text-xs text-gray-400">{user.phone}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </TouchableOpacity>
  );
};




