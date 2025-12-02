import React from "react";
import { View, Text, ActivityIndicator, RefreshControl } from "react-native";
import { ScrollView } from "react-native";
import { AuthorCard } from "./AuthorCard";
import type { Author } from "@features/author/api/author.api";

interface AuthorListProps {
  authors: Author[];
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onAuthorPress: (author: Author) => void;
  onAuthorDelete?: (author: Author) => void;
}

export const AuthorList: React.FC<AuthorListProps> = ({
  authors,
  isLoading = false,
  refreshing = false,
  onRefresh,
  onAuthorPress,
  onAuthorDelete,
}) => {
  if (isLoading && authors.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-gray-400 mt-4">Đang tải danh sách tác giả...</Text>
      </View>
    );
  }

  if (authors.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-4 py-20">
        <Text className="text-gray-400 text-lg text-center">
          Không có tác giả nào
        </Text>
        <Text className="text-gray-500 text-sm mt-2 text-center">
          Thêm tác giả mới để bắt đầu
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
      {authors.map((author) => (
        <AuthorCard
          key={author.id}
          author={author}
          onPress={onAuthorPress}
          onDelete={onAuthorDelete}
        />
      ))}
    </ScrollView>
  );
};

