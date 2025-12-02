import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { mutate as mutateSWR } from "swr";
import { AdminStackParamList } from "../navigation/AdminStack";
import { ContentDropdown } from "../../features/summary/components/ContentDropdown";
import useFetchSummary from "@features/summary/hooks/useFetchSummary";
import useFetchSummarySectionList from "@features/summary/hooks/useFetchSummarySectionList";
import { SlideUpModal } from "../../shared/components/SlideUpModal";
import { AdminActionButtons } from "../../features/comment/components/AdminActionButtons";
import { validateImageUri } from "@shared-utils/validate-image-uri";
import { AdminCommentPanel } from "../../features/comment/components/AdminCommentPanel";
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

  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  const {
    summary,
    isLoading: isSummaryLoading,
    mutate,
  } = useFetchSummary(summaryId);
  const { sections, isLoading: isSectionsLoading } =
    useFetchSummarySectionList(summaryId);

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
      mutate({ ...summary, status: newStatus }, false);
      // Invalidate the all-summaries cache to refresh the list
      mutateSWR("all-summaries");
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }
  };
  const handleApproveSummary = async (summaryId: string) => {
    await updateSummaryStatus(summaryId, "approved");
    // Invalidate the all-summaries cache to refresh the list
    mutateSWR("all-summaries");
  };
  const handleRejectSummary = async (summaryId: string) => {
    await updateSummaryStatus(summaryId, "rejected");
    // Invalidate the all-summaries cache to refresh the list
    mutateSWR("all-summaries");
  };

  if (isSummaryLoading || isSectionsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-white">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!summary) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-white">Summary not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const book = summary.book;
  const bookCoverUrlRaw =
    summary.book_cover_path ||
    book?.cover_image ||
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop";
  const bookCoverUrl = validateImageUri(bookCoverUrlRaw);
  const bookTitle = summary.title || book?.title || "";
  const bookAuthors =
    summary.book_author ||
    (book?.authors && book.authors.length > 0
      ? book.authors.map((a) => a.name).join(", ")
      : "") ||
    "";
  const user = summary.user;

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="relative">
          {/* Blurred Background */}
          <View className="h-64 bg-gray-800">
            <Image
              source={bookCoverUrl ? { uri: bookCoverUrl } : undefined}
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
              {bookCoverUrl ? (
                <Image
                  source={{ uri: bookCoverUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex-1 items-center justify-center p-4">
                  <Text className="text-white text-3xl font-bold tracking-wider">
                    {bookTitle || "BOOK"}
                  </Text>
                  <View className="mt-4 w-full h-32 bg-gradient-to-b from-orange-400 via-orange-300 to-yellow-200 rounded" />
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

        {/* Title Section + Admin menu button */}
        <View className="px-4 mt-6 flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white text-2xl font-bold">{bookTitle}</Text>
            <Text className="text-gray-400 mt-2">{bookAuthors}</Text>
            <Text className="text-gray-500 text-sm mt-1">{user?.username}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsReviewModalVisible(true)}
            className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#e5e7eb" />
          </TouchableOpacity>
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
              {sections.length} key ideas
            </Text>
          </View>
        </View>

        {/* Content Sections */}
        <View className="px-4 mt-8">
          <Text className="text-white text-xl font-bold mb-6">
            {sections.length} Sections
          </Text>

          {sections.map((section: any) => (
            <ContentDropdown
              key={section.section_order}
              section={section}
              isOpen={openSections.has(section.section_order)}
              onToggle={() => toggleSection(section.section_order)}
            />
          ))}
        </View>

        {/* Author Section */}
        {book?.authors && book.authors.length > 0 && (
          <View className="mx-4 mt-4 bg-gray-800 rounded-lg p-4">
            <Text className="text-white font-bold text-base mb-2">Tác giả</Text>
            {book.authors.map((author, index) => (
              <View key={author.id || index} className="mb-3 last:mb-0">
                <Text className="text-white font-semibold text-sm">
                  {author.name}
                </Text>
                {author.biography && (
                  <Text
                    className="text-gray-400 text-xs mt-1"
                    numberOfLines={3}
                  >
                    {author.biography}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>

      {/* Admin Review Modal */}
      <SlideUpModal
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        title="Admin Review"
        maxHeight={600}
      >
        <ScrollView nestedScrollEnabled>
          <AdminActionButtons
            summaryId={summaryId}
            currentStatus={summary.status}
            onApproveSummary={handleApproveSummary}
            onRejectSUmmary={handleRejectSummary}
            onStatusChange={handleStatusChange}
          />

          <AdminCommentPanel summaryId={summaryId} />
        </ScrollView>
      </SlideUpModal>
    </SafeAreaView>
  );
}
