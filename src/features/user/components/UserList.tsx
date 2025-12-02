import React from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { UserCard } from "./UserCard";
import type { User } from "@features/user/api/user.api";

interface UserListProps {
  users: User[];
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onUserPress: (user: User) => void;
  onToggleActive?: (user: User) => void;
}

export const UserList = ({
  users,
  isLoading = false,
  refreshing = false,
  onRefresh,
  onUserPress,
  onToggleActive,
}: UserListProps) => {
  if (isLoading && users.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-gray-400 text-sm mt-4">Đang tải danh sách users...</Text>
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12 px-4">
        <View className="bg-gray-800/50 rounded-full p-6 mb-4">
          <Text className="text-4xl">👥</Text>
        </View>
        <Text className="text-gray-300 text-lg font-semibold mb-2">
          Không tìm thấy user nào
        </Text>
        <Text className="text-gray-500 text-sm text-center">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981"
            colors={["#10b981"]}
          />
        ) : undefined
      }
    >
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onPress={onUserPress}
          onToggleActive={onToggleActive}
        />
      ))}
    </ScrollView>
  );
};

