import React from "react";
import { View, Text, TouchableOpacity, Image, Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BookPopulated } from "@shared-types/book.type";
import { validateImageUri } from "@shared-utils/validate-image-uri";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && SCREEN_WIDTH >= 768;

interface BookStoreCardProps {
  book: BookPopulated;
  onPress: (book: BookPopulated) => void;
  onAddToCart: (book: BookPopulated) => void;
}

export const BookStoreCard: React.FC<BookStoreCardProps> = ({
  book,
  onPress,
  onAddToCart,
}) => {
  const coverImage = validateImageUri(
    book.cover_image,
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCartPress = (e: any) => {
    e.stopPropagation();
    onAddToCart(book);
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(book)}
      className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700/50 active:bg-gray-750"
      activeOpacity={0.9}
      style={{
        width: IS_DESKTOP ? 200 : 160,
        marginRight: IS_DESKTOP ? 20 : 12,
        marginBottom: IS_DESKTOP ? 28 : 20,
      }}
    >
      {/* Cover Image */}
      <View className="relative">
        <Image
          source={{ uri: coverImage }}
          className="w-full bg-gray-700"
          style={{
            height: IS_DESKTOP ? 280 : 240,
          }}
          resizeMode="cover"
        />
        {book.stock_quantity === 0 && (
          <View className="absolute inset-0 bg-black/60 items-center justify-center">
            <View className="bg-red-500/90 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">Hết hàng</Text>
            </View>
          </View>
        )}
        {book.stock_quantity > 0 && book.stock_quantity < 5 && (
          <View className="absolute top-2 right-2 bg-orange-500/90 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">
              Còn {book.stock_quantity}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Title */}
        <Text
          className="text-white font-bold text-base mb-2"
          numberOfLines={2}
          style={{
            minHeight: IS_DESKTOP ? 48 : 44,
          }}
        >
          {book.title}
        </Text>

        {/* Author */}
        {book.authors && book.authors.length > 0 && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="person-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1.5 flex-1" numberOfLines={1}>
              {book.authors.map((a) => a.name).join(", ")}
            </Text>
          </View>
        )}

        {/* Publisher */}
        {book.publisher && (
          <View className="flex-row items-center mb-3">
            <Ionicons name="business-outline" size={12} color="#6B7280" />
            <Text className="text-gray-500 text-xs ml-1.5" numberOfLines={1}>
              {book.publisher.name}
            </Text>
          </View>
        )}

        {/* Price and Add to Cart */}
        <View className="flex-row items-center justify-between mt-auto pt-2 border-t border-gray-700/50">
          <View className="flex-1 mr-2">
            <Text className="text-emerald-400 font-bold text-base">
              {formatPrice(book.price)}
            </Text>
            {book.stock_quantity > 0 && (
              <Text className="text-gray-500 text-xs mt-0.5">
                Còn {book.stock_quantity} cuốn
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={handleAddToCartPress}
            disabled={book.stock_quantity === 0}
            className={`p-2.5 rounded-xl ${
              book.stock_quantity === 0
                ? "bg-gray-700/50"
                : "bg-emerald-500 active:bg-emerald-600"
            }`}
            activeOpacity={0.8}
          >
            <Ionicons
              name={book.stock_quantity === 0 ? "close-circle" : "cart"}
              size={20}
              color={book.stock_quantity === 0 ? "#9CA3AF" : "#FFFFFF"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

