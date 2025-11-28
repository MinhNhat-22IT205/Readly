import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  ActivityIndicator,
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
import { fetchBooksWithoutSummary } from "@features/book/api/book.api";

type WriterSummaryListScreenNavigationProp =
  NativeStackNavigationProp<WriterStackParamList>;

export default function WriterSummaryListScreen() {
  const navigation = useNavigation<WriterSummaryListScreenNavigationProp>();
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [isCheckingBooks, setIsCheckingBooks] = useState(false);
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
      console.log("Creating summary:", data);
      const newSummary = await createSummary({
        title: data.title,
        book_id: data.book_id,
        status: "editing",
      });
      
      console.log("New summary created:", newSummary);
      
      // Refresh summaries list
      await mutateSummaries();
      
      // Get summary ID from response
      const summaryIdentifier = newSummary?.id ?? newSummary?._id;
      const summaryId = summaryIdentifier ? summaryIdentifier.toString() : "";
      
      console.log("Summary ID extracted:", summaryId);
      
      if (!summaryId) {
        console.error("Summary response:", newSummary);
        throw new Error("Summary id missing in response");
      }
      
      // Navigate to editor with new summary ID
      navigation.navigate("WriterSummaryEditor", { summaryId });
    } catch (error: any) {
      console.error("Failed to create summary:", {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "We couldn't create the summary right now. Please try again.";
      
      Alert.alert("Error", errorMessage);
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
        onPress={async () => {
          console.log("FAB button pressed, checking books availability...");
          try {
            setIsCheckingBooks(true);
            
            // Kiểm tra books trước khi mở form
            const availableBooks = await fetchBooksWithoutSummary();
            console.log("Available books count:", availableBooks?.length || 0);
            
            if (!availableBooks || availableBooks.length === 0) {
              Alert.alert(
                "Không có sách mới",
                "Tất cả sách hiện tại đã có summary. Mỗi sách chỉ có thể có một summary.\n\nVui lòng thêm sách mới trước khi tạo summary.",
                [{ text: "Đã hiểu", style: "default" }]
              );
              return;
            }
            
            // Có books, mở form
            setIsCreateFormVisible(true);
          } catch (error: any) {
            console.error("Error checking books:", error);
            Alert.alert(
              "Lỗi",
              "Không thể kiểm tra sách. Vui lòng thử lại."
            );
          } finally {
            setIsCheckingBooks(false);
          }
        }}
        style={[
          styles.fab,
          isCheckingBooks && styles.fabDisabled
        ]}
        activeOpacity={0.8}
        disabled={isCheckingBooks}
      >
        {isCheckingBooks ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Ionicons name="add" size={28} color="#FFFFFF" />
        )}
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
    zIndex: 1000, // Đảm bảo FAB luôn ở trên cùng
  },
  fabDisabled: {
    opacity: 0.7,
  },
});
