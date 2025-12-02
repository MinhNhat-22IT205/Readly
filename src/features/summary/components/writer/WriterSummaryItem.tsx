import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Summary, SummaryPopulated } from "@shared-types/summary.type";
import { validateImageUri } from "@shared-utils/validate-image-uri";

interface WriterSummaryItemProps {
  summary: SummaryPopulated;
  onPress: () => void;
  onMorePress?: () => void;
  showMoreButton?: boolean;
}

const getStatusColor = (status: Summary["status"]) => {
  switch (status) {
    case "editing":
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
    case "editing":
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
  onMorePress,
  showMoreButton = false,
}: WriterSummaryItemProps) => {
  const handleMorePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onMorePress?.();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-gray-800 rounded-xl p-4 mb-3 flex-row"
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: validateImageUri(
            summary.book?.cover_image,
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
          ),
        }}
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
            {showMoreButton ? (
              <TouchableOpacity
                onPress={handleMorePress}
                className="ml-3 p-1 rounded-full bg-gray-700/60"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text className="text-gray-400 text-sm mb-2" numberOfLines={1}>
            {summary.book?.authors && summary.book.authors.length > 0
              ? summary.book.authors.map((a) => a.name).join(", ")
              : "Unknown author"}
          </Text>
          <View className="flex-row items-center gap-4 mb-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs">
                {summary.read_count.toLocaleString()}
              </Text>
            </View>
            {/* <View className="flex-row items-center gap-1">
            <Ionicons name="document-text-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs">
              {summary.content_sections.length} sections
            </Text>
          </View> */}
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
            {summary.created_at
              ? new Date(summary.created_at).toLocaleDateString()
              : "—"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
