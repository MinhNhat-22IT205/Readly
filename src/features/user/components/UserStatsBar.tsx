import React from "react";
import { View, Text, Platform } from "react-native";

interface UserStatsBarProps {
  total: number;
  active: number;
  readers: number;
  writers: number;
  admins: number;
}

export const UserStatsBar: React.FC<UserStatsBarProps> = ({
  total,
  active,
  readers,
  writers,
  admins,
}) => {
  return (
    <View className="px-4 py-3 bg-gray-800/50 border-b border-gray-800">
      <View
        className={`flex-row flex-wrap gap-2 ${
          Platform.OS === "web" ? "justify-start" : "justify-between"
        }`}
      >
        <View className="bg-gray-700/50 px-3 py-2 rounded-lg min-w-[80px]">
          <Text className="text-gray-400 text-xs">Tổng</Text>
          <Text className="text-white font-bold text-sm">{total}</Text>
        </View>
        <View className="bg-emerald-500/20 px-3 py-2 rounded-lg min-w-[80px]">
          <Text className="text-gray-400 text-xs">Hoạt động</Text>
          <Text className="text-emerald-400 font-bold text-sm">{active}</Text>
        </View>
        <View className="bg-blue-500/20 px-3 py-2 rounded-lg min-w-[80px]">
          <Text className="text-gray-400 text-xs">Reader</Text>
          <Text className="text-blue-400 font-bold text-sm">{readers}</Text>
        </View>
        <View className="bg-purple-500/20 px-3 py-2 rounded-lg min-w-[80px]">
          <Text className="text-gray-400 text-xs">Writer</Text>
          <Text className="text-purple-400 font-bold text-sm">{writers}</Text>
        </View>
        <View className="bg-red-500/20 px-3 py-2 rounded-lg min-w-[80px]">
          <Text className="text-gray-400 text-xs">Admin</Text>
          <Text className="text-red-400 font-bold text-sm">{admins}</Text>
        </View>
      </View>
    </View>
  );
};




