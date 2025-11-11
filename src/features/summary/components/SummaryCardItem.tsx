import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Summary } from "@shared-types/summary.type";

// Helper function to format read count (e.g., 8000000 -> "8m")
const formatReadCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(0)}m`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}k`;
  }
  return count.toString();
};

// Helper function to estimate reading time from content
const estimateReadingTime = (content: Summary["content"]): string => {
  // Calculate total word count from all sections
  const totalWords = content.reduce((acc, section) => {
    const words = section.content
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return acc + words.length;
  }, 0);

  // Average reading speed: 200 words per minute
  const minutes = Math.max(1, Math.ceil(totalWords / 200));
  return `${minutes}m`;
};

export const SummaryCardItem = ({
  summary,
  onPress,
}: {
  summary: Summary;
  onPress: () => void;
}) => {
  const duration = estimateReadingTime(summary.content);
  const views = formatReadCount(summary.read_count);

  return (
    <TouchableOpacity className="w-32 mr-3" onPress={onPress}>
      <Image
        source={{ uri: summary.book_cover_path }}
        className="w-32 h-44 rounded-lg bg-zinc-900"
      />
      <Text className="text-sm font-semibold text-white mt-2" numberOfLines={1}>
        {summary.title}
      </Text>
      <Text className="text-xs text-zinc-500" numberOfLines={1}>
        {summary.book_athor}
      </Text>
      <View className="flex-row items-center gap-3 mt-1.5">
        {/* <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={12} color="#71717a" />
          <Text className="text-xs text-zinc-500">{duration}</Text>
        </View> */}
        <View className="flex-row items-center gap-1">
          <Ionicons name="eye-outline" size={12} color="#71717a" />
          <Text className="text-xs text-zinc-500">{views}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
