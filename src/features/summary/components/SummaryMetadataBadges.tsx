import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Category } from "@shared-types/catagory.type";
import type { Publisher } from "@shared-types/publisher.type";

interface SummaryMetadataBadgesProps {
  categories?: Category[];
  publisher?: Publisher | null;
}

export const SummaryMetadataBadges = ({
  categories,
  publisher,
}: SummaryMetadataBadgesProps) => {
  const hasCategories = categories && categories.length > 0;
  const hasPublisher = publisher && publisher.name;

  if (!hasCategories && !hasPublisher) {
    return null;
  }

  return (
    <View className="px-4 mt-4">
      <View className="flex-row flex-wrap gap-2">
        {/* Categories */}
        {hasCategories &&
          categories.map((category) => (
            <View
              key={category.id}
              className="flex-row items-center bg-indigo-500/20 px-3 py-1.5 rounded-full border border-indigo-500/30"
            >
              <Text className="text-indigo-300 text-xs font-medium ml-1.5">
                {category.category_name}
              </Text>
            </View>
          ))}

        {/* Publisher */}
        {hasPublisher && (
          <View className="flex-row items-center bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-500/30">
            <Ionicons name="business-outline" size={14} color="#A78BFA" />
            <Text className="text-purple-300 text-xs font-medium ml-1.5">
              {publisher.name}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
