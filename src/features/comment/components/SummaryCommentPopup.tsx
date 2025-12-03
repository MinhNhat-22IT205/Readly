import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Comment, CommentPopulated } from "@shared-types/comment.type";
import { SlideUpModal } from "@shared-components/SlideUpModal";
import { createComment } from "../api/comment.api";
import { validateImageUri } from "@shared-utils/validate-image-uri";

interface SummaryCommentPopupProps {
  visible: boolean;
  onClose: () => void;
  comments: CommentPopulated[];
  summaryId: string;
  onCommentAdded?: () => void;
}

interface SummaryCommentItemProps {
  comment: CommentPopulated;
  onReply: (commentId: string) => void;
  level?: number;
}

const SummaryCommentItem = ({
  comment,
  onReply,
  level = 0,
}: SummaryCommentItemProps) => {
  const createdAt = new Date(comment.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Build profile image URI
  const getProfileImageUri = () => {
    if (!comment.user?.profile_image) {
      return "https://via.placeholder.com/48";
    }

    const profileImage = comment.user.profile_image;
    // Check if it's already an absolute URL
    if (profileImage.startsWith("http://") || profileImage.startsWith("https://")) {
      return profileImage;
    }

    // Build relative URL
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "";
    const fullUrl = baseUrl + (profileImage.startsWith("/") ? profileImage : "/" + profileImage);
    return fullUrl;
  };

  const avatarUri = validateImageUri(
    getProfileImageUri(),
    "https://via.placeholder.com/48"
  );

  return (
    <View
      className={`bg-gray-800 rounded-xl p-4 mb-3 ${
        level > 0 ? "ml-6 border-l-2 border-indigo-500/50" : ""
      }`}
    >
      <View className="flex-row items-start mb-3">
        <Image
          source={{ uri: avatarUri }}
          className="w-10 h-10 rounded-full mr-3"
        />
          <View className="flex-1">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-white font-semibold text-sm">
                {comment.user?.username || "Unknown"}
              </Text>
              <Text className="text-gray-500 text-xs">{createdAt}</Text>
            </View>
          </View>
      </View>

      {comment.parent_comment && (
        <View className="mb-2 pb-2 border-l-2 border-indigo-500/30 pl-3 ml-2">
          <View className="flex-row items-center mb-1">
            <Ionicons name="return-down-back" size={12} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1">
              Replying to {comment.parent_comment.user?.username || "Unknown"}:
            </Text>
          </View>
          <Text className="text-gray-500 text-xs italic ml-4" numberOfLines={2}>
            {comment.parent_comment.content}
          </Text>
        </View>
      )}

      <Text className="text-gray-100 text-sm leading-6 mb-3">
        {comment.content}
      </Text>

      <TouchableOpacity
        onPress={() => onReply(comment.id)}
        className="flex-row items-center mt-2 pt-2 border-t border-gray-700"
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-undo-outline" size={14} color="#9CA3AF" />
        <Text className="text-gray-400 text-xs ml-1.5">Reply</Text>
      </TouchableOpacity>
    </View>
  );
};

export const SummaryCommentPopup = ({
  visible,
  onClose,
  comments,
  summaryId,
  onCommentAdded,
}: SummaryCommentPopupProps) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const publicComments = comments.filter(
    (comment) => comment.access === "public"
  );

  // Organize comments hierarchically
  const topLevelComments = publicComments.filter(
    (c) => !c.parent_comment_id && !c.parent_comment
  );

  const getReplies = (parentId: string) =>
    publicComments.filter(
      (c) =>
        String(c.parent_comment_id) === parentId ||
        c.parent_comment?.id === parentId
    );

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const parentComment = replyingTo
    ? publicComments.find((c) => c.id === replyingTo)
    : null;

  const handleSubmitComment = async () => {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createComment({
        summary_id: summaryId,
        content: commentText.trim(),
        access: "public",
        parent_comment_id: replyingTo || undefined,
      });
      setCommentText("");
      setReplyingTo(null);
      onCommentAdded?.();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SlideUpModal
      visible={visible}
      onClose={onClose}
      title="Public Comments"
      maxHeight={600}
    >
      <View className="flex-1">
        <View className="px-5 pb-2">
          <Text className="text-gray-400 text-sm mb-4">
            {publicComments.length} comments
          </Text>
        </View>

        {/* Comments List */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
        >
          {topLevelComments.length === 0 ? (
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
            topLevelComments.map((comment) => (
              <View key={comment.id}>
                <SummaryCommentItem
                  comment={comment}
                  onReply={handleReply}
                  level={0}
                />
                {getReplies(comment.id).map((reply) => (
                  <SummaryCommentItem
                    key={reply.id}
                    comment={reply}
                    onReply={handleReply}
                    level={1}
                  />
                ))}
              </View>
            ))
          )}
        </ScrollView>

        {/* Comment Input */}
        <View className="px-5 pt-3 pb-4 border-t border-gray-800">
          {replyingTo && parentComment && (
            <View className="flex-row items-start mb-2 pb-2 bg-gray-800 rounded-lg px-3 py-2">
              <Ionicons name="arrow-undo" size={14} color="#9CA3AF" />
              <View className="flex-1 ml-2">
                <Text className="text-gray-400 text-xs">
                  Replying to {parentComment.user?.username || "comment"}:
                </Text>
                <Text
                  className="text-gray-500 text-xs italic mt-0.5"
                  numberOfLines={1}
                >
                  {parentComment.content}
                </Text>
              </View>
              <TouchableOpacity
                onPress={cancelReply}
                className="ml-2"
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          )}
          <View className="flex-row items-center bg-gray-800 rounded-xl px-4 py-2">
            <TextInput
              className="flex-1 text-white text-sm mr-3"
              placeholder={
                replyingTo ? "Write a reply..." : "Write a comment..."
              }
              placeholderTextColor="#9CA3AF"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
              style={{ minHeight: 40, maxHeight: 100 }}
            />
            <TouchableOpacity
              onPress={handleSubmitComment}
              disabled={!commentText.trim() || isSubmitting}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                commentText.trim() && !isSubmitting
                  ? "bg-indigo-600"
                  : "bg-gray-700"
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
                  color={
                    commentText.trim() && !isSubmitting ? "#fff" : "#6B7280"
                  }
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SlideUpModal>
  );
};
