import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AdminStackParamList } from "../navigation/AdminStack";
import { ContentDropdown } from "../../features/summary/components/ContentDropdown";
import { AdminCommentPanel } from "../../features/admin-comment/components/AdminCommentPanel";
import { AdminActionButtons } from "../../features/admin-comment/components/AdminActionButtons";
import useFetchSummary from "@features/summary/hooks/useFetchSummary";
import useFetchSummarySectionList from "@features/summary/hooks/useFetchSummarySectionList";
import { updateSummaryStatus } from "@features/summary/api/summary.api";

type AdminSummaryDetailScreenRouteProp = RouteProp<
  AdminStackParamList,
  "AdminSummaryDetail"
>;
type AdminSummaryDetailScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminSummaryDetail"
>;

export default function AdminSummaryDetailScreen() {
  const route = useRoute<AdminSummaryDetailScreenRouteProp>();
  const navigation = useNavigation<AdminSummaryDetailScreenNavigationProp>();
  const { summaryId } = route.params;

  const { summary, isLoading: isSummaryLoading, mutate: mutateSummary } =
    useFetchSummary(summaryId);
  const { sections, isLoading: isSectionsLoading } =
    useFetchSummarySectionList(summaryId);

  const [openSections, setOpenSections] = useState<Set<number>>(new Set());

  const loading = isSummaryLoading || isSectionsLoading;

  // Helper to safely get book and user data
  const book = summary?.book;
  const bookCoverUrl = book?.cover_image || "";
  const bookTitle = book?.title || summary?.title || "";
  const bookAuthor = book?.author?.name || "";
  const user = summary?.user;
  const userName = user?.username || "";
  const userAvatar = user?.profile_image || "";

  // Sort sections by section_order
  const sortedSections = useMemo(() => {
    if (!sections) return [];
    return [...sections].sort((a, b) => a.section_order - b.section_order);
  }, [sections]);

  const toggleSection = (order: number) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(order)) {
      newOpenSections.delete(order);
    } else {
      newOpenSections.add(order);
    }
    setOpenSections(newOpenSections);
  };

  const handleStatusChange = async (newStatus: "approved" | "rejected") => {
    try {
      await updateSummaryStatus(summaryId, newStatus);
      await mutateSummary(); // Refresh summary data
      Alert.alert("Success", `Summary ${newStatus} successfully`);
      // Navigate back to list after status change
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error("Failed to update summary status:", error);
      Alert.alert("Error", "Failed to update summary status. Please try again.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A5B4FC" />
          <Text className="text-gray-400 mt-4">Loading summary...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!summary) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-white text-xl font-bold mt-4 text-center">
            Summary not found
          </Text>
          <Text className="text-gray-400 text-sm mt-2 text-center">
            The summary you're looking for doesn't exist or has been deleted.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-6 bg-indigo-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      
      {/* Header with Back Button */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold flex-1">
          Summary Details
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="relative">
          {/* Blurred Background */}
          <View className="h-64 bg-gray-800">
            {bookCoverUrl ? (
              <Image
                source={{ uri: bookCoverUrl }}
                className="w-full h-full opacity-30"
                blurRadius={10}
              />
            ) : (
              <View className="w-full h-full bg-gray-700" />
            )}
          </View>

          {/* Book Cover */}
          <View className="absolute bottom-0 left-0 right-0 items-center pb-4">
            <View
              className="bg-indigo-900 rounded-lg overflow-hidden shadow-2xl"
              style={{ width: 160, height: 240 }}
            >
              {bookCoverUrl ? (
                <Image
                  source={{ uri: bookCoverUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-gray-700 items-center justify-center">
                  <Ionicons name="book-outline" size={64} color="#9CA3AF" />
                </View>
              )}
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
          <Text className="text-white text-2xl font-bold">{bookTitle}</Text>
          {bookAuthor ? (
            <Text className="text-gray-400 mt-2">{bookAuthor}</Text>
          ) : null}
          {userName ? (
            <Text className="text-gray-500 text-sm mt-1">By {userName}</Text>
          ) : null}
        </View>

        {/* Stats */}
        <View className="flex-row px-4 mt-4 gap-8">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={18} color="#9CA3AF" />
            <Text className="text-gray-400 ml-2">~{sortedSections.length * 3} min</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="bulb-outline" size={18} color="#9CA3AF" />
            <Text className="text-gray-400 ml-2">
              {sortedSections.length} key ideas
            </Text>
          </View>
        </View>

        {/* Admin Action Buttons (Approve/Reject) */}
        <AdminActionButtons
          summaryId={summaryId}
          currentStatus={
            summary.status === "editing" ? "writing" : summary.status
          }
          onStatusChange={handleStatusChange}
        />

        {/* Admin Comments Panel */}
        <AdminCommentPanel summaryId={summaryId} />

        {/* Content Sections */}
        <View className="px-4 mt-8">
          <Text className="text-white text-xl font-bold mb-6">
            {sortedSections.length} Sections
          </Text>

          {sortedSections.length > 0 ? (
            sortedSections.map((section) => (
              <ContentDropdown
                key={section.id}
                section={{
                  section_order: section.section_order,
                  title: section.title || "",
                  content: section.content || "",
                }}
                isOpen={openSections.has(section.section_order)}
                onToggle={() => toggleSection(section.section_order)}
              />
            ))
          ) : (
            <View className="bg-gray-800 rounded-lg p-4 mb-3">
              <Text className="text-gray-400 text-center">
                No sections available yet
              </Text>
            </View>
          )}

          {/* Final Summary */}
          <TouchableOpacity className="bg-gray-800 rounded-lg p-4 mb-3 flex-row items-center justify-between">
            <Text className="text-white font-semibold text-base">
              Final Summary
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Author Section */}
        {user && (
          <View className="mx-4 mt-4 bg-gray-800 rounded-lg p-4 flex-row">
            {userAvatar ? (
              <Image
                source={{ uri: userAvatar }}
                className="w-14 h-14 rounded-full"
              />
            ) : (
              <View className="w-14 h-14 rounded-full bg-gray-700 items-center justify-center">
                <Ionicons name="person-outline" size={24} color="#9CA3AF" />
              </View>
            )}
            <View className="ml-4 flex-1">
              <Text className="text-white font-bold text-base">
                {userName}
              </Text>
              {bookAuthor ? (
                <Text className="text-gray-500 text-sm">{bookAuthor}</Text>
              ) : null}
              {user.bio ? (
                <Text className="text-gray-400 text-sm mt-2">{user.bio}</Text>
              ) : (
                <Text className="text-gray-400 text-sm mt-2">
                  Writer who creates engaging summaries
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
