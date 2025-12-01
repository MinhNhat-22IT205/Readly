import React from "react";
import { View, Text } from "react-native";
import { Author } from "@shared-types/author.type";

interface SummaryAuthorSectionProps {
  authors: Author[];
}

export const SummaryAuthorSection = ({
  authors,
}: SummaryAuthorSectionProps) => {
  if (!authors || authors.length === 0) {
    return null;
  }

  return (
    <View className="mx-4 mt-4 bg-gray-800 rounded-lg p-4">
      <Text className="text-white font-bold text-base mb-2">Tác giả</Text>
      {authors.map((author, index) => (
        <View key={author.id || index} className="mb-3 last:mb-0">
          <Text className="text-white font-semibold text-sm">{author.name}</Text>
          {author.biography && author.biography.trim() && (
            <Text
              className="text-gray-400 text-xs mt-1"
              numberOfLines={3}
            >
              {author.biography}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

