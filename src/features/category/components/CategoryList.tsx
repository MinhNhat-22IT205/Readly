import React from "react";
import { View, Text, ActivityIndicator, RefreshControl } from "react-native";
import { ScrollView } from "react-native";
import { CategoryCard } from "./CategoryCard";
import type { Category } from "@features/category/api/category.api";

interface CategoryListProps {
  categories: Category[];
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onCategoryPress: (category: Category) => void;
  onCategoryDelete?: (category: Category) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  isLoading = false,
  refreshing = false,
  onRefresh,
  onCategoryPress,
  onCategoryDelete,
}) => {
  if (isLoading && categories.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-gray-400 mt-4">Đang tải danh sách danh mục...</Text>
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-4 py-20">
        <Text className="text-gray-400 text-lg text-center">
          Không có danh mục nào
        </Text>
        <Text className="text-gray-500 text-sm mt-2 text-center">
          Thêm danh mục mới để bắt đầu
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#A5B4FC"
          />
        ) : undefined
      }
    >
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onPress={onCategoryPress}
          onDelete={onCategoryDelete}
        />
      ))}
    </ScrollView>
  );
};

