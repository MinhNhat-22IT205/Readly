import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Category } from "@features/category/api/category.api";

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(category)}
      className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700 active:bg-gray-750"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-3">
          <View className="w-12 h-12 rounded-full bg-purple-500/20 items-center justify-center mr-3">
            <Ionicons name="bookmark" size={24} color="#a855f7" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg" numberOfLines={1}>
              {category.category_name}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">ID: {category.id}</Text>
          </View>
        </View>

        {onDelete && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDelete(category);
            }}
            className="p-2 rounded-full bg-red-500/20 active:bg-red-500/30"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

