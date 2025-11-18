import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { WriterSummaryList } from "../../features/summary/components/writer/WriterSummaryList";
import { CreateSummaryForm } from "../../features/summary/components/writer/CreateSummaryForm";
import { Summary } from "@shared-types/summary.type";
import { WriterStackParamList } from "../navigation/WriterStack";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";
import useFetchWriterSummaryList from "@features/summary/hooks/useFetchWriterSummaryList";

type WriterSummaryListScreenNavigationProp =
  NativeStackNavigationProp<WriterStackParamList>;

// Mock function to create summary - in real app, use API
const createSummary = async (data: {
  title: string;
  book_athor: string;
  book_cover_path: string;
  category_id: string;
  userId: string;
  username: string;
}): Promise<string> => {
  // Simulate API call
  const newSummaryId = Date.now().toString();
  console.log("Creating summary:", { ...data, summaryId: newSummaryId });
  // In real app: const response = await api.createSummary(data);
  // return response._id;
  return newSummaryId;
};

export default function WriterSummaryListScreen() {
  const navigation = useNavigation<WriterSummaryListScreenNavigationProp>();
  const endUser = useAuthStore((state) => state.endUser);
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const { summaries = [] } = useFetchWriterSummaryList();

  const handleSummaryPress = (summary: Summary) => {
    // Navigate to editor screen for writing/pending summaries, details for approved
    if (
      summary.status === "writing" ||
      summary.status === "waiting_for_approval"
    ) {
      navigation.navigate("WriterSummaryEditor", { summaryId: summary.id });
    } else {
      navigation.navigate("SummaryDetails", { bookId: summary.id });
    }
  };

  const handleCreateSummary = async (data: {
    title: string;
    book_athor: string;
    book_cover_path: string;
    category_id: string;
  }) => {
    try {
      const summaryId = await createSummary({
        ...data,
        userId: endUser.id,
        username: endUser.username,
      });
      // Navigate to editor with new summary ID
      navigation.navigate("WriterSummaryEditor", { summaryId });
    } catch (error) {
      console.error("Failed to create summary:", error);
    }
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
        summaries={summaries}
        onSummaryPress={handleSummaryPress}
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
