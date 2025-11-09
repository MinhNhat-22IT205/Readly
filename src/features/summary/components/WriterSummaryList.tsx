import React from "react";
import { ScrollView, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WriterSummaryItem } from "./WriterSummaryItem";
import { Summary } from "@shared-types/summary.type";

interface WriterSummaryListProps {
  summaries: Summary[];
  onSummaryPress: (summary: Summary) => void;
}

export const WriterSummaryList = ({
  summaries,
  onSummaryPress,
}: WriterSummaryListProps) => {
  if (summaries.length === 0) {
    return (
      <View className="items-center justify-center py-12 px-4">
        <Ionicons name="document-text-outline" size={64} color="#6B7280" />
        <Text className="text-gray-400 text-base mt-4">No summaries found</Text>
        <Text className="text-gray-500 text-sm mt-2">
          Start writing your first summary!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="px-4 py-4"
    >
      {summaries.map((summary) => (
        <WriterSummaryItem
          key={summary._id}
          summary={summary}
          onPress={() => onSummaryPress(summary)}
        />
      ))}
    </ScrollView>
  );
};
