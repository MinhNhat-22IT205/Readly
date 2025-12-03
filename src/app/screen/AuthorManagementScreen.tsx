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
import { AuthorList } from "@features/author/components/AuthorList";
import { AuthorSearchBar } from "@features/author/components/AuthorSearchBar";
import {
  fetchAuthors,
  deleteAuthor,
  type Author,
  type AuthorFilters,
} from "@features/author/api/author.api";
import Toast from "react-native-toast-message";

type AuthorManagementScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AuthorManagement"
>;

export default function AuthorManagementScreen() {
  const navigation = useNavigation<AuthorManagementScreenNavigationProp>();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadAuthors = useCallback(async () => {
    try {
      setIsError(false);
      const filters: AuthorFilters = {};

      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      const data = await fetchAuthors(filters);
      
      // Sort by name alphabetically
      const sorted = [...data].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setAuthors(sorted);
      setFilteredAuthors(sorted);
    } catch (error) {
      console.error("Failed to fetch authors:", error);
      setIsError(true);
      Toast.show({
        type: "error",
        text1: "Lỗi tải dữ liệu",
        text2: "Không thể tải danh sách tác giả",
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  // Load authors when search query changes
  useEffect(() => {
    loadAuthors();
  }, [loadAuthors]);

  // Reload authors when screen comes into focus
  const isInitialMount = useRef(true);
  useFocusEffect(
    React.useCallback(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      loadAuthors();
    }, [loadAuthors])
  );

  // Filter authors locally when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAuthors(authors);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = authors.filter(
      (author) =>
        author.name.toLowerCase().includes(query) ||
        (author.nationality &&
          author.nationality.toLowerCase().includes(query)) ||
        (author.biography && author.biography.toLowerCase().includes(query))
    );

    setFilteredAuthors(filtered);
  }, [searchQuery, authors]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAuthors();
  };

  const handleAuthorPress = (author: Author) => {
    navigation.navigate("AuthorDetail", { authorId: author.id.toString() });
  };

  const handleAuthorDelete = async (author: Author) => {
    try {
      await deleteAuthor(author.id.toString());
      Toast.show({
        type: "success",
        text1: "Xóa thành công",
        text2: `Tác giả "${author.name}" đã được xóa`,
      });
      loadAuthors();
    } catch (error: any) {
      console.error("Delete author error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi xóa",
        text2: error?.response?.data?.detail || "Không thể xóa tác giả",
      });
    }
  };

  const handleAddAuthor = () => {
    navigation.navigate("AuthorDetail", { authorId: "new" });
  };

  const stats = useMemo(() => {
    const total = authors.length;

    return { total };
  }, [authors]);

  if (isLoading && authors.length === 0) {
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
          <Text className="text-xl font-bold text-white">Author Management</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-400 mt-4">Đang tải danh sách tác giả...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && authors.length === 0) {
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
          <Text className="text-xl font-bold text-white">Author Management</Text>
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
            onPress={loadAuthors}
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
        <Text className="text-xl font-bold text-white flex-1">Author Management</Text>
        <TouchableOpacity
          onPress={handleAddAuthor}
          className="mr-2 p-2 rounded-full bg-emerald-500 active:bg-emerald-600"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-gray-400 text-sm">
          {filteredAuthors.length} authors
        </Text>
      </View>

      {/* Stats Bar */}
      <View className="px-4 py-3 bg-gray-800/50 border-b border-gray-800">
        <View className="flex-row flex-wrap gap-2">
          <View className="bg-gray-700/50 px-3 py-2 rounded-lg min-w-[80px]">
            <Text className="text-gray-400 text-xs">Tổng</Text>
            <Text className="text-white font-bold text-sm">{stats.total}</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <AuthorSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Author List */}
      <AuthorList
        authors={filteredAuthors}
        isLoading={isLoading && authors.length > 0}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onAuthorPress={handleAuthorPress}
        onAuthorDelete={handleAuthorDelete}
      />
    </SafeAreaView>
  );
}
