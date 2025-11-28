import React from "react";
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { WriterSummaryList } from "../../features/summary/components/writer/WriterSummaryList";
import { Summary, SummaryPopulated } from "@shared-types/summary.type";
import { AdminStackParamList } from "../navigation/AdminStack";
import useFetchPendingSummaryList from "@features/summary/hooks/useFetchPendingSummaryList";
import { updateSummaryStatus, deleteSummary } from "@features/summary/api/summary.api";
import { Alert } from "react-native";

type AdminSummaryListScreenNavigationProp =
  NativeStackNavigationProp<AdminStackParamList>;

export default function AdminSummaryListScreen() {
  const navigation = useNavigation<AdminSummaryListScreenNavigationProp>();
  const { summaries, isLoading, isError, mutate } = useFetchPendingSummaryList();

  const getSummaryIdentifier = (summary: SummaryPopulated) =>
    summary.id ?? summary._id ?? "";

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
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A5B4FC" />
          <Text className="text-gray-400 mt-4">Loading pending summaries...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-800">
          <Text className="text-white text-3xl font-bold">Pending Summaries</Text>
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
    );
  }

  // Check if summaries array is empty (not error, just no data)
  const isEmpty = !summaries || summaries.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-800">
        <Text className="text-white text-3xl font-bold">Pending Summaries</Text>
        <Text className="text-gray-400 text-sm mt-1">
          Review and approve summaries ({summaries?.length ?? 0})
        </Text>
      </View>

      {/* Empty State */}
      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="checkmark-circle-outline" size={64} color="#6B7280" />
          <Text className="text-gray-400 text-lg font-semibold mt-4 text-center">
            No pending summaries
          </Text>
          <Text className="text-gray-500 text-sm mt-2 text-center">
            All summaries have been reviewed. Great job! 🎉
          </Text>
        </View>
      ) : (
        /* Summaries List */
        <WriterSummaryList
          summaries={summaries}
          onSummaryPress={handleSummaryPress}
          onChangeStatus={handleChangeStatus}
          onDeleteSummary={handleDeleteSummary}
        />
      )}
    </SafeAreaView>
  );
}
