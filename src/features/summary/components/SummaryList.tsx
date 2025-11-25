import React from "react";
import { ScrollView } from "react-native";
import { SummaryCardItem } from "./SummaryCardItem";
import { Summary, SummaryPopulated } from "@shared-types/summary.type";

export const SummaryList = ({
  summaries,
  onSummaryPress,
}: {
  summaries: SummaryPopulated[];
  onSummaryPress: (summary: Summary) => void;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerClassName="px-4"
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
