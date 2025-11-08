import React from "react";
import { ScrollView } from "react-native";
import { PublicCommentCardItem } from "./PublicCommentCardItem";
import { Comment } from "@shared-types/comment.type";

export const PublicCommentList = ({ comments }: { comments: Comment[] }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerClassName="px-4 mt-4"
  >
    {comments.map((comment) => (
      <PublicCommentCardItem key={comment._id} comment={comment} />
    ))}
  </ScrollView>
);
