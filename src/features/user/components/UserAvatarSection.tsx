import React from "react";
import { View, Text, Image } from "react-native";
import type { User } from "@features/user/api/user.api";

interface UserAvatarSectionProps {
  user: User;
  avatarUri: string;
}

const getRoleColor = (role: string | undefined) => {
  if (!role) return "text-gray-400";
  switch (role) {
    case "admin":
      return "text-red-400";
    case "writer":
      return "text-blue-400";
    default:
      return "text-gray-400";
  }
};

const getRoleBadgeColor = (role: string | undefined) => {
  if (!role) return "bg-gray-500/20 border-gray-500/50";
  switch (role) {
    case "admin":
      return "bg-red-500/20 border-red-500/50";
    case "writer":
      return "bg-blue-500/20 border-blue-500/50";
    default:
      return "bg-gray-500/20 border-gray-500/50";
  }
};

export const UserAvatarSection: React.FC<UserAvatarSectionProps> = ({
  user,
  avatarUri,
}) => {
  return (
    <View className="items-center py-6 border-b border-gray-800 bg-gray-800/30">
      <View className="relative">
        <Image
          source={{ uri: avatarUri }}
          className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-600"
          resizeMode="cover"
        />
        {!user.is_active && (
          <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-gray-900" />
        )}
      </View>
      <Text className="text-white font-bold text-lg mt-3">{user.username}</Text>
      <View
        className={`px-3 py-1 rounded-full border mt-2 ${getRoleBadgeColor(
          user.role || "reader"
        )}`}
      >
        <Text
          className={`text-xs font-semibold ${getRoleColor(
            user.role || "reader"
          )}`}
        >
          {(user.role || "reader").toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

