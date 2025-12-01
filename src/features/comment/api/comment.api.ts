import { axiosInstance } from "@shared-libs/axios/axios.base";
import { CommentPopulated } from "@shared-types/comment.type";

export const fetchAdminRelatedComments = async (
  summaryId: string
): Promise<CommentPopulated[]> => {
  const response = await axiosInstance.get<CommentPopulated[]>(
    `/comments/admin-related?summary_id=${summaryId}`
  );
  return response.data;
};

export interface CreateCommentPayload {
  summary_id: string;
  content: string;
  parent_comment_id?: string | null;
  access?: "public" | "private";
}

export const createComment = async (
  payload: CreateCommentPayload
): Promise<CommentPopulated> => {
  const response = await axiosInstance.post<CommentPopulated>(
    "/comments/",
    payload
  );
  return response.data;
};

export const fetchCommentsBySummary = async (
  summaryId: string | number
): Promise<CommentPopulated[]> => {
  const response = await axiosInstance.get<CommentPopulated[]>(
    `/comments/summary/${summaryId}`
  );
  return response.data;
};
