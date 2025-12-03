import React from "react";
import { View, Text, ActivityIndicator, RefreshControl } from "react-native";
import { ScrollView } from "react-native";
import { BookCard } from "./BookCard";
import type { BookPopulated } from "@features/book/api/book-management.api";

interface BookListProps {
  books: BookPopulated[];
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onBookPress: (book: BookPopulated) => void;
  onBookDelete?: (book: BookPopulated) => void;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  isLoading = false,
  refreshing = false,
  onRefresh,
  onBookPress,
  onBookDelete,
}) => {
  if (isLoading && books.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-gray-400 mt-4">Đang tải danh sách sách...</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-4 py-20">
        <Text className="text-gray-400 text-lg text-center">
          Không có sách nào
        </Text>
        <Text className="text-gray-500 text-sm mt-2 text-center">
          Thêm sách mới để bắt đầu
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
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onPress={onBookPress}
          onDelete={onBookDelete}
        />
      ))}
    </ScrollView>
  );
};




