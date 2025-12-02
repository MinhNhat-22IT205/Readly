import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../navigation/AdminStack";
import { BookList } from "@features/book/components/BookList";
import { BookSearchBar } from "@features/book/components/BookSearchBar";
import {
  fetchAdminBooks,
  deleteBook,
  type BookPopulated,
  type BookFilters,
} from "@features/book/api/book-management.api";
import Toast from "react-native-toast-message";

type BookManagementScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "BookManagement"
>;

export default function BookManagementScreen() {
  const navigation = useNavigation<BookManagementScreenNavigationProp>();
  const [books, setBooks] = useState<BookPopulated[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookPopulated[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadBooks = useCallback(async () => {
    try {
      setIsError(false);
      const filters: BookFilters = {};

      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      const data = await fetchAdminBooks(filters);

      // Sort by title alphabetically
      const sorted = [...data].sort((a, b) => a.title.localeCompare(b.title));
      setBooks(sorted);
      setFilteredBooks(sorted);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setIsError(true);
      Toast.show({
        type: "error",
        text1: "Lỗi tải dữ liệu",
        text2: "Không thể tải danh sách sách",
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const isInitialMount = useRef(true);
  useFocusEffect(
    React.useCallback(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      loadBooks();
    }, [loadBooks])
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.publisher?.name.toLowerCase().includes(query) ||
        book.authors?.some((a) => a.name.toLowerCase().includes(query)) ||
        book.categories?.some((c) =>
          c.category_name.toLowerCase().includes(query)
        )
    );

    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  const onRefresh = () => {
    setRefreshing(true);
    loadBooks();
  };

  const handleBookPress = (book: BookPopulated) => {
    navigation.navigate("BookDetail", { bookId: book.id.toString() });
  };

  const handleBookDelete = async (book: BookPopulated) => {
    try {
      await deleteBook(book.id.toString());
      Toast.show({
        type: "success",
        text1: "Xóa thành công",
        text2: `Sách "${book.title}" đã được xóa`,
      });
      loadBooks();
    } catch (error: any) {
      console.error("Delete book error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi xóa",
        text2: error?.response?.data?.detail || "Không thể xóa sách",
      });
    }
  };

  const handleAddBook = () => {
    navigation.navigate("BookDetail", { bookId: "new" });
  };

  const stats = useMemo(() => {
    const total = books.length;
    const inStock = books.filter((b) => b.stock_quantity > 0).length;
    const outOfStock = books.filter((b) => b.stock_quantity === 0).length;
    const totalValue = books.reduce((sum, b) => sum + b.price * b.stock_quantity, 0);

    return { total, inStock, outOfStock, totalValue };
  }, [books]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (isLoading && books.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Book Management</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-400 mt-4">Đang tải danh sách sách...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && books.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Book Management</Text>
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-white text-lg font-semibold mt-4 text-center">
            Không thể tải dữ liệu
          </Text>
          <Text className="text-gray-400 text-sm mt-2 text-center">
            Vui lòng kiểm tra kết nối và thử lại
          </Text>
          <TouchableOpacity
            onPress={loadBooks}
            className="mt-6 bg-emerald-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white flex-1">Book Management</Text>
        <TouchableOpacity
          onPress={handleAddBook}
          className="mr-2 p-2 rounded-full bg-emerald-500 active:bg-emerald-600"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-gray-400 text-sm">
          {filteredBooks.length} books
        </Text>
      </View>

      {/* Stats Bar */}
      <View className="px-4 py-3 bg-gray-800/50 border-b border-gray-800">
        <View className="flex-row flex-wrap gap-2">
          <View className="bg-gray-700/50 px-3 py-2 rounded-lg min-w-[80px]">
            <Text className="text-gray-400 text-xs">Tổng</Text>
            <Text className="text-white font-bold text-sm">{stats.total}</Text>
          </View>
          <View className="bg-emerald-500/20 px-3 py-2 rounded-lg min-w-[80px]">
            <Text className="text-gray-400 text-xs">Còn hàng</Text>
            <Text className="text-emerald-400 font-bold text-sm">{stats.inStock}</Text>
          </View>
          <View className="bg-red-500/20 px-3 py-2 rounded-lg min-w-[80px]">
            <Text className="text-gray-400 text-xs">Hết hàng</Text>
            <Text className="text-red-400 font-bold text-sm">{stats.outOfStock}</Text>
          </View>
          <View className="bg-blue-500/20 px-3 py-2 rounded-lg min-w-[120px]">
            <Text className="text-gray-400 text-xs">Tổng giá trị</Text>
            <Text className="text-blue-400 font-bold text-xs" numberOfLines={1}>
              {formatPrice(stats.totalValue)}
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <BookSearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Book List */}
      <BookList
        books={filteredBooks}
        isLoading={isLoading && books.length > 0}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onBookPress={handleBookPress}
        onBookDelete={handleBookDelete}
      />
    </SafeAreaView>
  );
}
