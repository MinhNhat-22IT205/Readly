import { Comment } from "@shared-types/comment.type";
import React from "react";
import { View, Text, Image } from "react-native";
import { validateImageUri } from "@shared-utils/validate-image-uri";

export const PublicCommentCardItem = ({ comment }: { comment: Comment }) => {
  const avatarUri = validateImageUri(
    comment.endUser.avatar,
    "https://velle.vn/wp-content/uploads/2025/04/avatar-mac-dinh-4-2.jpg"
  );

  return (
    <View className="w-36 h-56 bg-zinc-900 rounded-xl p-3 relative overflow-hidden mr-3">
      <Text className="text-4xl font-bold text-zinc-700 mb-2">❝</Text>
      <Text className="text-xs text-zinc-400 leading-relaxed" numberOfLines={3}>
        {comment.content}
      </Text>
      <Image
        source={{ uri: avatarUri }}
        className="absolute bottom-3 left-3 w-12 h-16 rounded"
      />
    </View>
  );
};
