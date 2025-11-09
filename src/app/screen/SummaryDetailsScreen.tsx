import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStack";
import { Summary, SummarySection } from "@shared-types/summary.type";
import { SummaryList } from "../../features/summary/components/SummaryList";
import { Book } from "../../features/summary/components/SummaryCardItem";
import { SummaryCommentPopup } from "../../features/reader-comment/components/SummaryCommentPopup";
import { Comment } from "@shared-types/comment.type";
import { ContentDropdown } from "../../features/summary/components/ContentDropdown";

type SummaryDetailsScreenRouteProp = RouteProp<
  HomeStackParamList,
  "SummaryDetails"
>;
type SummaryDetailsScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "SummaryDetails"
>;

// Mock summary data - in real app, fetch this based on bookId
const mockSummary: Summary = {
  _id: "summary1",
  title: "Project Management for the Unofficial Project Manager",
  book_athor: "Kory Kogon, Suzette Blakemore, and James wood",
  book_cover_path:
    "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800",
  published_date: new Date(),
  category_id: "cat1",
  user: {
    _id: "author1",
    username: "James wood",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
  },
  status: "approved",
  read_count: 18000000,
  content: [
    {
      section_order: 1,
      title: "Introduction",
      content:
        "Getting Along (2022) describes the importance of workplace interactions and their effects on productivity and creativity. This book provides practical strategies for managing difficult relationships at work.",
    },
    {
      section_order: 2,
      title: "Creating the Foundation",
      content:
        "The foundation of effective workplace relationships starts with understanding different personality types and communication styles. Managers who want to create positive work environments must first recognize the diverse needs of their team members.",
    },
    {
      section_order: 3,
      title: "Key Strategies",
      content:
        "Key strategies include active listening, empathy, and setting clear boundaries. These techniques help navigate complex interpersonal dynamics while maintaining professional relationships.",
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const similarBooks: Book[] = [
  {
    id: 1,
    title: "Explore your create...",
    author: "Royryan Mercado",
    duration: "5m",
    views: "5m",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=450&fit=crop",
  },
  {
    id: 2,
    title: "Futurama",
    author: "Michael Douglas jr",
    duration: "5m",
    views: "5m",
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
  },
  {
    id: 3,
    title: "The good guy",
    author: "Mark mcallister",
    duration: "5m",
    views: "5m",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
  },
];


// Mock comments data - in real app, fetch this based on summaryId
const mockComments: Comment[] = [
  {
    _id: "comment1",
    summary: mockSummary,
    endUser: {
      _id: "user1",
      username: "John Doe",
      avatar:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    },
    content:
      "This book really helped me understand project management better. The strategies are practical and easy to implement.",
    access: "public",
    createdAt: new Date(),
  },
  {
    _id: "comment2",
    summary: mockSummary,
    endUser: {
      _id: "user2",
      username: "Jane Smith",
      avatar:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    },
    content:
      "Excellent read! The author's approach to workplace relationships is insightful and well-researched.",
    access: "public",
    createdAt: new Date(),
  },
  {
    _id: "comment3",
    summary: mockSummary,
    endUser: {
      _id: "user3",
      username: "Bob Johnson",
      avatar:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    },
    content:
      "I've recommended this to my entire team. The concepts are clear and the examples are relatable.",
    access: "public",
    createdAt: new Date(),
  },
  {
    _id: "comment4",
    summary: mockSummary,
    endUser: {
      _id: "user4",
      username: "Alice Williams",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
    content:
      "A must-read for anyone in management. The practical tips have already improved my team's dynamics.",
    access: "public",
    createdAt: new Date(),
  },
];

export default function SummaryDetailsScreen() {
  const route = useRoute<SummaryDetailsScreenRouteProp>();
  const navigation = useNavigation<SummaryDetailsScreenNavigationProp>();
  const { bookId } = route.params;
  const [summary] = useState<Summary>(mockSummary);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const [isCommentPopupVisible, setIsCommentPopupVisible] = useState(false);

  const toggleSection = (order: number) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(order)) {
      newOpenSections.delete(order);
    } else {
      newOpenSections.add(order);
    }
    setOpenSections(newOpenSections);
  };

  const handleBookPress = (book: Book) => {
    navigation.navigate("SummaryDetails", { bookId: book.id });
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
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
              <View className="flex-1 items-center justify-center p-4">
                <Text className="text-white text-3xl font-bold tracking-wider">
                  FUTURAMA
                </Text>
                <View className="mt-4 w-full h-32 bg-gradient-to-b from-orange-400 via-orange-300 to-yellow-200 rounded">
                  <View className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <View className="w-8 h-16 bg-blue-400 rounded-t-full" />
                  </View>
                </View>
              </View>
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
              Managers who want to create positive work environments
            </Text>
          </View>
        </View>

        {/* Similar Books */}
        <View className="mt-8 mb-6">
          <View className="flex-row justify-between items-center px-4 mb-4">
            <Text className="text-white text-lg font-bold">Similar Books</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-gray-400 mr-1">Show all</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <SummaryList books={similarBooks} onBookPress={handleBookPress} />
        </View>

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
