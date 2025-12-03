import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Publisher } from "@features/publisher/api/publisher.api";

interface PublisherCardProps {
  publisher: Publisher;
  onPress: (publisher: Publisher) => void;
  onDelete?: (publisher: Publisher) => void;
}

export const PublisherCard: React.FC<PublisherCardProps> = ({
  publisher,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(publisher)}
      className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700 active:bg-gray-750"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-3">
          <View className="w-12 h-12 rounded-full bg-emerald-500/20 items-center justify-center mr-3">
            <Ionicons name="business" size={24} color="#10b981" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg" numberOfLines={1}>
              {publisher.name}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">ID: {publisher.id}</Text>
          </View>
        </View>

        {onDelete && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDelete(publisher);
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




