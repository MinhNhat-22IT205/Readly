import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SummaryCardItem } from "@features/summary/components/SummaryCardItem";
import type { SummaryPopulated } from "@shared-types/summary.type";
import { ExploreStackParamList } from "@app/navigation/ExploreStack";
import useFetchApprovedSummaryList from "@features/summary/hooks/useFetchApprovedSummaryList";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type ExploreScreenNavigationProp = NativeStackNavigationProp<
  ExploreStackParamList,
  "ExploreHome"
>;

export default function ExploreScreen() {
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  const { summaries } = useFetchApprovedSummaryList();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");

  // Lấy danh sách categories từ summaries
  const categoryOptions = useMemo(() => {
    const names = new Set<string>();
    (summaries ?? []).forEach((summary) => {
      summary.book?.categories?.forEach((cat) => {
        if (cat.category_name) {
          names.add(cat.category_name);
        }
      });
    });

    return ["Tất cả", ...Array.from(names)];
  }, [summaries]);

  // Lọc summaries theo search + category
  const filteredSummaries = useMemo(() => {
    const list = summaries ?? [];
    const normalized = searchQuery.trim().toLowerCase();

    return list.filter((summary) => {
      const title = summary.title?.toLowerCase?.() ?? "";
      const authorNames =
        summary.book?.authors?.map((a) => a.name).join(" ").toLowerCase() ??
        "";
      const categoryNames =
        summary.book?.categories
          ?.map((c) => c.category_name || "")
          .join(" ")
          .toLowerCase() ?? "";

      const matchesSearch =
        normalized.length === 0 ||
        title.includes(normalized) ||
        authorNames.includes(normalized) ||
        categoryNames.includes(normalized);

      const matchesCategory =
        selectedCategory === "Tất cả" ||
        summary.book?.categories?.some(
          (c) => c.category_name === selectedCategory
        );

      return matchesSearch && matchesCategory;
    });
  }, [summaries, searchQuery, selectedCategory]);

  const handleSummaryPress = (summary: SummaryPopulated) => {
    navigation.navigate("SummaryDetails", { summaryId: summary.id ?? "" });
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <StatusBar barStyle="light-content" />

      {/* Header + Search */}
      <View className="px-4 py-3">
        {/* Title row */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold text-white">Explore</Text>
            <View className="w-20 h-1 bg-white rounded mt-1" />
          </View>
        </View>

        {/* Search bar */}
        <View className="flex-row items-center bg-neutral-800 rounded-2xl px-4 py-3">
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Title, author or keyword"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="ml-3 flex-1 text-white text-base"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Topics (categories) */}
        {categoryOptions.length > 1 && (
          <View className="mt-5">
            <Text className="text-white text-lg font-semibold mb-3">
              Topics
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 4 }}
            >
              {categoryOptions.map((category) => {
                const isActive = category === selectedCategory;
                return (
                  <TouchableOpacity
                    key={category}
                    className={`mr-2 px-4 py-2 rounded-full border ${
                      isActive
                        ? "bg-white border-white"
                        : "bg-neutral-800 border-neutral-700"
                    }`}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      className={`text-sm ${
                        isActive ? "text-black font-semibold" : "text-white"
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Results grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96, paddingHorizontal: 12 }}
      >
        {filteredSummaries.length === 0 ? (
          <View className="mt-10 items-center">
            <Ionicons name="search-outline" size={40} color="#6B7280" />
            <Text className="text-neutral-400 text-base mt-3 text-center">
              Không tìm thấy summary phù hợp
            </Text>
            <Text className="text-neutral-500 text-sm mt-1 text-center px-6">
              Hãy thử từ khóa khác hoặc chọn một chủ đề khác trong Topics
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap pt-2">
            {filteredSummaries.map((summary) => (
              <View
                key={summary.id}
                className="w-1/2 mb-6 items-center"
              >
                <SummaryCardItem
                  summary={summary}
                  onPress={() => handleSummaryPress(summary)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


