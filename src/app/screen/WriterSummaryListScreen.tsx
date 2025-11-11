import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { WriterSummaryList } from "../../features/summary/components/WriterSummaryList";
import { CreateSummaryForm } from "../../features/summary/components/CreateSummaryForm";
import { Summary } from "@shared-types/summary.type";
import { WriterStackParamList } from "../navigation/WriterStack";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";

type WriterSummaryListScreenNavigationProp =
  NativeStackNavigationProp<WriterStackParamList>;

type StatusFilter = "all" | Summary["status"];

// Mock summaries data - in real app, fetch this from API
const mockSummaries: Summary[] = [
  {
    _id: "1",
    title: "Project Management for the Unofficial Project Manager",
    book_athor: "Kory Kogon, Suzette Blakemore, and James Wood",
    book_cover_path:
      "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800",
    published_date: new Date("2023-10-12"),
    category_id: "cat1",
    user: {
      user_id: "user1",
      username: "Current User",
    },
    status: "writing",
    read_count: 0,
    content: [
      {
        section_order: 1,
        title: "Introduction",
        content:
          "Getting started with project management for those who aren't professional project managers, but still need to lead projects to success.",
      },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    _id: "2",
    title: "The Art of Effective Communication",
    book_athor: "John Smith",
    book_cover_path:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    published_date: new Date("2022-09-22"),
    category_id: "cat2",
    user: {
      user_id: "user1",
      username: "Current User",
    },
    status: "waiting_for_approval",
    read_count: 200,
    content: [
      {
        section_order: 1,
        title: "Introduction",
        content:
          "This summary covers the foundational principles of communicating clearly and persuasively in both personal and professional settings.",
      },
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    _id: "3",
    title: "Leadership in Modern Times",
    book_athor: "Jane Doe",
    book_cover_path:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
    published_date: new Date("2021-05-15"),
    category_id: "cat3",
    user: {
      user_id: "user1",
      username: "Current User",
    },
    status: "approved",
    read_count: 15000,
    content: [
      {
        section_order: 1,
        title: "Modern Leadership",
        content:
          "Explore changes in leadership philosophy over the last decade and essential skills for leading effective teams in the digital age.",
      },
    ],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    _id: "4",
    title: "Digital Transformation Guide",
    book_athor: "Mike Johnson",
    book_cover_path:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=450&fit=crop",
    published_date: new Date("2020-07-01"),
    category_id: "cat4",
    user: {
      user_id: "user1",
      username: "Current User",
    },
    status: "rejected",
    read_count: 0,
    content: [
      {
        section_order: 1,
        title: "What Is Digital Transformation?",
        content:
          "An overview of the strategies and common pitfalls in digital transformation initiatives in organizations of any size.",
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-08"),
  },
];

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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);

  const filteredSummaries = useMemo(() => {
    if (statusFilter === "all") {
      return mockSummaries;
    }
    return mockSummaries.filter((summary) => summary.status === statusFilter);
  }, [statusFilter]);

  const handleSummaryPress = (summary: Summary) => {
    // Navigate to editor screen for writing/pending summaries, details for approved
    if (
      summary.status === "writing" ||
      summary.status === "waiting_for_approval"
    ) {
      navigation.navigate("WriterSummaryEditor", { summaryId: summary._id });
    } else {
      navigation.navigate("SummaryDetails", { bookId: summary._id });
    }
  };

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Writing", value: "writing" },
    { label: "Pending", value: "waiting_for_approval" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const getStatusCount = (status: StatusFilter) => {
    if (status === "all") return mockSummaries.length;
    return mockSummaries.filter((s) => s.status === status).length;
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
        userId: endUser.user_id,
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
      <WriterSummaryList
        summaries={filteredSummaries}
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
