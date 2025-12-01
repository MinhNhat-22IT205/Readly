import React from "react";
import { View, Image, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SummaryHeroSectionProps {
  bookCoverUrl: string;
  bookTitle: string;
  isFavourite: boolean;
  isFavouriteToggling: boolean;
  onToggleFavourite: () => void;
}

export const SummaryHeroSection = ({
  bookCoverUrl,
  bookTitle,
  isFavourite,
  isFavouriteToggling,
  onToggleFavourite,
}: SummaryHeroSectionProps) => {
  return (
    <View className="relative">
      {/* Blurred Background */}
      <View className="h-64 bg-gray-800">
        {bookCoverUrl && (
          <Image
            source={{ uri: bookCoverUrl }}
            className="w-full h-full opacity-30"
            blurRadius={10}
          />
        )}
      </View>
      {/* Favourite Button */}
      <View className="absolute top-4 right-4 z-10">
        <TouchableOpacity
          onPress={onToggleFavourite}
          disabled={isFavouriteToggling}
          className="bg-black/50 rounded-full p-3"
          activeOpacity={0.7}
        >
          {isFavouriteToggling ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Ionicons
              name={isFavourite ? "heart" : "heart-outline"}
              size={24}
              color={isFavourite ? "#EF4444" : "white"}
            />
          )}
        </TouchableOpacity>
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
  );
};

