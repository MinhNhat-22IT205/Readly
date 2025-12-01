import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SlideUpModal } from "@shared-components/SlideUpModal";
import { CommentPopulated } from "@shared-types/comment.type";
import { createComment } from "../api/comment.api";

interface WriterEditorCommentModalProps {
  visible: boolean;
  onClose: () => void;
  comments: CommentPopulated[];
  isLoading: boolean;
  summaryId: string;
  onCommentAdded?: () => void;
}

const AdminCommentItem = ({
  comment,
  onReply,
}: {
  comment: CommentPopulated;
  onReply?: (commentId: string) => void;
}) => {
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
      {onReply && (
        <TouchableOpacity
          onPress={() => onReply(comment.id)}
          className="flex-row items-center mt-3"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-undo-outline" size={14} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs ml-1">Reply</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const WriterEditorCommentModal = ({
  visible,
  onClose,
  comments,
  isLoading,
  summaryId,
  onCommentAdded,
}: WriterEditorCommentModalProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      Alert.alert("Error", "Please enter a reply");
      return;
    }

    if (!replyingTo) {
      Alert.alert("Error", "Please select a comment to reply to");
      return;
    }

    try {
      setIsSubmitting(true);
      await createComment({
        summary_id: summaryId,
        content: newComment.trim(),
        parent_comment_id: replyingTo,
        access: "public",
      });
      setNewComment("");
      setReplyingTo(null);
      onCommentAdded?.();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.detail || "Failed to create reply"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment("");
  };

  const parentComment = replyingTo
    ? comments.find((c) => c.id === replyingTo)
    : null;

  return (
    <SlideUpModal
      visible={visible}
      onClose={onClose}
      title="Admin Comments"
      maxHeight={600}
    >
      <View className="px-5 pb-2">
        <Text className="text-gray-400 text-sm mb-4">
          {isLoading
            ? "Loading..."
            : `${comments.length} admin-related comments`}
        </Text>
      </View>

      {/* Reply Input Form - Only shown when replying */}
      {replyingTo && (
        <View className="px-5 pb-3">
          <View className="bg-gray-800 rounded-xl p-3">
            {parentComment && (
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
              placeholder="Write a reply..."
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
              <TouchableOpacity
                onPress={cancelReply}
                className="px-3 py-1.5 rounded-lg bg-gray-700"
                activeOpacity={0.7}
              >
                <Text className="text-gray-300 text-xs">Cancel</Text>
              </TouchableOpacity>
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
                  Reply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Comments List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
      >
        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-gray-400 text-base mt-4">
              Loading comments...
            </Text>
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
            <AdminCommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
            />
          ))
        )}
      </ScrollView>
    </SlideUpModal>
  );
};
