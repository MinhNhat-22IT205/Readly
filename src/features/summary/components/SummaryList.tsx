import React from "react";
import { ScrollView } from "react-native";
import { SummaryCardItem } from "./SummaryCardItem";
import { Summary, SummaryPopulated } from "@shared-types/summary.type";

export const SummaryList = ({
  summaries,
  onSummaryPress,
}: {
  summaries: SummaryPopulated[];
  onSummaryPress: (summary: SummaryPopulated) => void;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 16 }}
  >
    {summaries.map((summary) => (
      <SummaryCardItem
        key={summary.id}
        summary={summary}
        onPress={() => onSummaryPress(summary)}
      />
    ))}
  </ScrollView>
);
