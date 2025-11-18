import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SummaryList } from "../../features/summary/components/SummaryList";
import { SectionHeader } from "../../features/summary/components/SectionHeader";
import { Comment } from "@shared-types/comment.type";
import { Summary } from "@shared-types/summary.type";
import { HomeStackParamList } from "../navigation/HomeStack";
import { PublicCommentList } from "@features/reader-comment/components/PublicCommentList";
import useFetchApprovedSummaryList from "@features/summary/hooks/useFetchApprovedSummaryList";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Home"
>;

// --- Main Screen ---
export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { summaries, isLoading, isError, mutate } =
    useFetchApprovedSummaryList();

  const handleSummaryPress = (summary: Summary) => {
    navigation.navigate("SummaryDetails", { bookId: summary.id });
  };

  return (
    <View className="flex-1 bg-neutral-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View>
          <Text className="text-3xl font-bold text-white">Good Afternoon</Text>
          <View className="w-20 h-1 bg-white rounded mt-1" />
        </View>
      </View>

      {/* Main ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-24"
      >
        {/* Comments */}
        <PublicCommentList comments={[]} />

        {/* For You */}
        <SectionHeader
          title="For you"
          onShowAll={() => console.log("Show all For You")}
        />
        <SummaryList
          summaries={summaries ?? []}
          onSummaryPress={handleSummaryPress}
        />

        {/* Trending */}
        <SectionHeader
          title="Trending"
          onShowAll={() => console.log("Show all Trending")}
        />
        <SummaryList
          summaries={summaries ?? []}
          onSummaryPress={handleSummaryPress}
        />

        {/* 5-Min Read */}
        <SectionHeader
          title="5-Minutes read"
          onShowAll={() => console.log("Show all 5-min read")}
        />
        <SummaryList
          summaries={summaries ?? []}
          onSummaryPress={handleSummaryPress}
        />
      </ScrollView>
    </View>
  );
}
