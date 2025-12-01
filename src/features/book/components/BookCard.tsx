import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import type { BookPopulated } from "@shared-types/book.type";

type Props = {
  book: BookPopulated;
  onAddToCart?: (book: BookPopulated) => void;
  onPress?: (book: BookPopulated) => void;
};

export const BookCard = ({ book, onAddToCart, onPress }: Props) => {
  const coverImage =
    book.cover_image ??
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop";
  const authorNames = book.authors && book.authors.length > 0
    ? book.authors.map(a => a.name).join(", ")
    : "Tác giả đang cập nhật";

  return (
    <TouchableOpacity
      className="bg-neutral-900 rounded-2xl overflow-hidden w-44 mr-4"
      onPress={() => onPress?.(book)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: coverImage }} className="h-56 w-full" />
      <View className="p-4 gap-2">
        <View>
          <Text className="text-white font-semibold" numberOfLines={2}>
            {book.title}
          </Text>
          <Text className="text-neutral-400 text-xs mt-1" numberOfLines={1}>
            {authorNames}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-white font-bold">
            ${Number(book.price ?? 0).toFixed(2)}
          </Text>
          <TouchableOpacity
            className="bg-emerald-500 px-3 py-1 rounded-full"
            onPress={() => onAddToCart?.(book)}
          >
            <Text className="text-black font-semibold text-xs">Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};


