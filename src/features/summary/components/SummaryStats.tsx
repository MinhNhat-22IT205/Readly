import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SummaryStatsProps {
  readingTime?: string;
  sectionsCount: number;
}

export const SummaryStats = ({
  readingTime = "18 min",
  sectionsCount,
}: SummaryStatsProps) => {
  return (
    <View className="flex-row px-4 mt-4 gap-8">
      <View className="flex-row items-center">
        <Ionicons name="time-outline" size={18} color="#9CA3AF" />
        <Text className="text-gray-400 ml-2">{readingTime}</Text>
      </View>
      <View className="flex-row items-center">
        <Ionicons name="bulb-outline" size={18} color="#9CA3AF" />
        <Text className="text-gray-400 ml-2">{sectionsCount} key ideas</Text>
      </View>
    </View>
  );
};

