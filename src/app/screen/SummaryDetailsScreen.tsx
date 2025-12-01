import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStack";
import { SummaryCommentPopup } from "../../features/comment/components/SummaryCommentPopup";
import { ContentDropdown } from "../../features/summary/components/ContentDropdown";
import { SummaryHeroSection } from "../../features/summary/components/SummaryHeroSection";
import { SummaryActionButtons } from "../../features/summary/components/SummaryActionButtons";
import { SummaryTitleSection } from "../../features/summary/components/SummaryTitleSection";
import { SummaryStats } from "../../features/summary/components/SummaryStats";
import { SummaryReadingProgress } from "../../features/summary/components/SummaryReadingProgress";
import { SummaryAuthorSection } from "../../features/summary/components/SummaryAuthorSection";
import { SummaryViewCommentsButton } from "../../features/summary/components/SummaryViewCommentsButton";
import { SummaryMetadataBadges } from "../../features/summary/components/SummaryMetadataBadges";
import useFetchSummary from "@features/summary/hooks/useFetchSummary";
import useFetchSummarySectionList from "@features/summary/hooks/useFetchSummarySectionList";
import { useFavourite } from "@features/favourite/hooks/useFavourite";
import { useReadingHistory } from "@features/reading-history/hooks/useReadingHistory";
import { useReadingProgress } from "@features/reading-history/hooks/useReadingProgress";
import { useFetchCommentsBySummary } from "@features/comment/hooks/useFetchCommentsBySummary";

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

  const [isCommentPopupVisible, setIsCommentPopupVisible] = useState(false);

  // Favourite hook
  const {
    isFavourite,
    toggleFavourite,
    isToggling: isFavouriteToggling,
  } = useFavourite(summary?.id ? Number(summary.id) : null);

  // Reading history hook
  const {
    history,
    updateProgress,
    isUpdating: isHistoryUpdating,
  } = useReadingHistory(summary?.id ? Number(summary.id) : null);

  // Reading progress UI hook - quản lý logic mở/đóng sections và tracking progress
  const { openSections, toggleSection } = useReadingProgress({
    sections,
    history,
    summaryId: summary?.id ? Number(summary.id) : null,
    updateProgress,
  });

  // Comments hook
  const {
    comments = [],
    isLoading: isCommentsLoading,
    mutate: mutateComments,
  } = useFetchCommentsBySummary(summaryId);

  // Helper safely get
  const book = summary?.book;
  const bookCoverUrl = book?.cover_image || "";
  const bookTitle = book?.title || "";
  const bookAuthors =
    book?.authors && book.authors.length > 0
      ? book.authors.map((a) => a.name).join(", ")
      : "";
  const user = summary?.user;

  const publicCommentsCount = comments.filter(
    (c) => c.access === "public"
  ).length;

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
        <SummaryHeroSection
          bookCoverUrl={bookCoverUrl}
          bookTitle={bookTitle}
          isFavourite={isFavourite}
          isFavouriteToggling={isFavouriteToggling}
          onToggleFavourite={toggleFavourite}
        />

        <SummaryActionButtons />

        <SummaryTitleSection
          bookTitle={bookTitle}
          bookAuthors={bookAuthors}
          username={user?.username}
        />

        <SummaryStats sectionsCount={sections.length} />

        <SummaryMetadataBadges
          categories={book?.categories}
          publisher={book?.publisher}
        />

        {history && <SummaryReadingProgress history={history} />}

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

        {book?.authors && book.authors.length > 0 && (
          <SummaryAuthorSection authors={book.authors} />
        )}

        <SummaryViewCommentsButton
          commentsCount={publicCommentsCount}
          onPress={() => setIsCommentPopupVisible(true)}
        />

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>

      <SummaryCommentPopup
        visible={isCommentPopupVisible}
        onClose={() => setIsCommentPopupVisible(false)}
        comments={comments}
        summaryId={summaryId as string}
        onCommentAdded={() => {
          mutateComments();
        }}
      />
    </SafeAreaView>
  );
}
