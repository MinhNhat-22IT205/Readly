import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BookPopulated } from "@shared-types/book.type";
import type { CartItem } from "../api/cart.api";
import { buildBookCoverUrl } from "@shared-utils/build-book-cover-url";
import { validateImageUri } from "@shared-utils/validate-image-uri";

type Props = {
  book: BookPopulated;
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

export const CartItemCard = ({
  book,
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: Props) => {
  const coverImageUrl = buildBookCoverUrl(book.cover_image);
  const coverImage = validateImageUri(
    coverImageUrl,
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
  );

  return (
    <View className="flex-row bg-neutral-900 rounded-2xl p-3 mb-3">
      <Image
        source={{ uri: coverImage }}
        className="w-20 h-28 rounded-xl mr-3"
      />
      <View className="flex-1 justify-between">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 pr-4">
            <Text className="text-white font-semibold" numberOfLines={2}>
              {book.title}
            </Text>
            <Text className="text-neutral-400 text-xs mt-1" numberOfLines={1}>
              {book.authors && book.authors.length > 0
                ? book.authors.map(a => a.name).join(", ")
                : "Tác giả đang cập nhật"}
            </Text>
          </View>
          <TouchableOpacity onPress={onRemove}>
            <Ionicons name="trash-outline" size={20} color="#f87171" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mt-3">
          <Text className="text-white font-bold">
            ${Number(book.price ?? 0).toFixed(2)}
          </Text>

          <View className="flex-row items-center bg-neutral-800 rounded-full">
            <TouchableOpacity
              className="px-3 py-1"
              onPress={onDecrement}
              disabled={item.quantity <= 1}
            >
              <Text
                className={`text-lg font-bold ${
                  item.quantity <= 1 ? "text-neutral-600" : "text-white"
                }`}
              >
                -
              </Text>
            </TouchableOpacity>
            <Text className="text-white font-semibold px-2">{item.quantity}</Text>
            <TouchableOpacity className="px-3 py-1" onPress={onIncrement}>
              <Text className="text-lg font-bold text-white">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};


