import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
type Props = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: Props) => {
  return (
    <View className="my-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {categories.map((category) => {
          const isActive = category === selectedCategory;
          return (
            <TouchableOpacity
              key={category}
              className={`px-4 py-2 rounded-full mr-3 ${
                isActive ? "bg-emerald-500" : "bg-neutral-800"
              }`}
              onPress={() => onSelectCategory(category)}
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? "text-black" : "text-white"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};


