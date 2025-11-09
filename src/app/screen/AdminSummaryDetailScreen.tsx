import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Summary } from "@shared-types/summary.type";
import { AdminStackParamList } from "../navigation/AdminStack";
import { ContentDropdown } from "../../features/summary/components/ContentDropdown";
import { AdminCommentPanel } from "../../features/admin-comment/components/AdminCommentPanel";
import { AdminActionButtons } from "../../features/admin-comment/components/AdminActionButtons";

type AdminSummaryDetailScreenRouteProp = RouteProp<
  AdminStackParamList,
  "AdminSummaryDetail"
>;
type AdminSummaryDetailScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminSummaryDetail"
>;

// Mock function to fetch summary - in real app, use API
const fetchSummary = async (summaryId: string): Promise<Summary> => {
  // Simulate API call
  return {
    _id: summaryId,
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
        content:
          "Effective communication is the cornerstone of successful relationships and professional growth. This section explores the fundamental principles that make communication effective.",
      },
      {
        section_order: 2,
        title: "Key Principles",
        content:
          "Understanding the key principles of communication helps build stronger connections. We'll dive into active listening, empathy, and clarity in messaging.",
      },
      {
        section_order: 3,
        title: "Practical Applications",
        content:
          "Learn how to apply these principles in real-world scenarios, from workplace interactions to personal relationships.",
      },
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  };
};

export default function AdminSummaryDetailScreen() {
  const route = useRoute<AdminSummaryDetailScreenRouteProp>();
  const navigation = useNavigation<AdminSummaryDetailScreenNavigationProp>();
  const { summaryId } = route.params;

  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadData();
  }, [summaryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const summaryData = await fetchSummary(summaryId);
      setSummary(summaryData);
    } catch (error) {
      Alert.alert("Error", "Failed to load summary");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (order: number) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(order)) {
      newOpenSections.delete(order);
    } else {
      newOpenSections.add(order);
    }
    setOpenSections(newOpenSections);
  };

  const handleStatusChange = (newStatus: "approved" | "rejected") => {
    if (summary) {
      setSummary({ ...summary, status: newStatus });
      // Navigate back to list after status change
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }
  };

  if (loading || !summary) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-white">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="relative">
          {/* Blurred Background */}
          <View className="h-64 bg-gray-800">
            <Image
              source={{ uri: summary.book_cover_path }}
              className="w-full h-full opacity-30"
              blurRadius={10}
            />
          </View>

          {/* Book Cover */}
          <View className="absolute bottom-0 left-0 right-0 items-center pb-4">
            <View
              className="bg-indigo-900 rounded-lg overflow-hidden shadow-2xl"
              style={{ width: 160, height: 240 }}
            >
              <Image
                source={{ uri: summary.book_cover_path }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row mx-4 mt-6 gap-2">
          <TouchableOpacity className="flex-1 bg-gray-800 py-3 rounded-lg flex-row items-center justify-center">
            <Ionicons name="book-outline" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold">Read Nexus</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-800 py-3 rounded-lg flex-row items-center justify-center">
            <Ionicons name="headset-outline" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold">Play Nexus</Text>
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View className="px-4 mt-6">
          <Text className="text-white text-2xl font-bold">{summary.title}</Text>
          <Text className="text-gray-400 mt-2">{summary.book_athor}</Text>
          <Text className="text-gray-500 text-sm mt-1">
            {summary.user.username}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row px-4 mt-4 gap-8">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={18} color="#9CA3AF" />
            <Text className="text-gray-400 ml-2">18 min</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="bulb-outline" size={18} color="#9CA3AF" />
            <Text className="text-gray-400 ml-2">
              {summary.content.length} key ideas
            </Text>
          </View>
        </View>

        {/* Admin Action Buttons (Approve/Reject) */}
        <AdminActionButtons
          summaryId={summaryId}
          currentStatus={summary.status}
          onStatusChange={handleStatusChange}
        />

        {/* Admin Comments Panel */}
        <AdminCommentPanel summaryId={summaryId} />

        {/* Content Sections */}
        <View className="px-4 mt-8">
          <Text className="text-white text-xl font-bold mb-6">
            {summary.content.length} Sections
          </Text>

          {summary.content.map((section) => (
            <ContentDropdown
              key={section.section_order}
              section={section}
              isOpen={openSections.has(section.section_order)}
              onToggle={() => toggleSection(section.section_order)}
            />
          ))}

          {/* Final Summary */}
          <TouchableOpacity className="bg-gray-800 rounded-lg p-4 mb-3 flex-row items-center justify-between">
            <Text className="text-white font-semibold text-base">
              Final Summary
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Author Section */}
        <View className="mx-4 mt-4 bg-gray-800 rounded-lg p-4 flex-row">
          <Image
            source={{ uri: summary.user.avatar }}
            className="w-14 h-14 rounded-full"
          />
          <View className="ml-4 flex-1">
            <Text className="text-white font-bold text-base">
              {summary.user.username}
            </Text>
            <Text className="text-gray-500 text-sm">{summary.book_athor}</Text>
            <Text className="text-gray-400 text-sm mt-2">
              Writer who creates engaging summaries
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
