import useSWR from "swr";
import { fetchAdminRelatedComments } from "../api/comment.api";
import { CommentPopulated } from "@shared-types/comment.type";

export function useAdminComments(summaryId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<CommentPopulated[]>(
    summaryId ? ["admin-comments", summaryId] : null,
    ([, id]) => fetchAdminRelatedComments(id as string)
  );

  return {
    comments: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
