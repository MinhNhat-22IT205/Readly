import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WriterSummaryList } from "../../features/summary/components/WriterSummaryList";
import { Summary } from "@shared-types/summary.type";
import { AdminStackParamList } from "../navigation/AdminStack";

type AdminSummaryListScreenNavigationProp =
  NativeStackNavigationProp<AdminStackParamList>;

// Mock summaries data - in real app, fetch this from API
const mockPendingSummaries: Summary[] = [
  {
    _id: "2",
    title: "The Art of Effective Communication",
    book_athor: "John Smith",
    book_cover_path:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    published_date: new Date(),
    category_id: "cat2",
    user: {
      _id: "user1",
      username: "Writer User",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    },
    status: "waiting_for_approval",
    read_count: 0,
    content: [
      {
        section_order: 1,
        title: "Introduction",
        content: "Content here...",
      },
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    _id: "5",
    title: "Modern Leadership Principles",
    book_athor: "Sarah Johnson",
    book_cover_path:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=450&fit=crop",
    published_date: new Date(),
    category_id: "cat5",
    user: {
      _id: "user2",
      username: "Another Writer",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
    status: "waiting_for_approval",
    read_count: 0,
    content: [
      {
        section_order: 1,
        title: "Introduction",
        content: "Leadership content...",
      },
    ],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
  },
];

export default function AdminSummaryListScreen() {
  const navigation = useNavigation<AdminSummaryListScreenNavigationProp>();

  const handleSummaryPress = (summary: Summary) => {
    navigation.navigate("AdminSummaryDetail", { summaryId: summary._id });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-800">
        <Text className="text-white text-3xl font-bold">Pending Summaries</Text>
        <Text className="text-gray-400 text-sm mt-1">
          Review and approve summaries
        </Text>
      </View>

      {/* Summaries List */}
      <WriterSummaryList
        summaries={mockPendingSummaries}
        onSummaryPress={handleSummaryPress}
      />
    </SafeAreaView>
  );
}

