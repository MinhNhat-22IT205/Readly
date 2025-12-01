import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PopulatedFavourite } from "@shared-types/favourite.type";

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

export const FavouriteItem = ({
  favourite,
  onPress,
}: {
  favourite: PopulatedFavourite;
  onPress: () => void;
}) => {
  const views = formatReadCount(favourite.summary.read_count);

  return (
    <TouchableOpacity className="w-32 mr-3" onPress={onPress}>
      <Image
        source={{ uri: favourite.summary.book.cover_image }}
        className="w-32 h-44 rounded-lg bg-zinc-900"
      />
      <Text className="text-sm font-semibold text-white mt-2" numberOfLines={1}>
        {favourite.summary.title}
      </Text>
      <Text className="text-xs text-zinc-500" numberOfLines={1}>
        {favourite.summary.book.authors &&
        favourite.summary.book.authors.length > 0
          ? favourite.summary.book.authors.map((a) => a.name).join(", ")
          : "Unknown Author"}
      </Text>
      <View className="flex-row items-center gap-3 mt-1.5">
        <View className="flex-row items-center gap-1">
          <Ionicons name="eye-outline" size={12} color="#71717a" />
          <Text className="text-xs text-zinc-500">{views}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
