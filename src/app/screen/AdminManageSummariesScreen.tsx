import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { WriterSummaryList } from "../../features/summary/components/writer/WriterSummaryList";
import { Summary, SummaryPopulated } from "@shared-types/summary.type";
import { AdminStackParamList } from "../navigation/AdminStack";
import useFetchAllSummaryList from "@features/summary/hooks/useFetchAllSummaryList";
import { updateSummaryStatus, deleteSummary } from "@features/summary/api/summary.api";
import { Alert } from "react-native";
import { AdminProtectedScreen } from "@shared-components/AdminProtectedScreen";

type AdminManageSummariesScreenNavigationProp =
  NativeStackNavigationProp<AdminStackParamList, "AdminManageSummaries">;

type StatusFilter = "all" | Summary["status"];

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Writing", value: "editing" },
  { label: "Pending", value: "waiting_for_approval" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminManageSummariesScreen() {
  const navigation = useNavigation<AdminManageSummariesScreenNavigationProp>();
  const { summaries, isLoading, isError, mutate } = useFetchAllSummaryList();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const getSummaryIdentifier = (summary: SummaryPopulated) =>
    summary.id ?? summary._id ?? "";

  const filteredSummaries = useMemo(() => {
    const summariesList = summaries ?? [];
    if (statusFilter === "all") {
      return summariesList;
    }
    return summariesList.filter((summary) => summary.status === statusFilter);
  }, [summaries, statusFilter]);

  const getStatusCount = (status: StatusFilter) => {
    const summariesList = summaries ?? [];
    if (status === "all") return summariesList.length;
    return summariesList.filter((s) => s.status === status).length;
  };

  const handleSummaryPress = (summary: SummaryPopulated) => {
    const summaryId = getSummaryIdentifier(summary);
    if (!summaryId) {
      console.warn("Summary missing id:", summary);
      return;
    }
    navigation.navigate("AdminSummaryDetail", { summaryId: summaryId.toString() });
  };

  const handleChangeStatus = async (
    summary: SummaryPopulated,
    status: Summary["status"]
  ) => {
    try {
      const summaryId = getSummaryIdentifier(summary);
      if (!summaryId) {
        throw new Error("Summary identifier missing");
      }
      await updateSummaryStatus(summaryId, status);
      await mutate(); // Refresh list after status change
      Alert.alert("Success", `Summary status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update summary status:", error);
      Alert.alert("Error", "Failed to update summary status. Please try again.");
    }
  };

  const handleDeleteSummary = async (summary: SummaryPopulated) => {
    try {
      const summaryId = getSummaryIdentifier(summary);
      if (!summaryId) {
        throw new Error("Summary identifier missing");
      }
      await deleteSummary(summaryId);
      await mutate(); // Refresh list after deletion
      Alert.alert("Success", "Summary deleted successfully");
    } catch (error) {
      console.error("Failed to delete summary:", error);
      Alert.alert("Error", "Failed to delete summary. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <AdminProtectedScreen>
        <SafeAreaView className="flex-1 bg-gray-900">
          <StatusBar barStyle="light-content" />
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#A5B4FC" />
            <Text className="text-gray-400 mt-4">Loading summaries...</Text>
          </View>
        </SafeAreaView>
      </AdminProtectedScreen>
    );
  }

  if (isError) {
    return (
      <AdminProtectedScreen>
        <SafeAreaView className="flex-1 bg-gray-900">
          <StatusBar barStyle="light-content" />
          
          {/* Header */}
          <View className="px-4 py-4 border-b border-gray-800">
            <Text className="text-white text-3xl font-bold">Manage Summaries</Text>
          </View>

          {/* Error State */}
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-red-400 text-lg font-semibold text-center">
              Failed to load summaries
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Please check your connection and try again
            </Text>
            <TouchableOpacity
              onPress={() => mutate()}
              className="mt-6 bg-indigo-600 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </AdminProtectedScreen>
    );
  }

  const isEmpty = !summaries || summaries.length === 0;

  return (
    <AdminProtectedScreen>
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-800">
          <View className="flex-row items-center mb-2">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-white text-3xl font-bold">Manage Summaries</Text>
          </View>
          <Text className="text-gray-400 text-sm">
            Total: {summaries?.length ?? 0} summaries
          </Text>
        </View>

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
                className="mr-3 px-4 py-2 rounded-full"
                style={{
                  backgroundColor:
                    statusFilter === filter.value ? "#4F46E5" : "#1F2937",
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{
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
        {isEmpty ? (
          <View className="flex-1 items-center justify-center px-4">
            <Ionicons name="document-text-outline" size={64} color="#6B7280" />
            <Text className="text-gray-400 text-lg font-semibold mt-4 text-center">
              No summaries found
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center">
              There are no summaries in the system yet.
            </Text>
          </View>
        ) : filteredSummaries.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Ionicons name="filter-outline" size={64} color="#6B7280" />
            <Text className="text-gray-400 text-lg font-semibold mt-4 text-center">
              No summaries with this status
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center">
              Try selecting a different filter.
            </Text>
          </View>
        ) : (
          /* Summaries List - Pass filtered summaries và hide filters trong WriterSummaryList */
          <WriterSummaryList
            summaries={filteredSummaries}
            onSummaryPress={handleSummaryPress}
            onChangeStatus={handleChangeStatus}
            onDeleteSummary={handleDeleteSummary}
            hideFilters={true}
          />
        )}
      </SafeAreaView>
    </AdminProtectedScreen>
  );
}
