import useSWR from "swr";
import { fetchCommentsBySummary } from "../api/comment.api";
import { Comment, CommentPopulated } from "@shared-types/comment.type";

export function useFetchCommentsBySummary(summaryId: string | number | null) {
  const { data, error, isLoading, mutate } = useSWR<CommentPopulated[]>(
    summaryId ? ["comments", summaryId] : null,
    ([, id]) => fetchCommentsBySummary(id as string | number)
  );

  return {
    comments: data,
    isLoading,
    isError: error,
    mutate,
  };
}
