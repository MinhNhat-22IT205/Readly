import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Platform, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && SCREEN_WIDTH >= 768;

type Props = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export const CategoryFilter: React.FC<Props> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View>
      {/* Label */}
      <View className="mb-3">
        <Text className="text-gray-300 text-sm font-semibold">
          Danh mục sách
        </Text>
      </View>

      {/* Category Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: IS_DESKTOP ? 20 : 20,
        }}
        nestedScrollEnabled={true}
      >
        {categories.map((category, index) => {
          const isActive = category === selectedCategory;
          return (
            <TouchableOpacity
              key={category}
              className={`rounded-full ${
                IS_DESKTOP ? "px-6 py-3" : "px-5 py-2.5"
              } ${index === 0 ? "" : "ml-3"} ${
                isActive
                  ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                  : "bg-gray-800/80 border border-gray-700/50"
              }`}
              onPress={() => {
          
                onSelectCategory(category);
              }}
              activeOpacity={0.7}
            >
              <Text
                className={`font-semibold ${
                  isActive
                    ? "text-white"
                    : "text-gray-300"
                } ${IS_DESKTOP ? "text-base" : "text-sm"}`}
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


