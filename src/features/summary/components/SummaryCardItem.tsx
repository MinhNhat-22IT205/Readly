import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface Book {
  id: number;
  title: string;
  author: string;
  duration: string;
  views: string;
  image: string;
}

export const SummaryCardItem = ({
  book,
  onPress,
}: {
  book: Book;
  onPress: () => void;
}) => (
  <TouchableOpacity className="w-32 mr-3" onPress={onPress}>
    <Image
      source={{ uri: book.image }}
      className="w-32 h-44 rounded-lg bg-zinc-900"
    />
    <Text className="text-sm font-semibold text-white mt-2" numberOfLines={1}>
      {book.title}
    </Text>
    <Text className="text-xs text-zinc-500" numberOfLines={1}>
      {book.author}
    </Text>
    <View className="flex-row items-center gap-3 mt-1.5">
      <View className="flex-row items-center gap-1">
        <Ionicons name="time-outline" size={12} color="#71717a" />
        <Text className="text-xs text-zinc-500">{book.duration}</Text>
      </View>
      <View className="flex-row items-center gap-1">
        <Ionicons name="eye-outline" size={12} color="#71717a" />
        <Text className="text-xs text-zinc-500">{book.views}</Text>
      </View>
    </View>
  </TouchableOpacity>
);
