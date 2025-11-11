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
import useFetchApprovedSummary from "@features/summary/hooks/useFetchApprovedSummary";

type TabType = "home" | "explore" | "library";
type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Home"
>;

// Updated mock data to comply with type definitions and improved realism

const comments: Comment[] = [
  {
    _id: "c1",
    summary: {
      _id: "summary1",
      title: "The good guy",
      book_athor: "Mark mcallister",
      book_cover_path:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
      published_date: new Date("2023-02-01"),
      category_id: "cat1",
      user: { user_id: "author1", username: "Mark mcallister" },
      status: "approved",
      read_count: 8000000,
      content: [],
      createdAt: new Date("2023-02-01"),
      updatedAt: new Date("2023-03-01"),
    },
    endUser: {
      user_id: "user1",
      username: "John Doe",
    },
    content: "This summary is an eye-opener, highly recommended!",
    access: "public",
    createdAt: new Date("2023-02-14"),
  },
  {
    _id: "c2",
    summary: {
      _id: "summary2",
      title: "Futurama",
      book_athor: "Michael Douglas jr.",
      book_cover_path:
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
      published_date: new Date("2022-05-15"),
      category_id: "cat2",
      user: { user_id: "author2", username: "Michael Douglas jr." },
      status: "approved",
      read_count: 9000000,
      content: [],
      createdAt: new Date("2022-05-15"),
      updatedAt: new Date("2022-06-01"),
    },
    endUser: {
      user_id: "user2",
      username: "Jane Smith",
    },
    content: "Futurama brings hope and excitement for what's to come.",
    access: "public",
    createdAt: new Date("2023-01-29"),
  },
  {
    _id: "c3",
    summary: {
      _id: "summary3",
      title: "Explore your creativity...",
      book_athor: "Royryan Mercado",
      book_cover_path:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=450&fit=crop",
      published_date: new Date("2021-09-22"),
      category_id: "cat3",
      user: { user_id: "author3", username: "Royryan Mercado" },
      status: "approved",
      read_count: 15000000,
      content: [],
      createdAt: new Date("2021-09-22"),
      updatedAt: new Date("2021-10-11"),
    },
    endUser: {
      user_id: "user3",
      username: "Bob Johnson",
    },
    content: "Really sparks new ideas—excellent insights on creativity.",
    access: "public",
    createdAt: new Date("2022-12-05"),
  },
];

const books: Summary[] = [
  {
    _id: "summary1",
    title: "The good guy",
    book_athor: "Mark mcallister",
    book_cover_path:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    published_date: new Date("2023-02-01"),
    category_id: "cat1",
    user: { user_id: "author1", username: "Mark mcallister" },
    status: "approved",
    read_count: 8000000,
    content: [
      {
        section_order: 1,
        title: "Introduction",
        content: "This is a sample summary content. ".repeat(50),
      },
    ],
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-03-01"),
  },
  {
    _id: "summary2",
    title: "Futurama",
    book_athor: "Michael Douglas jr.",
    book_cover_path:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
    published_date: new Date("2022-05-15"),
    category_id: "cat2",
    user: { user_id: "author2", username: "Michael Douglas jr." },
    status: "approved",
    read_count: 9000000,
    content: [
      {
        section_order: 1,
        title: "The Future Begins",
        content: "This is a sample summary content. ".repeat(60),
      },
    ],
    createdAt: new Date("2022-05-15"),
    updatedAt: new Date("2022-06-01"),
  },
  {
    _id: "summary3",
    title: "Explore your creativity...",
    book_athor: "Royryan Mercado",
    book_cover_path:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=450&fit=crop",
    published_date: new Date("2021-09-22"),
    category_id: "cat3",
    user: { user_id: "author3", username: "Royryan Mercado" },
    status: "approved",
    read_count: 15000000,
    content: [
      {
        section_order: 1,
        title: "Starting Out",
        content: "This is a sample summary content. ".repeat(70),
      },
    ],
    createdAt: new Date("2021-09-22"),
    updatedAt: new Date("2021-10-11"),
  },
];

const trendingBooks: Summary[] = [
  {
    _id: "summary4",
    title: "Norse mythology",
    book_athor: "Neil Gaiman",
    book_cover_path:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=450&fit=crop",
    published_date: new Date("2021-12-12"),
    category_id: "cat4",
    user: { user_id: "author4", username: "Neil Gaiman" },
    status: "approved",
    read_count: 8500000,
    content: [
      {
        section_order: 1,
        title: "Gods & Myths",
        content: "This is a sample summary content. ".repeat(35),
      },
    ],
    createdAt: new Date("2021-12-12"),
    updatedAt: new Date("2022-01-10"),
  },
  {
    _id: "summary5",
    title: "Productivity Hacks",
    book_athor: "Susan Black",
    book_cover_path:
      "https://images.unsplash.com/photo-1556740720-1a741367b93e?w=300&h=450&fit=crop",
    published_date: new Date("2023-02-21"),
    category_id: "cat5",
    user: { user_id: "author5", username: "Susan Black" },
    status: "approved",
    read_count: 9500000,
    content: [
      {
        section_order: 1,
        title: "The Efficient Mind",
        content: "This is a sample summary content. ".repeat(50),
      },
    ],
    createdAt: new Date("2023-02-21"),
    updatedAt: new Date("2023-03-11"),
  },
  {
    _id: "summary6",
    title: "The Road to Success",
    book_athor: "Lisa Ray",
    book_cover_path:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a06b2?w=300&h=450&fit=crop",
    published_date: new Date("2022-11-01"),
    category_id: "cat6",
    user: { user_id: "author6", username: "Lisa Ray" },
    status: "approved",
    read_count: 12000000,
    content: [
      {
        section_order: 1,
        title: "First Steps",
        content: "This is a sample summary content. ".repeat(60),
      },
    ],
    createdAt: new Date("2022-11-01"),
    updatedAt: new Date("2023-01-01"),
  },
];

// --- Main Screen ---
export default function HomeScreen() {
  const [activeTab] = useState<TabType>("home");
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { summaries, isLoading, isError, mutate } = useFetchApprovedSummary();

  const handleSummaryPress = (summary: Summary) => {
    navigation.navigate("SummaryDetails", { bookId: summary._id });
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
        <PublicCommentList comments={comments} />

        {/* For You */}
        <SectionHeader
          title="For you"
          onShowAll={() => console.log("Show all For You")}
        />
        <SummaryList
          summaries={summaries}
          onSummaryPress={handleSummaryPress}
        />

        {/* Trending */}
        <SectionHeader
          title="Trending"
          onShowAll={() => console.log("Show all Trending")}
        />
        <SummaryList
          summaries={summaries}
          onSummaryPress={handleSummaryPress}
        />

        {/* 5-Min Read */}
        <SectionHeader
          title="5-Minutes read"
          onShowAll={() => console.log("Show all 5-min read")}
        />
        <SummaryList summaries={books} onSummaryPress={handleSummaryPress} />
      </ScrollView>
    </View>
  );
}
