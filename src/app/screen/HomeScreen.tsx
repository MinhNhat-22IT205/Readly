import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SummaryList } from "../../features/summary/components/SummaryList";
import { SectionHeader } from "../../features/summary/components/SectionHeader";
import { Comment } from "@shared-types/comment.type";
import { Summary, SummaryPopulated } from "@shared-types/summary.type";
import { HomeStackParamList } from "../navigation/HomeStack";
import { PublicCommentList } from "@features/comment/components/PublicCommentList";
import useFetchApprovedSummaryList from "@features/summary/hooks/useFetchApprovedSummaryList";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@features/cart/libs/useCart";

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
  const { totalItems } = useCart();

  const handleSummaryPress = (summary: SummaryPopulated) => {
    console.log(summary.id);
    navigation.navigate("SummaryDetails", { summaryId: summary.id ?? "" });
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
    <SafeAreaView className="flex-1 bg-neutral-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View>
          <Text className="text-3xl font-bold text-white">Good Afternoon</Text>
          <View className="w-20 h-1 bg-white rounded mt-1" />
        </View>
        {/* <TouchableOpacity
          onPress={handleLogout}
          className="px-3 py-2 bg-red-500 rounded-md"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity> */}
      </View>

      {/* Quick Access */}
      <View className="px-4">
        <TouchableOpacity
          className="bg-neutral-800 rounded-2xl p-4 flex-row items-center justify-between mb-3"
          onPress={() => navigation.navigate("BookStore")}
        >
          <View>
            <Text className="text-white font-semibold text-lg">
              Khám phá cửa hàng sách
            </Text>
            <Text className="text-neutral-400 mt-1">
              {totalItems > 0
                ? `Bạn có ${totalItems} sản phẩm trong giỏ`
                : "Ưu đãi hấp dẫn đang chờ bạn"}
            </Text>
          </View>
          <View className="w-12 h-12 rounded-full bg-emerald-500 items-center justify-center">
            <Ionicons name="cart-outline" size={22} color="#000" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-neutral-800 rounded-2xl p-4 flex-row items-center justify-between"
          onPress={() => navigation.navigate("OrderManagement")}
        >
          <View>
            <Text className="text-white font-semibold text-lg">
              Đơn hàng của tôi
            </Text>
            <Text className="text-neutral-400 mt-1">
              Xem và quản lý đơn hàng
            </Text>
          </View>
          <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
            <Ionicons name="receipt-outline" size={22} color="#000" />
          </View>
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
        {/* <SectionHeader
          title="Trending"
          onShowAll={() => console.log("Show all Trending")}
        />
        <SummaryList
          summaries={summaries ?? []}
          onSummaryPress={handleSummaryPress}
        /> */}

        {/* 5-Min Read */}
        {/* <SectionHeader
          title="5-Minutes read"
          onShowAll={() => console.log("Show all 5-min read")}
        />
        <SummaryList
          summaries={summaries ?? []}
          onSummaryPress={handleSummaryPress}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
}
