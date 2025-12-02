import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BookPopulated } from "@features/book/api/book-management.api";
import { validateImageUri } from "@shared-utils/validate-image-uri";

interface BookCardProps {
  book: BookPopulated;
  onPress: (book: BookPopulated) => void;
  onDelete?: (book: BookPopulated) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  onDelete,
}) => {
  const coverImage = validateImageUri(
    book.cover_image,
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(book)}
      className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700 active:bg-gray-750 flex-row"
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: coverImage }}
        className="w-20 h-28 rounded-lg bg-gray-700"
        resizeMode="cover"
      />

      <View className="flex-1 ml-4 justify-between">
        <View>
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-white font-bold text-base flex-1 mr-2" numberOfLines={2}>
              {book.title}
            </Text>
            {onDelete && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete(book);
                }}
                className="p-1 rounded-full bg-red-500/20 active:bg-red-500/30"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

          {book.publisher && (
            <View className="flex-row items-center mb-1">
              <Ionicons name="business-outline" size={14} color="#6B7280" />
              <Text className="text-gray-400 text-xs ml-1">
                {book.publisher.name}
              </Text>
            </View>
          )}

          {book.publish_date && (
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text className="text-gray-400 text-xs ml-1">
                {formatDate(book.publish_date)}
              </Text>
            </View>
          )}

          {book.authors && book.authors.length > 0 && (
            <View className="flex-row items-center mb-1">
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text className="text-gray-400 text-xs ml-1" numberOfLines={1}>
                {book.authors.map((a) => a.name).join(", ")}
              </Text>
            </View>
          )}

          {book.categories && book.categories.length > 0 && (
            <View className="flex-row items-center mb-1 flex-wrap">
              <Ionicons name="bookmark-outline" size={14} color="#6B7280" />
              <Text className="text-gray-400 text-xs ml-1" numberOfLines={1}>
                {book.categories.map((c) => c.category_name).join(", ")}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <View>
            <Text className="text-emerald-400 font-bold text-sm">
              {formatPrice(book.price)}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons
                name={book.stock_quantity > 0 ? "checkmark-circle" : "close-circle"}
                size={12}
                color={book.stock_quantity > 0 ? "#10b981" : "#EF4444"}
              />
              <Text
                className={`text-xs ml-1 ${
                  book.stock_quantity > 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {book.stock_quantity > 0
                  ? `Còn ${book.stock_quantity} cuốn`
                  : "Hết hàng"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
