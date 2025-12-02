import React from "react";
import { View, Text, ActivityIndicator, RefreshControl } from "react-native";
import { ScrollView } from "react-native";
import { PublisherCard } from "./PublisherCard";
import type { Publisher } from "@features/publisher/api/publisher.api";

interface PublisherListProps {
  publishers: Publisher[];
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onPublisherPress: (publisher: Publisher) => void;
  onPublisherDelete?: (publisher: Publisher) => void;
}

export const PublisherList: React.FC<PublisherListProps> = ({
  publishers,
  isLoading = false,
  refreshing = false,
  onRefresh,
  onPublisherPress,
  onPublisherDelete,
}) => {
  if (isLoading && publishers.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-gray-400 mt-4">Đang tải danh sách nhà xuất bản...</Text>
      </View>
    );
  }

  if (publishers.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-4 py-20">
        <Text className="text-gray-400 text-lg text-center">
          Không có nhà xuất bản nào
        </Text>
        <Text className="text-gray-500 text-sm mt-2 text-center">
          Thêm nhà xuất bản mới để bắt đầu
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#A5B4FC"
          />
        ) : undefined
      }
    >
      {publishers.map((publisher) => (
        <PublisherCard
          key={publisher.id}
          publisher={publisher}
          onPress={onPublisherPress}
          onDelete={onPublisherDelete}
        />
      ))}
    </ScrollView>
  );
};

