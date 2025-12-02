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
import { CategoryList } from "@features/category/components/CategoryList";
import { CategorySearchBar } from "@features/category/components/CategorySearchBar";
import {
  fetchCategories,
  deleteCategory,
  type Category,
  type CategoryFilters,
} from "@features/category/api/category.api";
import Toast from "react-native-toast-message";

type CategoryManagementScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "CategoryManagement"
>;

export default function CategoryManagementScreen() {
  const navigation = useNavigation<CategoryManagementScreenNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setIsError(false);
      const filters: CategoryFilters = {};

      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      const data = await fetchCategories(filters);

      // Sort by name alphabetically
      const sorted = [...data].sort((a, b) =>
        a.category_name.localeCompare(b.category_name)
      );
      setCategories(sorted);
      setFilteredCategories(sorted);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setIsError(true);
      Toast.show({
        type: "error",
        text1: "Lỗi tải dữ liệu",
        text2: "Không thể tải danh sách danh mục",
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const isInitialMount = useRef(true);
  useFocusEffect(
    React.useCallback(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      loadCategories();
    }, [loadCategories])
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = categories.filter((category) =>
      category.category_name.toLowerCase().includes(query)
    );

    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate("CategoryDetail", { categoryId: category.id.toString() });
  };

  const handleCategoryDelete = async (category: Category) => {
    try {
      await deleteCategory(category.id.toString());
      Toast.show({
        type: "success",
        text1: "Xóa thành công",
        text2: `Danh mục "${category.category_name}" đã được xóa`,
      });
      loadCategories();
    } catch (error: any) {
      console.error("Delete category error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi xóa",
        text2: error?.response?.data?.detail || "Không thể xóa danh mục",
      });
    }
  };

  const handleAddCategory = () => {
    navigation.navigate("CategoryDetail", { categoryId: "new" });
  };

  const stats = useMemo(() => {
    const total = categories.length;
    return { total };
  }, [categories]);

  if (isLoading && categories.length === 0) {
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
          <Text className="text-xl font-bold text-white">Category Management</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-400 mt-4">Đang tải danh sách danh mục...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && categories.length === 0) {
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
          <Text className="text-xl font-bold text-white">Category Management</Text>
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
            onPress={loadCategories}
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
        <Text className="text-xl font-bold text-white flex-1">Category Management</Text>
        <TouchableOpacity
          onPress={handleAddCategory}
          className="mr-2 p-2 rounded-full bg-emerald-500 active:bg-emerald-600"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-gray-400 text-sm">
          {filteredCategories.length} categories
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
      <CategorySearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Category List */}
      <CategoryList
        categories={filteredCategories}
        isLoading={isLoading && categories.length > 0}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onCategoryPress={handleCategoryPress}
        onCategoryDelete={handleCategoryDelete}
      />
    </SafeAreaView>
  );
}
