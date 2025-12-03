import React from "react";
import { View, Text, Platform } from "react-native";

interface UserStatsBarProps {
  total: number;
}

export const UserStatsBar: React.FC<UserStatsBarProps> = ({
  total,
}) => {
  return (
    <View className="px-4 py-3 bg-gray-800/50 border-b border-gray-800">
      <View
        className={`flex-row flex-wrap gap-2 ${
          Platform.OS === "web" ? "justify-start" : "justify-between"
        }`}
      >
        <View className="bg-gray-700/50 px-3 py-2 rounded-lg min-w-[80px]">
          <Text className="text-gray-400 text-xs">Tổng người dùng</Text>
          <Text className="text-white font-bold text-sm">{total}</Text>
        </View>
      </View>
    </View>
  );
};




