import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BookCard } from "@features/book/components/BookCard";
import { CategoryFilter } from "@features/book/components/CategoryFilter";
import { useBookCatalog } from "@features/book/libs/useBookCatalog";
import { useCart } from "@features/cart/libs/useCart";
import type { BookPopulated } from "@shared-types/book.type";
import type { HomeStackParamList } from "../navigation/HomeStack";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "BookStore">;

const BookStoreScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { books, categories, isLoading } = useBookCatalog();
  const { addItem, totalItems } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

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

  const filteredBooks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesCategory =
        selectedCategory === "All" ||
        book.categories?.some(cat => cat.category_name === selectedCategory) ||
        false;
      const authorNames = book.authors?.map(a => a.name).join(" ") || "";
      const categoryNames = book.categories?.map(cat => cat.category_name).join(" ") || "";
      const matchesSearch =
        book.title.toLowerCase().includes(normalizedSearch) ||
        authorNames.toLowerCase().includes(normalizedSearch) ||
        categoryNames.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [books, search, selectedCategory]);

  const handleAddToCart = async (book: BookPopulated) => {
    await addItem(book.id, Number(book.price ?? 0), 1);
  };

  const handleOpenCart = () => {
    navigation.navigate("Cart");
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Cửa hàng sách</Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center"
          onPress={handleOpenCart}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          {totalItems > 0 && (
            <View className="absolute -top-1 -right-1 bg-emerald-500 rounded-full px-1">
              <Text className="text-black text-xs font-bold">{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 mt-2">
          <Text className="text-3xl font-bold text-white mb-3">
            Khám phá kho sách
          </Text>
          <View className="flex-row items-center bg-neutral-900 rounded-2xl px-4 py-3">
            <Ionicons name="search-outline" size={18} color="#a3a3a3" />
            <TextInput
              placeholder="Tìm kiếm theo tên, tác giả"
              placeholderTextColor="#6b7280"
              value={search}
              onChangeText={setSearch}
              className="ml-3 flex-1 text-white"
            />
          </View>
        </View>

        <CategoryFilter
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {isLoading ? (
          <View className="py-10">
            <ActivityIndicator color="#34d399" />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={handleAddToCart}
              />
            ))}
          </ScrollView>
        )}

        {filteredBooks.length === 0 && !isLoading && (
          <Text className="text-center text-neutral-500 mt-10">
            Không tìm thấy sách phù hợp.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookStoreScreen;


