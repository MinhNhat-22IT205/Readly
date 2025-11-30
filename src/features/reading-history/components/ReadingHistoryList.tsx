import React from "react";
import { ScrollView, View, Text } from "react-native";
import { ReadingHistoryItem } from "./ReadingHistoryItem";
import { ReadingHistoryPopulated } from "@shared-types/reading-history.type";
import { Ionicons } from "@expo/vector-icons";

export const ReadingHistoryList = ({
  readingHistories,
  onReadingHistoryPress,
}: {
  readingHistories: ReadingHistoryPopulated[];
  onReadingHistoryPress: (readingHistory: ReadingHistoryPopulated) => void;
}) => {
  if (readingHistories.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Ionicons name="time-outline" size={64} color="#666" />
        <Text className="text-gray-400 text-lg mt-4">No history yet</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {readingHistories.map((readingHistory) => (
        <ReadingHistoryItem
          key={readingHistory.id}
          readingHistory={readingHistory}
          onPress={() => onReadingHistoryPress(readingHistory)}
        />
      ))}
    </ScrollView>
  );
};

