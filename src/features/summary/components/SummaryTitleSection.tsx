import React from "react";
import { View, Text } from "react-native";

interface SummaryTitleSectionProps {
  bookTitle: string;
  bookAuthors: string;
  username?: string;
}

export const SummaryTitleSection = ({
  bookTitle,
  bookAuthors,
  username,
}: SummaryTitleSectionProps) => {
  return (
    <View className="px-4 mt-6">
      <Text className="text-white text-2xl font-bold">{bookTitle}</Text>
      <Text className="text-gray-400 mt-2">{bookAuthors}</Text>
      {username && <Text className="text-gray-500 text-sm mt-1">{username}</Text>}
    </View>
  );
};

