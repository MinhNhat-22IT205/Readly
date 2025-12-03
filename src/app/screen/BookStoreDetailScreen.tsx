import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStack";
import { fetchBookById } from "@features/book/api/book.api";
import type { BookPopulated } from "@shared-types/book.type";
import { useCart } from "@features/cart/libs/useCart";
import { validateImageUri } from "@shared-utils/validate-image-uri";
import { buildBookCoverUrl } from "@shared-utils/build-book-cover-url";
import Toast from "react-native-toast-message";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && SCREEN_WIDTH >= 768;

type BookStoreDetailScreenRouteProp = {
  params: { bookId: string };
};

type BookStoreDetailScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "BookStoreDetail"
>;

export default function BookStoreDetailScreen() {
  const route = useRoute<BookStoreDetailScreenRouteProp>();
  const navigation = useNavigation<BookStoreDetailScreenNavigationProp>();
  const { bookId } = route.params;
  const { addItem } = useCart();

  const [book, setBook] = useState<BookPopulated | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    try {
      setIsLoading(true);
      const bookData = await fetchBookById(bookId);
      setBook(bookData);
    } catch (error: any) {
      console.error("Error loading book:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải thông tin sách",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!book) return;

    if (book.stock_quantity === 0) {
      Toast.show({
        type: "error",
        text1: "Hết hàng",
        text2: "Sách này hiện đã hết hàng",
      });
      return;
    }

    if (quantity > book.stock_quantity) {
      Toast.show({
        type: "error",
        text1: "Không đủ hàng",
        text2: `Chỉ còn ${book.stock_quantity} cuốn trong kho`,
      });
      return;
    }

    try {
      await addItem(book.id, Number(book.price ?? 0), quantity);
      Toast.show({
        type: "success",
        text1: "Đã thêm vào giỏ hàng",
        text2: `${book.title} (${quantity} cuốn)`,
      });
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể thêm vào giỏ hàng",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-400 mt-4">Đang tải thông tin sách...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950">
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="book-outline" size={64} color="#4B5563" />
          <Text className="text-gray-400 text-lg mt-4 font-semibold">
            Không tìm thấy sách
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-6 bg-emerald-500 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { buildBookCoverUrl } = require("@shared-utils/build-book-cover-url");
  const coverImageUrl = buildBookCoverUrl(book.cover_image);
  const coverImage = validateImageUri(
    coverImageUrl,
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
  );

  const isOutOfStock = book.stock_quantity === 0;
  const isLowStock = book.stock_quantity > 0 && book.stock_quantity < 5;

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-800/50">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-11 h-11 rounded-full bg-gray-900/80 items-center justify-center active:bg-gray-800"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold flex-1 text-center mr-11">
          Chi tiết sách
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: IS_DESKTOP ? 32 : 24 }}
      >
        <View className={`${IS_DESKTOP ? "px-8" : "px-5"} pt-6`}>
          {/* Book Cover and Basic Info */}
          <View
            className={`flex-row mb-6 ${
              IS_DESKTOP ? "justify-center" : ""
            }`}
          >
            <View className={`${IS_DESKTOP ? "w-80" : "w-full"} items-center`}>
              <View className="relative">
                <Image
                  source={{ uri: coverImage }}
                  className="rounded-2xl bg-gray-700"
                  style={{
                    width: IS_DESKTOP ? 320 : SCREEN_WIDTH - 40,
                    height: IS_DESKTOP ? 480 : ((SCREEN_WIDTH - 40) * 3) / 2,
                  }}
                  resizeMode="cover"
                />
                {isOutOfStock && (
                  <View className="absolute inset-0 bg-black/70 rounded-2xl items-center justify-center">
                    <View className="bg-red-500/90 px-4 py-2 rounded-full">
                      <Text className="text-white font-bold text-lg">
                        Hết hàng
                      </Text>
                    </View>
                  </View>
                )}
                {isLowStock && !isOutOfStock && (
                  <View className="absolute top-3 right-3 bg-orange-500/90 px-3 py-1.5 rounded-full">
                    <Text className="text-white text-sm font-semibold">
                      Còn {book.stock_quantity}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Book Title */}
          <Text
            className={`text-white font-bold mb-3 ${
              IS_DESKTOP ? "text-3xl" : "text-2xl"
            }`}
          >
            {book.title}
          </Text>

          {/* Authors */}
          {book.authors && book.authors.length > 0 && (
            <View className="flex-row items-center mb-4">
              <Ionicons name="person-outline" size={18} color="#9CA3AF" />
              <Text className="text-gray-300 ml-2 text-base">
                {book.authors.map((a) => a.name).join(", ")}
              </Text>
            </View>
          )}

          {/* Price and Stock */}
          <View className="flex-row items-center justify-between mb-6 pb-6 border-b border-gray-800/50">
            <View>
              <Text className="text-emerald-400 font-bold text-2xl mb-1">
                {formatPrice(book.price)}
              </Text>
              {!isOutOfStock && (
                <Text className="text-gray-400 text-sm">
                  Còn {book.stock_quantity} cuốn
                </Text>
              )}
            </View>
            {!isOutOfStock && (
              <View className="flex-row items-center bg-gray-900/80 rounded-xl px-3 py-2">
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 items-center justify-center"
                  disabled={quantity <= 1}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color={quantity <= 1 ? "#4B5563" : "#9CA3AF"}
                  />
                </TouchableOpacity>
                <Text className="text-white font-semibold text-lg mx-4 min-w-[30px] text-center">
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setQuantity(Math.min(book.stock_quantity, quantity + 1))
                  }
                  className="w-8 h-8 items-center justify-center"
                  disabled={quantity >= book.stock_quantity}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color={
                      quantity >= book.stock_quantity ? "#4B5563" : "#9CA3AF"
                    }
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Book Details */}
          <View className="mb-6">
            <Text className="text-white font-bold text-xl mb-4">
              Thông tin sách
            </Text>

            {/* Publisher */}
            {book.publisher && (
              <View className="mb-3">
                <Text className="text-gray-400 text-sm mb-1">Nhà xuất bản</Text>
                <Text className="text-white text-base">
                  {book.publisher.name}
                </Text>
              </View>
            )}

            {/* Publish Date */}
            {book.publish_date && (
              <View className="mb-3">
                <Text className="text-gray-400 text-sm mb-1">
                  Ngày xuất bản
                </Text>
                <Text className="text-white text-base">
                  {formatDate(book.publish_date)}
                </Text>
              </View>
            )}

            {/* Categories */}
            {book.categories && book.categories.length > 0 && (
              <View className="mb-3">
                <Text className="text-gray-400 text-sm mb-2">Danh mục</Text>
                <View className="flex-row flex-wrap">
                  {book.categories.map((cat, index) => (
                    <View
                      key={cat.id}
                      className="bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-full mr-2 mb-2"
                    >
                      <Text className="text-emerald-400 text-sm">
                        {cat.category_name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Stock Status */}
            <View className="mb-3">
              <Text className="text-gray-400 text-sm mb-1">Tình trạng</Text>
              <View className="flex-row items-center">
                {isOutOfStock ? (
                  <>
                    <Ionicons name="close-circle" size={18} color="#EF4444" />
                    <Text className="text-red-400 ml-2 font-semibold">
                      Hết hàng
                    </Text>
                  </>
                ) : isLowStock ? (
                  <>
                    <Ionicons name="warning" size={18} color="#F59E0B" />
                    <Text className="text-orange-400 ml-2 font-semibold">
                      Sắp hết hàng ({book.stock_quantity} cuốn)
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text className="text-emerald-400 ml-2 font-semibold">
                      Còn hàng ({book.stock_quantity} cuốn)
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Add to Cart Button */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-4 rounded-2xl flex-row items-center justify-center ${
                isOutOfStock
                  ? "bg-gray-700/50"
                  : "bg-emerald-500 active:bg-emerald-600"
              }`}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isOutOfStock ? "close-circle" : "cart"}
                size={24}
                color="#FFFFFF"
              />
              <Text className="text-white font-bold text-lg ml-2">
                {isOutOfStock
                  ? "Hết hàng"
                  : `Thêm vào giỏ hàng - ${formatPrice(book.price * quantity)}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}




