import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SummaryViewCommentsButtonProps {
  commentsCount: number;
  onPress: () => void;
}

export const SummaryViewCommentsButton = ({
  commentsCount,
  onPress,
}: SummaryViewCommentsButtonProps) => {
  return (
    <View className="px-4 mt-6">
      <TouchableOpacity
        onPress={onPress}
        className="bg-indigo-600 py-4 rounded-xl flex-row items-center justify-center"
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubbles-outline" size={20} color="white" />
        <Text className="text-white ml-2 font-semibold text-base">
          View Public Comments
        </Text>
        <View className="ml-2 bg-indigo-500 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">{commentsCount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

