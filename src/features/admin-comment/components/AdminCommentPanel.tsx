import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AdminComment } from "@shared-types/admin-comment.type";

interface AdminCommentPanelProps {
  summaryId: string;
}

// Mock function to fetch admin comments - in real app, use API
const fetchAdminComments = async (
  summaryId: string
): Promise<AdminComment[]> => {
  // Simulate API call
  return [
    {
      _id: "comment1",
      summary_id: summaryId,
      text_content: "Good content, but needs more examples in section 2.",
    },
  ];
};

// Mock function to create admin comment - in real app, use API
const createAdminComment = async (
  summaryId: string,
  textContent: string
): Promise<AdminComment> => {
  // Simulate API call
  const newComment: AdminComment = {
    _id: Date.now().toString(),
    summary_id: summaryId,
    text_content: textContent,
  };
  console.log("Creating admin comment:", newComment);
  return newComment;
};

export const AdminCommentPanel = ({ summaryId }: AdminCommentPanelProps) => {
  const [adminComments, setAdminComments] = useState<AdminComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommentInputVisible, setIsCommentInputVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [summaryId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await fetchAdminComments(summaryId);
      setAdminComments(commentsData);
    } catch (error) {
      Alert.alert("Error", "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    try {
      const comment = await createAdminComment(summaryId, newComment.trim());
      setAdminComments((prev) => [...prev, comment]);
      setNewComment("");
      setIsCommentInputVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to add comment");
    }
  };

  return (
    <View className="px-4 mt-6">
      <TouchableOpacity
        onPress={() => setIsCommentInputVisible(!isCommentInputVisible)}
        className="bg-indigo-600 py-4 rounded-xl flex-row items-center justify-center"
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubbles-outline" size={20} color="white" />
        <Text className="text-white ml-2 font-semibold text-base">
          {isCommentInputVisible ? "Hide" : "Add"} Admin Comment
        </Text>
        {adminComments.length > 0 && (
          <View className="ml-2 bg-indigo-500 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">
              {adminComments.length}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Existing Comments */}
      {adminComments.length > 0 && (
        <View className="mt-4 space-y-3">
          {adminComments.map((comment) => (
            <View key={comment._id} className="bg-gray-800 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="shield-checkmark" size={16} color="#b0e7b7" />
                <Text className="text-gray-400 text-xs ml-2">Admin</Text>
              </View>
              <Text className="text-gray-100 text-sm leading-6">
                {comment.text_content}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Add Comment Input */}
      {isCommentInputVisible && (
        <View className="mt-4 bg-gray-800 rounded-xl p-4">
          <TextInput
            placeholder="Add your admin comment..."
            placeholderTextColor="#6B7280"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-gray-700 text-white rounded-lg px-4 py-3 text-base mb-3"
            style={{
              color: "#FFFFFF",
              minHeight: 100,
            }}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            className="bg-indigo-600 rounded-lg py-3 flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
            <Text className="text-white font-semibold text-sm ml-2">
              Add Comment
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
