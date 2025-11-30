import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SlideUpModal } from "@shared-components/SlideUpModal";
import { AdminCommentResponse } from "../api/comment.api";

interface AdminCommentModalProps {
  visible: boolean;
  onClose: () => void;
  comments: AdminCommentResponse[];
  isLoading: boolean;
}

const AdminCommentItem = ({ comment }: { comment: AdminCommentResponse }) => {
  const userName = comment.user?.username || "Unknown";
  const userRole = comment.user?.role?.role_name || "";
  const isAdmin = userRole === "admin";
  const createdAt = new Date(comment.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View className="bg-gray-800 rounded-xl p-4 mb-3">
      <View className="flex-row items-start mb-3">
        <View className="w-10 h-10 rounded-full bg-indigo-600 items-center justify-center mr-3">
          <Ionicons
            name={isAdmin ? "shield-checkmark" : "person"}
            size={20}
            color="#fff"
          />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-white font-semibold text-base">
              {userName}
            </Text>
            {isAdmin && (
              <View className="bg-indigo-600 px-2 py-0.5 rounded">
                <Text className="text-white text-xs font-semibold">Admin</Text>
              </View>
            )}
          </View>
          <Text className="text-gray-400 text-xs mt-1">{createdAt}</Text>
        </View>
      </View>
      <Text className="text-gray-100 text-sm leading-6">{comment.content}</Text>
      {comment.parent_comment && (
        <View className="mt-3 pt-3 border-t border-gray-700">
          <View className="flex-row items-center mb-2">
            <Ionicons name="return-down-back" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1">Reply to:</Text>
          </View>
          <Text className="text-gray-400 text-xs italic">
            {comment.parent_comment.content}
          </Text>
        </View>
      )}
    </View>
  );
};

export const AdminCommentModal = ({
  visible,
  onClose,
  comments,
  isLoading,
}: AdminCommentModalProps) => {
  return (
    <SlideUpModal
      visible={visible}
      onClose={onClose}
      title="Admin Comments"
      maxHeight={600}
    >
      <View className="px-5 pb-2">
        <Text className="text-gray-400 text-sm mb-4">
          {isLoading ? "Loading..." : `${comments.length} admin-related comments`}
        </Text>
      </View>

      {/* Comments List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
      >
        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-gray-400 text-base mt-4">Loading comments...</Text>
          </View>
        ) : comments.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Ionicons name="chatbubbles-outline" size={64} color="#6B7280" />
            <Text className="text-gray-400 text-base mt-4">
              No admin comments yet
            </Text>
            <Text className="text-gray-500 text-sm mt-2">
              Admin comments will appear here
            </Text>
          </View>
        ) : (
          comments.map((comment) => (
            <AdminCommentItem key={comment.id} comment={comment} />
          ))
        )}
      </ScrollView>
    </SlideUpModal>
  );
};

