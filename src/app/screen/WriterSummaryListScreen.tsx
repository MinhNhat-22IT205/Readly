import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { WriterSummaryList } from "../../features/summary/components/writer/WriterSummaryList";
import { CreateSummaryForm } from "../../features/summary/components/writer/CreateSummaryForm";
import { Summary, SummaryPopulated } from "@shared-types/summary.type";
import { WriterStackParamList } from "../navigation/WriterStack";
import useFetchWriterSummaryList from "@features/summary/hooks/useFetchWriterSummaryList";
import {
  createSummary,
  deleteSummary,
  updateSummaryStatus,
} from "@features/summary/api/summary.api";

type WriterSummaryListScreenNavigationProp =
  NativeStackNavigationProp<WriterStackParamList>;

export default function WriterSummaryListScreen() {
  const navigation = useNavigation<WriterSummaryListScreenNavigationProp>();
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const { summaries, mutate: mutateSummaries } = useFetchWriterSummaryList();

  // Fix type: handle undefined summary.id and correct Summary type if needed
  const handleSummaryPress = (summary: Summary) => {
    const summaryId = summary.id ?? "";
    // Only navigate if summaryId actually exists
    if (!summaryId) {
      console.warn("Summary missing id:", summary);
      return;
    }
    // Navigate to editor screen for writing/pending summaries, details for approved
    if (
      summary.status === "editing" ||
      summary.status === "waiting_for_approval"
    ) {
      navigation.navigate("WriterSummaryEditor", { summaryId });
    } else {
      navigation.navigate("SummaryDetails", { summaryId });
    }
  };

  const handleCreateSummary = async (data: {
    title: string;
    book_id: number;
  }) => {
    try {
      const newSummary = await createSummary({
        title: data.title,
        book_id: data.book_id,
        status: "editing",
      });
      await mutateSummaries();
      const summaryIdentifier = newSummary?.id ?? newSummary?._id;
      const summaryId = summaryIdentifier ? summaryIdentifier.toString() : "";
      if (!summaryId) {
        throw new Error("Summary id missing in response");
      }
      // Navigate to editor with new summary ID
      navigation.navigate("WriterSummaryEditor", { summaryId });
    } catch (error) {
      console.error("Failed to create summary:", error);
      Alert.alert(
        "Error",
        "We couldn't create the summary right now. Please try again."
      );
    }
  };

  const getSummaryIdentifier = (summary: Summary) =>
    summary.id ?? summary._id ?? "";

  const handleChangeStatus = async (
    summary: SummaryPopulated,
    status: Summary["status"]
  ) => {
    const summaryId = getSummaryIdentifier(summary);
    if (!summaryId) {
      console.warn("Summary missing id:", summary);
      throw new Error("Summary identifier missing");
    }
    await updateSummaryStatus(summaryId, status);
    await mutateSummaries();
  };

  const handleDeleteSummary = async (summary: SummaryPopulated) => {
    const summaryId = getSummaryIdentifier(summary);
    if (!summaryId) {
      console.warn("Summary missing id:", summary);
      throw new Error("Summary identifier missing");
    }
    await deleteSummary(summaryId);
    await mutateSummaries();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-800">
        <Text className="text-white text-3xl font-bold">My Summaries</Text>
        <Text className="text-gray-400 text-sm mt-1">
          Manage your writing projects
        </Text>
      </View>

      {/* Summaries List */}
      <WriterSummaryList
        summaries={summaries ?? []}
        onSummaryPress={handleSummaryPress}
        onChangeStatus={handleChangeStatus}
        onDeleteSummary={handleDeleteSummary}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setIsCreateFormVisible(true)}
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Create Summary Form */}
      <CreateSummaryForm
        visible={isCreateFormVisible}
        onClose={() => setIsCreateFormVisible(false)}
        onSubmit={handleCreateSummary}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
