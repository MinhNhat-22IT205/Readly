import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QuoteList } from "../../features/summary/components/QuoteList";
import { SummaryList } from "../../features/summary/components/SummaryList";
import { SectionHeader } from "../../features/summary/components/SectionHeader";
import { Quote } from "../../features/summary/components/QuoteCardItem";
import { Book } from "../../features/summary/components/SummaryCardItem";
import { HomeStackParamList } from "../navigation/HomeStack";

type TabType = "home" | "explore" | "library";
type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Home"
>;

const quotes: Quote[] = [
  {
    id: 1,
    text: "And when it was time to go, the time was no more in control but he kep...",
    image:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
  },
  {
    id: 2,
    text: "Life is like a time machine, it takes you to future",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
  },
  {
    id: 3,
    text: "Creativity is the life of the creative minds",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
  },
];

const books: Book[] = [
  {
    id: 1,
    title: "The good guy",
    author: "Mark mcallister",
    duration: "5m",
    views: "8m",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
  },
  {
    id: 2,
    title: "Futurama",
    author: "Michael Douglas jr.",
    duration: "12m",
    views: "9m",
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
  },
  {
    id: 3,
    title: "Explore your create...",
    author: "Royryan Mercado",
    duration: "15m",
    views: "15m",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=450&fit=crop",
  },
];

const trendingBooks: Book[] = [
  {
    id: 4,
    title: "Norse mythology",
    author: "Neil Gaiman",
    duration: "5m",
    views: "8m",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=450&fit=crop",
  },
  {
    id: 5,
    title: "Explore your create...",
    author: "Royryan Mercado",
    duration: "5m",
    views: "8m",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=450&fit=crop",
  },
  {
    id: 6,
    title: "Futurama",
    author: "Michael Douglas jr.",
    duration: "5m",
    views: "8m",
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
  },
];

// --- Main Screen ---
export default function HomeScreen() {
  const [activeTab] = useState<TabType>("home");
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleBookPress = (book: Book) => {
    navigation.navigate("SummaryDetails", { bookId: book.id });
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
        {/* Quotes */}
        <QuoteList quotes={quotes} />

        {/* For You */}
        <SectionHeader
          title="For you"
          onShowAll={() => console.log("Show all For You")}
        />
        <SummaryList books={books} onBookPress={handleBookPress} />

        {/* Trending */}
        <SectionHeader
          title="Trending"
          onShowAll={() => console.log("Show all Trending")}
        />
        <SummaryList books={trendingBooks} onBookPress={handleBookPress} />

        {/* 5-Min Read */}
        <SectionHeader
          title="5-Minutes read"
          onShowAll={() => console.log("Show all 5-min read")}
        />
        <SummaryList books={books} onBookPress={handleBookPress} />
      </ScrollView>
    </View>
  );
}
