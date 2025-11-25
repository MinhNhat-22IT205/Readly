import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStack";
// import { Summary, SummarySection } from "@shared-types/summary.type";
import { SummaryList } from "../../features/summary/components/SummaryList";
// import { Book } from "../../features/summary/components/SummaryCardItem";
import { SummaryCommentPopup } from "../../features/reader-comment/components/SummaryCommentPopup";
// import { Comment } from "@shared-types/comment.type";
import { ContentDropdown } from "../../features/summary/components/ContentDropdown";
import useFetchSummary from "@features/summary/hooks/useFetchSummary";
import useFetchSummarySectionList from "@features/summary/hooks/useFetchSummarySectionList";

// Types
type SummaryDetailsScreenRouteProp = RouteProp<
  HomeStackParamList,
  "SummaryDetails"
>;
type SummaryDetailsScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "SummaryDetails"
>;

export default function SummaryDetailsScreen() {
  const route = useRoute<SummaryDetailsScreenRouteProp>();
  const navigation = useNavigation<SummaryDetailsScreenNavigationProp>();
  const { summaryId } = route.params;
  const { summary, isLoading: isSummaryLoading } = useFetchSummary(summaryId);
  const { sections, isLoading: isSectionsLoading } =
    useFetchSummarySectionList(summaryId);

  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const [isCommentPopupVisible, setIsCommentPopupVisible] = useState(false);

  // Placeholder for comments since fetching comments is not shown in the code/context
  const mockComments: any[] = []; // Replace with fetched comments if available

  // Placeholder for similar books/summaries, to be replaced by real data
  const similarSummaries: any[] = []; // You should fetch and pass as summaries

  // Helper safely get
  const book = summary?.book;
  const bookCoverUrl = book?.cover_image || "";
  const bookTitle = book?.title || "";
  const bookAuthor = book?.author?.name || book?.author.name || "";
  const bookAuthorBio = book?.author?.biography || book?.author.biography || "";
  const bookPublisher = book?.publisher?.name || book?.publisher.name || "";
  const user = summary?.user;

  const toggleSection = (order: number) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(order)) {
      newOpenSections.delete(order);
    } else {
      newOpenSections.add(order);
    }
    setOpenSections(newOpenSections);
  };

  // Updated: handleBookPress expects summaryId from summary
  const handleBookPress = (summary: any) => {
    navigation.navigate("SummaryDetails", { summaryId: summary.id });
  };

  if (isSummaryLoading || isSectionsLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#6366F1" />
      </SafeAreaView>
    );
  }

  if (!summary) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-white">Summary not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
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
                  style={{ width: "100%", height: "100%" }}
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

        {/* Title Section */}
        <View className="px-4 mt-6">
          <Text className="text-white text-2xl font-bold">{bookTitle}</Text>
          <Text className="text-gray-400 mt-2">{bookAuthor}</Text>
          <Text className="text-gray-500 text-sm mt-1">{user?.username}</Text>
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

        {/* View Comments Button */}
        <View className="px-4 mt-6">
          <TouchableOpacity
            onPress={() => setIsCommentPopupVisible(true)}
            className="bg-indigo-600 py-4 rounded-xl flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubbles-outline" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold text-base">
              View Public Comments
            </Text>
            <View className="ml-2 bg-indigo-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">
                {mockComments.filter((c) => c.access === "public").length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content Sections */}
        <View className="px-4 mt-8">
          <Text className="text-white text-xl font-bold mb-6">
            {sections.length} Sections
          </Text>

          {sections.map((section) => (
            <ContentDropdown
              key={section.section_order}
              section={section}
              isOpen={openSections.has(section.section_order)}
              onToggle={() => toggleSection(section.section_order)}
            />
          ))}
        </View>

        {/* Author Section */}
        <View className="mx-4 mt-4 bg-gray-800 rounded-lg p-4 flex-row">
          <Image source={""} className="w-14 h-14 rounded-full" />
          <View className="ml-4 flex-1">
            <Text className="text-white font-bold text-base">{bookAuthor}</Text>
            <Text className="text-gray-500 text-sm">{bookAuthor}</Text>
            <Text className="text-gray-400 text-sm mt-2">{bookAuthorBio}</Text>
          </View>
        </View>

        {/* Similar Summaries */}
        {/* <View className="mt-8 mb-6">
          <View className="flex-row justify-between items-center px-4 mb-4">
            <Text className="text-white text-lg font-bold">
              Similar Summaries
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-gray-400 mr-1">Show all</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <SummaryList
            summaries={similarSummaries}
            onSummaryPress={handleBookPress}
          />
        </View> */}
        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>

      {/* Public Comment Popup */}
      <SummaryCommentPopup
        visible={isCommentPopupVisible}
        onClose={() => setIsCommentPopupVisible(false)}
        comments={mockComments}
      />
    </SafeAreaView>
  );
}
