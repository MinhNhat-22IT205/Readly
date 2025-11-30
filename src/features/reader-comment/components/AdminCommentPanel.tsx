import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAdminComments } from "../hooks/useAdminComments";
import { createComment, AdminCommentResponse } from "../api/comment.api";

interface AdminCommentPanelProps {
  summaryId: string | number;
}

const CommentItem = ({
  comment,
  onReply,
  level = 0,
}: {
  comment: AdminCommentResponse;
  onReply: (commentId: number) => void;
  level?: number;
}) => {
  const userName = comment.user?.username || "Unknown";
  const userRole = comment.user?.role?.role_name || "";
  const isAdmin = userRole === "admin";
  const createdAt = new Date(comment.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      className={`bg-gray-800 rounded-xl p-3 mb-2 ${level > 0 ? "ml-6 border-l-2 border-indigo-600" : ""}`}
    >
      <View className="flex-row items-start mb-2">
        <View
          className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
            isAdmin ? "bg-indigo-600" : "bg-gray-700"
          }`}
        >
          <Ionicons
            name={isAdmin ? "shield-checkmark" : "person"}
            size={16}
            color="#fff"
          />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 flex-wrap">
            <Text className="text-white font-semibold text-sm">{userName}</Text>
            {isAdmin && (
              <View className="bg-indigo-600 px-1.5 py-0.5 rounded">
                <Text className="text-white text-xs font-semibold">Admin</Text>
              </View>
            )}
            <Text className="text-gray-500 text-xs">{createdAt}</Text>
          </View>
        </View>
      </View>
      <Text className="text-gray-100 text-sm leading-5 mb-2">
        {comment.content}
      </Text>
      {comment.parent_comment && (
        <View className="mt-2 pt-2 border-t border-gray-700">
          <View className="flex-row items-center mb-1">
            <Ionicons name="return-down-back" size={12} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1">
              Replying to {comment.parent_comment.user?.username || "Unknown"}:
            </Text>
          </View>
          <Text className="text-gray-500 text-xs italic ml-4">
            {comment.parent_comment.content}
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => onReply(comment.id)}
        className="flex-row items-center mt-2"
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-undo-outline" size={14} color="#9CA3AF" />
        <Text className="text-gray-400 text-xs ml-1">Reply</Text>
      </TouchableOpacity>
    </View>
  );
};

export const AdminCommentPanel = ({ summaryId }: AdminCommentPanelProps) => {
  const summaryIdNum =
    typeof summaryId === "string" ? Number(summaryId) : summaryId;
  const { comments, isLoading, mutate } = useAdminComments(summaryIdNum);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    try {
      setIsSubmitting(true);
      await createComment({
        summary_id: summaryIdNum,
        content: newComment.trim(),
        parent_comment_id: replyingTo,
        access: "public",
      });
      setNewComment("");
      setReplyingTo(null);
      setShowInput(false);
      mutate(); // Refresh comments
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.detail || "Failed to create comment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
    setShowInput(true);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment("");
    setShowInput(false);
  };

  // Find parent comment for reply indicator
  const parentComment = replyingTo
    ? comments.find((c) => c.id === replyingTo)
    : null;

  // Group comments by parent to show threaded structure
  const topLevelComments = comments.filter(
    (c) => !c.parent_comment_id && !c.parent_comment
  );
  const getReplies = (parentId: number) =>
    comments.filter(
      (c) =>
        c.parent_comment_id === parentId || c.parent_comment?.id === parentId
    );

  return (
    <View className="mt-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Ionicons name="chatbubbles" size={20} color="#6366F1" />
          <Text className="text-white font-bold text-lg ml-2">
            Admin Comments
          </Text>
          {comments.length > 0 && (
            <View className="ml-2 bg-indigo-600 px-2 py-0.5 rounded-full">
              <Text className="text-white text-xs font-bold">
                {comments.length}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (showInput) cancelReply();
            setShowInput(!showInput);
          }}
          className="bg-indigo-600 px-3 py-1.5 rounded-lg flex-row items-center"
          activeOpacity={0.8}
        >
          <Ionicons name={showInput ? "close" : "add"} size={16} color="#fff" />
          <Text className="text-white text-xs font-semibold ml-1">
            {showInput ? "Cancel" : "Comment"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comment Input Form - Compact */}
      {showInput && (
        <View className="bg-gray-800 rounded-xl p-3 mb-4">
          {replyingTo && parentComment && (
            <View className="flex-row items-start mb-2 pb-2 border-b border-gray-700">
              <Ionicons name="arrow-undo" size={14} color="#9CA3AF" />
              <View className="flex-1 ml-1">
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
          <TextInput
            placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
            placeholderTextColor="#6B7280"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm mb-2"
            style={{
              color: "#FFFFFF",
              minHeight: 60,
              maxHeight: 100,
            }}
          />
          <View className="flex-row justify-end gap-2">
            {replyingTo && (
              <TouchableOpacity
                onPress={cancelReply}
                className="px-3 py-1.5 rounded-lg bg-gray-700"
                activeOpacity={0.7}
              >
                <Text className="text-gray-300 text-xs">Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || !newComment.trim()}
              className={`px-4 py-1.5 rounded-lg flex-row items-center ${
                isSubmitting || !newComment.trim()
                  ? "bg-gray-700"
                  : "bg-indigo-600"
              }`}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={14} color="#FFFFFF" />
              )}
              <Text
                className={`text-xs font-semibold ml-1 ${
                  isSubmitting || !newComment.trim()
                    ? "text-gray-400"
                    : "text-white"
                }`}
              >
                {replyingTo ? "Reply" : "Post"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Comments List */}
      {isLoading ? (
        <View className="items-center justify-center py-8">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-gray-400 text-sm mt-2">
            Loading comments...
          </Text>
        </View>
      ) : topLevelComments.length === 0 ? (
        <View className="items-center justify-center py-8 bg-gray-800 rounded-xl">
          <Ionicons name="chatbubbles-outline" size={48} color="#6B7280" />
          <Text className="text-gray-400 text-sm mt-3">No comments yet</Text>
          <Text className="text-gray-500 text-xs mt-1">
            Be the first to add a comment
          </Text>
        </View>
      ) : (
        <View>
          {topLevelComments.map((comment) => (
            <View key={comment.id}>
              <CommentItem comment={comment} onReply={handleReply} />
              {getReplies(comment.id).map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={handleReply}
                  level={1}
                />
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
