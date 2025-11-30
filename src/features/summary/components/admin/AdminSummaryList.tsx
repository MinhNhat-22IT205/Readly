import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SummaryPopulated } from "@shared-types/summary.type";

interface AdminSummaryListProps {
  summaries: SummaryPopulated[];
  onSummaryPress: (summary: SummaryPopulated) => void;
  onDeleteSummary: (summary: SummaryPopulated) => void | Promise<void>;
}

export const AdminSummaryList = ({
  summaries,
  onSummaryPress,
  onDeleteSummary,
}: AdminSummaryListProps) => {
  const hasSummaries = summaries.length > 0;

  if (!hasSummaries) {
    return (
      <View className="flex-1 items-center justify-center py-12 px-4 bg-gray-900">
        <Ionicons name="document-text-outline" size={64} color="#6B7280" />
        <Text className="text-gray-300 text-base mt-4">No summaries found</Text>
        <Text className="text-gray-500 text-sm mt-2">
          There are currently no summaries to review.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {summaries.map((summary) => (
        <TouchableOpacity
          key={summary.id ?? summary._id}
          onPress={() => onSummaryPress(summary)}
          className="bg-gray-800/90 border border-gray-700 rounded-2xl p-4 mb-3 flex-row shadow-lg shadow-black/40"
          activeOpacity={0.8}
        >
          <View className="w-20 h-28 mr-4 rounded-xl overflow-hidden bg-gray-700 items-center justify-center">
            {summary.book?.cover_image ? (
              <Image
                source={{ uri: summary.book.cover_image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Ionicons name="image-outline" size={24} color="#4B5563" />
              </View>
            )}
          </View>

          <View className="flex-1 justify-between">
            <View>
              <View className="flex-row items-start justify-between mb-1">
                <View className="flex-1 mr-2">
                  <Text
                    className="text-white font-bold text-base"
                    numberOfLines={2}
                  >
                    {summary.title}
                  </Text>
                  <Text
                    className="text-gray-400 text-xs mt-0.5"
                    numberOfLines={1}
                  >
                    {summary.book?.title}
                  </Text>
                </View>

                <View className="items-end">
                  <View className="px-2 py-0.5 rounded-full bg-gray-700">
                    <Text className="text-[10px] text-gray-300 uppercase tracking-wide">
                      {summary.status.replace(/_/g, " ")}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => onDeleteSummary(summary)}
                    className="mt-2 p-1 rounded-full bg-red-500/10"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FCA5A5" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text className="text-gray-300 text-xs" numberOfLines={1}>
                {summary.book?.author?.name ?? "Unknown author"}
              </Text>

              <View className="mt-1 flex-row">
                <Text className="text-gray-400 text-[11px]" numberOfLines={1}>
                  Writer:{" "}
                  <Text className="text-gray-300">
                    {summary.user?.username ?? "Unknown"}
                  </Text>
                </Text>
              </View>
              <View className="mt-0.5 flex-row">
                <Text className="text-gray-400 text-[11px]" numberOfLines={1}>
                  Category:{" "}
                  <Text className="text-gray-300">
                    {summary.book?.category?.category_name ?? "Unknown"}
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs">
                      {summary.read_count.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                  <Text className="text-gray-400 text-xs">
                    {summary.createdAt || summary.created_at
                      ? new Date(
                          (summary.createdAt ??
                            summary.created_at) as unknown as string
                        ).toLocaleDateString()
                      : "—"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
