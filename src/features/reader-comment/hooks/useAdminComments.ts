import useSWR from "swr";
import { fetchAdminRelatedComments, AdminCommentResponse } from "../api/comment.api";

export function useAdminComments(summaryId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<AdminCommentResponse[]>(
    summaryId ? ["admin-comments", summaryId] : null,
    ([, id]) => fetchAdminRelatedComments(id as number)
  );

  return {
    comments: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

