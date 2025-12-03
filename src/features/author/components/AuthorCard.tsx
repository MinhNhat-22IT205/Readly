import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Author } from "@features/author/api/author.api";

interface AuthorCardProps {
  author: Author;
  onPress: (author: Author) => void;
  onDelete?: (author: Author) => void;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({
  author,
  onPress,
  onDelete,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(author)}
      className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700 active:bg-gray-750"
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-2">
            <Ionicons name="person" size={20} color="#10b981" />
            <Text className="text-white font-bold text-lg ml-2" numberOfLines={1}>
              {author.name}
            </Text>
          </View>

          {author.nationality && (
            <View className="flex-row items-center mb-1">
              <Ionicons name="globe-outline" size={14} color="#6B7280" />
              <Text className="text-gray-400 text-sm ml-1">
                {author.nationality}
              </Text>
            </View>
          )}

          {author.birth_date && (
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text className="text-gray-400 text-sm ml-1">
                {formatDate(author.birth_date)}
              </Text>
            </View>
          )}

          {author.biography && (
            <Text
              className="text-gray-500 text-xs mt-2"
              numberOfLines={2}
            >
              {author.biography}
            </Text>
          )}
        </View>

        {onDelete && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDelete(author);
            }}
            className="p-2 rounded-full bg-red-500/20 active:bg-red-500/30"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};




