import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReadingHistoryPopulated } from "@shared-types/reading-history.type";
import { validateImageUri } from "@shared-utils/validate-image-uri";
import { buildBookCoverUrl } from "@shared-utils/build-book-cover-url";

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

// Helper function to format time spent (in seconds)
const formatTimeSpent = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m`;
  }
  return `${Math.floor(seconds / 3600)}h`;
};

export const ReadingHistoryItem = ({
  readingHistory,
  onPress,
}: {
  readingHistory: ReadingHistoryPopulated;
  onPress: () => void;
}) => {
  const views = formatReadCount(readingHistory.summary.read_count);
  const timeSpent = formatTimeSpent(readingHistory.time_spent);

  const coverImageUrl = buildBookCoverUrl(readingHistory.summary.book.cover_image);
  const coverImage = validateImageUri(
    coverImageUrl,
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
  );

  return (
    <TouchableOpacity className="w-32 mr-3" onPress={onPress}>
      <Image
        source={{ uri: coverImage }}
        className="w-32 h-44 rounded-lg bg-zinc-900"
      />
      <Text className="text-sm font-semibold text-white mt-2" numberOfLines={1}>
        {readingHistory.summary.title}
      </Text>
      <Text className="text-xs text-zinc-500" numberOfLines={1}>
        {readingHistory.summary.book.authors &&
        readingHistory.summary.book.authors.length > 0
          ? readingHistory.summary.book.authors.map((a) => a.name).join(", ")
          : "Unknown Author"}
      </Text>
      <View className="flex-row items-center gap-3 mt-1.5">
        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={12} color="#71717a" />
          <Text className="text-xs text-zinc-500">{timeSpent}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="eye-outline" size={12} color="#71717a" />
          <Text className="text-xs text-zinc-500">{views}</Text>
        </View>
      </View>
      {readingHistory.progress_percent >= 0 && (
        <View className="mt-2">
          <View className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <View
              className="h-full bg-white rounded-full"
              style={{ width: `${readingHistory.progress_percent}%` }}
            />
          </View>
          <Text className="text-xs text-zinc-500 mt-1">
            {Math.round(readingHistory.progress_percent)}% read
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
