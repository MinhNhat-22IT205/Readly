import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BookStoreCard } from "@features/book/components/BookStoreCard";
import { useBookCatalog } from "@features/book/libs/useBookCatalog";
import { useCart } from "@features/cart/libs/useCart";
import type { BookPopulated } from "@shared-types/book.type";
import type { HomeStackParamList } from "../navigation/HomeStack";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && SCREEN_WIDTH >= 768;

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "BookStore">;

const BookStoreScreen = () => {
  // Use navigation hook - it should always be available if component is in NavigationContainer
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const { books, categories, isLoading } = useBookCatalog();
  const { addItem, totalItems } = useCart();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Tạo danh sách categories với "All"
  const categoryOptions = useMemo(() => {
    const uniqueNames = Array.from(
      new Set(
        categories
          .map((category) => category.category_name)
          .filter((name): name is string => Boolean(name))
      )
    );
    return ["All", ...uniqueNames];
  }, [categories]);


  // Lọc sách dựa trên category và search query
  const filteredBooks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return books.filter((book) => {
      // Lọc theo category
      const matchesCategory =
        selectedCategory === "All" ||
        book.categories?.some(cat => cat.category_name === selectedCategory) ||
        false;

      // Lọc theo search query (tên sách, tác giả, danh mục)
      const authorNames = book.authors?.map(a => a.name).join(" ") || "";
      const categoryNames = book.categories?.map(cat => cat.category_name).join(" ") || "";
      const matchesSearch =
        normalizedSearch === "" ||
        book.title.toLowerCase().includes(normalizedSearch) ||
        authorNames.toLowerCase().includes(normalizedSearch) ||
        categoryNames.toLowerCase().includes(normalizedSearch);

      // Phải thỏa mãn cả category và search
      return matchesCategory && matchesSearch;
    });
  }, [books, search, selectedCategory]);

  const handleAddToCart = useCallback(async (book: BookPopulated) => {
    await addItem(book.id, Number(book.price ?? 0), 1);
  }, [addItem]);

  const handleOpenCart = useCallback(() => {
    if (!isFocused) {
      return;
    }
    try {
      // Use optional chaining to safely access navigation
      navigation?.navigate?.("Cart");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, [navigation, isFocused]);

  const handleBookPress = useCallback(
    (book: BookPopulated) => {
      if (!isFocused) {
        return;
      }
      try {
        navigation?.navigate?.("BookStoreDetail", {
          bookId: book.id.toString(),
        });
      } catch (error) {
        console.error("Navigation error:", error);
      }
    },
    [navigation, isFocused]
  );


  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-800/50">
        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-gray-900/80 items-center justify-center active:bg-gray-800"
          onPress={() => {
            if (!isFocused) {
              return;
            }
            try {
              // Use optional chaining to safely access navigation
              navigation?.goBack?.();
            } catch (error) {
              console.error("Navigation error:", error);
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Cửa hàng sách</Text>
        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-gray-900/80 items-center justify-center relative active:bg-gray-800"
          onPress={handleOpenCart}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="cart-outline" size={22} color="#fff" />
          {totalItems > 0 && (
            <View className="absolute -top-1 -right-1 bg-emerald-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1.5 border-2 border-neutral-950">
              <Text className="text-white text-xs font-bold">{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: IS_DESKTOP ? 32 : 24 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* Hero Section */}
        <View className={`px-5 ${IS_DESKTOP ? "pt-8 pb-6" : "pt-6 pb-5"}`}>
          <Text
            className={`text-white font-bold mb-4 ${
              IS_DESKTOP ? "text-4xl" : "text-3xl"
            }`}
          >
            Khám phá kho sách
          </Text>
          <Text className="text-gray-400 text-sm mb-5">
            Tìm kiếm và khám phá hàng ngàn cuốn sách hay
          </Text>

          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-900/80 rounded-2xl px-4 py-3.5 border border-gray-800/50">
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Tìm kiếm theo tên sách, tác giả, danh mục..."
              placeholderTextColor="#6B7280"
              value={search}
              onChangeText={setSearch}
              className="ml-3 flex-1 text-white text-base"
              style={{ fontSize: IS_DESKTOP ? 15 : 14 }}
            />
            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearch("")}
                className="ml-2 p-1"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter Dropdown */}
          <View className="mt-4">
            <Text className="text-gray-300 text-sm font-semibold mb-2">
              Danh mục sách
            </Text>
            <TouchableOpacity
              onPress={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="bg-gray-900/80 rounded-2xl px-4 py-3.5 border border-gray-800/50 flex-row items-center justify-between"
              activeOpacity={0.8}
            >
              <Text className="text-white text-base flex-1">
                {selectedCategory}
              </Text>
              <Ionicons
                name={categoryDropdownOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
            {categoryDropdownOpen && (
              <View className="mt-2 bg-gray-900/95 rounded-2xl border border-gray-800/50 max-h-60">
                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                  className="max-h-60"
                >
                  {categoryOptions.map((category) => {
                    const isSelected = category === selectedCategory;
                    return (
                      <TouchableOpacity
                        key={category}
                        onPress={() => {
                          setSelectedCategory(category);
                          setCategoryDropdownOpen(false);
                        }}
                        className={`px-4 py-3.5 flex-row items-center justify-between ${
                          isSelected ? "bg-emerald-500/20" : ""
                        }`}
                        activeOpacity={0.7}
                      >
                        <Text
                          className={`text-base ${
                            isSelected ? "text-emerald-400 font-semibold" : "text-white"
                          }`}
                        >
                          {category}
                        </Text>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#10b981"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Books Grid */}
        {isLoading ? (
          <View className={`py-16 items-center ${IS_DESKTOP ? "px-8" : "px-5"}`}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text className="text-gray-400 mt-4 text-base">
              Đang tải danh sách sách...
            </Text>
          </View>
        ) : filteredBooks.length === 0 ? (
          <View className={`py-16 items-center ${IS_DESKTOP ? "px-8" : "px-5"}`}>
            <Ionicons name="book-outline" size={64} color="#4B5563" />
            <Text className="text-gray-400 text-lg mt-4 font-semibold">
              Không tìm thấy sách phù hợp
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center">
              Thử thay đổi từ khóa tìm kiếm hoặc danh mục
            </Text>
          </View>
        ) : (
          <View
            className={`flex-row flex-wrap ${
              IS_DESKTOP ? "px-8" : "px-5"
            }`}
          >
            {filteredBooks.map((book) => (
              <BookStoreCard
                key={book.id}
                book={book}
                onPress={handleBookPress}
                onAddToCart={handleAddToCart}
              />
            ))}
          </View>
        )}

        {/* Results Count */}
        {!isLoading && filteredBooks.length > 0 && (
          <View className="px-5 pt-4 pb-2">
            <Text className="text-gray-500 text-sm text-center">
              Hiển thị {filteredBooks.length} / {books.length} cuốn sách
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookStoreScreen;


