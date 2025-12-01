import React from "react";
import { View, Text } from "react-native";

interface ReadingHistory {
  progress_percent: number;
}

interface SummaryReadingProgressProps {
  history: ReadingHistory;
}

export const SummaryReadingProgress = ({
  history,
}: SummaryReadingProgressProps) => {
  return (
    <View className="px-4 mt-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-400 text-sm">Reading Progress</Text>
        <Text className="text-gray-400 text-sm">{history.progress_percent}%</Text>
      </View>
      <View className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <View
          className="h-full bg-indigo-600 rounded-full"
          style={{ width: `${history.progress_percent}%` }}
        />
      </View>
    </View>
  );
};

