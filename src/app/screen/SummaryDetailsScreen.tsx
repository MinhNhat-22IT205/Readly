import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute } from "@react-navigation/native";
import { HomeStackParamList } from "../navigation/HomeStack";

type SummaryDetailsScreenRouteProp = RouteProp<
  HomeStackParamList,
  "SummaryDetails"
>;

export default function SummaryDetailsScreen() {
  const route = useRoute<SummaryDetailsScreenRouteProp>();
  const { bookId } = route.params;
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="relative">
          {/* Blurred Background */}
          <View className="h-64 bg-gray-800">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800",
              }}
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
          <Text className="text-white text-2xl font-bold">
            Project Management for the Unofficial Project Manager
          </Text>
          <Text className="text-gray-400 mt-2">
            Kory Kogon, Suzette Blakemore, and James wood
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            A FranklinConvey Title
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
            <Text className="text-gray-400 ml-2">6 key ideas</Text>
          </View>
        </View>

        {/* About Section */}
        <View className="px-4 mt-6">
          <Text className="text-white text-lg font-bold mb-3">
            About this Book
          </Text>
          <Text className="text-gray-400 leading-6">
            Getting Along (2022) describes the importance of workplace
            interactions and their effects on productivity and creativity.
          </Text>
        </View>

        {/* Chapters Section */}
        <View className="px-4 mt-8">
          <Text className="text-white text-lg font-bold mb-4">56 Chapters</Text>

          {[
            { num: "01", title: "Introduction", ideas: 2 },
            { num: "02", title: "Creating the", ideas: 2 },
            { num: "03", title: "Introduction", ideas: 2 },
          ].map((chapter) => (
            <TouchableOpacity
              key={chapter.num}
              className="bg-gray-800 rounded-lg p-4 mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-gray-400 text-lg font-semibold mr-4">
                  {chapter.num}
                </Text>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-base">
                    {chapter.title}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Subscribe to unlock all {chapter.ideas} key ideas fro..
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#6B7280" />
            </TouchableOpacity>
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
            source={{
              uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
            }}
            className="w-14 h-14 rounded-full"
          />
          <View className="ml-4 flex-1">
            <Text className="text-white font-bold text-base">James wood</Text>
            <Text className="text-gray-500 text-sm">
              A FranklinConvey Title
            </Text>
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {[
              {
                title: "Explore your create...",
                author: "Royryan Mercado",
                time: "5m",
                reads: "5m",
                color: "bg-pink-400",
              },
              {
                title: "Futurama",
                author: "Michael Douglas jr",
                time: "5m",
                reads: "5m",
                color: "bg-indigo-900",
              },
              {
                title: "The good guy",
                author: "Mark mcallister",
                time: "5m",
                reads: "5m",
                color: "bg-red-900",
              },
            ].map((book, idx) => (
              <View key={idx} className="mr-4" style={{ width: 140 }}>
                <View
                  className={`${book.color} rounded-lg h-52 mb-2 items-center justify-center overflow-hidden`}
                >
                  {idx === 0 && (
                    <Text className="text-white text-4xl font-bold">
                      CREATIVE
                    </Text>
                  )}
                  {idx === 1 && (
                    <Text className="text-white text-2xl font-bold">
                      FUTURAMA
                    </Text>
                  )}
                  {idx === 2 && (
                    <Text className="text-white text-xl font-bold text-center px-2">
                      THE{"\n"}GOOD{"\n"}GUY
                    </Text>
                  )}
                </View>
                <Text
                  className="text-white font-medium text-sm"
                  numberOfLines={1}
                >
                  {book.title}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {book.author}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="time-outline" size={12} color="#6B7280" />
                  <Text className="text-gray-500 text-xs ml-1">
                    {book.time}
                  </Text>
                  <Ionicons
                    name="eye-outline"
                    size={12}
                    color="#6B7280"
                    className="ml-2"
                  />
                  <Text className="text-gray-500 text-xs ml-1">
                    {book.reads}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
