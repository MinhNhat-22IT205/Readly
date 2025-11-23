import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SummaryList } from "../../features/summary/components/SummaryList";
import { SectionHeader } from "../../features/summary/components/SectionHeader";
import { Comment } from "@shared-types/comment.type";
import { Summary } from "@shared-types/summary.type";
import { HomeStackParamList } from "../navigation/HomeStack";
import { PublicCommentList } from "@features/reader-comment/components/PublicCommentList";
import useFetchApprovedSummaryList from "@features/summary/hooks/useFetchApprovedSummaryList";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Home"
>;

// --- Main Screen ---
export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { summaries, isLoading, isError, mutate } =
    useFetchApprovedSummaryList();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleSummaryPress = (summary: Summary) => {
    navigation.navigate("SummaryDetails", { bookId: summary.id ?? "" });
  };

  const handleLogout = async () => {
    try {
      // Clear store first
      clearAuth();
      // Remove persisted token in storage (navigator will react to store change)
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.removeItem("auth_token");
        }
      } else {
        await AsyncStorage.removeItem("auth_token");
      }
    } catch {}
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
        <TouchableOpacity
          onPress={handleLogout}
          className="px-3 py-2 bg-red-500 rounded-md"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
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
