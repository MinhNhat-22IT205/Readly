import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SummaryPopulated } from "@shared-types/summary.type";
import { AdminStackParamList } from "../navigation/AdminStack";
import { deleteSummary } from "@features/summary/api/summary.api";
import { AdminSummaryList } from "@features/summary/components/admin/AdminSummaryList";
import useFetchAllSummary from "@features/summary/hooks/useFetchAllSummary";

type AdminSummaryListScreenNavigationProp =
  NativeStackNavigationProp<AdminStackParamList>;

type StatusFilter = "all" | SummaryPopulated["status"];

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Writing", value: "editing" },
  { label: "Pending", value: "waiting_for_approval" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminSummaryListScreen() {
  const navigation = useNavigation<AdminSummaryListScreenNavigationProp>();
  const { summaries = [], mutate } = useFetchAllSummary();
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

  const handleSummaryPress = (summary: SummaryPopulated) => {
    navigation.navigate("AdminSummaryDetail", {
      summaryId: summary.id as string,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-800">
        <Text className="text-white text-3xl font-bold">All Summaries</Text>
        <Text className="text-gray-400 text-sm mt-1">
          Review, inspect and manage summaries
        </Text>
      </View>

      {/* Status Filters (same style as writer list) */}
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
      <AdminSummaryList
        summaries={filteredSummaries}
        onSummaryPress={handleSummaryPress}
        onDeleteSummary={async (summary) => {
          await deleteSummary(summary.id ?? summary._id ?? "");
          mutate();
        }}
      />
    </SafeAreaView>
  );
}
