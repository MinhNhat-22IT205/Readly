import React, { useState, useMemo } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WriterSummaryItem } from "./WriterSummaryItem";
import { Summary, SummaryPopulated } from "@shared-types/summary.type";

type StatusFilter = "all" | Summary["status"];

interface WriterSummaryListProps {
  summaries: SummaryPopulated[];
  onSummaryPress: (summary: SummaryPopulated) => void;
}

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Writing", value: "writing" },
  { label: "Pending", value: "waiting_for_approval" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export const WriterSummaryList = ({
  summaries,
  onSummaryPress,
}: WriterSummaryListProps) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredSummaries = useMemo(() => {
    if (statusFilter === "all") {
      return summaries;
    }
    return summaries.filter((summary) => summary.status === statusFilter);
  }, [summaries, statusFilter]);

  const getStatusCount = (status: StatusFilter) => {
    if (status === "all") return summaries.length;
    return summaries.filter((s) => s.status === status).length;
  };

  if (filteredSummaries.length === 0) {
    return (
      <View className="flex-1">
        {/* Status Filters */}
        <View className="border-b border-gray-800">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            {statusFilters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                onPress={() => setStatusFilter(filter.value)}
                style={{
                  marginRight: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor:
                    statusFilter === filter.value ? "#4F46E5" : "#1F2937",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color:
                      statusFilter === filter.value ? "#FFFFFF" : "#9CA3AF",
                  }}
                >
                  {filter.label} ({getStatusCount(filter.value)})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Empty State */}
        <View className="items-center justify-center py-12 px-4">
          <Ionicons name="document-text-outline" size={64} color="#6B7280" />
          <Text className="text-gray-400 text-base mt-4">
            No summaries found
          </Text>
          <Text className="text-gray-500 text-sm mt-2">
            {statusFilter === "all"
              ? "Start writing your first summary!"
              : `No ${statusFilters.find((f) => f.value === statusFilter)?.label.toLowerCase()} summaries`}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Status Filters */}
      <View className="border-b border-gray-800">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        >
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => setStatusFilter(filter.value)}
              style={{
                marginRight: 12,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor:
                  statusFilter === filter.value ? "#4F46E5" : "#1F2937",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: statusFilter === filter.value ? "#FFFFFF" : "#9CA3AF",
                }}
              >
                {filter.label} ({getStatusCount(filter.value)})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Summaries List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 py-4"
      >
        {filteredSummaries.map((summary) => (
          <WriterSummaryItem
            key={summary.id}
            summary={summary}
            onPress={() => onSummaryPress(summary)}
          />
        ))}
      </ScrollView>
    </View>
  );
};
