import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";
import { ThreeDotMenuButton } from "@shared-components/ThreeDotMenuButton";
import { SlideUpModal } from "@shared-components/SlideUpModal";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import useSWR from "swr";
import { fetchMyReadingHistory } from "@features/reading-history/api/reading-history.api";
import { fetchMyFavourites } from "@features/favourite/api/favourite.api";
import { ReadingHistoryList } from "@features/reading-history/components/ReadingHistoryList";
import { FavouriteList } from "@features/favourite/components/FavouriteList";
import { ReadingHistoryPopulated } from "@shared-types/reading-history.type";
import { PopulatedFavourite } from "@shared-types/favourite.type";
import { useNavigation } from "@react-navigation/native";

type TabType = "Favourites" | "History" | "Highlights";

export default function MyLibraryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("Favourites");
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const endUser = useAuthStore((s) => s.endUser);
  const navigation = useNavigation<any>();

  // Fetch reading history using SWR
  const {
    data: readingHistories,
    error: readingHistoryError,
    isLoading: isLoadingHistory,
  } = useSWR<ReadingHistoryPopulated[]>(
    "reading-history",
    fetchMyReadingHistory,
    {
      refreshInterval: 5000, // 5 seconds
    }
  );

  // Fetch favourites using SWR
  const {
    data: favourites,
    error: favouritesError,
    isLoading: isLoadingFavourites,
  } = useSWR<PopulatedFavourite[]>("favourites", fetchMyFavourites, {
    refreshInterval: 5000, // 5 seconds
  });

  const handleLogout = async () => {
    try {
      setIsMenuModalVisible(false);
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
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfilePress = () => {
    setIsMenuModalVisible(false);
    navigation.navigate("Profile");
  };

  const handleReadingHistoryPress = (
    readingHistory: ReadingHistoryPopulated
  ) => {
    // Navigate to summary details screen
    navigation.navigate("SummaryDetails", {
      summaryId: readingHistory.summary_id,
    });
  };

  const handleFavouritePress = (favourite: PopulatedFavourite) => {
    // Navigate to summary details screen
    navigation.navigate("SummaryDetails", {
      summaryId: favourite.summary_id,
    });
  };

  const tabs: TabType[] = ["Favourites", "History", "Highlights"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Favourites":
        if (isLoadingFavourites) {
          return (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#fff" />
            </View>
          );
        }
        if (favouritesError) {
          return (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
              <Text className="text-red-500 text-lg mt-4">
                Error loading favourites
              </Text>
            </View>
          );
        }
        return (
          <View className="flex-1 py-4">
            <FavouriteList
              favourites={favourites || []}
              onFavouritePress={handleFavouritePress}
            />
          </View>
        );
      case "History":
        if (isLoadingHistory) {
          return (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#fff" />
            </View>
          );
        }
        if (readingHistoryError) {
          return (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
              <Text className="text-red-500 text-lg mt-4">
                Error loading history
              </Text>
            </View>
          );
        }
        return (
          <View className="flex-1 py-4">
            <ReadingHistoryList
              readingHistories={readingHistories || []}
              onReadingHistoryPress={handleReadingHistoryPress}
            />
          </View>
        );
      case "Highlights":
        return (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="bookmark-outline" size={64} color="#666" />
            <Text className="text-gray-400 text-lg mt-4">
              No highlights yet
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
        <Text className="text-3xl font-bold text-white">My Library</Text>
        <ThreeDotMenuButton onPress={() => setIsMenuModalVisible(true)} />
      </View>

      {/* Top Tabs */}
      <View className="flex-row border-b border-gray-800">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="flex-1 py-4 items-center"
            activeOpacity={0.7}
          >
            <Text
              className={`text-base font-semibold ${
                activeTab === tab ? "text-white" : "text-gray-500"
              }`}
            >
              {tab}
            </Text>
            {activeTab === tab && (
              <View className="absolute bottom-0 w-full h-0.5 bg-white" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {renderTabContent()}
      </ScrollView>

      {/* Menu Modal */}
      <SlideUpModal
        visible={isMenuModalVisible}
        onClose={() => setIsMenuModalVisible(false)}
        title="Menu"
        showHandleBar={true}
        showCloseButton={false}
        maxHeight={400}
      >
        <View className="px-5 py-4" style={{ flexGrow: 1 }}>
          <TouchableOpacity
            onPress={handleProfilePress}
            className="flex-row items-center py-4 border-b border-gray-800"
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={24} color="#fff" />
            <Text className="text-white text-lg ml-4">Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center py-4"
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text className="text-red-500 text-lg ml-4">Logout</Text>
          </TouchableOpacity>
        </View>
      </SlideUpModal>
    </SafeAreaView>
  );
}
