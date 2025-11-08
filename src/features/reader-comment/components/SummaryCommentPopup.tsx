import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Comment } from "@shared-types/comment.type";
import { SlideUpModal } from "@shared-components/SlideUpModal";

interface SummaryCommentPopupProps {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
}

const SummaryCommentItem = ({ comment }: { comment: Comment }) => (
  <View className="bg-gray-800 rounded-xl p-4 mb-3">
    <View className="flex-row items-start mb-3">
      <Image
        source={{ uri: comment.endUser.avatar }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        <Text className="text-white font-semibold text-base">
          {comment.endUser.username}
        </Text>
        <Text className="text-gray-400 text-xs mt-1">
          {new Date(comment.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
    <Text className="text-gray-100 text-sm leading-6">{comment.content}</Text>
    <View className="flex-row items-center mt-3 pt-3 border-t border-gray-700">
      <View className="flex-row items-center mr-4">
        <Ionicons name="book-outline" size={14} color="#9CA3AF" />
        <Text className="text-gray-400 text-xs ml-1">
          {comment.summary.title}
        </Text>
      </View>
    </View>
  </View>
);

export const SummaryCommentPopup = ({
  visible,
  onClose,
  comments,
}: SummaryCommentPopupProps) => {
  const publicComments = comments.filter(
    (comment) => comment.access === "public"
  );

  return (
    <SlideUpModal
      visible={visible}
      onClose={onClose}
      title="Public Comments"
      maxHeight={600}
    >
      <View className="px-5 pb-2">
        <Text className="text-gray-400 text-sm mb-4">
          {publicComments.length} comments
        </Text>
      </View>

      {/* Comments List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-4"
      >
        {publicComments.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Ionicons name="chatbubbles-outline" size={64} color="#6B7280" />
            <Text className="text-gray-400 text-base mt-4">
              No public comments yet
            </Text>
            <Text className="text-gray-500 text-sm mt-2">
              Be the first to share your thoughts!
            </Text>
          </View>
        ) : (
          publicComments.map((comment) => (
            <SummaryCommentItem key={comment._id} comment={comment} />
          ))
        )}
      </ScrollView>
    </SlideUpModal>
  );
};
