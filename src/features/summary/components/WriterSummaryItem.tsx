import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Summary } from "@shared-types/summary.type";

interface WriterSummaryItemProps {
  summary: Summary;
  onPress: () => void;
}

const getStatusColor = (status: Summary["status"]) => {
  switch (status) {
    case "writing":
      return "bg-yellow-500";
    case "waiting_for_approval":
      return "bg-blue-500";
    case "approved":
      return "bg-green-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusLabel = (status: Summary["status"]) => {
  switch (status) {
    case "writing":
      return "Writing";
    case "waiting_for_approval":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
};

export const WriterSummaryItem = ({
  summary,
  onPress,
}: WriterSummaryItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-gray-800 rounded-xl p-4 mb-3 flex-row"
    activeOpacity={0.7}
  >
    <Image
      source={{ uri: summary.book_cover_path }}
      className="w-24 h-32 rounded-lg bg-gray-700"
    />
    <View className="flex-1 ml-4 justify-between">
      <View>
        <View className="flex-row items-center justify-between mb-2">
          <Text
            className="text-white font-bold text-base flex-1"
            numberOfLines={2}
          >
            {summary.title}
          </Text>
        </View>
        <Text className="text-gray-400 text-sm mb-2" numberOfLines={1}>
          {summary.book_athor}
        </Text>
        <View className="flex-row items-center gap-4 mb-2">
          <View className="flex-row items-center gap-1">
            <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs">
              {summary.read_count.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="document-text-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs">
              {summary.content.length} sections
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <View
          className={`${getStatusColor(summary.status)} px-3 py-1 rounded-full`}
        >
          <Text className="text-white text-xs font-semibold">
            {getStatusLabel(summary.status)}
          </Text>
        </View>
        <Text className="text-gray-500 text-xs">
          {new Date(summary.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);
